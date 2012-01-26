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
    var r = document.querySelector('[name="' + name + '"][value="' + value + '"]');
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
    document.querySelector('[name="u-name"]').value = data.name;
    
    this.setMarkedRadio('u-typeCustom', "true");
    document.querySelector('[name="u-typeCustom"]:checked').click();
    this.setMarkedRadio('u-filterType', "ADVANCED");
    document.querySelector('[name="u-filterType"]:checked').click();
    
    
    document.querySelector('[name="u-customFilterA"]').value = data.customFilterA;
    document.querySelector('[name="u-customFilterB"]').value = data.customFilterB;
    document.querySelector('[name="u-customFilterC"]').value = data.customFilterC;
    document.querySelector('[name="u-customFilterAExpression"]').value = data.customFilterAExpression;
    document.querySelector('[name="u-customFilterBExpression"]').value = data.customFilterBExpression;
    document.querySelector('[name="u-customFilterCExpression"]').value = data.customFilterCExpression;
    this.setMarkedRadio('u-filterARequired', data.filterARequired);
    this.setMarkedRadio('u-filterBRequired', data.filterBRequired);
    this.setMarkedRadio('u-filterCOverride', data.filterCOverride);
    this.setMarkedRadio('u-caseSensitive', data.caseSensitive);
    return true;
};

/********************/
/*** GOAL PASTERS ***/
/********************/

GaPaste.prototype.pasteGoal_urlDest = function() {
    log('Pasting UrlDest');
    var s, i, data = this.data;
    document.querySelector('[name="x-name"]').value = data.name;
    this.setMarkedRadio('x-active', data.active);

    this.setMarkedRadio('x-goalType', 'Page');
    document.querySelector('[name="x-goalType"]:checked').click();

    document.querySelector('[name="x-path"]').value = data.path;
    document.querySelector('[name="x-matchType"]').value = data.matchType;
    document.querySelector('[name="x-caseSensitive"]').checked = data.caseSensitive;
    document.querySelector('[name="x-monetaryValue"]').value = data.monetaryValue;

    if (data.addFunnel) {
        document.querySelector('[name="x-addFunnel"]').checked = data.addFunnel;
        // Double click to fire the event and keep the state.
        document.querySelector('[name="x-addFunnel"]').click();
        document.querySelector('[name="x-addFunnel"]').click();

        document.querySelector('[name="x-step1Required"]').checked = data.step1Required;

        s = document.querySelectorAll('[name="x-stepPath"]');

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
            s = document.querySelectorAll('[name="x-stepPath"]');
        }

        for (i = 0; i < data.stepPaths.length; i++) {
                s[i].value = data.stepPaths[i];
        }

        s = document.querySelectorAll('[name="x-stepName"]');
        for (i = 0; i < data.stepNames.length; i++) {
            s[i].value = data.stepNames[i];
        }
    }
    return true;
};

GaPaste.prototype.pasteGoal_engTime = function() {
    log('Pasting engTime');
    var data = this.data;
    document.querySelector('[name="x-name"]').value = data.name;
    this.setMarkedRadio('x-active', data.active);

    this.setMarkedRadio('x-goalType', 'Visit_TimeOnSite');
    document.querySelector('[name="x-goalType"]:checked').click();

    document.querySelector('[name="x-condition"]').value = data.condition;
    document.querySelector('[name="x-hours"]').value = data.hours;
    document.querySelector('[name="x-minutes"]').value = data.minutes;
    document.querySelector('[name="x-seconds"]').value = data.seconds;
    document.querySelector('[name="x-monetaryValue"]').value = data.monetaryValue;
    return true;
};

GaPaste.prototype.pasteGoal_engPages = function() {
    log('Pasting engPages');
    var data = this.data;
    document.querySelector('[name="x-name"]').value = data.name;
    this.setMarkedRadio('x-active', data.active);

    this.setMarkedRadio('x-goalType', 'Visit_NumPages');
    document.querySelector('[name="x-goalType"]:checked').click();

    document.querySelector('[name="x-condition"]').value = data.condition;
    document.querySelector('[name="x-pages"]').value = data.pages;
    document.querySelector('[name="x-monetaryValue"]').value = data.monetaryValue;
    return true;
};

GaPaste.prototype.pasteGoal_event = function() {
log('Pasting event');
    var data = this.data;
    document.querySelector('[name="x-name"]').value = data.name;
    this.setMarkedRadio('x-active', data.active);

    this.setMarkedRadio('x-goalType', 'Event');
    document.querySelector('[name="x-goalType"]:checked').click();

    document.querySelector('[name="x-CATEGORY_0"]').value = data.categoryMatchType;
    this.fireChange(document.querySelector('[name="x-CATEGORY_0"]'));
    document.querySelector('[name="x-CATEGORY_0_field"]').value = data.categoryField;

    document.querySelector('[name="x-ACTION_0"]').value = data.actionMatchType;
    this.fireChange(document.querySelector('[name="x-ACTION_0"]'));
    document.querySelector('[name="x-ACTION_0_field"]').value = data.actionField;

    document.querySelector('[name="x-LABEL_0"]').value = data.labelMatchType;
    this.fireChange(document.querySelector('[name="x-LABEL_0"]'));
    document.querySelector('[name="x-LABEL_0_field"]').value = data.labelField;

    document.querySelector('[name="x-VALUE_0"]').value = data.valueMatchType;
    this.fireChange(document.querySelector('[name="x-VALUE_0"]'));
    document.querySelector('[name="x-VALUE_0_field"]').value = data.valueField;

     this.setMarkedRadio('x-useEventValue', data.useEventValue);
     document.querySelector('[name="x-useEventValue"]:checked').click();

    document.querySelector('[name="x-monetaryValue"]').value = data.monetaryValue;
    return true;
};

