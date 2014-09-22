$(window).ready(function () {
    var $window = $(window);
    var $body = $('body');
    var moreThanMin = false;

    function onScroll() {

        var topWindow = $window.scrollTop();
        $('#info').text(topWindow);
        var mtm = topWindow > 10;

        if (moreThanMin !== mtm) {
            moreThanMin = mtm;

            if (mtm) {
                $body.addClass("scrolling");
                //$('#logo2').css('display','block');
            } else {
                $body.removeClass("scrolling");
                //$('#logo2').css('display','none');
            }
        }
    }


    onScroll();

    function onResize() {
        var $v = $('.video');
        if ($v.length) {
            var newHeight = ($(window).width() * 9 / 16);
            var maxHeight = $(window).height() - $v.offset().top - 60;
            newHeight = Math.min(newHeight, maxHeight);
            $v.height(newHeight);
            $v.width(newHeight * 16 / 9);
        }
    }

    $(window).resize(onResize);

    $window.scroll(onScroll);
    $('body').addClass('loading');
    $(window).load(function () {
        $('body').removeClass('loading');
    });

    onResize();
    
});