const URL = "http://localhost:3000"
// https://tonyspiro.com/how-to-keep-session-data-after-fetch-post-with-express/
Parse.initialize("myAppId2", "myMasterKey2"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "http://localhost:1337/parse";
window.onload = function () {
    document.getElementById("signin").onclick = function() {
        let username = document.getElementById("fname").value
        let password = "thisispassword"
        //let email = `${username}@gmail.com`
        const data = { username, password};

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

    document.getElementById("getuser").onclick = function() {
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

