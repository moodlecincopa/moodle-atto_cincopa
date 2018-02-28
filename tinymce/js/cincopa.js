tinyMCEPopup.requireLangPack();

var CincopaPopup = {
    init : function() {
        var ed = tinyMCEPopup.editor,
            el = document.getElementById('iframecontainer'), ifr, doc, css, cssHTML = '';

        // Create iframe
        el.innerHTML = '<iframe src="https://www.cincopa.com/media-platform/start.aspx?source=moodle_plugin" id="cincopa-iframe" ></iframe>';
        ifr = document.getElementById('cincopa-iframe');
        ifr.width = screen.width - 200;
        ifr.height = screen.height - 200;
    }
};

tinyMCEPopup.onInit.add(CincopaPopup.init, CincopaPopup);

/* listen message from cincopa.com*/


function sendEvent(data){
    var iframe = document.getElementById("cincopa-iframe");
    if(!iframe) return;
    var receiver = iframe.contentWindow;
    var params = data;
    params["sender"] = "cincopa-moodle";
    receiver.postMessage(params, '*');
}

window.addEventListener('message', receiveMessage);
function receiveMessage(e){
    if(e.data && e.data.sender == "cincopa" && e.data.action == "insert-moodle"){
        sendEvent({
            action: "insert-moodle-btn"
        })
    } else if(e.data && e.data.sender == "cincopa" && e.data.action == "insert-moodle-gallery"){
        tinyMCEPopup.editor.execCommand('mceInsertClipboardContent', false, {content : "[cincopa " +  e.data.fid + "]"});
        tinyMCEPopup.close();
    }
}
