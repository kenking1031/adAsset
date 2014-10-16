/**
 * Created with JetBrains RubyMine.
 * User: USCal-XJiang
 * Date: 10/15/14
 * Time: 10:10 PM
 * To change this template use File | Settings | File Templates.
 */


$(document).ready(function()

    {

        var clientTarget = new ZeroClipboard($('.buttonFt'),{
            moviePath: "http://www.paulund.co.uk/playground/demo/zeroclipboard-demo/zeroclipboard/ZeroClipboard.swf",
            debug: false
            }
        );

        clientTarget.on( "load", function(clientTarget)
                {
                    $('#flash-loaded').fadeIn();

                    clientTarget.on( "dataRequested", function(clientTarget, args) {
                        clientTarget.setText( args.text );
                        $(this).css('backgroundColor','#ccc');
                        $(this).parent().find('.msg_box').fadeIn();
                        _self = $(this);
                        setTimeout(function(){_self.parent().find('.msg_box').fadeOut();},1500);
                    } );
                }
        );

    });

