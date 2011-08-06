chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.action == 'copy'){
            var _gac = new GaCopy();
            if(_gac.copy()){
                sendResponse(_gac.save());
            }else{
                sendResponse({});
            }
        }
        if(request.action == 'paste'){
            var _gap = new GaPaste(request.obj);
            console.log('Pasting', _gap);
            try{
                _gap.paste();
                sendResponse({});
            }catch(e){
                sendResponse({error:true});
            }
        }
        if(request.action == 'check'){
            var _gac = new GaCopy();
            sendResponse({
                action: 'check',
                data: _gac.check()
            });
        }
});


