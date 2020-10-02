var getTodayDate = function() {
    var dateObj = new Date();
    return dateObj.getDate() + '. ' + (dateObj.getMonth() + 1) + '. ' + dateObj.getFullYear();
};
docControls.resetForm();
docControls.setDate(getTodayDate());
