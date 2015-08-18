function onSuccess(googleUser) {
    "use strict";
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    window.location.href = "http://nischaalc.github.io/MeTime/users?name=" + googleUser.getBasicProfile().getName();
    console.log(googleUser.getBasicProfile());
}

function renderButton() {
    "use strict";
    gapi.signin2.render('my-signin2', {
        'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/calendar',
        'width': 200,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'cookiepolicy': 'single_host_origin',
        'onsuccess': onSuccess
    });
}