var allEvents = [
            {
                title: 'Long Event',
                start: '2015-08-10',
                end: '2015-08-26'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2015-08-26T16:00:00',
                end: '2015-08-26T18:00:00'
            },
            {
                title: 'Conference',
                start: '2015-08-25',
                end: '2015-08-27'
            },
            {
                title: 'Lunch',
                start: '2015-08-25T12:00:00',
                end: '2015-08-25T14:00:00'
            },
            {
                title: 'Happy Hour',
                start: '2015-08-24T17:30:00',
                end: '2015-08-24T19:00:00'
            },
            {
                title: 'Dinner',
                start: '2015-08-26T20:00:00',
                end: '2015-08-26T22:00:00'
            },
            {
                title: 'Birthday Party',
                start: '2015-08-27T07:00:00',
                end: '2015-08-27T09:00:00'
            },
            {
                title: 'Click for Google',
                url: 'http://google.com/',
                start: '2015-08-28',
                end: '2015-08-29'
            }
        ];
var loc = '', authToken = '';

$(document).ready(function () {
    "use strict";

    $('#calendar').css('visibility', 'hidden');
    $('#dayinfo').hide();
    $('#footer').hide();
    
    var today = moment();
    
    getLocation(today);
    createCalendar();
    getWeather(loc, today);
    
    $('.spinner').fadeOut(750, function() {
        $('#calendar').fadeIn(function() {
            $('#calendar').css('visibility', 'visible');
        });
        $('#dayinfo').fadeIn();
        $('#footer').fadeIn();
    });        
        
    var name = getUrlVars()['name'];
    if (name.indexOf('%20') != -1)
        name = name.replace('%20', ' ');
    $('#username').text(name);    
    
    var googleUser = window.localStorage.getItem("googleUser.object");
    console.log(googleUser);
    authToken = googleUser.getAuthResponse();
    console.log(authToken);
});

function createCalendar() {
    var height = ($(window).height() / 1.5);

    var day = moment().format('e');
    if (day == 7)
        day = 0;
    
    $('#calendar').fullCalendar({
        header: {
            left: 'prev',
            center: 'title',
            right: 'next'
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

function addEvent() {
    console.log('test');
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
        $.getJSON(url)
            .done(function(data) {
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
    var goalString = '<div class="modal"><p>Goal</p><form><input type="text" name="goalname" placeholder="Name"><br></form></div>';
    var classString = '<div class="modal"><p>Class</p><form><input type="text" name="goalname" placeholder="Name"><br><input type="text" name="starttime" placeholder="Start Time"><br><input type="text" name="endtime" placeholder="End Time"><br><select><option value="monday">Monday</option><option value="tuesday">Tuesday</option><option value="wednesday">Wednesday</option>    <option value="thursday">Thursday</option><option value="friday">Friday</option><option value="saturday">Saturday</option><option value="Sunday">Sunday</option></select></form></div>';
    var eventString = '<div class="modal"><p>Event</p><form><input type="text" name="goalname" placeholder="Name"><br><input type="text" name="starttime" placeholder="Start Time"><br><input type="text" name="endtime" placeholder="End Time"><br><select><option value="monday">Monday</option><option value="tuesday">Tuesday</option><option value="wednesday">Wednesday</option>    <option value="thursday">Thursday</option><option value="friday">Friday</option><option value="saturday">Saturday</option><option value="Sunday">Sunday</option></select></form></div>';
    
    $('#classlink').click(function() {
        vex.dialog.open({
            input: classString
        });
    });
    
    $('#eventlink').click(function() {
        vex.dialog.open({
            input: eventString
        });
    });
    
    $('#goallink').click(function() {
        vex.dialog.open({
            input: goalString
        });
    });
});