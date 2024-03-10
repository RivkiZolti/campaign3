const apiRequests = (() => {


    return {

        makeRequest: async (endpoint, request, errorMessage) => {
            try {
                const url = appModule.getBaseUrl() + endpoint;
                const response = await fetch(url, request);

                const responseData = await response.json();
                if (responseData.responseStatus !== 'OK') {
                    console.error(endpoint + " failed. Server response: " + (responseData.message || 'Unknown error'));
                    if (errorMessage !== "") {
                        Swal.fire({
                            title: 'Error!',
                            text: errorMessage,
                            icon: 'error',
                        });
                    }
                    return false;
                } else {
                    return responseData;
                }
                
            } catch (error) {
                console.error(endpoint + " failed. Reason: " + error);
                if (errorMessage !== "") {
                    Swal.fire({
                        title: 'Error!',
                        text: errorMessage,
                        icon: 'error',
                    });
                }
                return false;
            }
        },



        post: async (endpoint, payload, errorMessage) => {
            const request = {
                method: 'POST',
                body: payload,
            };
            return apiRequests.makeRequest(endpoint, request, errorMessage);
        },

        postWithHeaders: async (endpoint, payload, errorMessage) => {
            const headers = {
                'Content-Type': 'application/json'
            };
            const request = {
                method: 'POST',
                body: payload,
                headers: headers
            };

            return apiRequests.makeRequest(endpoint,request,errorMessage);
        },
    };
})();