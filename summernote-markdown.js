
(function (factory) {
  'use strict';
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals: jQuery
    factory(jQuery);
  }
}(function ($) {
  'use strict';

var md = window.markdownit();

var $preview = $('<div />');

$.extend($.summernote.plugins, {
    /**
     * @param {Object} context - context object has status of editor.
     */
    'markdown': function (context) {
        var self = this;

        // ui has renders to build ui elements.
        //  - you can create a button with `ui.button`
        var ui = $.summernote.ui;


        function togglePreview(status){

            var layout = context.layoutInfo;
            var icon = $('.fa-mkpreview',layout.toolbar);
            if(status){
                self.isPreview = true;
                self.lastCode = context.code();

                context.invoke('codeview.deactivate');

                icon.addClass('glyphicon-eye-close');
                icon.removeClass('glyphicon-eye-open');
            }else{
                self.isPreview = false;
                context.code(self.lastCode);

                layout.codable.hide();
                context.invoke('codeview.activate');
                layout.codable.show();

                icon.addClass('glyphicon-eye-open');
                icon.removeClass('glyphicon-eye-close');
            }

            icon.closest('.note-btn-group').find('.disabled').removeAttr('disabled').removeClass('disabled');
            context.layoutInfo.editable.removeAttr('contenteditable');
        }

        self.isPreview = false;

        context.memo('button.markdown', function () {
            // create button
            var button = ui.button({
                contents: '<i class="glyphicon fa-mkpreview" />',
                tooltip: '预览',
                click: function () {
                    togglePreview(!self.isPreview);

                    var res = md.render(context.code());
                    context.layoutInfo.editable.html(res);
                }
            });

            var button2 = ui.button({
                contents: '<i class="glyphicon glyphicon-info-sign" />',
                tooltip: 'Markdown语法',
                click: function () {
                    window.open('https://daringfireball.net/projects/markdown/syntax');
                }
            });

            var button2_ele = button2.render();
            // context.layoutInfo.toolbar.append(button2_ele);

            // create jQuery object from button instance.
            var $hello = button.render();



            context.layoutInfo.codable.on('change',function(){
                 context.triggerEvent('change',context.code());
             });

            setTimeout(function(){
                togglePreview(false);
            },0);


            return $hello.add(button2_ele);
        });

        // This events will be attached when editor is initialized.
        this.events = {
            // This will be called after modules are initialized.
            'summernote.init': function (we, e) {
                self.lastCode = context.code();
                // $preview.html(md.render(layoutInfo.holder().code()));
                // console.log('summernote initialized', we, e);
            },
            // This will be called when user releases a key on editable.
            'summernote.keyup': function (we, e) {
                console.log('summernote keyup', we, e);
            }
        };



    }
  });
}));
