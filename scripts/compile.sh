#!/bin/bash

DIR=src

uglifyjs \
    $DIR/js/zepto.js \
    $DIR/js/zepto.editable.js \
    $DIR/js/zepto.getscript.js \
    $DIR/js/zepto.code.js \
    $DIR/js/underscore.js \
    $DIR/js/backbone.js \
    $DIR/js/app.js \
    $DIR/js/utils.js \
    $DIR/js/storage.js \
    $DIR/js/connection.js \
    $DIR/js/mvc/model.js \
    $DIR/js/mvc/message.js \
    $DIR/js/mvc/edit.js \
    $DIR/js/mvc/code.js \
    $DIR/js/mvc/list.js \
    $DIR/js/mvc/settings.js \
    -m -c --screw-ie8 \
    > code.js

lessc -x $DIR/css/mempe.less > style.css
lessc -x $DIR/css/prettify.css >> style.css
lessc -x $DIR/css/theme.css >> style.css
