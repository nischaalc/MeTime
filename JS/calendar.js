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
        ],
    location;

$(window).load(function () {
    "use strict";

    $('#calendar').css('visibility', 'hidden');
    $('#dayinfo').hide();
    $('#footer').hide();
    
    createCalendar();
    
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
    
    location = getLocation();
    console.log(location);
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
            getWeather(location, date);
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
    
    $.getJSON(url)
        .done(function(data) {
        return data.location.zip;
    });
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
    var htmlString = '<div class="modal"><p>Test</p></div>'
    $('.link').click(function() {
        vex.dialog.open({
            message: 'Test',
            input: htmlString
        });
    });
});