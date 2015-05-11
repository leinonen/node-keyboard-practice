var midi = require('midi');
var input = new midi.input();
//var c = input.getPortCount();

var sequenceToPlay = [];
var currentKey;
var currentScale;

var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
var scales = require('./scales');


function mapKey(inkey) {
	return notes[(inkey % 12)];
}

function unMapNote(note) {
	return notes.indexOf(note);
}

function printSequence() {
	var seq = sequenceToPlay.map(function (a) {
		return mapKey(a);
	}).join(' ');
	console.log(seq);
}


function generateSequence() {
	currentScale = Math.floor(Math.random() * scales.length);
	sequenceToPlay = scales[currentScale].notes.map(unMapNote);
	console.log('Please play the %s', scales[currentScale].name);
}

function validNote(key) {
	return sequenceToPlay[0] === (key % 12);
}

function noteSuccess() {
	console.log('CORRECT!');
	sequenceToPlay.splice(0, 1);
}

function noteFail() {
	console.log('WRONG!');
}

function sequenceComplete() {
	return sequenceToPlay.length === 0;
}

function play() {
	generateSequence();
	printSequence();
}

function win() {
	console.log('You are good!');
}

function processMessage(deltaTime, message) {
	var key = message[1];
	var dir = message[0];

	// 144 = down press, 128 = release
	if (dir === 144) {
		currentKey = key;
	} else if (dir === 128 && currentKey === key) {

		if (validNote(key)) {
			noteSuccess();
			if (sequenceComplete()) {
				win();
				play();
			} else {
				printSequence();
			}
		}

	} else {
		noteFail();
		printSequence();
	}

}

input.on('message', processMessage);
input.openPort(0);
input.ignoreTypes(false, false, false);

play();

//input.closePort();
