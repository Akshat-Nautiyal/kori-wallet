let $ = require('jquery');
var Request = require("request");
 $('#add-register').on('click', () => {
    

    
    let userFirstname = $('#userFirstname').val()
    let userLastname = $('#userLastname').val()
    let username = $('#username').val()
    let useremail = $('#useremail').val()
    let usertype = $('#usertype').val()
    let phoneno = $('#phoneno').val()
    let userpassword = $('#userpassword').val()
    let country = $('#country').val()
    let state = $('#state').val()
    let city = $('#city').val()




     Request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://api.bitstudioz.com/api/v1/createuser",
        "body": JSON.stringify({
            "userFirstname": userFirstname,
            "userLastname" : userLastname,
            "username": username,
            "useremail": useremail,
            "usertype": usertype,
            "phoneno": phoneno,
            "userpassword": userpassword,
            "country": country,
            "state": state,
            "city": city
        })
    }, (error, response, body) => {
        if(error) {
            console.log("error");
        }
        var da = JSON.parse(body);
        // console.log(da);
        if(da.message=="success"){
            alert("You are succesfully registered. Please note down below information" + "Your private key is: "+ da.privatekey + ", Your public key is: " + da.publickey);
            
        }
       
        console.log(JSON.parse(body));
    });






 })
 