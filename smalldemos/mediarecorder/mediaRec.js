navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints, audioElement, dataElement, downloadLink;
var iniBtn, finBtn;

function errorCallback(error) {
    console.log("navigator.getUserMedia error: ", error);
}

var count=0;
function startRecording(stream) {
    mediaRecorder = new MediaRecorder(stream);
    log('Starting...');
    mediaRecorder.ondataavailable = function(e) {
	log('Data available..');
	count++;
	if (count > 1) {
	    return;
	}
	console.log(e);
	audioElement.src = window.URL.createObjectURL(e.data);	
	downloadLink.href = window.URL.createObjectURL(e.data);
	downloadLink.innerHTML = "Download as ogg audio";
    };
    
    mediaRecorder.onerror = function(e){
	log('Error: ' + e);
    };

    mediaRecorder.onstart = function(e) {
	log('Started~!');
    }

    mediaRecorder.onstop = function(e) {
	log('Stopped');
    }

   
    mediaRecorder.start();

    finBtn.addEventListener("click", function(){
	mediaRecorder.stop();
    }, false);
    /*
    window.setTimeout(function() {
	mediaRecorder.stop();
    }, 5000);
    */
}

window.onload = function() {
    constraints = {audio: true};
    audioElement = document.getElementById('playback');
    dataElement = document.getElementById('data');
    downloadLink = document.getElementById('dl');
    iniBtn = document.getElementById('ini');
    finBtn = document.getElementById('fin');

    if(typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
	alert('no se puede correr aqui el demo');
    } else {
	iniBtn.addEventListener("click", function() {
	    navigator.getUserMedia(constraints, startRecording, errorCallback)}, false);
    }
};

function log(msg) {
    if(dataElement)
	dataElement.innerHTML = msg + '<br>' + dataElement.innerHTML;
}