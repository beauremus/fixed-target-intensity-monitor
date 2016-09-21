const INTS = ["F:MTEST","F:MIPP","F:NMBEAM"] // intensity devices
const ROWS = 10
let count = 1 // count not index, shouldn't be 0

$(document).ready(function(){
    loggerGet(INTS, "10minago", "now", init)
})

function init(result) {
    print(result)

    count === INTS.length ? getLive() : count++
}

function print(obj,info) {
    if (typeof(obj) != 'object') { // obj.data === undefined ||
        console.log("ERROR: unexpected data type")
        return false
    }

    console.log("result: ",obj)

    let reply = obj['data-set'] === undefined ? [] : obj['data-set'].reply

    if (reply.length > 0) {
        printLogger(reply)
    } else {
        printLive(obj,info)
    }
}

function printLogger(reply) {
    for (var i = 0; i < reply.length; i++) {
        let dateTime = new Date(reply[i].time),
            intsIndex = INTS.indexOf(reply[i].request.device),
            $container = $('#container'+intsIndex)

        removeFirst($container)

        appendNew($container,reply[i].value.content,timeFromDate(dateTime))
    }
}

function printLive(obj,info) {
    let dateTime = new Date(obj.timestamp),
        intsIndex = INTS.indexOf(info.name),
        $container = $('#container'+intsIndex)

    removeFirst($container)

    appendNew($container,obj.data,timeFromDate(dateTime))
}

function removeFirst(container) {
    if (container.children().length >= ROWS) { // 10 readings on page already
        container.find('tr').first().remove() // remove first reading
    }
}

function appendNew(container,intensity,time) {
    container.append(`<tr class="new"><td>${intensity}</td><td>@</td><td>${time}</td></tr>`) // append new reading
}

function getLive() {
    let dpm = new DPM()

    for (var i = 0; i < INTS.length; i++) {
        dpm.addRequest(INTS[i]+'@E,37',print)
    }

    dpm.start()
}

function timeFromDate(date) {
    let hour = date.getHours() < 10 ? '0'+date.getHours() : date.getHours(),
        min = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes(),
        sec = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds()

    return hour+':'+min+':'+sec
}
