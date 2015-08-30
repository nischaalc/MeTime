var allEvents = [];
var loc = '';

$(document).ready(function () {
    "use strict";

    $('#calendar').css('visibility', 'hidden');
    $('#dayinfo').hide();
    $('#footer').hide();
    
    var today = moment();
    var accessToken = window.localStorage.getItem("googleUser.object");
    
    getLocation(today);
    getGCalEvents(accessToken);
    getWeather(loc, today);
    
    $('.spinner').fadeOut(750, function() {
        $('#calendar').fadeIn(function() {
            $('#calendar').css('visibility', 'visible');
        });
        $('#dayinfo').fadeIn();
        $('#footer').fadeIn();
    });        
        
    var name = getUrlVars().name;
    if (name.indexOf('%20') != -1)
        name = name.replace('%20', ' ');
    $('#username').text(name);    
});

function getGCalEvents(token) {
    var url = 'https://metime.herokuapp.com/calEvents?token=' + token;

    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data, status) {
            allEvents = data.items;
            createCalendar();
        }
    });
}

function createCalendar() {
    var height = ($(window).height() / 1.5);

    var day = moment().format('e');
    if (day == 7)
        day = 0;
    
    $('#calendar').fullCalendar({
        header: {
            center: 'title',
            left: 'false',
            right: 'false'
        },
        firstDay: day,
        defaultView: 'basicWeek',
        height: height,
        events: allEvents,
        dayClick: function(date, jsEvent, view) {
            populateDate(date);
            getWeather(loc, date);
        },
        loading: function(isLoading, view) {
            if (isLoading) 
                $('.spinner').show();
            else 
                $('.spinner').hide();
        }
    });
    
    var today = moment();
    $('#title').html("<h2>Information for " + today.toString().substring(0, 15) + "</h2>");
}

function populateDate(date) {
        $('#title').html("<h2>Information for " + date.toString().substring(0, 15) + "</h2>");
}


function getUrlVars() {
    "use strict";
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getLocation(date) {
    var url = 'http://api.wunderground.com/api/a13f71c3ae3eecbb/geolookup/q/autoip.json';
    
    if (loc == '' || loc == null || loc == undefined) {
        $.getJSON(url).done(function(data) {
                loc = data.location.zip;
                getWeather(loc, date)
        });
    }
}

function getWeather(zip, date) {
    var url =  'http://api.wunderground.com/api/a13f71c3ae3eecbb/forecast10day/q/' + zip + '.json';  
    $.getJSON(url).done(function(data) {
        var forecastArray = data.forecast.simpleforecast.forecastday;
        var icon, high, low, desc;
        var dayOfWeek = date.format('dddd');
        for (var i = 0; i < 7; i++) {
            if (forecastArray[i].date.weekday == dayOfWeek) {
                icon = forecastArray[i].icon_url;
                desc = forecastArray[i].conditions;
                high = forecastArray[i].high.fahrenheit;
                low = forecastArray[i].low.fahrenheit;
                displayWeather(icon, desc, high, low);
            }
        }
    });
}

function displayWeather(icon, desc, high, low) {
    var strHtml = '<img src=' + icon + ' class="icon"/>';
    strHtml = strHtml + '<p class="temp">High: ' + high + ' &deg;F</p>';
    strHtml = strHtml + '<p class="temp">Low: ' + low + ' &deg;F</p>';
    strHtml = strHtml + '<p class="desc">' + desc + '</p>';
    
    $('.weatherobject').html(strHtml);
}

$(function() {
    var name = '', start = '', end = '', priority = 0, days = [];
    
    classdialog = $('.classmodal').dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "Add Class": addClass,
            Cancel: function() {
                classdialog.dialog('close');
            }
        },
        close: function() {
            console.log('form closed');
        }
    });
    
    eventdialog = $('.eventmodal').dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "Add Class": addEvent,
            Cancel: function() {
                eventdialog.dialog('close');
            }
        },
        close: function() {
            console.log('form closed');
        }
    });
    
    goaldialog = $('.goalmodal').dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "Add Class": addGoal,
            Cancel: function() {
                goaldialog.dialog('close');
            }
        },
        close: function() {
            console.log('form closed');
        }
    });
    
    $('#classlink').click(function() {
        classdialog.dialog('open');
    });
    
    $('#eventlink').click(function() {
        eventdialog.dialog('open');
    });
    
    $('#goallink').click(function() {
        goaldialog.dialog('open');
    });
    
    function addClass() {
        name = $('#classname').val();
        start = $('#classStart').val();
        end = $('#classEnd').val();
        priority = $('#classPri').val();
        days = $('input[name=classWeek]:checked').map(function()
            {
                return $(this).val();
            }).get();
        
        console.log('Class - ' + name + ':' + start + ':' + end + ':' + priority + ':' + days);
        
    }
    
    function addGoal() {
        name = $('#goalName').val();
        start = 0;
        end = 0;
        priority = $('#goalPri').val();
        days = null;
        
        console.log('Goal - ' + name + ':' + priority);
    }
    
    function addEvent() {
        name = $('#eventName').val();
        start = $('#eventStart').val();
        end = $('#eventEnd').val();
        priority = 0;
        days = $('input[name=eventWeek]:checked').map(function()
            {
                return $(this).val();
            }).get();
        
        console.log('Event - ' + name + ':' + start + ':' + end + ':' + priority + ':' + days);
    }
});