var allEvents = [];
var loc = '';
var temp = [
				{
					title: 'All Day Event',
					start: '2015-02-01'
				},
				{
					title: 'Long Event',
					start: '2015-02-07',
					end: '2015-02-10'
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: '2015-02-09T16:00:00'
				},
				{
					id: 999,
					title: 'Repeating Event',
					start: '2015-02-16T16:00:00'
				},
				{
					title: 'Conference',
					start: '2015-02-11',
					end: '2015-02-13'
				},
				{
					title: 'Meeting',
					start: '2015-02-12T10:30:00',
					end: '2015-02-12T12:30:00'
				},
				{
					title: 'Lunch',
					start: '2015-02-12T12:00:00'
				}
            ];

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
    
    console.log('InCal: ' + allEvents);
    
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
    var goalString = '<div class="modal"><p>Goal</p><form><input type="text" name="goalname" placeholder="Name"><br><input type="range" id="priority" value="0" step="0.5" min="0" max="5"><br></form></div>';
    var classString = '<div class="modal"><p>Class</p><form><input type="text" name="classname" placeholder="Name"><br><input type="text" name="starttime" placeholder="Start Time"><br><input type="text" name="endtime" placeholder="End Time"><br><input type="checkbox" name="weekday" value="monday">Monday<br><input type="checkbox" name="weekday" value="tuesday">Tuesday<br><input type="checkbox" name="weekday" value="wednesday">Wednesday<br><input type="checkbox" name="weekday" value="thursday">Thursday<br><input type="checkbox" name="weekday" value="friday">Friday<br><input type="checkbox" name="weekday" value="saturday">Saturday<br><input type="checkbox" name="weekday" value="sunday">Sunday<br><input type="range" name="priorityRange" id="priority" value="0" step="0.5" min="0" max="5"><br>Priority</form></div>';
    var eventString = '<div class="modal"><p>Event</p><form><input type="text" name="goalname" placeholder="Name"><br><input type="text" name="starttime" placeholder="Start Time"><br><input type="text" name="endtime" placeholder="End Time"><br><input type="checkbox" name="weekday" value="monday">Monday<br><input type="checkbox" name="weekday" value="tuesday">Tuesday<br><input type="checkbox" name="weekday" value="wednesday">Wednesday<br><input type="checkbox" name="weekday" value="thursday">Thursday<br><input type="checkbox" name="weekday" value="friday">Friday<br><input type="checkbox" name="weekday" value="saturday">Saturday<br><input type="checkbox" name="weekday" value="sunday">Sunday<br>Priority</form></div>';
    
    var name, start = '', end = '', priority = [], priority = 0;
    $('#classlink').click(function() {
        vex.dialog.open({
            input: classString,
            callback: function(value) {
                if (value != false) {
                    name = value.classname;
                    start = value.starttime;
                    end = value.endtime;
                    priority = value.priorityRange;
                    console.log(name + " : " + start + " : " + end + " : " + priority);
                }
            }
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