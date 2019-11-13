// // ES6 Modules or TypeScript
// import Swal from 'sweetalert2'

// // CommonJS
var Swal = require('sweetalert2')
var express = require('express');


var app = express();
let $ = require('jquery');

var Request = require("request");
var crypt = require('crypto');
//var session= require('electron');
var remote = require('electron').remote;
var session = remote.session;
var dialog = remote.dialog;
var mainSession = session.defaultSession;
var data='';



$('#add-to-login').on('click', () => {
    
    
    // console.log("hi")

    let namee = $('#Name').val()
    let pwd = $('#Email').val()
    let typee = "User"

    let pd = crypt.createHash('sha256').update(pwd).digest('hex');

    



// Login checking here

    Request.post({
        "headers": { "content-type": "application/json" },
        "url": "https://api-prod.kori.biz/api/v1/user/login",
        "body": JSON.stringify({
            "username": namee,
            "userpassword": pd,
            "loginType": typee
        })
    }, (error, response, body) => {
        if(error) {
            Swal.fire({
                type: 'error',
                title: 'Server Error',
                text: 'Error at Server Side!',
                footer: 'Try Again'
              })
        }
        else{
            var dataArray = JSON.parse(body);
             if(dataArray.code==0){
                 console.log(body);
                session.defaultSession.cookies.set({
                    'name':'login',
                    'value':body,
                    'url':'http:localhost/'
                })
           
           window.location.href="index.html";
            }
            else{
                Swal.fire({
                    type: 'error',
                    title: 'Password Mismatch',
                    text: 'Wrong Username or Password!',
                    footer: 'Try Again'
                  })
           
            }
            
   
           




        }
    });

   

 })


//when user clcik on register

 $('#add-to-register').on('click', () => {
    

    window.location.href="registration.html";
   
 })
 




