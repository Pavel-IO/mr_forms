var serverUrl = 'http://localhost/mr_forms/register.php';
var fieldNames = ['VisitID', 'Jmeno', 'Prijmeni', 'RC', 'Datum_narozeni', 'Matersky_jazyk', 'Vyska', 'Vaha', 'Pohlavi', 'Stranova_dominance', 'Zrakova_korekce'];
var createRequest = function(serverUrl, jsonSrc) {
  return serverUrl + '?form=' + encodeURI(JSON.stringify(jsonSrc));
};
var successResponse = function(docObj) {
  var setDocId = function(valueId) {
    docObj.getField('VisitID').value = valueId;
  };
  return function(response) {
    try {
      var responseObj = JSON.parse(response);
      if (responseObj.status == 'ok' && responseObj.assignedId) {
        setDocId(responseObj.assignedId);
      }
      if (responseObj.message) {
        app.alert(responseObj.message);
      }
    } catch (e) {
        app.alert('Invalid server response: ' + response);
    }
  };
};
var params = {};
for (index in fieldNames) {
  var key = fieldNames[index];
  params[key] = this.getField(key).value.toString().trim();
}
trustedLoadId(createRequest(serverUrl , params), successResponse(this));
