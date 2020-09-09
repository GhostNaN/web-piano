// The verticies are laid out starting in the top left, then going clockwise.

var whiteKeyWidth = 1.0 / 7
var whiteKeyHeight = 1.00
var blackKeyWidth = 0.5 / 7
var blackKeyHeight = 0.60

var whiteFrontVert = [
    [0.0, 0.0],   // Top Left
    [whiteKeyWidth - (blackKeyWidth / 2), 0.0],   // Top Right
    [whiteKeyWidth - (blackKeyWidth / 2), blackKeyHeight],
    [whiteKeyWidth, blackKeyHeight],
    [whiteKeyWidth, whiteKeyHeight],  // Bottom Right
    [0.0, whiteKeyHeight] // Bottom Left
]

var whiteMiddleVert = [
    [0.0, 0.0], // Top Left
    [whiteKeyWidth - blackKeyWidth, 0.0],   // Top Right
    [whiteKeyWidth - blackKeyWidth, blackKeyHeight],
    [whiteKeyWidth - (blackKeyWidth / 2), blackKeyHeight],
    [whiteKeyWidth - (blackKeyWidth / 2), whiteKeyHeight], // Bottom Right
    [-blackKeyWidth / 2, whiteKeyHeight], // Bottom Left
    [-blackKeyWidth / 2, blackKeyHeight],
    [0.0, blackKeyHeight]
]

var whiteBackVert = [
    [0.0, 0.0], // Top Left
    [whiteKeyWidth - (blackKeyWidth / 2), 0.0],   // Top Right
    [whiteKeyWidth - (blackKeyWidth / 2), whiteKeyHeight],  // Bottom Right
    [-blackKeyWidth / 2, whiteKeyHeight], // Bottom Left
    [-blackKeyWidth / 2, blackKeyHeight],
    [0.0, blackKeyHeight]
]

var blackVert = [
    [0.0, 0.0], // Top Left
    [blackKeyWidth, 0.0], // Top Right
    [blackKeyWidth, blackKeyHeight], // Bottom Right
    [0.0, blackKeyHeight] // Bottom Left
]

export function getVertexes(width, height, octives) {
    width /= octives
    var pianoRoll = ['wf', 'b', 'wm', 'b', 'wb', 'wf', 'b', 'wm', 'b', 'wm', 'b', 'wb']

    var octiveVert = []
    var keyOffset = 0;
    for (var key = 0; key < pianoRoll.length; key++) {

        var keyVert = [];
        switch(pianoRoll[key]) {
            case 'b':
                for (var i = 0; i < blackVert.length; i++) {
                    keyVert.push([(blackVert[i][0] * width) + keyOffset, blackVert[i][1] * height])
                }
                break;
            case 'wf':
                for (var i = 0; i < whiteFrontVert.length; i++) {
                    keyVert.push([(whiteFrontVert[i][0] * width) + keyOffset, whiteFrontVert[i][1] * height])
                }
                break;
            case 'wm':
                for (var i = 0; i < whiteMiddleVert.length; i++) {
                    keyVert.push([(whiteMiddleVert[i][0] * width) + keyOffset, whiteMiddleVert[i][1] * height])
                }
                break;
            case 'wb':
                for (var i = 0; i < whiteBackVert.length; i++) {
                    keyVert.push([(whiteBackVert[i][0] * width) + keyOffset, whiteBackVert[i][1] * height])
                }
                break;
        }
        octiveVert.push(keyVert);
        keyOffset = keyVert[2][0];
    }
    return octiveVert;
}