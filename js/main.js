$(document).ready(function(){
    loggerGet(["F:MT6SC1"], "10minago", "now", print)
    liveGet()
})

function print(obj,info) {
    if (typeof(obj.data) === 'undefined') {
        console.log("ERROR: data undefined")
        return false
    }

    let dateTime = new Date(1000*obj.timestamp),
        time = timeFromDate(dateTime)

    if ($('#container').children().length >= 10) { // 10 readings on page already
        $('#container div:first-child').remove() // remove first reading
    }

    $('#container').append(`<div>${obj.data} @ ${time}</div>`) // append new reading
}

function liveGet() {
    let dpm = new DPM()

    dpm.addRequest("F:MT6SC1@E,36",print)

    dpm.start()
}

function timeFromDate(date) {
    let hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds()

    return hour+':'+min+':'+sec
}
