// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

$(document).ready(function() {
    // call the tablesorter plugin
//    $("table").tablesorter({
//        // set forced sort on the fourth column and i decending order.
//        sortForce: [[0,0]]
//    });

//    $('button').onclick(function(){
//        this.closest('.urlFt')
//    });

//    var copy_sel = $('a');
//
//    // Disables other default handlers on click (avoid issues)
//    copy_sel.on('click', function(e) {
//        e.preventDefault();
//    });

    // Apply clipboard click event
    $('button').clipboard({
        path: '/jquery.clipboard.swf',

        copy: function() {
            var this_sel = $(this);
            // Return text in closest element (useful when you have multiple boxes that can be copied)
            return this_sel.closest('.urlFt').text();
        }
    });


});

