

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

GaPaste.prototype.fireChange = function(elem){
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', true, true, window);
    elem.dispatchEvent(evt);
}

/********************/
/*** GOAL PASTERS ***/
/********************/

GaPaste.prototype.pasteGoal_urlDest = function() {
    log('Pasting UrlDest');
    var s, i, data = this.data;
    document.querySelector('[name="C_EDITGOAL-name"]').value = data.name;
    this.setMarkedRadio('C_EDITGOAL-active', data.active);

    this.setMarkedRadio('C_EDITGOAL-goalType', 'Page');
    document.querySelector('[name="C_EDITGOAL-goalType"]:checked').click();

    document.querySelector('[name="C_EDITGOAL-path"]').value = data.path;
    document.querySelector('[name="C_EDITGOAL-matchType"]').value = data.matchType;
    document.querySelector('[name="C_EDITGOAL-caseSensitive"]').checked = data.caseSensitive;
    document.querySelector('[name="C_EDITGOAL-monetaryValue"]').value = data.monetaryValue;
    
    if (data.addFunnel) {
        document.querySelector('[name="C_EDITGOAL-addFunnel"]').checked = data.addFunnel;
        // Double click to fire the event and keep the state.
        document.querySelector('[name="C_EDITGOAL-addFunnel"]').click();
        document.querySelector('[name="C_EDITGOAL-addFunnel"]').click();
        
        document.querySelector('[name="C_EDITGOAL-step1Required"]').checked = data.step1Required;

        s = document.querySelectorAll('[name="C_EDITGOAL-stepPath"]');

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
            s = document.querySelectorAll('[name="C_EDITGOAL-stepPath"]');
        }

        for (i = 0; i < data.stepPaths.length; i++) {
                s[i].value = data.stepPaths[i];
        }

        s = document.querySelectorAll('[name="C_EDITGOAL-stepName"]');
        for (i = 0; i < data.stepNames.length; i++) {
            s[i].value = data.stepNames[i];
        }
    }
    return true;
};

GaPaste.prototype.pasteGoal_engTime = function(){
    log('Pasting engTime');
    var data = this.data;
    document.querySelector('[name="C_EDITGOAL-name"]').value = data.name;
    this.setMarkedRadio('C_EDITGOAL-active', data.active);
    
    this.setMarkedRadio('C_EDITGOAL-goalType', 'Visit_TimeOnSite');
    document.querySelector('[name="C_EDITGOAL-goalType"]:checked').click();
    
    document.querySelector('[name="C_EDITGOAL-condition"]').value= data.condition;
    document.querySelector('[name="C_EDITGOAL-hours"]').value = data.hours;
    document.querySelector('[name="C_EDITGOAL-minutes"]').value = data.minutes;
    document.querySelector('[name="C_EDITGOAL-seconds"]').value = data.seconds;
    document.querySelector('[name="C_EDITGOAL-monetaryValue"]').value = data.monetaryValue;
    return true;
}

GaPaste.prototype.pasteGoal_engPages = function(){
    log('Pasting engPages');
    var data = this.data;
    document.querySelector('[name="C_EDITGOAL-name"]').value = data.name;
    this.setMarkedRadio('C_EDITGOAL-active', data.active);
    
    this.setMarkedRadio('C_EDITGOAL-goalType', 'Visit_NumPages');
    document.querySelector('[name="C_EDITGOAL-goalType"]:checked').click();
    
    document.querySelector('[name="C_EDITGOAL-condition"]').value = data.condition;
    document.querySelector('[name="C_EDITGOAL-pages"]').value = data.pages;
    document.querySelector('[name="C_EDITGOAL-monetaryValue"]').value = data.monetaryValue;
    return true;
}

GaPaste.prototype.pasteGoal_event = function(){
log('Pasting event');
    var data = this.data;
    document.querySelector('[name="C_EDITGOAL-name"]').value = data.name;
    this.setMarkedRadio('C_EDITGOAL-active', data.active);
    
    this.setMarkedRadio('C_EDITGOAL-goalType', 'Event');
    document.querySelector('[name="C_EDITGOAL-goalType"]:checked').click();
    
    document.querySelector('[name="C_EDITGOAL-CATEGORY_0"]').value = data.categoryMatchType;
    this.fireChange(document.querySelector('[name="C_EDITGOAL-CATEGORY_0"]'));
    document.querySelector('[name="C_EDITGOAL-CATEGORY_0_field"]').value = data.categoryField;
    
    document.querySelector('[name="C_EDITGOAL-ACTION_0"]').value = data.actionMatchType;
    this.fireChange(document.querySelector('[name="C_EDITGOAL-ACTION_0"]'));
    document.querySelector('[name="C_EDITGOAL-ACTION_0_field"]').value = data.actionField;
    
    document.querySelector('[name="C_EDITGOAL-LABEL_0"]').value = data.labelMatchType;
    this.fireChange(document.querySelector('[name="C_EDITGOAL-LABEL_0"]'));
    document.querySelector('[name="C_EDITGOAL-LABEL_0_field"]').value = data.labelField;
    
    document.querySelector('[name="C_EDITGOAL-VALUE_0"]').value = data.valueMatchType;
    this.fireChange(document.querySelector('[name="C_EDITGOAL-VALUE_0"]'));
    document.querySelector('[name="C_EDITGOAL-VALUE_0_field"]').value = data.valueField;
    
     this.setMarkedRadio('C_EDITGOAL-useEventValue', data.useEventValue);
     document.querySelector('[name="C_EDITGOAL-useEventValue"]:checked').click();
    
    document.querySelector('[name="C_EDITGOAL-monetaryValue"]').value = data.monetaryValue;
    return true;
}
