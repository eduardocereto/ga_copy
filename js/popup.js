function warn(text) {
    $('#warn').text(text).show();
    setTimeout(function() {
        $('#warn').text('').hide();
    }, 3000);
}

function _handle_response(response) {
    try {
        if (response.error) {
            return false;
        }
        if (response.action === 'check') {
            $('#copy_but').prop('disabled', !response.data);
            return true;
        }
        var id = response.type + '_' + response.data.name;
        id = id.replace(/\s+/g, '-');
        localStorage[id] = JSON.stringify(response);

        _gaq.push(['_trackEvent', 'Copy', response.type, response.variation]);

        init_popup();
        return true;
    }catch (e) {
        gaException(e);
    }
}

function send_action(action, data) {
    var req = {
        'action': action,
        'obj': data
    };
    console.log('Req: ', req);
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, req, _handle_response);
    });
}

$(document).ready(function() {
    try {
        init_popup();
        send_action('check');
        $('#copy_but').click(function() {
            send_action('copy');
        });
        var data;
        $('.paste').live('click', function() {
            data = localStorage[$(this).attr('id')];
            if (data) {
                data = JSON.parse(data);
                _gaq.push(['_trackEvent', 'Paste', data.type, data.variation]);
                send_action('paste', data);
            }else {
                console.log('Rule not found');
            }
        });

        /*
        $('#clear_all').click(function(){
            var msg = 'Are you sure you want to remove all copied goals and filters?'
            if(confirm(msg)){
                localStorage.clear();
                $('#goal_list,#filter_list').empty();
            }

        });
        */

        $('.clear').live('click', function() {
            var el = $(this).parent().find('.paste');
            localStorage.removeItem(el.attr('id'));
            _gaq.push(['_trackEvent', 'Clear', el.attr('id').split('_')[0]]);
            init_popup();
        });
    }catch (e) {
        gaException(e);
    }
});

function init_popup() {
    $('ul').empty();
    $('p').show();
    var id, t, n;
    for (id in localStorage) {
        n = JSON.parse(localStorage[id]).data.name;
        if (id.indexOf('goal_') === 0 ||
            id.indexOf('filter_') === 0
        ) {
            t = id.split('_');
            if ($('#' + id).length == 0) {
                var el = $('<span/>', {
                    'id': id,
                    'class': 'paste',
                    'title': n
                });
                el.text(n);
                //el.addClass(t[1]); //spaces dont play nice
                var li = $('<li/>');
                el.appendTo(li);
                $('<span/>', {
                    'class': 'clear',
                    'title': 'Clear'
                }).appendTo(li);
                li.appendTo('#' + t[0] + '_list');
                $('#' + t[0] + 's p').hide();
            }
        }
    }
}

function gaException(e) {
    _gaq.push(['_trackEvent',
        'Exception ' + (e.name || 'Error'),
        e.message
    ]);
}
