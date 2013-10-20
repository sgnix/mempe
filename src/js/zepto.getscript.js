;(function($){
    var loaded = {};
    if ( $.hasOwnProperty('getScript') ) return;

    $.getScript = function (url, success, error) {

        if ( loaded[url] ) return success();
        loaded[url] = true;

        var script = document.createElement("script"),
            $script = $(script);
        script.src = url;

        $("head").append(script);
        $script.bind("load", success);
        $script.bind("error", error);
    };

})(Zepto);
