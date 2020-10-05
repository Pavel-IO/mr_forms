function DocControls(docObj) {
    this.formFields = [
        'VisitID', 'Jmeno', 'Prijmeni', 'RC', 'Datum_narozeni', 'Matersky_jazyk',
        'Vyska', 'Vaha', 'Pohlavi', 'Stranova_dominance', 'Zrakova_korekce', 'Datum'
    ];
    this.formChecked = [
        'Operace_hlavy', 'Operace_oci', 'Svorka', 'Rovnatka', 'Proteza',
        'Naplast', 'Tetovani', 'Klaustrofobie', 'Cocky', 'Piercing',
        'Operace_srdce', 'Srouby', 'Kardiostimulator', 'Infuzni_pumpa', 'Kochlear',
        'El_zarizeni', 'Chlopen', 'Strepina_oko', 'Strepina_telo'
    ];

    this.getFieldValue = function(key) {
        return docObj.getField(key).value.toString().trim();
    }

    this.validateFormValues = function() {
        var emptyFields = [];
        var validateField = function(obj, key) {
            var value = obj.getFieldValue(key);
            if ((!value || value == 'Off')) {
                emptyFields.push(key);
            }
        };
        var allCheckedFields = this.formFields.concat(this.formChecked);
        for (index in allCheckedFields) {
            if (allCheckedFields[index] != 'VisitID') {
                validateField(this, allCheckedFields[index]);
            }
        }
        if (this.getFieldValue('Pohlavi') == 'Zena') {
            validateField(this, 'Tehotna');
        }
        if (emptyFields.length > 0) {
            this.disablePrint();
            this.statusError();
            this.showMessage('Formulář obsahuje nevyplněná pole: ' + emptyFields.join(', ') + '.');
            return false;
        }
        return true;
    };

    this.getFormValues = function() {
        var params = {};
        for (index in this.formFields) {
            params[this.formFields[index]] = this.getFieldValue(this.formFields[index]);
        }
        return params;
    };

    this.setFormId = function(valueId) {
        docObj.getField('VisitID').value = valueId;
    };
    this.setDate = function(date) {
        docObj.getField('Datum').value = date;
    };
    this.statusOk = function() {
        docObj.getField('Potvrdit').fillColor = color.green;
    }
    this.statusError = function() {
        docObj.getField('Potvrdit').fillColor = color.red;
    }
    this.enablePrint = function() {
        docObj.getField('Tisknout').display = display.noPrint;
    }
    this.disablePrint = function() {
        docObj.getField('Tisknout').display = display.hidden;
    }
    this.showMessage = function(message) {
        app.alert(message);
    }
    this.resetForm = function() {
        this.disablePrint();
        docObj.getField('Potvrdit').fillColor = ['RGB', 0.75, 0.75, 0.75];
    }
}

var docControls = new DocControls(this);
var serverUrl = 'http://localhost/mr_forms/register.php';
