$(document).ready(function () {

    function fadeWrap() {
        let scrollPos = window.pageYOffset || document.documentElement.scrollLeft;
        if(scrollPos > 300) {
            $("#scroll-left").show();
        }
        else {
            $("#scroll-left").hide();
        }
    }
    
});