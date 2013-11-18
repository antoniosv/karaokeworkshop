navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints, audioElement, dataElement, downloadLink, fileinput;
var mediaRecorder;
var upBtn, downBtn;
var client = new BinaryClient('ws://localhost:9000');
var piece;

client.on('stream', function(stream, meta) {
    var parts = [];
    stream.on('data', function(data) {
	parts.push(data);
    });

    stream.on('end', function() {
	console.log('Datos recibidos');
	var clip = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
	if(document.getElementById("playback")) {
	    var pastAudio = document.getElementById("playback");
	    pastAudio.parentNode.removeChild(pastAudio);
	}
	var audio = document.createElement("audio");
	audio.id = "playback";
	audio.controls = "controls";
	audio.autoplay = "autoplay";
	audio.preload = "auto";
	linkControls(upBtn, downBtn, audio);
	//document.getElementById("foreign").insertBefore(audio, document.getElementById("foreign").firstChild.nextSibling);
	document.getElementById("foreign").appendChild(audio);
	audio.src = clip;
	audio.addEventListener('pause', function(){
	    //
	}, false);
	    });
});

function linkControls(up, down, audio) {
    up.addEventListener("click", function() {
	if(audio.volume < 1.0)
	    audio.volume+= 0.1;
    }, false);

    down.addEventListener("click", function(){
	if(audio.volume > 0.1)
	    audio.volume-= 0.1;
    }, false);

}

function errorCallback(error) {
    console.log("navigator.getUserMedia error: ", error);
}

var count=0;
function startRecording(stream) {
    mediaRecorder = new MediaRecorder(stream);
    log('Starting mediaRecording...');
    mediaRecorder.ondataavailable = function(e) {
	log('Data available..');
	count++;
	if (count > 1) {
	    return;
	}
	console.log(e);
	piece = e.data;
	//audioElement.src = window.URL.createObjectURL(e.data);	
	downloadLink.href = window.URL.createObjectURL(e.data);
	downloadLink.innerHTML = "Download recording";
	downloadLink.name = fileinput.value;
	downloadLink.download = fileinput.value;
    };
    
    mediaRecorder.onerror = function(e){
	log('Error: ' + e);
    };

    mediaRecorder.onstart = function(e) {
	log('Recording~!');
    }

    mediaRecorder.onstop = function(e) {
	log('Stopped');
	if(piece) {
	    client.send(piece);
	    count=0;
	    //mediaRecorder = null;
	}
    }
}

function recordSession(f) {
    var track;

    if(document.getElementById("track")) {
	track = document.getElementById("track")
	track.parentNode.removeChild(track);
	track = null;
	}
    track = document.createElement("audio");   
    track.id = "track";	
    track.controls = "controls";
    linkControls(upBtn, downBtn, track);
    track.addEventListener('play', function(){
	if(mediaRecorder)
	    mediaRecorder.start();
	else
	    console.log("no se han dado los permisos del mic");
    }, false); 
    track.addEventListener('pause', function() {
	if(mediaRecorder)
	    mediaRecorder.stop();
    }, false);
   // document.getElementById("self").insertBefore(track, document.getElementById("self").firstChild.nextSibling);

    document.getElementById("self").appendChild(track); 
    track.src = (window.URL || window.webkitURL).createObjectURL(f)
}

window.onload = function() {
    constraints = {audio: true};
    audioElement = document.getElementById('playback');
    dataElement = document.getElementById('data');
    downloadLink = document.getElementById('dl');
    upBtn = document.getElementById('vup');
    downBtn = document.getElementById('vdown');

    var file;
    fileinput = document.getElementById("fileinput");
    fileinput.addEventListener('change', function(event) {
	deleteLog();    	
	file = event.target.files[0];
	recordSession(file);
    }, false);

    if(typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
	alert('no se puede correr aqui el demo');
    } else {
	navigator.getUserMedia(constraints, startRecording, errorCallback)

    }
};

function log(msg) {
    dataElement.innerHTML = msg + '<br>' + dataElement.innerHTML;
}

function deleteLog() {
    dataElement.innerHTML = "";
}
