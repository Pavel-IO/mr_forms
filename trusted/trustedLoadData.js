var trustedLoadData = app.trustedFunction(function(cURL, successFcn) {
    app.beginPriv();
    try {
        var params = {
            cVerb: "GET",
            cURL: cURL,
            oHandler: {
                response: function(msg, uri, e) {
                    var result = SOAP.stringFromStream(msg);
                    successFcn(result);
                }
            }
        };
        Net.HTTP.request(params);
    } catch (e) {
        app.alert('Error in HTTP request: ' + e.message);
    }
    app.endPriv();
});
