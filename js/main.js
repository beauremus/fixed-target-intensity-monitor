$(document).ready(function(){
    loggerGet(["F:MT6SC1"], "10minago", "now", init)
})

function init(result) {
    let reply = result['data-set'].reply

    for (var i = 0; i < reply.length; i++) {
        let logDateTime = new Date(reply[i].time),
            logTime = timeFromDate(logDateTime)

        if ($('#container').children().length >= 10) { // 10 readings on page already
            $('#container div:first-child').remove() // remove first reading
        }

        $('#container').append(`<div>${reply[i].value.content} @ ${logTime}</div>`)
    }

    liveGet()
}

function print(obj,info) {
    if (typeof(obj.data) === 'undefined') {
        console.log("ERROR: data undefined")
        return false
    }

    console.log(obj.timestamp)

    let dateTime = new Date(obj.timestamp),
        time = timeFromDate(dateTime)

    console.log("dateTime: ",dateTime," time: ",time)

    if ($('#container').children().length >= 10) { // 10 readings on page already
        $('#container div:first-child').remove() // remove first reading
    }

    $('#container').append(`<div>${obj.data} @ ${time}</div>`) // append new reading
}

function liveGet() {
    let dpm = new DPM()

    dpm.addRequest("F:MT6SC1@E,37",print)

    dpm.start()
}

function timeFromDate(date) {
    let hour = date.getHours() < 10 ? '0'+date.getHours() : date.getHours(),
        min = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes(),
        sec = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds()

    return hour+':'+min+':'+sec
}
