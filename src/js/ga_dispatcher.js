chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.action == 'copy') {
            var _gac = new GaCopy();
            log('Copying', _gac);
            try{
                _gac.copy();
                sendResponse(_gac.save());
            }catch (e) {
                sendResponse({
                    error: true,
                    error_message: _gac.error_message || e.message || 'Unknown Copy Error'
                });
            }
        }
        if (request.action == 'paste') {
            var _gap = new GaPaste(request.obj);
            log('Pasting', _gap);
            try {
                _gap.paste();
                sendResponse({});
            }catch (e) {
                sendResponse({
                    error: true,
                    error_message: e.message || 'Unknown Paste Error'
                });
            }
        }
        if (request.action == 'check') {
            var _gac = new GaCopy();
            sendResponse({
                action: 'check',
                data: _gac.check()
            });
        }
});

