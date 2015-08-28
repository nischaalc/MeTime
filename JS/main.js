var clientID = '593421187274-6oq2kl1u02u4k97lps8vu2tdmpgofpep.apps.googleusercontent.com';

function onSuccess(googleUser) {
    "use strict";
    //window.location.href = "http://nischaalc.github.io/MeTime/users?name=" + googleUser.getBasicProfile().getName();
    window.localStorage.setItem("googleUser.object", googleUser.getAuthResponse().id_token);
    console.log(googleUser);
    console.log(googleUser.getAuthResponse().access_token);
    console.log(googleUser.getAuthResponse().id_token);
}

function renderButton() {
    "use strict";
    gapi.signin2.render('googleIn', {
        'scope': 'https://www.googleapis.com/auth/calendar profile',
        'width': 200,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'cookiepolicy': 'single_host_origin',
        'onsuccess': onSuccess
    });
}