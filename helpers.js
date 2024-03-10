const helperModule = (() =>{
    
    return {
        hideElements : (elements) => {
            for (let value of elements) {
                $("#" + value).css("display", "none");
            }
        },

        showElements : (elements) => {
            for (let value of elements) {
                $("#" + value).css("display", "block");
            }
        },

        validateRequiredFields : (fields) => {
            
            for (let index in fields){

                if ($("#" + fields[index]).val() === "" || $("#" + fields[index]).val() === null || $("#" + fields[index]).val() === undefined){
                    alert("חובה למלא"  + $("label[for='" + fields[index] +"']").text().replace(':', ''))
                    return false
                }
                if (fields[index] === "audioSource"){
                    if (appModule.getAudioFile() === undefined || appModule.getAudioFile() === '' || appModule.getAudioFile() === null ){
                        alert(' חובה להכניס שמע ע"י העלאת קובץ או הקלטה')
                        return false
                    }
                }
            };
            return true
        },
    }
})();
