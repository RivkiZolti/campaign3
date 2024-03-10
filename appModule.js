
// This approach is used to encapsulate state and avoid reliance on global variables.
const appModule  = (() => {
    const maxCharacters = 127
    const baseUrl  = "https://www.call2all.co.il/ym/api/"

    let token = "025089532:7974153";
    let templateId ;
    let selectedStudents = [];
    let rowData;
    let streamVideo;
    let audioFile;

    return {
        // Token functions
        getToken: () => token,
        setToken: (newToken) => { token = newToken; },

        // TemplateId functions
        getTemplateId: () => templateId,
        setTemplateId: (newTemplateId) => { templateId = newTemplateId; },

        // SelectedStudents functions
        getSelectedStudents: () => selectedStudents,
        addSelectedStudent: (student) => { selectedStudents.push(student); },

        // streamVideo functions
        getStreamVideo: () => streamVideo,
        setStreamVideo: (newStreamVideo) => { streamVideo = newStreamVideo; },

        // rowData functions
        getRowData: () => rowData,
        setRowData: (newRowData) => { rowData = newRowData; },

        // maxCharacters function
        getMaxCharacters: () => maxCharacters,

        // baseUrl function
        getBaseUrl: () => baseUrl,

        
        // audioFile functions
        getAudioFile: () => audioFile,
        setAudioFile: (newAudioFile) => { audioFile = newAudioFile; },
    };
})();