const express = require('express')
const app = express()
const port = 8000

(function ($) {
    "use strict";

    
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

})(jQuery);
function redirect(){
    if($('#form').valid()){
        //window.open("index.html", "_self");
        app.get('/', (req, res) => res.send('Hello World!'))
        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    }
    app.get('/', (req, res) => res.send('Hello World!'))
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

const URL = "http://localhost:3000" 
// https://tonyspiro.com/how-to-keep-session-data-after-fetch-post-with-express/
Parse.initialize("myAppId2", "myMasterKey2"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "http://localhost:1337/parse";
window.onload = function () {
    document.getElementById("signin1").onclick = function() {
        //let username = document.getElementById("usernamee").value
        //let password = "thisispassword"
        let password = document.getElementById("password1").value
        //let email = `${username}@gmail.com`
        let email = document.getElementById("email1").value
        const data = { email, password};

        fetch(URL + "/api/signin", {
            method: 'POST',
            //credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
    }

    document.getElementById("signupp").onclick = function() {
        gethttp(URL + "/api/getcurrentuser")
        .then(res => {
            debugger
            let user = JSON.parse(res.body).message

            console.log(user)
            document.getElementById("user").innerHTML = user.username
            
        }, err => {
            console.log(err)
        })
    }
}

async function gethttp(url) {
    let response = await fetch(url);
    let responsemessage = await response.text();
    return { body: responsemessage, status: response.status };
}

