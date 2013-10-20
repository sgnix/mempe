
$.fn.code = function(model, opts) {
  var $el = this;
  opts = opts || {};

  _.defaults(opts, {
    lines: true,
    compress: false,
    length: 0
  });

  var spaces = Array(app.tabSpaces + 1).join(" ");

  var text = model.get('text').replace(/\t/g, spaces);
  var syntax = model.get('syntax');

  // Compress multiple new lines into one
  if ( opts.compress ) {
    text = text.replace(/\n\s*\n/g, '\n');
  }

  // Trim the text, if length is specified
  if ( opts.length && text.length > opts.length ) {
    text = text.substr(0, opts.length) + "\n...";
  }

  // Set the text
  if ( !syntax || !app.styles[syntax] ) return $el.text(text);

  var callback = function() {
    var html = prettyPrintOne( _.escape(text), syntax, opts.lines );
    $el.html(html);
  }

  var fileName = app.styles[syntax][1];
  if (fileName) {
    $.getScript("syntax/" + fileName, callback);
  } else {
    callback();
  }
};
