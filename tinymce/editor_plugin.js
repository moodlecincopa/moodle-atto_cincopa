/**
 * TinyMCE plugin Cincopa
 *
 * @author  Cincopa LTD <moodle@cincopa.com>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
(function () {
    var tiny = null;
    var jq = document.createElement("script");

    jq.src = "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js";
    document.querySelector("head").appendChild(jq);
    var DOM = tinymce.DOM;
    tinymce.PluginManager.requireLangPack('cincopa');




    tinymce.create('tinymce.plugins.cincopa', {init: function (ed, url) {
            var s = ed.settings;
            theurl = url;
        },
        createControl: function (n, cm) {
            switch (n) {
                case 'cincopa':
                    var c = cm.createSplitButton('cincopa', {
                        title: tinymce.activeEditor.getLang('cincopa.buttontitle', 0),
                        image: theurl + '/img/cincopa2.png',
                        onclick: function () {
                            tiny = tinyMCE.activeEditor.windowManager.open({
                                //url: 'http://www.cincopa.com/media-platform/start.aspx',
                                url: theurl + '/html/cincopa.html',
                                width: screen.width - 200,
                                height: screen.height - 200,
                                inline: 1
                            }, {
                                custom_param: 1
                            });
                        }
                    });
                    c.onRenderMenu.add(function (c, m) {
                        $.getJSON("https://www.cincopa.com/media-platform/my-galleries-getlist?disable_editor=true?callback=?", function (result) {
                            if (result.response.error) {
                                m.add({title: tinymce.activeEditor.getLang('cincopa.loginorregister', 0), 'class': 'mceMenuItemTitle'}).setDisabled(1);
                                m.add({title: tinymce.activeEditor.getLang('cincopa.login', 0), onclick: function () {
                                        window.open("https://www.cincopa.com/login.aspx","_blank");
                                    }});
                                m.add({title: tinymce.activeEditor.getLang('cincopa.register', 0), onclick: function () {
                                        window.open('https://www.cincopa.com/register.aspx',"_blank");
                                    }});
                            } else {
                                if (result.response.items_data.folders_count == 0) {
                                    tinyMCE.activeEditor.windowManager.open({
                                        url: 'http://www.cincopa.com/media-platform/start.aspx',
                                        width: screen.width - 200,
                                        height: screen.height - 200,
                                        inline: 1
                                    }, {
                                        custom_param: 1
                                    });
                                } else {
                                    for (var i = 0; i < result.response.folders.length; i++) {
                                        var did = result.response.folders[i].sysdata.did;
                                        var obj={id:result.response.folders[i].sysdata.did ,title: result.response.folders[i].sysdata.name + '(id:' + result.response.folders[i].sysdata.did + ')<br> Modified:' + result.response.folders[i].sysdata.modified, onclick: function (e) {
                                                tinymce.activeEditor.execCommand('mceInsertContent', false, "[cincopa " +  this.id + "]");
                                            }}
                                        m.add(obj);
                                    }
                                }
                            }
                        });
                    });
                    // Return the new splitbutton instance
                    return c;
            }
            return null;
        }
    });
    // Register plugin
    tinymce.PluginManager.add('cincopa', tinymce.plugins.cincopa);
})();
