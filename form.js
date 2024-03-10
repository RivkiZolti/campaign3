
function setSelectedStudents(table) {

    table.rows('.selected', { search: 'applied' }).data().each(function (data) {
        appModule.addSelectedStudent(data)
    });
}
function createcampaign(table){
    setSelectedStudents(table)
    if (appModule.getSelectedStudents().length >0){
        parseCampaignName()
        table.destroy()
        $('#studentTable').hide()
        $('#createcampaign').hide()
        $('#chooseSystem').show() 
    }else{
        alert("חובה לבחור לפחות תלמיד אחד מהרשימה")
    }
}

function getCurrentDate(){
    let today = new Date();
    let dd = String(today.getDate());
    let mm = String(today.getMonth() + 1);
    if (dd.length === 1) {
        dd = '0' + dd;
    }
    if (mm.length === 1) {
        mm = '0' + mm;
    }
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    return today
}


function parseCampaignName(){
    let groupsName={}
    $.each(appModule.getSelectedStudents(), function (_, user) {
        if (user["שם מוסד מלא"] in groupsName){
            
            if ($.inArray(user["שם קבוצה"], groupsName[user["שם מוסד מלא"]]) === -1){
                groupsName[user["שם מוסד מלא"]].push(user["שם קבוצה"])
            }

        }else{
            groupsName[user["שם מוסד מלא"]] = []
            groupsName[user["שם מוסד מלא"]].push(user["שם קבוצה"])
        }

    });
    let today = getCurrentDate()
    let nameData = today +":"
    let len
    let lastKey = Object.keys(groupsName)
    lastKey =lastKey[lastKey.length - 1]
    for (group in groupsName){
        len = groupsName[group].length
        nameData += group + ":" 
        for (index in groupsName[group]){
            nameData+= groupsName[group][index]

            if (index  < (len -1)){
                nameData += "|"
            }
        }
        if (group !== lastKey){
            nameData += ","
        }
        
    }
    nameData = nameData.slice(0, appModule.getMaxCharacters());
   $("#defaultText").text(nameData);
   $("#name").val($("#defaultText").text());

} 

function populateCallerIdSelect(response){
    let caller_ids = [response.mainDid];

    $.each(response.secondary_dids, function(_, did) {
        caller_ids.push(did.did);
    });

    $.each(response.callerIds, function(_, caller_id) {
        caller_ids.push(caller_id.callerId);
    });

    let selectElement = document.getElementById("caller_id");

    caller_ids.forEach(function(caller_id) {
        let option = document.createElement("option");
        option.value = caller_id;
        option.text = caller_id;
        selectElement.add(option);
    });
}

async function getCallerIds() {

        let payload = {
            'token': appModule.getToken(),
        };

        const res = await apiRequests.postWithHeaders("GetCustomerData" ,JSON.stringify(payload),'שגיאה בקבלת אמצעי זיהוי')
        if (!res) {
            return false
        }
        return res
}

async function buildCallerIdDropdown(){

    const response =await getCallerIds()
    if (response !== false){
        populateCallerIdSelect(response)
    }

}

function getPhonesInfo(){
    const fields = $("#myList").find('li').map(function() {
        return $(this).text();
    }).get();
    const selectedStudents = appModule.getSelectedStudents();
    let data="phone,name,moreinfo\n"
    let moreInfo = ""
    
    if (fields.length > 0) {
        for ( user in selectedStudents){
            moreInfo = ""
            fields.forEach(function(field) {
                moreInfo += field + ":" + selectedStudents[user][field] + " "

            });
            
            data += selectedStudents[user]["טלפון"] + "," + selectedStudents[user]["שם"] +  "," + moreInfo + "\n"
        }
    }
    return data
}

async function DeleteTemplate(){
    let payload = {
        'token': appModule.getToken() ,
        'templateId' : appModule.getTemplateId()
    };
    await apiRequests.postWithHeaders("DeleteTemplate" ,JSON.stringify(payload),"")

}

async function createTemplate() {
    let payload = {
        'token': appModule.getToken(),
        "description": $("#name").val()
    };
    const res =await  apiRequests.postWithHeaders("CreateTemplate" ,JSON.stringify(payload),'שגיאה ביצירת תבנית לקמפיין')
    if (!res) {
        return false
    }
    appModule.setTemplateId(res.templateId)
    return await uploadFile();

}

async function uploadFile() {
    let file = appModule.getAudioFile()
    let formData = new FormData();
    formData.append('file', file);
    formData.append('token', appModule.getToken());
    formData.append('path', appModule.getTemplateId() + '.wav');
    formData.append('convertAudio', 1);
    const res = await apiRequests.post('UploadFile',formData ,'שגיאה בהעלאת הקובץ')
    if (!res) {
        return false
    }
    return await uploadPhoneList();
}
async function uploadPhoneList() {
    let phones = getPhonesInfo()
    let payload = {
        "token": appModule.getToken(),
        "templateId": appModule.getTemplateId(),
        "data": phones
    };
    const res = await apiRequests.postWithHeaders("UploadPhoneList" ,JSON.stringify(payload),'שגיאה בהעלאת מספרי פלאפון')
    if (!res) {
        return false
    }
    return await runCampaign();
}

async function runCampaign() {

    let payload = {
        'token': appModule.getToken(),
        'templateId': appModule.getTemplateId(),
        'callerId': $("#caller_id option:selected").val()
    };
    const res = await apiRequests.postWithHeaders("RunCampaign" ,JSON.stringify(payload),'שגיאה בהרצת הקמפיין')
    if (!res) {
        await DeleteTemplate()
    }else{
        Swal.fire({
            title: 'success!',
            text: 'הקמפיין רץ בהצלחה',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        await retryFailedCampaignPhones(res)
    }
   

}
function showLoadingIndicator() {
    $('#loading-overlay').css('display', 'flex');
}

function hideLoadingIndicator() {
    helperModule.hideElements(['loading-overlay'])
}

