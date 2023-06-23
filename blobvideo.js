const videoName = 'Big Buck Bunny 60fps 4K - Official Blender Foundation Short Film [aqz-KE-bpKQ].webm';
const mimeType = 'video/webm';

const videoElement = document.getElementById('blobvideo');
const logsElement = document.getElementById('logs');
const progressBar = document.getElementById('progressBar');

var last = 0;
function writeLog(text){
    const e = document.createElement('i');
    const date = new Date();
    const time = date.getTime();
    e.innerText = '[after ' + (time - last) + 'ms ]' + date.toString() + ' / '+ text;
    last = time;
    logsElement.appendChild(e);
    console.log(text);
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = 'arraybuffer';
    xmlHttp.onprogress = function (e) {
        progressBar.max = e.total;
        progressBar.value = e.loaded;
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.response);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

writeLog('videoName' + videoName);
writeLog('mimeType ' + mimeType);
writeLog('start httpGetAsync');
httpGetAsync(videoName, function(res){
    writeLog('done httpGetAsync');
    const byteArray = new Uint8Array(res);
    writeLog('byteArray lenght ' + byteArray.length);
    writeLog('byteArray ' + byteArray.length / 1024 / 1024 + ' Megabytes');
    const blob = new Blob([byteArray], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    writeLog('blobUrl');
    writeLog(blobUrl);
    videoElement.src = blobUrl;
    videoElement.play();
    videoElement.onplay = function(){
        URL.revokeObjectURL(blobUrl);
        writeLog('URL.revokeObjectURL');
        videoElement.pause();
        videoElement.onplay = null;
    }
})
// 