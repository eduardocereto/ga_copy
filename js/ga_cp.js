DEBUG = false;
VERSION = '1';

function log() {
    if (DEBUG) console.log(arguments);
}

function GaCopy() {
    this.version = VERSION;
}

GaCopy.prototype.check = function() {
    if (document.querySelector('[name=C_EDITGOAL-name]')) {
        this.type = 'goal';
    }else if (document.querySelector('[name=C_EDITFILTER-name]')) {
        this.type = 'filter';
    }else {
        this.type = undefined;
    }
    log('check:', this.type);
    return this.type;
};

GaCopy.prototype.getGoalVariation = function() {
    this.variation = undefined;
    if (this.type !== 'goal') {
        return this.variation;
    }
    var radios = document.querySelectorAll('[name=C_EDITGOAL-goalType]');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            this.variation = [
                'urlDest',
                'engTime',
                'engPages',
                'event'
            ][i];
            break;
        }
    }
    console.log('getGoalVariation:', this.variation);
    return this.variation;
};

GaCopy.prototype.getFilterVariation = function() {
    this.variation = undefined;
    if (this.type !== 'filter') {
        return this.variation;
    }

    var filterMethod = document.querySelector('[name="C_EDITFILTER-filterMethod"]:checked');
    if (filterMethod && filterMethod.value === 'new') {
        var typeCustom = document.querySelector('[name="C_EDITFILTER-typeCustom"]:checked');
        if (typeCustom && typeCustom.value === 'false') {
            this.variation = 'PREDEFINED';
        }else if (typeCustom && typeCustom.value === 'true') {
            var filterType = document.querySelector('[name="C_EDITFILTER-filterType"]:checked');
            if (filterType && filterType.value) {
                this.variation = filterType.value;
            }
        }
    }
    return this.variation;
};

GaCopy.prototype.copy = function() {
    log('Copy starting');
    this.check();
    if (this.type === 'goal') {
        this.getGoalVariation();
        if (this['copyGoal_' + this.variation]) {
            return this['copyGoal_' + this.variation]();
        }
    }else if (this.type === 'filter') {
        this.getFilterVariation();
        if (this['copyFilter_' + this.variation]) {
            return this['copyFilter_' + this.variation]();
        }
    }
    return false;
};

GaCopy.prototype.getMarkedCheckboxes = function(name) {
    var cb = document.querySelectorAll('[name="' + name + '"]:checked');
    var res = [];
    for (var i = 0; i < cb.length; i++) {
        res.push(cb[i]);
    }
    return res;
};

GaCopy.prototype.getMarkedRadio = function(name) {
    var ra = this.getMarkedCheckboxes(name);
    if (ra.length > 0) {
        return ra[0];
    }
    return undefined;
};

GaCopy.prototype.save = function() {
    var ret = {};
    ret.version = this.version;
    ret.data = this.data;
    ret.type = this.type;
    ret.variation = this.variation;
    return ret;
};

/**********************/
/*** FILTER PARSERS ***/
/**********************/

GaCopy.prototype.copyFilter_PREDEFINED = function() {
    console.log('parsing PREDEFINED');
    var data = {};

    data.name = document.querySelector('[name="C_EDITFILTER-name"]').value;
    data.filterIncludeExcludeType = document.querySelector('[name="C_EDITFILTER-filterIncludeExcludeType"]').value;
    data.predefinedType = document.querySelector('[name="C_EDITFILTER-predefinedType"]').value;
    data.comparisonOperator = document.querySelector('[name="C_EDITFILTER-comparisonOperator"]').value;
    //data.domainName = document.querySelector('.ID-domainName input').value;
    //data.caseSensitive = document.querySelector('[name="C_EDITFILTER-caseSensitive"]').value;

    this.data = data;
    return data;
};
GaCopy.prototype.copyFilter_PREDEFINED_domainName = function() {};
GaCopy.prototype.copyFilter_PREDEFINED_ipAddress = function() {};
GaCopy.prototype.copyFilter_PREDEFINED_subDirectory = function() {};
GaCopy.prototype.copyFilter_EXCLUDE = function() {};
GaCopy.prototype.copyFilter_INCLUDE = function() {};
GaCopy.prototype.copyFilter_LOWER = function() {};
GaCopy.prototype.copyFilter_UPPER = function() {};
GaCopy.prototype.copyFilter_REPLACE = function() {};
GaCopy.prototype.copyFilter_ADVANCED = function() {};


/********************/
/*** GOAL PARSERS ***/
/********************/
GaCopy.prototype.copyGoal_urlDest = function() {
    log('parsing UrlDest');
    var s, i, data = {};
    data.name = document.querySelector('[name="C_EDITGOAL-name"]').value;
    data.active = this.getMarkedRadio('C_EDITGOAL-active').value;
    data.path = document.querySelector('[name="C_EDITGOAL-path"]').value;
    data.matchType = document.querySelector('[name="C_EDITGOAL-matchType"]').value;
    data.caseSensitive = document.querySelector('[name="C_EDITGOAL-caseSensitive"]').checked;
    data.monetaryValue = document.querySelector('[name="C_EDITGOAL-monetaryValue"]').value;

    data.addFunnel = document.querySelector('[name="C_EDITGOAL-addFunnel"]').checked;

    if (data.addFunnel) {
        data.step1Required = document.querySelector('[name="C_EDITGOAL-step1Required"]').checked;

        data.stepPaths = [];
        s = document.querySelectorAll('[name="C_EDITGOAL-stepPath"]');
        for (i = 0; i < s.length; i++) {
            data.stepPaths.push(s[i].value);
        }

        data.stepNames = [];
        s = document.querySelectorAll('[name="C_EDITGOAL-stepName"]');
        for (i = 0; i < s.length; i++) {
            data.stepNames.push(s[i].value);
        }
    }
    this.data = data;
    return data;
};

GaCopy.prototype.copyGoal_engTime = function() {
    log('parsing engTime');
    var data = {};
    data.name = document.querySelector('[name="C_EDITGOAL-name"]').value;
    data.active = this.getMarkedRadio('C_EDITGOAL-active').value;
    data.condition = document.querySelector('[name="C_EDITGOAL-condition"]').value;
    data.hours = document.querySelector('[name="C_EDITGOAL-hours"]').value;
    data.minutes = document.querySelector('[name="C_EDITGOAL-minutes"]').value;
    data.seconds = document.querySelector('[name="C_EDITGOAL-seconds"]').value;
    data.monetaryValue = document.querySelector('[name="C_EDITGOAL-monetaryValue"]').value;
    this.data = data;
    return data;
};

GaCopy.prototype.copyGoal_engPages = function() {
    log('parsing engPages');
    var data = {};
    data.name = document.querySelector('[name="C_EDITGOAL-name"]').value;
    data.active = this.getMarkedRadio('C_EDITGOAL-active').value;
    data.condition = document.querySelector('[name="C_EDITGOAL-condition"]').value;
    data.pages = document.querySelector('[name="C_EDITGOAL-pages"]').value;
    data.monetaryValue = document.querySelector('[name="C_EDITGOAL-monetaryValue"]').value;
    this.data = data;
    return data;
};

GaCopy.prototype.copyGoal_event = function() {
    log('parsing event');
    var data = {};
    data.name = document.querySelector('[name="C_EDITGOAL-name"]').value;
    data.active = this.getMarkedRadio('C_EDITGOAL-active').value;

    data.categoryMatchType = document.querySelector('[name="C_EDITGOAL-CATEGORY_0"]').value;
    data.categoryField = document.querySelector('[name="C_EDITGOAL-CATEGORY_0_field"]').value;

    data.actionMatchType = document.querySelector('[name="C_EDITGOAL-ACTION_0"]').value;
    data.actionField = document.querySelector('[name="C_EDITGOAL-ACTION_0_field"]').value;

    data.labelMatchType = document.querySelector('[name="C_EDITGOAL-LABEL_0"]').value;
    data.labelField = document.querySelector('[name="C_EDITGOAL-LABEL_0_field"]').value;

    data.valueMatchType = document.querySelector('[name="C_EDITGOAL-VALUE_0"]').value;
    data.valueField = document.querySelector('[name="C_EDITGOAL-VALUE_0_field"]').value;

    data.useEventValue = this.getMarkedRadio('C_EDITGOAL-useEventValue').value;

    data.monetaryValue = document.querySelector('[name="C_EDITGOAL-monetaryValue"]').value;
    this.data = data;
    return data;
};

