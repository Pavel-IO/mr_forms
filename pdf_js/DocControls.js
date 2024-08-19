function DocControls(docObj) {
    this.locked = false;

    this.formFields = [
        'VisitID', 'Fantom', 'Jmeno', 'Prijmeni', 'RC', 'Datum_narozeni', 'Matersky_jazyk',
        'Vyska', 'Vaha', 'Pohlavi', 'Stranova_dominance', 'Zrakova_korekce', 'Datum'
    ]
    this.formChecked = [
        'Operace_hlavy', 'Operace_oci', 'Svorka', 'Rovnatka', 'Proteza',
        'Naplast', 'Tetovani', 'Potize', 'Klaustrofobie', 'Cocky', 'Piercing',
        'Operace_srdce', 'Srouby', 'Kardiostimulator', 'Infuzni_pumpa', 'Kochlear',
        'El_zarizeni', 'Chlopen', 'Strepina_oko', 'Strepina_telo'
    ]

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
        var allCheckedFields = this.isFantom() ? [] : this.formFields.concat(this.formChecked);
        for (index in allCheckedFields) {
            var currentKey = allCheckedFields[index];
            if (currentKey != 'VisitID' && currentKey != 'Fantom') {
                validateField(this, currentKey);
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
    }

    this.isFantom = function() {
        return this.getFieldValue('Fantom') != 'Off';
    }

    this.isLocked = function() {
        return this.locked;
    }

    this.lockFields = function(state) {
        for (index in this.formFields) {
            docObj.getField(this.formFields[index]).readonly = state;
        }
    }

    this.lock = function() {
        this.locked = true;
        this.lockFields(true);
        this.enablePrint();
        docObj.getField('Potvrdit').buttonSetCaption('Odemknout');
        docObj.getField('Neulozen').display = display.hidden;
    }

    this.unlock = function() {
        this.locked = false;
        this.lockFields(false);
        this.disablePrint();
        docObj.getField('Potvrdit').buttonSetCaption('Potvrdit');
        docObj.getField('Neulozen').display = display.noView;
    }

    this.getFormValues = function() {
        var params = {};
        for (index in this.formFields) {
            params[this.formFields[index]] = this.getFieldValue(this.formFields[index]);
        }
        return params;
    }

    this.setFormId = function(valueId) {
        docObj.getField('VisitID').value = valueId;
    }
    this.setDbId = function(valueId) {

    }
    this.setDate = function(date) {
        docObj.getField('Datum').value = date;
    }
    this.setNote = function(note) {
        docObj.getField('Notification').display = display.noPrint;
        docObj.getField('Notification').value = note;
    }
    this.hiddenNote = function(note) {
        docObj.getField('Notification').display = display.hidden;
    }
    this.statusOk = function() {
        docObj.getField('Potvrdit').fillColor = color.green;
    }
    this.statusNote = function(message) {
        docObj.getField('Potvrdit').fillColor = color.cyan;
    }
    this.statusError = function() {
        docObj.getField('Potvrdit').fillColor = color.red;
    }
    // navazano na lock(), nepozivat samostatne
    this.enablePrint = function() {
        docObj.getField('Tisknout').display = display.noPrint;
    }
    // navazano na unlock(), nepozivat samostatne
    this.disablePrint = function() {
        docObj.getField('Tisknout').display = display.hidden;
    }
    this.showMessage = function(message) {
        app.alert(message);
    }
    this.resetForm = function() {
        this.unlock();
        this.setNote('');
        this.hiddenNote();
        docObj.getField('Potvrdit').fillColor = ['RGB', 0.75, 0.75, 0.75];
    }
}

var docControls = new DocControls(this);
var serverUrl = 'http://localhost/mr_forms/register.php';
