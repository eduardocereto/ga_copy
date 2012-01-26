DEBUG = false;
VERSION = '1';

function log() {
    if (DEBUG) console.log(arguments);
}

function GaCopy() {
    this.version = VERSION;
    this.error = false;
    this.error_message = undefined;
}

GaCopy.prototype.check = function() {
    if (document.querySelector('[name=x-name]')) {
        this.type = 'goal';
    }else if (document.querySelector('[name=u-name]')) {
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
    var radios = document.querySelectorAll('[name=x-goalType]');
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
    log('getGoalVariation:', this.variation);
    return this.variation;
};

GaCopy.prototype.getFilterVariation = function() {
    this.variation = undefined;
    if (this.type !== 'filter') {
        return this.variation;
    }

    var filterMethod = document.querySelector('[name="u-filterMethod"]:checked');
    if (filterMethod && filterMethod.value === 'new') {
        var typeCustom = document.querySelector('[name="u-typeCustom"]:checked');
        if (typeCustom && typeCustom.value === 'false') {
            this.variation = 'PREDEFINED';
        }else if (typeCustom && typeCustom.value === 'true') {
            var filterType = document.querySelector('[name="u-filterType"]:checked');
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
    }else{
        this.triggerError('Goal/Filter not found.');
        return false;
    }
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
    ret.error = this.error;
    ret.error_message = this.error_message;
    ret.action = 'copy';
    log('Save: ', ret);
    return ret;
};

GaCopy.prototype.triggerError = function(msg) {
    this.error = true;
    this.error_message = msg;
};

/**********************/
/*** FILTER PARSERS ***/
/**********************/

GaCopy.prototype.copyFilter_PREDEFINED = function() {
    return this.triggerError('Predefined Filters are not supported.');

    log('parsing PREDEFINED');
    var data = {};

    data.name = document.querySelector('[name="u-name"]').value;
    data.filterIncludeExcludeType = document.querySelector('[name="u-filterIncludeExcludeType"]').value;
    data.predefinedType = document.querySelector('[name="u-predefinedType"]').value;
    data.comparisonOperator = document.querySelector('[name="u-comparisonOperator"]').value;
    //data.domainName = document.querySelector('.ID-domainName input').value;
    //data.caseSensitive = document.querySelector('[name="u-caseSensitive"]').value;

    this.data = data;
    return data;
};
GaCopy.prototype.copyFilter_PREDEFINED_domainName = function() {
    return this.triggerError('Predefined Filters are not supported.');
};
GaCopy.prototype.copyFilter_PREDEFINED_ipAddress = function() {
    return this.triggerError('Predefined Filters are not supported.');
};
GaCopy.prototype.copyFilter_PREDEFINED_subDirectory = function() {
    return this.triggerError('Predefined Filters are not supported.');
};
GaCopy.prototype.copyFilter_EXCLUDE = function() {
    log('Parsing Exclude');
    return this.copyFilter_INCLUDE();
};
GaCopy.prototype.copyFilter_INCLUDE = function() {
    log('parsing Include');
    var data = {};
    data.name = document.querySelector('[name="u-name"]').value;
    data.filterField = document.querySelector('[name="u-filterField"]').value;
    data.filterExpression = document.querySelector('[name="u-filterExpression"]').value;
    data.caseSensitive = document.querySelector('[name="u-caseSensitive"]:checked').value;
    this.data = data;
    return data;
};
GaCopy.prototype.copyFilter_LOWER = function() {
    log('parsing Lower');
    var data = {};
    data.name = document.querySelector('[name="u-name"]').value;
    data.filterField = document.querySelector('[name="u-filterField"]').value;
    this.data = data;
    return data;
};
GaCopy.prototype.copyFilter_UPPER = function() {
    log('parsing Upper');
    return this.copyFilter_LOWER();
};
GaCopy.prototype.copyFilter_REPLACE = function() {
    log('parsing Replace');
    var data = {};
    data.name = document.querySelector('[name="u-name"]').value;
    data.filterField = document.querySelector('[name="u-filterField"]').value;
    data.searchString = document.querySelector('[name="u-searchString"]').value;
    data.replaceString = document.querySelector('[name="u-replaceString"]').value;
    data.caseSensitive = document.querySelector('[name="u-caseSensitive"]:checked').value;
    this.data = data;
    return data;
};
GaCopy.prototype.copyFilter_ADVANCED = function() {
    log('parsing Advanced');
    var data = {};
    data.name = document.querySelector('[name="u-name"]').value;
    data.customFilterA = document.querySelector('[name="u-customFilterA"]').value;
    data.customFilterB = document.querySelector('[name="u-customFilterB"]').value;
    data.customFilterC = document.querySelector('[name="u-customFilterC"]').value;
    data.customFilterAExpression = document.querySelector('[name="u-customFilterAExpression"]').value;
    data.customFilterBExpression = document.querySelector('[name="u-customFilterBExpression"]').value;
    data.customFilterCExpression = document.querySelector('[name="u-customFilterCExpression"]').value;
    data.filterARequired = document.querySelector('[name="u-filterARequired"]:checked').value;
    data.filterBRequired = document.querySelector('[name="u-filterBRequired"]:checked').value;
    data.filterCOverride = document.querySelector('[name="u-filterCOverride"]:checked').value;
    data.caseSensitive = document.querySelector('[name="u-caseSensitive"]:checked').value;
    this.data = data;
    return data;
};


/********************/
/*** GOAL PARSERS ***/
/********************/
GaCopy.prototype.copyGoal_urlDest = function() {
    log('parsing UrlDest');
    var s, i, data = {};
    data.name = document.querySelector('[name="x-name"]').value;
    data.active = this.getMarkedRadio('x-active').value;
    data.path = document.querySelector('[name="x-path"]').value;
    data.matchType = document.querySelector('[name="x-matchType"]').value;
    data.caseSensitive = document.querySelector('[name="x-caseSensitive"]').checked;
    data.monetaryValue = document.querySelector('[name="x-monetaryValue"]').value;

    data.addFunnel = document.querySelector('[name="x-addFunnel"]').checked;

    if (data.addFunnel) {
        data.step1Required = document.querySelector('[name="x-step1Required"]').checked;

        data.stepPaths = [];
        s = document.querySelectorAll('[name="x-stepPath"]');
        for (i = 0; i < s.length; i++) {
            data.stepPaths.push(s[i].value);
        }

        data.stepNames = [];
        s = document.querySelectorAll('[name="x-stepName"]');
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
    data.name = document.querySelector('[name="x-name"]').value;
    data.active = this.getMarkedRadio('x-active').value;
    data.condition = document.querySelector('[name="x-condition"]').value;
    data.hours = document.querySelector('[name="x-hours"]').value;
    data.minutes = document.querySelector('[name="x-minutes"]').value;
    data.seconds = document.querySelector('[name="x-seconds"]').value;
    data.monetaryValue = document.querySelector('[name="x-monetaryValue"]').value;
    this.data = data;
    return data;
};

GaCopy.prototype.copyGoal_engPages = function() {
    log('parsing engPages');
    var data = {};
    data.name = document.querySelector('[name="x-name"]').value;
    data.active = this.getMarkedRadio('x-active').value;
    data.condition = document.querySelector('[name="x-condition"]').value;
    data.pages = document.querySelector('[name="x-pages"]').value;
    data.monetaryValue = document.querySelector('[name="x-monetaryValue"]').value;
    this.data = data;
    return data;
};

GaCopy.prototype.copyGoal_event = function() {
    log('parsing event');
    var data = {};
    data.name = document.querySelector('[name="x-name"]').value;
    data.active = this.getMarkedRadio('x-active').value;

    data.categoryMatchType = document.querySelector('[name="x-CATEGORY_0"]').value;
    data.categoryField = document.querySelector('[name="x-CATEGORY_0_field"]').value;

    data.actionMatchType = document.querySelector('[name="x-ACTION_0"]').value;
    data.actionField = document.querySelector('[name="x-ACTION_0_field"]').value;

    data.labelMatchType = document.querySelector('[name="x-LABEL_0"]').value;
    data.labelField = document.querySelector('[name="x-LABEL_0_field"]').value;

    data.valueMatchType = document.querySelector('[name="x-VALUE_0"]').value;
    data.valueField = document.querySelector('[name="x-VALUE_0_field"]').value;

    data.useEventValue = this.getMarkedRadio('x-useEventValue').value;

    data.monetaryValue = document.querySelector('[name="x-monetaryValue"]').value;
    this.data = data;
    return data;
};

