var serverUrl = 'http://localhost/mr_forms/register.php';
var createRequest = function(serverUrl, jsonSrc) {
    return serverUrl + '?form=' + encodeURI(JSON.stringify(jsonSrc));
};

var successResponse = function(docControls) {
    return function(response) {
        try {
            var responseObj = JSON.parse(response);
            if (responseObj.status == 'ok') {
                if (responseObj.assignedId) {
                    docControls.setFormId(responseObj.assignedId);
                }
                docControls.statusOk();
                docControls.enablePrint();
            } else {
                docControls.statusError();
                docControls.disablePrint()
            }
            if (responseObj.message) {
                docControls.showMessage(responseObj.message);
            }
        } catch (e) {
            docControls.showMessage('Invalid server response: ' + response);
        }
    };
};

if (docControls.validateFormValues()) {
    trustedLoadData(createRequest(serverUrl , docControls.getFormValues()), successResponse(docControls));
}
