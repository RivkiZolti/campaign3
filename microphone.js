const microphoneModule  = (() => {
    let mediaRecorder;
    let audioChunks = [];
    let stream = null;

    return {
        handleMicrophone: async () => {
            if (!stream || stream.active === false) {
                await microphoneModule.activateMicrophone();
                microphoneModule.record();
            }
            else{
                microphoneModule.record();

            }
        },

        activateMicrophone: async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        },

        record : () => {
            mediaRecorder = new MediaRecorder(stream);
        
            mediaRecorder.ondataavailable = function(event) {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };
        
            mediaRecorder.onstop = function() {
                let audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                let audioUrl = URL.createObjectURL(audioBlob);
                $('#audioRecordPlayer').attr('src', audioUrl);
                let fileName = 'record.wav';
                let file = new File([audioBlob], fileName);
                appModule.setAudioFile(file)
                
            };
        
            mediaRecorder.start();
            audioChunks = [];
            helperModule.hideElements(['startRecording'])
            helperModule.showElements(['iconRecord','stopRecording'])
        },
        stopRecord: () => {
            if (mediaRecorder) {
                mediaRecorder.stop();
                helperModule.hideElements(['iconRecord' ,'stopRecording'])
                helperModule.showElements(['audioRecordPlayer','reRecord'])
            }

        }
    }
})();


