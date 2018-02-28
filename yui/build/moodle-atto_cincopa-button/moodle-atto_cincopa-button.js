YUI.add('moodle-atto_cincopa-button', function (Y, NAME) {
    console.log("min");
    Y.namespace('M.atto_cincopa').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
        initializer: function () {
            var that = this;
            var firstbutton = this.addButton({
                callback: this._getUrl,
                buttonName: 'first',
                icon: 'icontoolbar',
                iconComponent: 'atto_cincopa',
            });
            var items = [];
            items.push({
                text: '<div id="cincopa_atto">wait...</div>',
                callback: this._changeStyle
            });
            var secondbutton = this.addToolbarMenu({
                items: items,
                icon:'icontoolbar',
                iconComponent: 'atto_cincopa'
            });
            secondbutton._node.removeChild(secondbutton._node.childNodes[0]);
            var po = this;
			
			/* listen message from cincopa.com*/
            function sendEvent(data){
                var cincopaIframe = document.getElementById("cincopa-iframe");
                if(!cincopaIframe) return;
                var receiver = cincopaIframe.contentWindow;
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
                    po.editor.focus();
                    po.get('host').insertContentAtFocusPoint('[cincopa '+e.data.fid+']');
                    po.markUpdated();
                    that._dialogue && that._dialogue.hide();
                }
            }
			
            secondbutton.on('click', function (e) {
                window.setTimeout(function () {
                    YUI().use('jsonp', 'node', 'event', 'jsonp-url', function (Y) {
                        Y.jsonp('https://www.cincopa.com/media-platform/my-galleries-getlist?disable_editor=true?callback=?', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            sync: false,
                            on: {
                                success: function (id, response) {
                                    while (document.getElementById('cincopa_atto').parentNode.parentNode.parentNode.childNodes.length > 1) {
                                        document.getElementById('cincopa_atto').parentNode.parentNode.parentNode.removeChild(document.getElementById('cincopa_atto').parentNode.parentNode.parentNode.lastChild);
                                    }
                                    if (id.response.error) {
                                        var li = document.createElement('li');
                                        var a = document.createElement('a');
                                        a.setAttribute('href', 'https://www.cincopa.com/login.aspx');
                                        a.setAttribute('role', 'link');
                                        a.setAttribute('target', '_blank');
                                        li.setAttribute('class', 'atto_menuentry2');
                                        a.innerHTML = "Login";
                                        li.appendChild(a);
                                        var li2 = document.createElement('li');
                                        var a2 = document.createElement('a');
                                        a2.setAttribute('href', 'https://www.cincopa.com/register.aspx');
                                        a2.setAttribute('role', 'link');
                                        a2.setAttribute('target', '_blank');
                                        li2.setAttribute('class', 'atto_menuentry2');
                                        a2.innerHTML = "Register";
                                        li2.appendChild(a2);
                                        document.getElementById('cincopa_atto').parentNode.parentNode.parentNode.appendChild(li);
                                        document.getElementById('cincopa_atto').parentNode.parentNode.parentNode.appendChild(li2);
                                        document.getElementById('cincopa_atto').innerHTML = "";
                                    } else {
                                        if (id.response.items_data.folders_count != 0) {                                     
                                            for (var i = 0; i < id.response.folders.length; i++) {
                                                var did = id.response.folders[i].sysdata.did;
                                                var li = document.createElement('li');
                                                var a = document.createElement('a');
                                                a.setAttribute('href', '#');
                                                a.setAttribute('role', 'menuitem');
                                                a.setAttribute('data-index', 0);
                                                a.setAttribute('did', id.response.folders[i].sysdata.did);
                                                a.addEventListener('click', function(e) {
                                                    po.editor.focus();
                                                    po.get('host').insertContentAtFocusPoint('[cincopa '+e.target.getAttribute('did')+']');
                                                    po.markUpdated();
                                                });
                                                li.setAttribute('role', 'presentation');
                                                li.setAttribute('class', 'atto_menuentry');
                                                a.innerHTML = id.response.folders[i].sysdata.name + '(id:' + id.response.folders[i].sysdata.did + ')<br> Modified:' + id.response.folders[i].sysdata.modified;
                                                li.appendChild(a);
                                                document.getElementById('cincopa_atto').parentNode.parentNode.parentNode.appendChild(li);
                                            }
                                            document.getElementById('cincopa_atto').innerHTML = "";
                                        }
                                        else{
                                             document.getElementById('cincopa_atto').innerHTML = "No galleries found";

                                        }
                                    }
                                }
                            }
                        });
                    });
                }, 500);
                if(document.getElementById('cincopa_atto')){
                while (document.getElementById('cincopa_atto').parentNode.parentNode.parentNode.childNodes.length > 1) {
                    document.getElementById('cincopa_atto').parentNode.parentNode.parentNode.removeChild(document.getElementById('cincopa_atto').parentNode.parentNode.parentNode.lastChild);
                }
                document.getElementById('cincopa_atto').innerHTML = "wait...";
            }
            });
        },
        _getUrl: function () {
            var width = screen.width - 220;
            var height = screen.height - 220;
           // var url = "https://www.cincopa.com/media-platform/start.aspx";
            var url = "https://www.cincopa.com/media-platform/start.aspx?source=moodle_plugin";
            var dialogue = this.getDialogue({
                bodyContent: '<iframe id="cincopa-iframe" width=' + width + ' height=' + height + ' scrolling="yes" src=' + url + ' frameborder="0" allowfullscreen scrolling="no"></iframe>',
                width: screen.width - 200,
            }, true);
            dialogue.show();
            this._dialogue = dialogue;
        },
        _changeStyle: function (e) { }
    });
});