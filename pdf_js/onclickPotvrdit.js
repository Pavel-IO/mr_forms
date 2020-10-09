var saveFormRequest = function(serverUrl, jsonSrc) {
    return serverUrl + '?form=' + encodeURI(JSON.stringify(jsonSrc));
};

var saveFormSuccessResponse = function(docControls) {
    return function(response) {
        try {
            var responseObj = JSON.parse(response);
            if (responseObj.status == 'ok') {
                if (responseObj.assignedId) {
                    docControls.setFormId(responseObj.assignedId);
                }
                docControls.statusOk();
                docControls.enablePrint();
                if (responseObj.message) {
                    docControls.statusNote();
                }
            } else {
                docControls.statusError();
                docControls.disablePrint()
            }
            if (responseObj.message) {
                docControls.setNote(responseObj.message);
                docControls.showMessage(responseObj.message);
            } else {
                docControls.hiddenNote();
            }
        } catch (e) {
            docControls.showMessage('Invalid server response: ' + response);
        }
    };
};

if (docControls.validateFormValues()) {
    trustedLoadData(saveFormRequest(serverUrl, docControls.getFormValues()), saveFormSuccessResponse(docControls));
}
