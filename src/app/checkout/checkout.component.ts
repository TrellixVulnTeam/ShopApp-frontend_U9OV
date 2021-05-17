import { Component, OnInit } from '@angular/core';
import {CartServiceService} from '../service/cart-service.service';
import {HttpServiceService} from '../http-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartObj = [];
  cartTotalPrice :any
  pay_type = "cash_on_delivery";
  delivery_address = "";
    constructor(private router:Router,private cartService:CartServiceService,private http:HttpServiceService) { }

  ngOnInit() {    
    this.getCartDetailsByUser();
    //below function will be triggerd from when removing and qty  is changing..
    this.cartService.cartServiceEvent.subscribe(data=>{
      this.cartObj =  this.cartService.getCartOBj();
      this.cartTotalPrice  = this.cartService.cartTotalPrice;
    });
  }

  qtyChange(qty,cartObj){
   var request = {
    "addCartId":cartObj.addCartId,
    "qty":qty,
    "price":(cartObj.price)*(qty)
  }
    this.http.postRequestWithToken("addtocart/updateQtyForCart",request).subscribe((data:any)=>{
      this.cartService.getCartDetailsByUser();//for updating in the application..
    },error=>{
      alert("Error while fetching the cart Details");
    })
  }

  

  getCartDetailsByUser(){
    this.http.postRequestWithToken("addtocart/getCartsByUserId",{}).subscribe((data:any)=>{
      this.cartObj = data;
      this.cartTotalPrice = this.getTotalAmounOfTheCart();   
    },error=>{
      alert("Error while fetching the cart Details");
    })
  }

  getTotalAmounOfTheCart(){
    let obj = this.cartObj;
    let totalPrice  = 0;   
    for(var o in obj ){      
      totalPrice = totalPrice +parseFloat(obj[o].price);
    }
    return totalPrice.toFixed(2);
  }

  removeCartById(cartObj){
      if(confirm("Are you sure want to delete?")){
      let id  = cartObj.addCartId;
      console.log("About to be deleted " + id);
      this.cartService.removeCart(id);
    }    
  }
  
  checkoutCart(){
    if(this.delivery_address == ""){
      alert("Delivery address should not be empty");
      return;
    }
    if(this.pay_type != ""){
      let request = {
        "total_price":this.cartTotalPrice,
        "pay_type":this.pay_type,
        "deliveryAddress":this.delivery_address
     }
      this.http.postRequestWithToken("order/checkout_order",request).subscribe((data:any)=>{
        alert("Checkout process completed. Your order has been processed..");
        this.cartService.getCartDetailsByUser();
        this.router.navigate(['']);
     },error=>{
       // alert("Error while fetching the cart Details");
       alert("Checkout error, maybe price mismatch");
       this.cartService.getCartDetailsByUser();
       this.router.navigate(['']);
      })

    }else{
        alert("Payment Integration is not yet completed.")
    }
  }
}