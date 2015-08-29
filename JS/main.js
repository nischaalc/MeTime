function onSuccess(googleUser) {
    "use strict";
    window.localStorage.setItem("googleUser.object", googleUser.Ka.access_token);
    getGCalEvents(googleUser.Ka.access_token);
    //window.location.href = "http://nischaalc.github.io/MeTime/users?name=" + googleUser.getBasicProfile().getName();
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

function getGCalEvents(token) {
    var url = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
        
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data, status) {
            console.log(data);
        },
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
    });
}