$(document).ready(function(){
    loggerGet(["F:MTEST"], "10minago", "now", init)
})

function init(result) {
    let reply = result['data-set'].reply

    for (var i = 0; i < reply.length; i++) {
        let logDateTime = new Date(reply[i].time),
            logTime = timeFromDate(logDateTime)

        if ($('#container').children().length >= 10) { // 10 readings on page already
            $('#container tr:first-child').remove() // remove first reading
        }

        $('#container1').append(`<tr class="new"><td>${reply[i].value.content}</td><td>@</td><td>${logTime}</td></tr>`)
    }

    liveGet()
}

function print(obj,info) {
    if (typeof(obj.data) === 'undefined') {
        console.log("ERROR: data undefined")
        return false
    }

    let dateTime = new Date(obj.timestamp),
        time = timeFromDate(dateTime)

    if ($('#container1').children().length >= 10) { // 10 readings on page already
        $('#container1 tr:first-child').remove() // remove first reading
    }

    $('#container1').append(`<tr class="new"><td>${obj.data}</td><td>@</td><td>${time}</td></tr>`) // append new reading
}

function liveGet() {
    let dpm = new DPM()

    dpm.addRequest("F:MTEST@E,37",print)

    dpm.start()
}

function timeFromDate(date) {
    let hour = date.getHours() < 10 ? '0'+date.getHours() : date.getHours(),
        min = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes(),
        sec = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds()

    return hour+':'+min+':'+sec
}
