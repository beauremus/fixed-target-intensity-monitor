$(document).ready(function(){
    loggerGet(["F:MT6SC1"], "10minago", "now", print)
    liveGet()
})

function print(obj,info) {
    if ($('#container').children().length >= 10) { // 10 readings on page already
        $('#container div:first-child').remove() // remove first reading
    }

    $('#container').append(`<div>${obj.data} @ ${obj.time}</div>`) // append new reading
}

function liveGet() {
    let dpm = new DPM()

    dpm.addRequest("F:MT6SC1@E,36",print)

    dpm.start()
}
