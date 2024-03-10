
function takePicture() {
    
    $('#canvas')[0].getContext('2d').drawImage($('#videoPreview')[0], 0, 0, $('#canvas')[0].width, $('#canvas')[0].height);
    let imageData = $('#canvas')[0].toDataURL('image/jpeg');
    showCanvas()
    $("#imageData").val(imageData)
    $("#savePicture").show()
}

function resetCameraButtons(){
    $("#changePicture").hide();
    $("#cameraButton").show();
    $("#savePicture").hide();
}

function showCanvas() {

    $('#videoPreview')[0].style.display = 'none';
    $('#canvas')[0].style.display = 'block';
}

function showVideo() {

    $('#videoPreview')[0].style.display = 'block';
    $('#canvas')[0].style.display = 'none';
}

function hideVideoCanvas() {

    $('#videoPreview')[0].style.display = 'none';
    $('#canvas')[0].style.display = 'none';
}

function activateCamera(){
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (mediaStream) {
        $("#cameraButton").html('<i class="fa fa-camera"></i>')
        $("#cameraButton").show()
        appModule.setStreamVideo(mediaStream);
        $('#videoPreview')[0].srcObject = mediaStream;
        $('#videoPreview')[0].play()
        showVideo()
    })
    .catch(function (error) {
        console.error('Error accessing camera:', error);
    });

    $('#videoPreview')[0].addEventListener('loadedmetadata', function() {
        let aspectRatio 
        const videoPreview = $('#videoPreview')[0]
        if (videoPreview.videoWidth >videoPreview.videoHeight){
            aspectRatio = videoPreview.videoWidth / videoPreview.videoHeight;
        }
        else{
            aspectRatio =   videoPreview.videoHeight / videoPreview.videoWidth;

        }
        let canvasWidth = 160; 
        let canvasHeight = canvasWidth / aspectRatio;
        $('#canvas')[0].width = canvasWidth;
        $('#canvas')[0].height = canvasHeight;
    });
}



function handleCameraCapture(){
    const stream = appModule.getStreamVideo()
    if (!stream || stream.active === false) {
        activateCamera()
    } else {
        $('#changePicture').show()
        $('#cameraButton').hide()
        takePicture();
    }
}
function changePicture(){
    showVideo()
    resetCameraButtons()
    $("#imageData").val('')
}

function savePicture() {
    
    closeCameraModal();
    sendData()
}


function closeStream(){
    const stream =appModule.getStreamVideo()
    if (stream) {
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());       
    }
    $('#videoPreview')[0].srcObject = null;

    $('#canvas')[0].getContext('2d').clearRect(0, 0, $('#canvas')[0].width, $('#canvas')[0].height);
    resetCameraButtons()
    hideVideoCanvas();
}

function sendData(){
    let payload = {
        "id" :appModule.getRowData()["תז"],
        "image" : $("#imageData").val()
    }
    
    // $.ajax({

    //     url: "https://mllcr.info",
    //     type: 'POST',
    //     // context: Text,
    //     data: payload,
    //     cache: false,
    //     timeout: 60000,
    //     async: false,

    //     success: function (response) {
    //         //TODO: reload data
    //         console.log(response)
    //     },
    //     error: function (error) {
    //         //TODO :error handling
    //         console.log(error)
    //     },
    // });

}

function closeCameraModal() {
    helperModule.hideElements(['cameraModal'])
    closeStream()
}


function openCameraModal() {
    helperModule.showElements(['cameraModal'])
}