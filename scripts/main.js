import { getKeyList } from "./key_list.js";
var keyList = getKeyList("real");

import { getVertexes } from "./vertexes.js";

var piano = {
    octives: 5,
    location: 2,
    sustain: true,
    notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    pressedKeys: [],
    activeNotes: [],
};

// Globals
var soundfont = require('soundfont-player')
var ac = new AudioContext();
var inst = soundfont.instrument(ac, 'bright_acoustic_piano');

function switchKeyboardType() {
    var type = document.getElementById("keyboardTypeButton").textContent;

    if (type == "Real") {
        keyList = getKeyList("full");
        document.getElementById("keyboardTypeButton").textContent = "Full";
    }
    else if (type == "Full") {
        keyList = getKeyList("real");
        document.getElementById("keyboardTypeButton").textContent = "Real";
    }
    if (document.getElementById("showKeysButton").textContent != "Show Keys") {
        drawKeys(true);
        drawKeys(false);
    }
}

function toggleShowKeys() {
    var state = document.getElementById("showKeysButton").textContent;

    if (state == "Show Keys") {
        drawKeys(false);
        document.getElementById("showKeysButton").textContent = "Hide Keys";
        return
    }
    else if (state == "Hide Keys") {
        drawKeys(true);
        document.getElementById("showKeysButton").textContent = "Show Keys";
        return
    }

}

function toggleSustain() {
    var sustain = document.getElementById("sustainButton").textContent;

    if (sustain == "Sustain On") {
        piano.sustain = false
        document.getElementById("sustainButton").textContent = "Sustain Off";
        return
    }
    else if (sustain == "Sustain Off") {
        piano.sustain = true
        document.getElementById("sustainButton").textContent = "Sustain On";
        return
    }
}

function selectInstrument(event) {
    var select = document.getElementById("instrumentSelect").value
    console.log("Instrument: " + select + " selected")
    inst = soundfont.instrument(ac, select);
}

function play_note(note) {
    inst.then(function (player) {
        piano.activeNotes[note] = player.play(note);
    })
    drawPiano(1, note);
}

function stop_note(note) {
    if (!piano.sustain) {
        inst.then(function (player) {
            piano.activeNotes[note].stop();
        })
    }
    drawPiano(0, note);
}

function drawKeys(clear) {
    var overlay = document.getElementById("overlayCanvas");
    var ctx = document.getElementById('overlayCanvas').getContext('2d');

    if (clear) {
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        return
    }

    var pianoRoll = ['wf', 'b', 'wm', 'b', 'wb', 'wf', 'b', 'wm', 'b', 'wm', 'b', 'wb']
    var octiveVert = getVertexes(overlay.width, overlay.height, piano.octives);

    var whiteKeySize = ((overlay.width / piano.octives) / 7)
    var fontSize = Math.floor(whiteKeySize / 2)
    ctx.font = fontSize.toString() + 'px Arial';
    ctx.textAlign = "center"

    for (var octive = piano.location; octive < piano.location + piano.octives; octive++) {
        for (var key = 0; key < piano.notes.length; key++) {

            var note = piano.notes[key].toString() + octive.toString();
            var text = Object.keys(keyList).find(key => keyList[key] === note)

            // Get middle x cord of key
            var min = octiveVert[key][0][0]
            var max = octiveVert[key][0][0]
            for (var i = 0; i < octiveVert[key].length; i++) {
                if (octiveVert[key][i][0] > max) {
                    max = octiveVert[key][i][0]
                }
                if (octiveVert[key][i][0] < min) {
                    min = octiveVert[key][i][0]
                }
            }
            var middle = ((max + min) / 2)
            var xPos =  middle + ((overlay.width / piano.octives) * (octive - piano.location))

            if (text) {
                switch(pianoRoll[key]) {
                    case 'b':
                        var yPos = fontSize
                        ctx.fillStyle = "#FFFFFF"
                        ctx.fillText(text, xPos, yPos);
                        break;
                    default:
                        var yPos = overlay.height - fontSize
                        ctx.fillStyle = "#000000"
                        ctx.fillText(text, xPos, yPos);
                        break;
                }
            }
        }
    }
}

function drawPiano(active, note) {
    var canvas = document.getElementById('pianoCanvas');

    if (active) {
        var blackKeyColor = "#1793D1"
        var whiteKeyColor = "#75c7f0"
    }
    else {
        var blackKeyColor = "#000000"
        var whiteKeyColor = "#ffffff"
    }

    var ctx = canvas.getContext('2d');

    var octiveVert = getVertexes(canvas.width, canvas.height, piano.octives);

    var pianoRoll = ['wf', 'b', 'wm', 'b', 'wb', 'wf', 'b', 'wm', 'b', 'wm', 'b', 'wb']

    if (note) {
        var octive = note.match(/\d+/)[0] - piano.location // minus 2 because of starting place
        var key = piano.notes.indexOf(note.replace(/\d+/, ''));
    }
    else {
        var octive = 0
        var key = 0
    }

    for (octive; octive < piano.octives; octive++) {
        var octiveOffset = (canvas.width / piano.octives) * octive;

        for (key; key < pianoRoll.length; key++) {

            ctx.beginPath();
            ctx.moveTo(octiveVert[key][0][0] + octiveOffset, octiveVert[key][0][1]);

            for (var i = 1; i < octiveVert[key].length; i++) {
                ctx.lineTo(octiveVert[key][i][0] + octiveOffset, octiveVert[key][i][1])
            }
            ctx.closePath();

            switch(pianoRoll[key]) {
                case 'b':
                    ctx.fillStyle = blackKeyColor
                    ctx.fill();
                    break;
                default:
                    ctx.fillStyle = whiteKeyColor
                    ctx.fill();
                    ctx.stroke();
                    break;
            }
            if (note) {
                return;
            }
        }
        key = 0
    }
}

function resizeEvent(event) {
    setupPiano();

    if (document.getElementById("showKeysButton").textContent != "Show Keys") {
        drawKeys(true);
        drawKeys(false);
    }
}

function mousedownEvent(event) {
    var canvas = document.getElementById('pianoCanvas');

    var xPos = event.clientX - canvas.offsetLeft
    var yPos = event.clientY - canvas.offsetTop

    var octiveVert = getVertexes(canvas.width, canvas.height, piano.octives);

    // Find octive
    for (var octive = 0; octive < piano.octives + 1; octive++) {
        if ((canvas.width / piano.octives) * octive < xPos && (canvas.width / piano.octives) * (octive + 1) > xPos ) {
            xPos -= (canvas.width / piano.octives) * octive
            break;
        }
    }
    // Find key
    for (var key = 0; key < octiveVert.length; key++) {

        for (var vert = 0; vert < octiveVert[key].length; vert++) {
            // Quick and dirty test
            if (octiveVert[key][vert][0] > xPos) {
                // Refind PNPOLY test
                var i = 0, j = octiveVert[key].length - 1;
                for (i, j; i < octiveVert[key].length; j = i++) {
                    if ( (octiveVert[key][i][1] > yPos) != (octiveVert[key][j][1] > yPos) &&
                        xPos < (octiveVert[key][j][0] - octiveVert[key][i][0]) * (yPos - octiveVert[key][i][1])
                        / (octiveVert[key][j][1] - octiveVert[key][i][1]) + octiveVert[key][i][0] ) {

                        var note = piano.notes[key] + (octive + piano.location).toString();
                        piano.pressedKeys["mouse"] = note;
                        console.log("Mouse:" + (event.clientX - canvas.offsetLeft) + "," + yPos + " Note:" + note)
                        play_note(note);
                        return;
                    }
                }
            }
        }
    }
}

function mouseupEvent(event) {
    stop_note(piano.pressedKeys["mouse"]);
}

function keydownEvent(event) {
    // Prevent keyboard shortcuts
    event.preventDefault();

    if(piano.pressedKeys[event.key]) {
        return;
    }
    var note = keyList[event.key]
    piano.pressedKeys[event.key] = note;

    if (note) {
        console.log("Keyboard:" + event.key + " Note:" + note)
        play_note(note);
    }
}

function keyupEvent(event) {
    stop_note(piano.pressedKeys[event.key]);
    piano.pressedKeys[event.key] = false;
}

function parseMidiMessage(message) {
    var noteNum = message.data[1]
    var octive = Math.floor(noteNum / 12) - 1
    var note = piano.notes[noteNum % 12] + octive.toString()

    var command = message.data[0] >> 4
    var channel = message.data[0] & 0xf
    var velocity = message.data[2] / 127

    switch(command) {
        case 9: // start
             play_note(note);
             console.log(message.currentTarget.name + ":" + noteNum + " Note:" + note)
             break;

        case 8: // stop
            stop_note(note);
            break;
    }
}

function setupPiano() {

    var canvas = document.getElementById("pianoCanvas");
    canvas.onselectstart = function() { return false; };
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetWidth / 6;

    var overlay = document.getElementById("overlayCanvas");
    overlay.width = canvas.offsetWidth
    overlay.height = canvas.offsetHeight
    overlay.style.left = canvas.offsetLeft
    overlay.style.top = canvas.offsetTop
    overlay.style.position = "absolute";

    drawPiano(0, null);
}

// Main
window.onload = function() {
    document.getElementById("keyboardTypeButton").addEventListener("click", switchKeyboardType);
    document.getElementById("showKeysButton").addEventListener("click", toggleShowKeys);
    document.getElementById("sustainButton").addEventListener("click", toggleSustain);

    var instrumentList = require("soundfont-player/names/musyngkite.json")
    var instrumentDropDown = document.getElementById("instrumentSelect");
    for (var i = 0; i < instrumentList.length; i++) {
        var instrument = document.createElement('option');
        instrument.text = instrument.value = instrumentList[i];
        instrumentDropDown.add(instrument, i);
    }
    document.getElementById("instrumentSelect").addEventListener("change", selectInstrument);
    document.getElementById("instrumentSelect").value = "bright_acoustic_piano";

    document.getElementById("pianoCanvas").addEventListener("mousedown", mousedownEvent);
    document.getElementById("pianoCanvas").addEventListener("mouseup", mouseupEvent);

    document.addEventListener("keydown", keydownEvent);
    document.addEventListener("keyup", keyupEvent);

    window.addEventListener('resize', resizeEvent);

    window.navigator.requestMIDIAccess().then(function (midiAccess) {
        midiAccess.inputs.forEach(function (midiInput) {
            midiInput.onmidimessage = function(event){
                parseMidiMessage(event);
            }
        })
    })
    // Disable accidental highlighting
    var canvas = document.getElementById("pianoCanvas");
    canvas.onselectstart = function() { return false; };

    setupPiano();
    setupPiano();
}