
app.CodeView = app.Pane.extend({
  el: "#code",

  events: {
    "change select": "setSyntax",
    "click .fork": "fork",
    "click .raw": "raw",
    "click .remove": "askRemove"
  },

  renderText: function() {
    this.$("pre").code(this.model);
  },

  render: function() {
    this.$el.html( app.jst.codeView({m: this.model}) );
    this.renderText();

    // If own paste, then make the title editable and allow
    // for selecting syntax
    if ( app.ownPaste ) {
      var _this = this;
      this.$('.title').editable(function(title) {
        _this.model.set('title', title);
      });

      this.$('.syntax').html(app.jst.syntaxView({m: this.model}));
    }

    return this;
  },

  setSyntax: function() {
    this.model.set('syntax', this.$("select").val());
    this.renderText();
  },

  fork: function(e) {
    e.stopPropagation();
    var json = this.model.toJSON();
    delete json.id;
    delete json.created;
    var paste = new app.PasteModel(json);
    app.pasteCollection.add(paste);
    app.router.navigate(paste.url(), {trigger: true});
  },

  raw: function(e) {
    e.stopPropagation();
    if ( !this.rawDisplay ) {
      var text = this.model.get('text');
      this.$('pre').text(text);
      this.rawDisplay = true;
    } else {
      this.renderText();
      this.rawDisplay = false;
    }
  },

  askRemove: function() {
    var _this = this;
    app.confirm({
      el: this.$('.remove'),
      message: "",
      onYes: function() {
        app.pasteCollection.remove(_this.model);
        app.router.navigate('list', {trigger: true});
      }
    });
  }

});
