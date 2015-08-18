$(window).load(function () {
    "use strict";
    var height = ($(window).height() / 1.5);
    
    $('#calendar').fullCalendar({
        header: {
            left: 'prev',
            center: 'title',
            right: 'next'
        },
        firstDay: 1,
        defaultView: 'basicWeek',
        height: height,
        events: [
            {
                title: 'All Day Event',
                start: '2015-02-01'
            },
            {
                title: 'Long Event',
                start: '2015-08-10',
                end: '2015-08-11'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2015-08-12T16:00:00'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2015-08-16T16:00:00'
            },
            {
                title: 'Conference',
                start: '2015-08-11',
                end: '2015-08-13'
            },
            {
                title: 'Meeting',
                start: '2015-08-13T10:30:00',
                end: '2015-08-13T12:30:00'
            },
            {
                title: 'Lunch',
                start: '2015-08-15T12:00:00'
            },
            {
                title: 'Meeting',
                start: '2015-02-12T14:30:00'
            },
            {
                title: 'Happy Hour',
                start: '2015-08-114T17:30:00'
            },
            {
                title: 'Dinner',
                start: '2015-08-115T20:00:00'
            },
            {
                title: 'Birthday Party',
                start: '2015-08-13T07:00:00'
            },
            {
                title: 'Click for Google',
                url: 'http://google.com/',
                start: '2015-08-12'
            }
        ]
    });
    console.log(getUrlVars());
});

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