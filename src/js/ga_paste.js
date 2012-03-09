function GaPaste(obj) {
    this.version = obj.version;
    if (this.version !== VERSION) {
        throw 'Object version mismatch';
    }
    this.type = obj.type;
    this.variation = obj.variation;
    this.data = obj.data;
}

GaPaste.prototype.paste = function() {
    log('paste', this)
    if (this.type === 'goal' && this['pasteGoal_' + this.variation]) {
        return this['pasteGoal_' + this.variation]();
    }
    if (this.type === 'filter' && this['pasteFilter_' + this.variation]) {
        return this['pasteFilter_' + this.variation]();
    }
};

GaPaste.prototype.setMarkedRadio = function(name, value) {
    var r = document.querySelector('[name$="' + name + '"][value="' + value + '"]');
    r.checked = true;
};

GaPaste.prototype.fireChange = function(elem) {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', true, true, window);
    elem.dispatchEvent(evt);
};

/**********************/
/*** FILTER PASTERS ***/
/**********************/
GaPaste.prototype.pasteFilter_ADVANCED = function() {
    log('pasting Advanced');
    var data = this.data;
    document.querySelector('[name$="-name"]').value = data.name;
    
    this.setMarkedRadio('-typeCustom', "true");
    document.querySelector('[name$="-typeCustom"]:checked').click();
    this.setMarkedRadio('-filterType', "ADVANCED");
    document.querySelector('[name$="-filterType"]:checked').click();
    
    
    document.querySelector('[name$="-customFilterA"]').value = data.customFilterA;
    document.querySelector('[name$="-customFilterB"]').value = data.customFilterB;
    document.querySelector('[name$="-customFilterC"]').value = data.customFilterC;
    document.querySelector('[name$="-customFilterAExpression"]').value = data.customFilterAExpression;
    document.querySelector('[name$="-customFilterBExpression"]').value = data.customFilterBExpression;
    document.querySelector('[name$="-customFilterCExpression"]').value = data.customFilterCExpression;
    this.setMarkedRadio('-filterARequired', data.filterARequired);
    this.setMarkedRadio('-filterBRequired', data.filterBRequired);
    this.setMarkedRadio('-filterCOverride', data.filterCOverride);
    this.setMarkedRadio('-caseSensitive', data.caseSensitive);
    return true;
};

/********************/
/*** GOAL PASTERS ***/
/********************/

GaPaste.prototype.pasteGoal_urlDest = function() {
    log('Pasting UrlDest');
    var s, i, data = this.data;
    document.querySelector('[name$="-name"]').value = data.name;
    this.setMarkedRadio('-active', data.active);

    this.setMarkedRadio('-goalType', 'Page');
    document.querySelector('[name$="-goalType"]:checked').click();

    document.querySelector('[name$="-path"]').value = data.path;
    document.querySelector('[name$="-matchType"]').value = data.matchType;
    document.querySelector('[name$="-caseSensitive"]').checked = data.caseSensitive;
    document.querySelector('[name$="-monetaryValue"]').value = data.monetaryValue;

    if (data.addFunnel) {
        document.querySelector('[name$="-addFunnel"]').checked = data.addFunnel;
        // Double click to fire the event and keep the state.
        document.querySelector('[name$="-addFunnel"]').click();
        document.querySelector('[name$="-addFunnel"]').click();

        document.querySelector('[name$="-step1Required"]').checked = data.step1Required;

        s = document.querySelectorAll('[name$="-stepPath"]');

        // Let's add more steps if needed.
        while (s.length < data.stepPaths.length) {
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, window,
                1, 0, 0, 0, 0,
                false, false, false, false,
                0, null);
            if (document.querySelector('.ACTION-addFunnel') === null) {
                break;
            }
            document.querySelector('.ACTION-addFunnel').dispatchEvent(evt);
            s = document.querySelectorAll('[name$="-stepPath"]');
        }

        for (i = 0; i < data.stepPaths.length; i++) {
                s[i].value = data.stepPaths[i];
        }

        s = document.querySelectorAll('[name$="-stepName"]');
        for (i = 0; i < data.stepNames.length; i++) {
            s[i].value = data.stepNames[i];
        }
    }else{
        document.querySelector('[name$="-addFunnel"]').checked = false;
        // Double click to fire the event and keep the state.
        document.querySelector('[name$="-addFunnel"]').click();
        document.querySelector('[name$="-addFunnel"]').click();
    }
    return true;
};

GaPaste.prototype.pasteGoal_engTime = function() {
    log('Pasting engTime');
    var data = this.data;
    document.querySelector('[name$="-name"]').value = data.name;
    this.setMarkedRadio('-active', data.active);

    this.setMarkedRadio('-goalType', 'Visit_TimeOnSite');
    document.querySelector('[name$="-goalType"]:checked').click();

    document.querySelector('[name$="-condition"]').value = data.condition;
    document.querySelector('[name$="-hours"]').value = data.hours;
    document.querySelector('[name$="-minutes"]').value = data.minutes;
    document.querySelector('[name$="-seconds"]').value = data.seconds;
    document.querySelector('[name$="-monetaryValue"]').value = data.monetaryValue;
    return true;
};

GaPaste.prototype.pasteGoal_engPages = function() {
    log('Pasting engPages');
    var data = this.data;
    document.querySelector('[name$="-name"]').value = data.name;
    this.setMarkedRadio('-active', data.active);

    this.setMarkedRadio('-goalType', 'Visit_NumPages');
    document.querySelector('[name$="-goalType"]:checked').click();

    document.querySelector('[name$="-condition"]').value = data.condition;
    document.querySelector('[name$="-pages"]').value = data.pages;
    document.querySelector('[name$="-monetaryValue"]').value = data.monetaryValue;
    return true;
};

GaPaste.prototype.pasteGoal_event = function() {
log('Pasting event');
    var data = this.data;
    document.querySelector('[name$="-name"]').value = data.name;
    this.setMarkedRadio('-active', data.active);

    this.setMarkedRadio('-goalType', 'Event');
    document.querySelector('[name$="-goalType"]:checked').click();

    document.querySelector('[name$="-CATEGORY_0"]').value = data.categoryMatchType;
    this.fireChange(document.querySelector('[name$="-CATEGORY_0"]'));
    document.querySelector('[name$="-CATEGORY_0_field"]').value = data.categoryField;

    document.querySelector('[name$="-ACTION_0"]').value = data.actionMatchType;
    this.fireChange(document.querySelector('[name$="-ACTION_0"]'));
    document.querySelector('[name$="-ACTION_0_field"]').value = data.actionField;

    document.querySelector('[name$="-LABEL_0"]').value = data.labelMatchType;
    this.fireChange(document.querySelector('[name$="-LABEL_0"]'));
    document.querySelector('[name$="-LABEL_0_field"]').value = data.labelField;

    document.querySelector('[name$="-VALUE_0"]').value = data.valueMatchType;
    this.fireChange(document.querySelector('[name$="-VALUE_0"]'));
    document.querySelector('[name$="-VALUE_0_field"]').value = data.valueField;

     this.setMarkedRadio('-useEventValue', data.useEventValue);
     document.querySelector('[name$="-useEventValue"]:checked').click();

    document.querySelector('[name$="-monetaryValue"]').value = data.monetaryValue;
    return true;
};

