// Fatal error
app.fatal = function(message) {
  return function() {
    app.message.set({
      type: "error",
      name: "CUSTOM",
      args: { message: message }
    })
    .trigger('show');
  }
};

app.formatText = function(text) {
  var lines = text.split(/\n/);
  var min = 65535;
  for ( var i = 0; i < lines.length; i++ ) {
    if ( !lines[i].match(/\S/) ) {
      lines[i] = "";
      continue;
    }
    var match = lines[i].match(/^(\s+)/);
    if (match) {
      min = Math.min(min, match[1].length);
    } else {
      min = 0;
      break;
    }
  }
  var trimmedLines = _(lines).map(function(line) {
    return line.substr(min, line.length - min);
  });
  return trimmedLines.join("\n").replace(/^\n+/, '').replace(/\s*$/, '');
};

app.confirm = function(opts) {
  var $el = $(opts.el);

  _.defaults(opts, {
    message : "Are you sure?",
    yes     : "delete",
    cancel  : "cancel",
    onYes   : function() {},
    onCancel: function() {}
  });

  var saveHtml     = $el.html(),
      yesButton    = $("<button/>").text(opts.yes).addClass('yes'),
      cancelButton = $("<button/>").text(opts.cancel).addClass('cancel');

  var click = function(callback) {
    return function(e) {
      e.stopPropagation();
      $el.html(saveHtml);
      callback();
    }
  };

  yesButton.on('click', click(opts.onYes));
  cancelButton.on('click', click(opts.onCancel));

  $el.html( opts.message ).append(yesButton).append(cancelButton);
};

app.loadPaste = function(name, id, onSuccess) {

  function error(name) {
    app.message.set({
      type: "error",
      name: name
    }).trigger('show');
  }

  if (name === app.identity()) {
    var paste = app.pasteCollection.findWhere({
      id: parseInt(id)
    });
    if (paste) {
      onSuccess(paste);
    } else {
      error("LOCAL_NOT_FOUND");
    }
  } else {
    app.connection.request("fetch", {
      name: name,
      id: id
    }, function(doc) {
      if (!doc.error) {
        doc.name = name;
        var paste = new app.PasteModel(doc);
        onSuccess(paste);
      } else {
        error(doc.error);
      }
    });
  }
};

app.identity = function(value) {
  var name;
  if ( typeof value !== "undefined" ) {
    localStorage.setItem(app.identityKey, name = value);
  } else {
    name = localStorage.getItem(app.identityKey);
  }
  return name;
};

app.settings = function(value) {
  if ( typeof value === "object"  ) {
    localStorage.setItem(app.settingsKey, JSON.stringify(value));
  } else {
    value = {};
    try {
      value = JSON.parse(localStorage.getItem(app.settingsKey)) || {};
    } catch (e) {
      console.error("Can't parse settings");
    }
    _.defaults(value, app.settingsDefaults);
  }

  return value;
};

app.toggleLights = function() {
  var settings = app.settings();
  if (app.darkness) {
    $(app.darkness).remove();
    app.darkness = null;
    settings.dark = false;
    app.settings(settings);
  } else {
    $.getStyle("dark.css", function(e) {
      app.darkness = e;
      settings.dark = true;
      app.settings(settings);
    });
  }
};
