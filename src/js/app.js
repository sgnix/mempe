var app = {
  socketPort: 443,
  identityKey: 'name',
  storageKey: 'mempes',
  storageIdKey: 'id',
  settingsKey: 'settings',
  panesEl: '#panes',
  snippetLen: 300,

  // Default values for the settings
  settingsDefaults: {
    username: (Math.floor(new Date().getTime() / 1000)).toString(36),
    tabsize: 2
  },

  styles: {
    c       : ["c/c++", null],
    cs      : ["c#", null],
    java    : ["java", null],
    bash    : ["bash", null],
    python  : ["python", null],
    perl    : ["perl", null],
    ruby    : ["ruby", null],
    js      : ["javascript", null],
    html    : ["html/xml", null],
    apollo  : ["apollo", "lang-apollo.js"],
    basic   : ["basic", "lang-basic.js"],
    coffee  : ["coffeescript", null],
    clj     : ["clojure", "lang-clj.js"],
    css     : ["css", "lang-css.js"],
    dart    : ["dart", "lang-dart.js"],
    erlang  : ["erlang", "lang-erlang.js"],
    go      : ["go", "lang-go.js"],
    hs      : ["haskell", "lang-hs.js"],
    lisp    : ["lisp", "lang-lisp.js"],
    llvm    : ["llvm", "lang-llvm.js"],
    lua     : ["lua", "lang-lua.js"],
    matlab  : ["matlab", "lang-matlab.js"],
    ml      : ["ml", "lang-ml.js"],
    mumps   : ["mumps", "lang-mumps.js"],
    n       : ["n", "lang-n.js"],
    pascal  : ["pascal", "lang-pascal.js"],
    proto   : ["proto", "lang-proto.js"],
    r       : ["r", "lang-r.js"],
    rust    : ["rust", null],
    scala   : ["scala", "lang-scala.js"],
    sql     : ["sql", "lang-sql.js"],
    tcl     : ["tcl", "lang-tcl.js"],
    tex     : ["tex", "lang-tex.js"],
    vb      : ["visual basic", "lang-vb.js"],
    vhdl    : ["vhdl", "lang-vhdl.js"],
    wiki    : ["wiki", "lang-wiki.js"],
    xq      : ["xquery", "lang-xq.js"],
    yaml    : ["yaml", "lang-yaml.js"]
  },

  // Will be set by the router on loading new paste
  ownPaste: false,

  // Bootstrap
  run: function() {

    // Hide all panes in at start
    $(app.panesEl).children().hide();

    // Compile all templates into the app.jst document
    app.jst = {};
    $("script[type='text/template']").each(function() {
      app.jst[$(this).prop("id")] = _.template($(this).text());
    });

    // Save default settings
    app.settings(app.settings());

    // Messages
    app.message = new app.MessageModel();
    new app.MessageView({ model: app.message });

    // Collection of pastes
    app.pasteCollection = new app.PasteCollection(app.storage.collection());

    // DOM initializations
    $(".logo").on("click", function() {
      app.router.navigate("", {trigger: true});
    });

    // Initialize the websocket connection and all the views
    // and event bindings right after
    app.connection = new app.Connection(function() {

      // Views
      app.editView = new app.EditView();
      app.codeView = new app.CodeView();
      app.listView = new app.ListView({ collection: app.pasteCollection });
      app.settingsView = new app.SettingsView();

      // Start router
      Backbone.history.start();

    });
  },

  // Pane management
  Pane: Backbone.View.extend({
    show: function () {
      var _this = this;
      $(app.panesEl).children().each(function() {
        if ( $(this).prop('id') !== _this.$el.prop('id')) {
          $(this).hide();
        }
      });
      this.$el.show();
    }
  }),

  // Router
  router: new (Backbone.Router.extend({
    routes: {
      ""            : "edit",
      ":name/:id"   : "code",
      "list"        : "list",
      "settings"    : "settings",
      "about"       : "about"
    },

    edit: function () {
      app.editView.show();
    },

    code: function (name, id) {
      app.loadPaste(name, id, function(paste) {
        app.codeView.model = paste;
        app.codeView.render().show();
      });
    },

    list: function() {
      if ( !app.pasteCollection.length ) {
        app.message.set({type: "info", name: "NO_PASTES"}).trigger('show');
        return;
      }
      if ( !app.listView.rendered ) {
        app.listView.render();
      }
      app.listView.show();
    },

    settings: function() {
      app.settingsView.render().show();
    },

    about: function() {
      app.message.set({ type: "page", name: "ABOUT" }).trigger('show');
    }
  }))()

};
