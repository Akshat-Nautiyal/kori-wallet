var express = require('express');
var app = express();
var $ = require('jquery');
var Request = require("request");
var crypt = require('crypto');
var Swal = require('sweetalert2')
 var remote = require('electron').remote;
 let win = remote.BrowserWindow;
var session = remote.session;
var dialog = remote.dialog;

       
$(document).ready(function(){
    
    session.defaultSession.cookies.get({},(err,cookies)=>{
        if(err)console.error(err);
        console.log("below is the cookies data");
       
        cookies.map(function (cookiesdata) {
        if (cookiesdata.name == "login") {

            var obj = JSON.parse(cookiesdata.value);
        
            var publickey = obj.UserDetails.publickey;
            var username = obj.UserDetails.username;
            var useremail = obj.UserDetails.useremail;

        getBalance(publickey,username,useremail);
        logincheckup(publickey,username);

        userconfirmbal(publickey);
     //   withdrawList(publickey);
        
         document.getElementById('username').innerHTML = username;



            //console.log(window.data1);
        }
        else{
            //console.log("no data");

        }
       });


       
                 

    })
    
    
   
    
    
    function withdrawList(publickey){

        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://api-prod.kori.biz/api/v1/getWithdrawreq",
            "body": JSON.stringify({
                "senderkey": publickey
            })
        }, (error, response, body) => {
            if(error) {
                Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                  })
                console.log("error");
            }
            else{
              //  alert("here");
                var da = JSON.parse(body);
                console.log("below data");
              
               console.log(da);
                var pay = da.data;
                var ik = 1;
                    for (var index = 0; index < pay.length; index++) {
                    // if(pay[index]['status']==0)
                    {
                        unixTimestamp = pay[index]['currenttime'];
                        
                        var a = new Date(unixTimestamp * 1000);
                        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        var year = a.getFullYear();
                        var month = months[a.getMonth()];
                        var date = a.getDate();
                        var hour = a.getHours();
                        var min = a.getMinutes();
                        var sec = a.getSeconds();
                        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
                      
                        if(pay[index]['withdrawtype']=="Bank Account"){
                            var b = 0;
                           


                        var append = '<tr id ='+ik+'><td>'+pay[index]['amount']+'</td><td>'+pay[index]['withdrawtype']+' </td><td>'+time+'</td><td><button class="button1" onclick="takeValue('+ik+','+pay[index]['amount']+','+pay[index]['currenttime']+','+pay[index]['id']+','+pay[index]['status']+','+pay[index]['transactionid']+','+b+',this)">Cancel</button></td></tr>';
                       console.log(append);
                            ik = ik+1;
                    }
                        else{
                        var b = 1;


                        var append = '<tr id ='+ik+'><td>'+pay[index]['amount']+'</td><td>'+pay[index]['withdrawtype']+' </td><td>'+time+'</td><td><button class="button1" onclick="takeValue('+ik+','+pay[index]['amount']+','+pay[index]['currenttime']+','+pay[index]['id']+','+pay[index]['status']+','+pay[index]['transactionid']+','+b+',this)">Cancel</button></td></tr>';
                   console.log(append);
                   ik = ik+1;
                }
alert("now again");

                 $('#payment_table55').append(append);
                     
                }
                   
              }
            }

        });
    
    }


   




















//
    
function userconfirmbal(publickey){

        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://api-prod.kori.biz/api/v1/getuserconfirmbal",
            "body": JSON.stringify({
                "publickey": publickey
            })
        }, (error, response, body) => {
            if(error) {
                Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                  })
                console.log("error");
            }
            else{
                var da = JSON.parse(body);
            //     console.log("below data");
            //    console.log(da);
                var pay = da.data;
                    for (var index = 0; index < pay.length; index++) {
                    // if(pay[index]['status']==0)
                    {
                        unixTimestamp = pay[index]['updatedtime'];
                        
                        var a = new Date(unixTimestamp * 1000);
                        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        var year = a.getFullYear();
                        var month = months[a.getMonth()];
                        var date = a.getDate();
                        var hour = a.getHours();
                        var min = a.getMinutes();
                        var sec = a.getSeconds();
                        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

                         if(pay[index]['receiverpublickey']==publickey){

                        // time = utcString.slice(-11, -4); 
                       if(pay[index]['status']==0){

                        var append = '<tr><td>'+pay[index]['senderpublickey']+'</td><td>'+pay[index]['amount']+'</td><td>'+pay[index]['transactiontype']+' </td><td>'+time+'</td><td>Pending </td>';
                       // console.log(append);
                        $('#payment_table2').append(append);
                       }
                       if(pay[index]['status']==1){

                        var append = '<tr><td>'+pay[index]['senderpublickey']+'</td><td>'+pay[index]['amount']+'</td><td>'+pay[index]['transactiontype']+' </td><td>'+time+'</td><td>Approved </td>';
                       // console.log(append);
                        $('#payment_table1').append(append);
                       }
                       if(pay[index]['status']==2){

                        var append = '<tr><td>'+pay[index]['senderpublickey']+'</td><td>'+pay[index]['amount']+'</td><td>'+pay[index]['transactiontype']+' </td><td>'+time+'</td><td>Reject </td>';
                       // console.log(append);
                        $('#payment_table3').append(append);
                       }
                        
                    }

                    if(pay[index]['receiverpublickey']!==publickey){

                        // time = utcString.slice(-11, -4); 
                       if(pay[index]['status']==0){
                        
                        var append = '<tr><td>'+pay[index]['receiverpublickey']+'</td><td>'+pay[index]['amount']+'</td><td>'+pay[index]['transactiontype']+' </td><td>'+time+'</td><td>Pending </td>';
                       // console.log(append);
                        $('#payment_table2').append(append);
                       }
                       if(pay[index]['status']==1){

                        var append = '<tr><td>'+pay[index]['receiverpublickey']+'</td><td>'+pay[index]['amount']+'</td><td>'+pay[index]['transactiontype']+' </td><td>'+time+'</td><td>Approved </td>';
                       // console.log(append);
                        $('#payment_table1').append(append);
                       }
                       if(pay[index]['status']==2){

                        var append = '<tr><td>'+pay[index]['receiverpublickey']+'</td><td>'+pay[index]['amount']+'</td><td>'+pay[index]['transactiontype']+' </td><td>'+time+'</td><td>Reject </td>';
                       // console.log(append);
                        $('#payment_table3').append(append);
                       }
                        
                    }

                    }
        
              
                }

                $(document).ready(function(){
                    $("#payment_table1").dataTable({searching: false,oLanguage: {
                        sLengthMenu: "_MENU_",
                     }});
                    $("#payment_table2").dataTable({searching: false,oLanguage: {
                        sLengthMenu: "_MENU_",
                     }});
                    $("#payment_table3").dataTable({searching: false,oLanguage: {
                        sLengthMenu: "_MENU_",
                     }});
        
             });



            }

        });
    
    }












    function logincheckup(publickey,username){
        
        

        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://api-prod.kori.biz/api/v1/txshistoryfull",
            "body": JSON.stringify({
                "senderkey": publickey
            })
        }, (error, response, body) => {
            if(error) {
                Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                  })
                console.log("error");
            }
            else{
                var da = JSON.parse(body);
              
                // console.log(da);
                var pay = da.data;

                
 
         for (var index = 0; index < pay.length; index++) {
            var datetime = pay[index]['created_at'];
            var now = datetime.toLocaleString().replace('Z', '   ').replace('T', '   ');

            if(pay[index]['details']['asset_code']=='FRI'){
            
                if(pay[index]['ordertype']=='BUY'){


                    var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>FRI </td><td>BUY-SELL MARKET</td></tr>';
                   // console.log(append);
                    $('#payment_tabfri').append(append);

                    }
                    else if(pay[index]['ordertype']=='BUY FRI'){

                        var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>FRI </td><td>BUY FRI</td></tr>';
                        // console.log(append);
                         $('#payment_tabfri').append(append);
                    }
                    else{
                        var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>FRI </td><td>WALLET</td></tr>';
                        // console.log(append);
                         $('#payment_tabfri').append(append);
                        
                    }

                        }
                       
                   
                    if(pay[index]['details']['asset_type']=='native'){
                      
                            if(pay[index]['ordertype']=='BUY'){


                                var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>KRI </td><td>BUY-SELL MARKET</td></tr>';
                               // console.log(append);
                                $('#payment_tabkri').append(append);
        
                                }
                                else if(pay[index]['ordertype']=='BUY FRI'){
        
                                    var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>KRI </td><td>BUY FRI</td></tr>';
                                    // console.log(append);
                                     $('#payment_tabkri').append(append);
                                }
                                else{
                                    var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>KRI </td><td>WALLET</td></tr>';
                                    // console.log(append);
                                     $('#payment_tabkri').append(append);
                                    
                                }
                         }


                    
        
              
                }
                $(document).ready(function(){
                    document.getElementById("homekri").style.display = "none";
                    document.getElementById("homefri").style.display = "none";
                    $("#payment_tabkri").dataTable({searching: false,oLanguage: {
                        sLengthMenu: "_MENU_",
                     }});
                    $("#payment_tabfri").dataTable({searching: false,oLanguage: {
                        sLengthMenu: "_MENU_",
                     }});
        
             });

            }

        });
    
    }




     
     
    function logincheckup1(publickey,username){
        

        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://api-prod.kori.biz/api/v1/txshistoryfull",
            "body": JSON.stringify({
                "senderkey": publickey
            })
        }, (error, response, body) => {
            if(error) {
                Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                  })
                console.log("error");
            }
            else{
                var da = JSON.parse(body);
              
                // console.log(da);
                var pay = da.data;
 
         for (var index = 0; index < pay.length; index++) {
            var datetime = pay[index]['created_at'];
            var now = datetime.toLocaleString().replace('Z', '   ').replace('T', '   ');

            if(pay[index]['details']['asset_code']=='FRI'){
            
                if(pay[index]['ordertype']=='BUY'){


                    var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>FRI </td><td>BUY-SELL MARKET</td></tr>';
                   // console.log(append);
                    $('#payment_table').append(append);

                    }
                    else if(pay[index]['ordertype']=='BUY FRI'){

                        var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>FRI </td><td>BUY FRI</td></tr>';
                        // console.log(append);
                         $('#payment_table').append(append);
                    }
                    else{
                        var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>FRI </td><td>WALLET</td></tr>';
                        // console.log(append);
                         $('#payment_table').append(append);
                        
                    }

                        }
                       
                   
                    if(pay[index]['details']['asset_type']=='native'){
                      
                            if(pay[index]['ordertype']=='BUY'){


                                var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>KRI </td><td>BUY-SELL MARKET</td></tr>';
                               // console.log(append);
                                $('#payment_table').append(append);
        
                                }
                                else if(pay[index]['ordertype']=='BUY FRI'){
        
                                    var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>KRI </td><td>BUY FRI</td></tr>';
                                    // console.log(append);
                                     $('#payment_table').append(append);
                                }
                                else{
                                    var append = '<tr><td>'+pay[index]['transaction_hash']+'</td><td>'+now+'</td><td>'+pay[index]['details']['from']+'</td><td>'+pay[index]['details']['to']+' </td><td>'+pay[index]['details']['amount']+' </td><td>KRI </td><td>WALLET</td></tr>';
                                    // console.log(append);
                                     $('#payment_table').append(append);
                                    
                                }
                         }


                    
        
              
                }
            }

        });
    
    }
   

    function getBalance(publickey,username,useremail){
        // var a ="GD2ZGSURQHTD7O2TNSHS7A4U2AWC7K2JTDXFI2T4S3UPHJEBMTFZGCBA";
        // var b = "aaa";
       
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://api-prod.kori.biz/api/v1/getbalance",
            "body": JSON.stringify({
                "publickey": publickey,
                "username" : username
            })
        }, (error, response, body) => {
            if(error) {
               
                Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                  })
                console.log("error");
            }
            else{
                
                var da = JSON.parse(body);
                var bal = da.data;
                var fribalncereal;
                var nativebalreal;

                bal.map(function (cookiesdata) {

                    console.log("below is the cookies data");
                    
                    
                   if (cookiesdata.asset_code == "FRI") {
                      
                    fribalncereal = cookiesdata.balance;
                    
                                
                    }
                    if (cookiesdata.asset_type == "native") {
                       
                        nativebalreal = cookiesdata.balance;
                                //console.log(obj.UserDetails);
                                    
                        }
                    else{
                        //console.log("no data");
            
                    }
                    });
                   
                   
                    $('#balanceKRI_table').val(nativebalreal);
                    $('#balanceFRI_table').val(fribalncereal);

                    $('#balanceEURO_table').val(da.balance[0].balance);

            }

        });

    }
    
     $('#add-money').on('click', () => {
      
        var amount= $('#amounting').val();
       
       console.log(amount);


        session.defaultSession.cookies.get({},(err,cookies)=>{
        if(err)console.error(err);

        cookies.map(function (cookiesdata) {

            console.log("below is the cookies data");
            
           if (cookiesdata.name == "login") {
               
                var obj = JSON.parse(cookiesdata.value);
          //console.log(obj.UserDetails);
    var publickey = obj.UserDetails.publickey;
    var useremail = obj.UserDetails.useremail;
     sendingkri(amount,publickey,useremail);
               
            }
            else{
                //console.log("no data");

            }
            });



  
      
    })
       // var e = document.getElementById(myList);
    
       function sendingkri(amount,publickey,useremail){
        var a=amount;
        var b=publickey;
        var c=useremail;
        console.log("below");
        console.log(a);
        console.log(b);
        console.log(c);
              Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://api-prod.kori.biz/api/v1/sendReqAdmin",
            "body": JSON.stringify({
                "amount": a,
                "currencytype": "EURO",
                "publickey": b,
                "useremail": c
            })
        }, (error, response, body) => {
            if(error) {
                Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                  })
                console.log("something went wrong", error);
            }
            else{
              
              // console.log(b);
              // console.log(body);
                var successdata = JSON.parse(body);
                if(successdata.code==0)
                {
                    // Swal.fire(
                    //           'Good job!',
                    //           'Sending KRI is Successfull!',
                    //           'success'
                    //         )
                Swal.fire({
                    type: 'success',
                    title: 'Congrats',
                    text: 'Request send Successfully!',
                    // footer: 'Try Again'
                  })
                }
                else{
                 Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: 'Try Again'
                  })
                }
                }
        });
       }
        
    
    
       
     })
     

     $('#money-withdrawtestfinal').on('click', () => {
        var amount= $('#your-input').val();
        var type = $("input[type='radio'][name='checkybox']:checked").val();
       
        var privtky= $('#your-input500').val();
      
        var newvar = 0;
        if (amount.length == 0)
       { 
        newvar = 1;
           Swal.fire({
               type: 'error',
               title: "Datafield empty",
               text: 'Amount filed empty',
               footer: 'Try Again'
               })  	
          return false; 
       }  
   
      if(type == "BankAccount"){

      }else if(type =="PhoneNumber"){

      }else
      {
        newvar = 1;
        Swal.fire({
            type: 'error',
            title: "Datafield Empty",
            text: 'Please select Phone Number or Account Number',
            footer: 'Try Again'
            })  	  
      }
        
       
       if (privtky.length == 0)
       { 
        newvar = 1;
           Swal.fire({
               type: 'error',
               title: "Datafield empty",
               text: 'Private Key Empty!',
               footer: 'Try Again'
               })  	  	
          return false; 
       }  
 session.defaultSession.cookies.set({
        'name':'withdrawamount',
        'value':amount,
        'url':'http:localhost/'
    })
    session.defaultSession.cookies.set({
        'name':'withdrawamounttype',
        'value':type,
        'url':'http:localhost/'
    })
    session.defaultSession.cookies.set({
        'name':'withdrawprivate',
        'value':privtky,
        'url':'http:localhost/'
    })

    if(type=="BankAccount")
    {
        $("#checkyboxconfirm").prop("checked", true);
    }
    else{
        $("#checkybox1confirm").prop("checked", true);
    }



    if(newvar == 0)
    {
        $('#second').show();
   $('#first').hide();
    }


   
   
   
   
   
    document.getElementById("your-input-amount").value = amount;
    
    // document.getElementById("your-input-amount").value = value;
   
    

     })

 


     $('#money-withdrawtest').on('click', () => {
     

        var publickey;
        var withdrawamounttype;
        var withdrawamount;
        var withdrawprivate;
   
     
     session.defaultSession.cookies.get({},(err,cookies)=>{
     if(err)console.error(err);

     cookies.map(function (cookiesdata) {

        console.log("below is the cookies data");
        
       if (cookiesdata.name == "login") {
           
            var obj = JSON.parse(cookiesdata.value);
                //console.log(obj.UserDetails);
           publickey = obj.UserDetails.publickey;
           
                    
        }
        if (cookiesdata.name == "withdrawamount") {
           
            withdrawamount = cookiesdata.value;
                    
        }
        if (cookiesdata.name == "withdrawamounttype") {
           
            withdrawamounttype = cookiesdata.value;
                    
        }
        if (cookiesdata.name == "withdrawprivate") {
           
            withdrawprivate = cookiesdata.value;
                    
        }
        else{
            //console.log("no data");

        }
        });

    
        moneywithdrawl(publickey,withdrawamounttype,withdrawamount,withdrawprivate);

    })
    


        function moneywithdrawl(publickey,type,amount,privtky){
            var a=publickey;
            var b=type;
            var c=amount;    
            var d=privtky;
            console.log("below");
            console.log(a);
            console.log(b);
            console.log(c);
            console.log(d);
            Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://api-prod.kori.biz/api/v1/withdrawrequest",
            "body": JSON.stringify({
            "publickey": a,
            "withdrawtype": b,
            "amount": c,
            "privatekey": d
            })
            }, (error, response, body) => {
            if(error) {
                Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                  })
            // dialog.showMessageBox({message:"Please send request again",title:"Unsuccesfull"});
            console.log("something went wrong", error);
            }
            else{
            var successdata = JSON.parse(body);
            if(successdata.code==0)
            {
                Swal.fire({
                    type: 'success',
                    title: 'Congrats',
                    text: 'Withdraw Request Sent Successfully!',
                    // footer: 'Try Again'
                  }) 
                  
            console.log("successful");
            }
            else if(successdata.code==3 || successdata.code==4){
                Swal.fire({
                    type: 'error',
                    title: "Oops ...",
                    text: 'You do not have enough fiat and need to cancel withdraw request to complete this transfer.',
                    // footer: 'Try Again'
                  })
             
            }
            else if(successdata.code==2){
                Swal.fire({
                    type: 'error',
                    title: "Oops ...",
                    text: 'Please enter correct private key.',
                    // footer: 'Try Again'
                  })
             
            }
            else{
                Swal.fire({
                    type: 'error',
                    title: "Oops ...",
                    text: 'Please send request again!',
                    // footer: 'Try Again'
                  })
            }
            }
            });
           
                 // withdrawList(publickey);
            }
            
            
            
            
            })

    

    $('#send-kri').on('click', () => {
    
        publickeyreceiver = $('#publickeyreceiver').val()
        privatekeysender = $('#privatekeysender').val()
        amount = $('#Amount').val()
       
       
     })
     

$('#send-kri-final').on('click', () => {
  


 })



     $('#add-mobile-payment').on('click', () => {

        var code= $('#code').val();
        var operator= $('#operator').val();
        var mobileno= $('#mobileno').val();
        
        console.log(code);
        console.log(operator);
        console.log(mobileno);
        
        
        session.defaultSession.cookies.get({},(err,cookies)=>{
        if(err)console.error(err);

        cookies.map(function (cookiesdata) {

            console.log("below is the cookies data");
            
           if (cookiesdata.name == "login") {
               
                var obj = JSON.parse(cookiesdata.value);
                    //console.log(obj.UserDetails);
                var publickey = obj.UserDetails.publickey;
                mobilepayment(publickey,code,operator,mobileno);
                        
            }
            else{
                //console.log("no data");
    
            }
            });

        })


        function mobilepayment(publickey,code,operator,mobileno){
            var a=publickey;
            var b=code;
            var c=operator;
            var d=mobileno;
            console.log("below");
            console.log(a);
            console.log(b);
            console.log(c);
            console.log(d);
            Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://api-prod.kori.biz/api/v1/addmobiledetails",
            "body": JSON.stringify({
            "publickey": a,
            "country_code": b,
            "mobile_number": d,
            "operator_number": c
            })
            }, (error, response, body) => {
            if(error) {
                Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                  })
                // dialog.showMessageBox({message:"Please send request again",title:"Unsuccesfull"});
            
            console.log("something went wrong", error);
            }
            else{
               
            // console.log(b);
            // console.log(body);
            var successdata = JSON.parse(body);
            if(successdata.code==0)
            {
             Swal.fire({
                    type: 'success',
                    title: 'Congrats',
                    text: 'Adding Mobile Payment Request Send Successfully!',
                    // footer: 'Try Again'
                  })   
            // dialog.showMessageBox({message:"Adding Mobile Payment Request Send Successfully",title:"Success"});
            console.log("successful");
            }
            else{
                Swal.fire({
                    type: 'error',
                    title: "Oops ...",
                    text: 'Please send request again!',
                    // footer: 'Try Again'
                  })
                // dialog.showMessageBox({message:"Please send request again",title:"Unsuccesfull"});
             
            }
            }
            });
            }
            
            })

  $('#add-bank-account5').on('click', () => {
    
        let accountname = $('#accountname').val()
        let accountnuber = $('#accountnuber').val()
        let bankname = $('#bankname').val()

        let shortcode = $('#shortcode').val()
        let iban = $('#iban').val()
        let swift = $('#swift').val()


       // var e = document.getElementById(myList);
       session.defaultSession.cookies.get({},(err,cookies)=>{
        if(err)console.error(err);


        cookies.map(function (cookiesdata) {

            console.log("below is the cookies data");
            
           if (cookiesdata.name == "login") {
               
                var obj = JSON.parse(cookiesdata.value);
                    //console.log(obj.UserDetails);
                var publickey = obj.UserDetails.publickey;
                addbankpayment(publickey,accountname,accountnuber,bankname,shortcode,iban,swift);
                        
            }
            else{
                //console.log("no data");
    
            }
            });

        })
    
    
        function addbankpayment(publickey,accountname,accountnuber,bankname,shortcode,iban,swift){
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://api-prod.kori.biz/api/v1/addbankdetails",
            "body": JSON.stringify({
                "publickey": publickey,
                "account_name":accountname,
                "account_number":accountnuber,
                "bank_name":bankname,
                "bank_short_code":shortcode,
                "bank_iban":iban,
                "bank_swift":swift
            })
        }, (error, response, body) => {
            if(error) {
                Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                  })
                // dialog.showMessageBox({message:"Please send request again",title:"Unsuccesfull"});
            
            console.log("something went wrong", error);
            }
            else{
                      
            // console.log(b);
            // console.log(body);
            var successdata = JSON.parse(body);
            if(successdata.code==0)
            {
                Swal.fire({
                    type: 'success',
                    title: 'Congrats',
                    text: 'Added Bank Account Successfully!',
                    // footer: 'Try Again'
                  })
            // dialog.showMessageBox({message:"Added Bank Account Successfully",title:"Success"});
            console.log("successful");
            }
            else{
                Swal.fire({
                    type: 'error',
                    title: "Oops ...",
                    text: 'Please send request again!',
                    // footer: 'Try Again'
                  })
                  // dialog.showMessageBox({message:"Please send request again",title:"Unsuccesfull"});

            }
            }
            });
        }
            }
            )

     $('#add-bank-account6').on('click', () => {
    
                let accountname = $('#accountname').val()
                let accountnuber = $('#accountnuber').val()
                let bankname = $('#bankname').val()
        
                let shortcode = $('#shortcode').val()
                let iban = $('#iban').val()
                let swift = $('#swift').val()
        
        
               // var e = document.getElementById(myList);
               session.defaultSession.cookies.get({},(err,cookies)=>{
                if(err)console.error(err);

                cookies.map(function (cookiesdata) {

                    console.log("below is the cookies data");
                    
                   if (cookiesdata.name == "login") {
                       
                        var obj = JSON.parse(cookiesdata.value);
                            //console.log(obj.UserDetails);
                        var publickey = obj.UserDetails.publickey;
                        addbankpayment(publickey,accountname,accountnuber,bankname,shortcode,iban,swift);
                                
                    }
                    else{
                        //console.log("no data");
            
                    }
                    });
                //  var user=cookies[0].value;
                // var obj = JSON.parse(user);
                // //console.log(obj.UserDetails);
                // var publickey = obj.UserDetails.publickey;
                // addbankpayment(publickey,accountname,accountnuber,bankname,shortcode,iban,swift);
                })
            
            
                function addbankpayment(publickey,accountname,accountnuber,bankname,shortcode,iban,swift){
                Request.post({
                    "headers": { "content-type": "application/json" },
                    "url": "https://api-prod.kori.biz/api/v1/addbankdetails",
                    "body": JSON.stringify({
                        "publickey": publickey,
                        "account_name":accountname,
                        "account_number":accountnuber,
                        "bank_name":bankname,
                        "bank_short_code":shortcode,
                        "bank_iban":iban,
                        "bank_swift":swift
                    })
                }, (error, response, body) => {
                    if(error) {
                        Swal.fire({
                            type: 'error',
                            title: "It's a server error ...",
                            text: 'Please send request again!',
                            footer: 'Try Again'
                          })
                        // dialog.showMessageBox({message:"Please send request again",title:"Unsuccesfull"});
                    
                    console.log("something went wrong", error);
                    }
                    else{
                              
                    // console.log(b);
                    // console.log(body);
                    var successdata = JSON.parse(body);
                    if(successdata.code==0)
                    {
                        Swal.fire({
                            type: 'success',
                            title: 'Congrats',
                            text: 'Added Bank Account Successfully!',
                            // footer: 'Try Again'
                          })
                    // dialog.showMessageBox({message:"Added Bank Account Successfully",title:"Success"});
                    console.log("successful");
                    }
                    else{
                        Swal.fire({
                            type: 'error',
                            title: "Oops ...",
                            text: 'Please send request again!',
                            // footer: 'Try Again'
                          })
                          // dialog.showMessageBox({message:"Please send request again",title:"Unsuccesfull"});
        
                    }
                    }
                    });
                }
                    }
                    )


     $('#add-mobile-payment6').on('click', () => {

        console.log("add mobile");

        var code= $('#code').val();
        var operator= $('#operator').val();
        var mobileno= $('#mobileno').val();
        
        console.log(code);
        console.log(operator);
        console.log(mobileno);
        
        
        session.defaultSession.cookies.get({},(err,cookies)=>{
        if(err)console.error(err);

        cookies.map(function (cookiesdata) {

            console.log("below is the cookies data");
            
           if (cookiesdata.name == "login") {
               
                var obj = JSON.parse(cookiesdata.value);
                    //console.log(obj.UserDetails);
                var publickey = obj.UserDetails.publickey;
                mobilepayment(publickey,code,operator,mobileno);
                        
            }
            else{
                //console.log("no data");
    
            }
            });

        
        
        
        })


        function mobilepayment(publickey,code,operator,mobileno){
            var a=publickey;
            var b=code;
            var c=operator;
            var d=mobileno;
            console.log("below");
            console.log(a);
            console.log(b);
            console.log(c);
            console.log(d);
            Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://api-prod.kori.biz/api/v1/addmobiledetails",
            "body": JSON.stringify({
            "publickey": a,
            "country_code": b,
            "mobile_number": d,
            "operator_number": c
            })
            }, (error, response, body) => {
            if(error) {
                Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                  })
            }
            else{
            var successdata = JSON.parse(body);
            if(successdata.code==0)
            {
                Swal.fire({
                    type: 'success',
                    title: 'Congrats',
                    text: 'Added Mobile Payment Successfully!',
                    // footer: 'Try Again'
                  })
            // dialog.showMessageBox({message:"Added Mobile Payment Successfully",title:"Success"});
            console.log("successful");
            }
            else{
                Swal.fire({
                    type: 'error',
                    title: "Oops ...",
                    text: 'Please send request again!',
                    // footer: 'Try Again'
                  })
               
            }
            }
            });
            }
            
            
            
            
            })




//-------------------------------------sending kri function---------------------------

$('#send-money1').on('click', () => {
    console.log("inside send money function");
    let amountingg = $('#amountingg').val()
    let amountingpubkeyy = $('#amountingpubkeyy').val()

   // var e = document.getElementById(myList);
    let amountingprivv = $('#amountingprivv').val()
    
   
    if (amountingg.length == 0)
    { 
        Swal.fire({
            type: 'error',
            title: "Datafield empty",
            text: 'Amount filed empty',
            footer: 'Try Again'
            })  	
       return false; 
    }  
    if (amountingpubkeyy.length == 0)
    { 
        Swal.fire({
            type: 'error',
            title: "Datafield empty",
            text: 'Public Key Empty!',
            footer: 'Try Again'
            })  	 	
       return false; 
    }  
    
    if (amountingprivv.length == 0)
    { 
        Swal.fire({
            type: 'error',
            title: "Datafield empty",
            text: 'Private Key Empty!',
            footer: 'Try Again'
            })  	  	
       return false; 
    }  
    
   
    
    
    session.defaultSession.cookies.get({},(err,cookies)=>{
        if(err)console.error(err);


        cookies.map(function (cookiesdata) {

            console.log("below is the cookies data");
            
           if (cookiesdata.name == "login") {
               
                var obj = JSON.parse(cookiesdata.value);
                    //console.log(obj.UserDetails);
                var publickey = obj.UserDetails.publickey;
                Request.post({
                    "headers": { "content-type": "application/json" },
                    "url": "https://api-prod.kori.biz/api/v1/checkkriwallet",
                    "body": JSON.stringify({
                    "publicKey": amountingpubkeyy,
                    "usersend_amount": amountingg,
                    "userpublickey": publickey,
                    "secretKey": amountingprivv
                    })
            }, (error, response, body) => {
        if(error) {
                    Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                    })
            console.log("something went wrong", error);
            }
        else{

            // console.log(b);
            console.log("below is data");
            console.log(body);
            var successdata = JSON.parse(body);
            console.log(successdata);
            if(successdata.code==3)
            {

                Swal.fire({
                type: 'error',
                title: 'Failed',
                text: 'Public Key doesnt exist!',
                footer: 'Try Again'
                })
            }
            else if(successdata.code==2){
                Swal.fire({
                type: 'error',
                title: 'Failed',
                text: 'Please enter correct private key!',
                footer: 'Try Again'
                })
            }
            else if(successdata.code==1){
                Swal.fire({
                type: 'error',
                title: 'Failed',
                text: 'Please enter correct keys!',
                footer: 'Try Again'
                })
            }
            else if(successdata.code==0){

                session.defaultSession.cookies.set({
                    'name':'amountingg',
                    'value':amountingg,
                    'url':'http:localhost/'
                })
                session.defaultSession.cookies.set({
                    'name':'amountingpubkeyy',
                    'value':amountingpubkeyy,
                    'url':'http:localhost/'
                })
                session.defaultSession.cookies.set({
                    'name':'amountingprivv',
                    'value':amountingprivv,
                    'url':'http:localhost/'
                })

                


                window.location.href="confirm.html";
           
                }
                else{
                    Swal.fire({
                        type: 'error',
                        title: 'Failed',
                        text: 'Please fill the details',
                        footer: 'Try Again'
                        })
                }

                }
            
            }); 

                        
            }
            else{
                //console.log("no data");
    
            }
            });








         });
   })















//-------------------------------------till here--------------------------------------------



//-------------------------------------sending fri function-------------------------------
$('#send-moneyfri1').on('click', () => {
    console.log("inside send money function");
    let friamountingg = $('#friamountingg').val()
    let friamountingpubkeyy = $('#friamountingpubkeyy').val()

   // var e = document.getElementById(myList);
    let friamountingprivv = $('#friamountingprivv').val()
    
   
    if (friamountingg.length == 0)
    { 
        Swal.fire({
            type: 'error',
            title: "Datafield empty",
            text: 'Amount filed empty',
            footer: 'Try Again'
            })  	
       return false; 
    }  
    if (friamountingpubkeyy.length == 0)
    { 
        Swal.fire({
            type: 'error',
            title: "Datafield empty",
            text: 'Public Key Empty!',
            footer: 'Try Again'
            })  	 	
       return false; 
    }  
    
    if (friamountingprivv.length == 0)
    { 
        Swal.fire({
            type: 'error',
            title: "Datafield empty",
            text: 'Private Key Empty!',
            footer: 'Try Again'
            })  	  	
       return false; 
    }  
    
   
    
    
    session.defaultSession.cookies.get({},(err,cookies)=>{
        if(err)console.error(err);


        cookies.map(function (cookiesdata) {

            console.log("below is the cookies data");
            
           if (cookiesdata.name == "login") {
               
                var obj = JSON.parse(cookiesdata.value);
                    //console.log(obj.UserDetails);
                var publickey = obj.UserDetails.publickey;
                Request.post({
                    "headers": { "content-type": "application/json" },
                    "url": "https://api-prod.kori.biz/api/v1/checkkriwallet",
                    "body": JSON.stringify({
                    "publicKey": friamountingpubkeyy,
                    "usersend_amount": friamountingg,
                    "userpublickey": publickey,
                    "secretKey": friamountingprivv
                    })
            }, (error, response, body) => {
        if(error) {
                    Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                    })
            console.log("something went wrong", error);
            }
        else{

            // console.log(b);
            console.log("below is data");
            console.log(body);
            var successdata = JSON.parse(body);
            console.log(successdata);
            if(successdata.code==3)
            {

                Swal.fire({
                type: 'error',
                title: 'Failed',
                text: 'Public Key doesnt exist!',
                footer: 'Try Again'
                })
            }
            else if(successdata.code==2){
                Swal.fire({
                type: 'error',
                title: 'Failed',
                text: 'Please enter correct private key!',
                footer: 'Try Again'
                })
            }
            else if(successdata.code==1){
                Swal.fire({
                type: 'error',
                title: 'Failed',
                text: 'Please enter correct keys!',
                footer: 'Try Again'
                })
            }
            else if(successdata.code==0){

                session.defaultSession.cookies.set({
                    'name':'friamountingg',
                    'value':friamountingg,
                    'url':'http:localhost/'
                })
                session.defaultSession.cookies.set({
                    'name':'friamountingpubkeyy',
                    'value':friamountingpubkeyy,
                    'url':'http:localhost/'
                })
                session.defaultSession.cookies.set({
                    'name':'friamountingprivv',
                    'value':friamountingprivv,
                    'url':'http:localhost/'
                })

                


                window.location.href="friconfirm.html";
            //     Swal.fire({
            //         type: 'success',
            //         title: 'Congrats',
            //     text: 'Email send Successfully!',
            //                                 // footer: 'Try Again'
            // })
                }
                else{
                    Swal.fire({
                        type: 'error',
                        title: 'Failed',
                        text: 'Please fill the details',
                        footer: 'Try Again'
                        })
                }

                }
            
            }); 

                        
            }
            else{
                //console.log("no data");
    
            }
            });








         });
   })



//----------------------------------------till here--------------------------------------







//------------------------Transfer FIAT-----------------------------------

$('#send-money').on('click', () => {
    console.log("inside send money function");
    let data = $('#amounting').val()
    let data1 = $('#amountingpubkey').val()

   // var e = document.getElementById(myList);
    let data2 = $('#amountingpriv').val()
    console.log(data);
    console.log(data1);
    console.log(data2);
   
    if (data.length == 0)
    { 
        Swal.fire({
            type: 'error',
            title: "Datafield empty",
            text: 'Amount filed empty',
            footer: 'Try Again'
            })  	
       return false; 
    }  
    if (data1.length == 0)
    { 
        Swal.fire({
            type: 'error',
            title: "Datafield empty",
            text: 'Public Key Empty!',
            footer: 'Try Again'
            })  	 	
       return false; 
    }  
    
    if (data2.length == 0)
    { 
        Swal.fire({
            type: 'error',
            title: "Datafield empty",
            text: 'Private Key Empty!',
            footer: 'Try Again'
            })  	  	
       return false; 
    }  
    
   
    
    
    session.defaultSession.cookies.get({},(err,cookies)=>{
        if(err)console.error(err);
        // var user=cookies[0].value;
        // var obj = JSON.parse(user);

        cookies.map(function (cookiesdata) {

            console.log("below is the cookies data");
            
           if (cookiesdata.name == "login") {
               
                var obj = JSON.parse(cookiesdata.value);
                    //console.log(obj.UserDetails);
                    var eurobalance = obj.UserDetails.balance;
                    var publickey = obj.UserDetails.publickey;
             
                        Request.post({
                                "headers": { "content-type": "application/json" },
                                "url": "https://api-prod.kori.biz/api/v1/checkfiatuser",
                                "body": JSON.stringify({
                                "userpublickey": publickey,
                                "usersend_amount": data,
                                "sendaddress_amount": data1,
                                "send_privatekey": data2,
                                "withdrawtype" : "Transfer",
                                "transactiontype" : "TRANSFER",
                                "amounttype" : "EURO"
            
                                    })
                        }, (error, response, body) => {
                    if(error) {
                                Swal.fire({
                                type: 'error',
                                title: "It's a server error ...",
                                text: 'Please send request again!',
                                footer: 'Try Again'
                                })
                        console.log("something went wrong", error);
                        }
                    else{
            
                        // console.log(b);
                        console.log("below is data");
                        console.log(body);
                        var successdata = JSON.parse(body);
                        console.log(successdata);
                        if(successdata.code==3)
                        {
            
                            Swal.fire({
                            type: 'error',
                            title: 'Failed',
                            text: 'Please enter correct public key!',
                            footer: 'Try Again'
                            })
                        }
                        else if(successdata.code==2){
                            Swal.fire({
                            type: 'error',
                            title: 'Failed',
                            text: 'Please enter correct private key!',
                            footer: 'Try Again'
                            })
                        }
                        else if(successdata.code==0){
                            session.defaultSession.cookies.set({
                                'name':'amounting',
                                'value':data,
                                'url':'http:localhost/'
                            })
                            session.defaultSession.cookies.set({
                                'name':'amountingpubkey',
                                'value':data1,
                                'url':'http:localhost/'
                            })
                            session.defaultSession.cookies.set({
                                'name':'amountingpri',
                                'value':data2,
                                'url':'http:localhost/'
                            })
                            newsendingfunction(publickey,data,data1,data2,eurobalance);
                            }
                        else{
                                Swal.fire({
                                    type: 'error',
                                    title: 'Failed',
                                    text: 'Please fill the details',
                                    footer: 'Try Again'
                                    })
                            }
            
                            }
                        
                        }); 
                        
            }
            else{
                //console.log("no data");
    
            }
            });






        });
   })

   function newsendingfunction(publickey,data,data1,data2,eurobalance)
   {

        Request.get({
                "headers": { "content-type": "application/json" },
                "url": "https://api-prod.kori.biz/api/v1/getTransferfee"

                }, (error, response, body) => {
                if(error) {
                        Swal.fire({
                        type: 'error',
                        title: "It's a server error ...",
                        text: 'Please send request again!',
                        footer: 'Try Again'
                        })
                console.log("something went wrong", error);
                }
                else{

                // console.log(b);

                var successdata = JSON.parse(body);
                if(successdata.code==1){
                    Swal.fire({
                    type: 'error',
                    title: 'Failed',
                    text: 'Server is not responding for fetching data!',
                    footer: 'Try Again'
                    })
                }
                else{
                    console.log("below is fee value");
                    console.log(successdata.data[0].fee);
                    var fees = successdata.data[0].fee;
                    var newamnt = Number(data) + Number(successdata.data[0].fee);
                    console.log("here is the euro balance");
                   // console.log(eurobalance);
                    console.log(newamnt);
                 
                     if(newamnt<=eurobalance)
                     {
                        session.defaultSession.cookies.set({
                            'name':'newamount',
                            'value':newamnt.toString(),
                            'url':'http:localhost/'
                        })
                        session.defaultSession.cookies.set({
                            'name':'fees',
                            'value':fees,
                            'url':'http:localhost/'
                        })
                        session.defaultSession.cookies.set({
                            'name':'amountingpubkeyag',
                            'value':data1,
                            'url':'http:localhost/'
                        })
                        session.defaultSession.cookies.set({
                            'name':'amountingpriag',
                            'value':data2,
                            'url':'http:localhost/'
                        })
                        session.defaultSession.cookies.set({
                            'name':'amountingagain',
                            'value':data,
                            'url':'http:localhost/'
                        })
                        session.defaultSession.cookies.get({},(err,cookies)=>{
                            console.log(cookies);
                        })
                       
                       window.location.href="money_confirm.html";
                     }
                    else{
                    
                        Swal.fire({
                        type: 'error',
                        title: 'Failed',
                        text: 'You cannot put amount higher than EURO Balance',
                        footer: 'Try Again'
                        })
                    }}

                    }
                }); 
    }


    $('#send-confirm').on('click', () => {
        

        let data = $('#amountnewfortrade').val()
       
        let data1 = $('#transactionfees').val()

        let amount = Number(data) - Number(data1);
       
        
      

        session.defaultSession.cookies.get({},(err,cookies)=>{
            if(err)console.error(err);
            let newval;
            var newval1;
            var newval2;


            cookies.map(function (cookiesdata) {
                if (cookiesdata.name == "login") {
        
                    var obj = JSON.parse(cookiesdata.value);
                
                    var publickey1 = obj.UserDetails.publickey;
                    newval = publickey1;
                    // let rcvrpub=cookies[3].value;
                    // let data2=cookies[4].value;
      
                    // afterConfirmation(publickey1,amount,rcvrpub,data2,data1);
             }
             else if (cookiesdata.name == "amountingpubkey") {
        
                newval1 = cookiesdata.value;
         }
         else if (cookiesdata.name == "amountingpri") {
        
            newval2 = cookiesdata.value;
     }
            else{
                    //console.log("no data");
        
                }
               });

               afterConfirmation(newval,amount,newval1,newval2,data1);



             })

 })
function afterConfirmation(publickey1,amount,rcvrpub,data2,data1){
     Request.post({
        "headers": { "content-type": "application/json" },
        "url": "https://api-prod.kori.biz/api/v1/sendfiat",
        "body": JSON.stringify({
        "userpublickey": publickey1,  //user
        "usersend_amount": amount,    
        "sendaddress_amount": rcvrpub,  //receiver pub key
        "send_privatekey": data2,    //user private key
        "withdrawtype" : "Transfer",
        "transactiontype" : "TRANSFER",
        "amounttype" : "EURO",
        "transferamount" : data1   //fees

    })

    }, (error, response, body) => {
    if(error) {
      
        Swal.fire({
        type: 'error',
        title: "It's a server error ...",
        text: 'Please send request again!',
        footer: 'Try Again'
        })
    console.log("something went wrong", error);
    }
    else{
      
        var successdata = JSON.parse(body);
    if(successdata.code==1)
    {

       
            Swal.fire({
            type: 'error',
            title: 'Failed',
            text: 'Please enter Correct Public key!',
            footer: 'Try Again'
            })
    }
    else{
        
    Swal.fire({
                type: 'success',
                title: 'Congrats',
            text: 'FIAT send Successfully!',
                                        // footer: 'Try Again'
        })
    }

    }
    }); 

}

//------------------------transfer fiat ends here---------------------------






//----------------------------sending kri -----------------------------------



$('#sending-kri').on('click', () => {
        

    let data = $('#data').val()
   
    let data1 = $('#data1').val()

    let data2 = $('#data2').val()

   
    
  

    session.defaultSession.cookies.get({},(err,cookies)=>{
        if(err)console.error(err);


        cookies.map(function (cookiesdata) {

            console.log("below is the cookies data");
            
           if (cookiesdata.name == "login") {
               
                var obj = JSON.parse(cookiesdata.value);
          //console.log(obj.UserDetails);
    var publickey = obj.UserDetails.publickey;
    sendingfinalkriamount(data,data1,data2,publickey);
               
            }
            else{
                //console.log("no data");

            }
            });

    //     var user=cookies[0].value;
    // var obj = JSON.parse(user);
    // //console.log(obj.UserDetails);
    // var publickey = obj.UserDetails.publickey;

    //       sendingfinalkriamount(data,data1,data2,publickey);


         })

})
function sendingfinalkriamount(data,data1,data2,publickey){
    Request.post({
       "headers": { "content-type": "application/json" },
       "url": "https://api-prod.kori.biz/api/v1/transferpayment",
       "body": JSON.stringify({
           "secretKey": data2,
           "publicKey": data,
           "amount": data1,
           "userpublickey" : publickey
       })
   }, (error, response, body) => {
       if(error) {
         
           console.log(data);
           console.log(data1);
           console.log(data2);
           console.log(publickey);
           Swal.fire({
                   type: 'error',
                   title: "It's a server error ...",
                   text: 'Please send request again!',
                   footer: 'Try Again'
                 })
           console.log("private key or public key or both are wrong", error);
       }
       else{
           console.log(body);
           var successdata = JSON.parse(body);
           console.log(successdata)
          if(successdata.code==0)
          {
          Swal.fire({
                       type: 'success',
                       title: 'Congrats',
                       text: 'KRI send Successfully!',
                       // footer: 'Try Again'
                     })
           console.log("KRI is successfully send");
          }
         else if(successdata.code==2){

               Swal.fire({
                           type: 'error',
                           title: 'Oops...',
                           text: 'Private Key is wrong!',
                           footer: 'Try Again'
                         })
           }
           else if(successdata.code==3){

               Swal.fire({
                           type: 'error',
                           title: 'Oops...',
                           text: 'Public Key is wrong!',
                           footer: 'Try Again'
                       })
               }
               else{
                   Swal.fire({
                           type: 'error',
                           title: 'Oops...',
                           text: 'Private Key is wrong!',
                           footer: 'Try Again'
                       })

               }
           }
   });
   

   }







//---------------------------sending kri ends here--------------------------------



//-----------------------------sending fri function final----------------


$('#sending-fri').on('click', () => {
        

    let data = $('#data').val()
   
    let data1 = $('#data1').val()

    let data2 = $('#data2').val()

   
    
  

    session.defaultSession.cookies.get({},(err,cookies)=>{
        if(err)console.error(err);


        cookies.map(function (cookiesdata) {

            console.log("below is the cookies data");
            
           if (cookiesdata.name == "login") {
               
                var obj = JSON.parse(cookiesdata.value);
          //console.log(obj.UserDetails);
    var publickey = obj.UserDetails.publickey;
    sendingfinalfriamount(data,data1,data2,publickey);
               
            }
            else{
                //console.log("no data");

            }
            });

    //     var user=cookies[0].value;
    // var obj = JSON.parse(user);
    // //console.log(obj.UserDetails);
    // var publickey = obj.UserDetails.publickey;

    //       sendingfinalkriamount(data,data1,data2,publickey);


         })

})
function sendingfinalfriamount(data,data1,data2,publickey){
    Request.post({
       "headers": { "content-type": "application/json" },
       "url": "https://api-prod.kori.biz/api/v1/sendfri",
       "body": JSON.stringify({
           "secretKey": data2,
           "publicKey": data,
           "amount": data1
       })
   }, (error, response, body) => {
       if(error) {
         
           console.log(data);
           console.log(data1);
           console.log(data2);
           console.log(publickey);
           Swal.fire({
                   type: 'error',
                   title: "It's a server error ...",
                   text: 'Please send request again!',
                   footer: 'Try Again'
                 })
           console.log("private key or public key or both are wrong", error);
       }
       else{
           console.log(body);
           var successdata = JSON.parse(body);
           console.log(successdata)
          if(successdata.code==0)
          {
          Swal.fire({
                       type: 'success',
                       title: 'Congrats',
                       text: 'FRI send Successfully!',
                       // footer: 'Try Again'
                     })
           console.log("FRI is successfully send");
          }
         else if(successdata.code==2){

               Swal.fire({
                           type: 'error',
                           title: 'Oops...',
                           text: 'Private Key is wrong!',
                           footer: 'Try Again'
                         })
           }
           else if(successdata.code==3){

               Swal.fire({
                           type: 'error',
                           title: 'Oops...',
                           text: 'Public Key is wrong!',
                           footer: 'Try Again'
                       })
               }
               else{
                   Swal.fire({
                           type: 'error',
                           title: 'Oops...',
                           text: 'Private Key is wrong!',
                           footer: 'Try Again'
                       })

               }
           }
   });
   

   }














//-------------------till here----------------------------------------











//----------------------------change password function---------------------

 $('#change-password').on('click', () => {
    
        
        let currentpassword = $('#currentpassword').val()
        let newpassword = $('#newpassword').val()

       // var e = document.getElementById(myList);
        let confirm = $('#confirm').val()



        if (currentpassword.length == 0)
        { 
            Swal.fire({
                type: 'error',
                title: "Datafield empty",
                text: 'Current Password filed empty',
                footer: 'Try Again'
                })  	
           return false; 
        }  
        if (newpassword.length == 0)
        { 
            Swal.fire({
                type: 'error',
                title: "Datafield empty",
                text: 'New Password Empty!',
                footer: 'Try Again'
                })  	 	
           return false; 
        }  
        if (confirm.length == 0)
        { 
            Swal.fire({
                type: 'error',
                title: "Datafield empty",
                text: 'Confirm Password Empty!',
                footer: 'Try Again'
                })  	 	
           return false; 
        }  











        if(confirm != newpassword ){
            Swal.fire({
                    type: 'error',
                    title: "Oops ...",
                    text: 'Please check if your passwords are same!',
                    // footer: 'Try Again'
                  })
            // dialog.showMessageBox({message:"Please check if your passwords are same",title:"Unsuccesfull"});
            return false;
   
        }

       let currentpasswor = crypt.createHash('sha256').update(currentpassword).digest('hex');
       let newpasswor = crypt.createHash('sha256').update(newpassword).digest('hex');
        
      session.defaultSession.cookies.get({},(err,cookies)=>{
        if(err)console.error(err);


        cookies.map(function (cookiesdata) {
            if (cookiesdata.name == "login") {
    
                var obj = JSON.parse(cookiesdata.value);
            
                var publickey = obj.UserDetails.publickey;
                changepassword(publickey,currentpasswor,newpasswor);
    
    
    
                //console.log(window.data1);
            }
            else{
                //console.log("no data");
    
            }
           });

         })
       })
//--------------------------change password ends here---------------------

  function changepassword(publickey,currentpasswor,newpasswor){
            var a=publickey;
            var b=currentpasswor;
            var c=newpasswor;
            console.log("below");
            console.log(a);
            console.log(b);
            console.log(c);
        Request.post({
            "headers": { "content-type": "application/json" },
            "url": "https://api-prod.kori.biz/api/v1/changepassword",
            "body": JSON.stringify({
                "publickey": publickey,
                "currpassword": currentpasswor,
                "newpassword": newpasswor
            })
        }, (error, response, body) => {
            if(error) {
                Swal.fire({
                    type: 'error',
                    title: "It's a server error ...",
                    text: 'Please send request again!',
                    footer: 'Try Again'
                  })
                 // dialog.showMessageBox({message:"Please try again",title:"Unsuccesfull"});
                 
                console.log(publickey);
                console.log(currentpasswor);
                console.log(newpasswor);
                console.log("something went wrong", error);
            }
            else{
                // dialog.showMessageBox({message:"Please try again",title:"Unsuccesfull"});
                 
              console.log(body);
                var successdata = JSON.parse(body);
                if(successdata.code==0)
                {
                    Swal.fire({
                    type: 'success',
                    title: 'Congrats',
                    text: 'Password changed Successfully!',
                    // footer: 'Try Again'
                  })
                // dialog.showMessageBox({message:"Password changed successfully",title:"Success"});
                 console.log("successful");
                }
                else{
                    Swal.fire({
                    type: 'error',
                    title: "Oops ...",
                    text: 'Please try again!',
                    // footer: 'Try Again'
                  })
                     // dialog.showMessageBox({message:"Please try again",title:"Unsuccesfull"});
                }
                }
        });
    
       
     }
   
     

   


$('#add-logout').on('click', () => {
    sessionStorage.clear();
    window.location.href="login.html";


 })



    

})