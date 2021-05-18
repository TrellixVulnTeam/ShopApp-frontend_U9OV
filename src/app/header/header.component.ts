import { Component, OnInit } from '@angular/core';
import {HttpServiceService} from '../http-service.service';
import {CartServiceService} from '../service/cart-service.service';
import { timingSafeEqual } from 'crypto';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faCheck, faCheckSquare} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faCheckSquare = faCheckSquare;
  isOpenLoginDialog = false;
  currentDropDownMenu = "";
  dialogType = "login";
  mainDialogType = "";
  isLogin = false;
  mobile = "123456789";
  password = "test";
  cartObj = [];
  cart_qty = 0;
  cartTotalPrice = 0;
  register = {"name":"","email":"","mobile":"","password":"","re_password":""}
  welcomeUsername = "";
  productsList:any;
  resetemail ="";
  show:boolean = false;
  constructor(private router:Router,private cartService:CartServiceService, 
    private http:HttpServiceService){
    let request = {}

    this.http.postRequest("api/status",request).subscribe(data=>{
        console.log("test",data);
    },error=>{
      alert("Server connection error "+error)
    })
    if(this.http.isLogin()){
      this.isLogin = true;
      this.welcomeUsername = this.http.getLoginDataByKey("name");
    }
    if(this.http.isLogin()){
      this.isLogin = true;
      this.welcomeUsername = this.http.getLoginDataByKey("name");
    }
    this.cartService.cartServiceEvent.subscribe(data=>{
      this.cart_qty = this.cartService.getQty();
    })
  }
  logout(){
    this.http.logout();
    this.isLogin = false;
  }

  forgotpassword(){
    alert("inside forgot password ");
    if(this.resetemail == ""){
      alert("email should not be empty");
      return;
    }
    let request ={
      "resetemail": this.resetemail,
    }
    this.http.postRequest('api/signup/resetemail',request).subscribe(data=>{
       console.log("connected to server ${request}");
       console.log(data);
    },error=>{
      alert("Error in reset data "+error);
    })
  }

  ngOnInit() {
  }

  toggle(){
    this.show = !this.show;
  }
  loginUserCheck(){
    if(this.mobile == ""){
      alert("Name should not be empty");
      return;
    }
    if(this.password == ""){
     alert("Password should not be empty");
     return;
    }    
    let request ={
      "mobile": this.mobile,
      "password":this.password
    }
    this.http.postRequest('api/login/user',request).subscribe(data=>{
        if(data.hasOwnProperty("token")){
          this.http.setLoginToken(data['token']);
          this.http.setLoginData(data);
          this.welcomeUsername = this.http.getLoginDataByKey("name");
          this.isLogin = true;
          this.isOpenLoginDialog = false;
        }
    },error=>{
      alert("Error in login ");
    })
  } 
  
  registerUser(){
    if(this.register.name ==""){
      alert("Name should not be empty");
      return
    }
    if(this.register.email ==""){
     alert("Email should not be empty");
     return
    }
    if(this.register.password ==""){
      alert("password should not be empty");
      return
     }
     if(this.register.password != this.register.re_password){
      alert("password and rePassword should be same");
      return
     }
     if(this.register.mobile ==""){
       alert("Mobile should not be empty");
      return
     }
     

    let request ={     
      "user_name":this.register.name,
      "email":this.register.email,
      "password":this.register.password,
      "mobile":this.register.mobile
    }
    this.http.postRequest('api/signup/user',request).subscribe(data=>{
         alert("Register successfully.");
         console.log(data);
         this.dialogType = "login";
    },error=>{
      alert("Error in login "+error);
    })
  }
  checkout_btn(){
    this.router.navigate(['checkout']);
   }
  openCheckoutModel(){
    this.cartObj =  this.cartService.getCartOBj();
    this.cartTotalPrice  = this.cartService.cartTotalPrice;
    this.mainDialogType = "checkout";
  }
  openDialog(){
    this.mainDialogType = "login";
  }
  dialogTypeInside(type){
    if(this.dialogType != type)
        this.dialogType = type;
  }
  closeDialog(){
     this.mainDialogType = "";
  }
  curentDropDown(currentDropdownMenuName){
    if(this.currentDropDownMenu == currentDropdownMenuName){
      this.currentDropDownMenu = "";
    }else{
      this.currentDropDownMenu = currentDropdownMenuName;
    }
    
  }
  

  getProductsByCategory(obj){
    let request ={
      "category":obj
    }
    var url = 'product/getProductsByCategory';
    console.log("URL is " + url);
   this.http.postRequestWithToken(url,request).subscribe(data=>{
      this.productsList = data
      if(this.productsList.length == 0){
        alert("No Product is found..");
      }
      else {
        console.log(this.productsList);
      }
   },error=>{
     alert("Error in product Get "+error);
   })
  }
}
