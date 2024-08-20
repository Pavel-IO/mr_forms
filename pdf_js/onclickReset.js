var getTodayDate = function() {
    var dateObj = new Date();
    return dateObj.getDate() + '. ' + (dateObj.getMonth() + 1) + '. ' + dateObj.getFullYear();
};

var newIdRequest = function(serverUrl) {
    return serverUrl + '?getNewId=1';
};

var newIdSuccessResponse = function(docControls) {
    return function(response) {
        try {
            var responseObj = JSON.parse(response);
            if (responseObj.status == 'ok') {
                docControls.setFormId(responseObj.newId);
            } else {
                docControls.showMessage('Invalid server response: Status is' + responseObj.status);
            }
        } catch (e) {
            docControls.showMessage('Invalid server response: ' + response);
        }
    };
};

docControls.resetForm();
docControls.updateZastupce();
docControls.updateName();
docControls.setDate(getTodayDate());
trustedLoadData(newIdRequest(serverUrl), newIdSuccessResponse(docControls));
