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


;(function($){
    var loaded = {};
    if ( $.hasOwnProperty('getStyle') ) return;

    $.getStyle = function (url, success, error) {

        var style = document.createElement("link"),
            $style = $(style);
        style.href = url;
        style.type = "text/css";
        style.rel = "stylesheet";

        $("head").append(style);
        $style.bind("load", function() { success(style) });
        $style.bind("error", error);
    };

})(Zepto);

