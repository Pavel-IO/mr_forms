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
                    docControls.setDbId(responseObj.dbId);
                }
                docControls.statusOk();
                docControls.lock();
                if (responseObj.message) {
                    docControls.statusNote();
                }
            } else {
                docControls.statusError();
                docControls.unlock();
            }
            if (responseObj.message) {
                docControls.setNote(responseObj.message);
                docControls.showMessage(responseObj.message);
            } else {
                docControls.hiddenNote();
            }
        } catch (e) {
            docControls.unlock();
            docControls.showMessage('Invalid server response: ' + response);
        }
    };
};

if (docControls.isLocked()) {
    docControls.unlock();
} else {
    if (docControls.validateFormValues()) {
        trustedLoadData(saveFormRequest(serverUrl, docControls.getFormValues()), saveFormSuccessResponse(docControls));
    }
}
