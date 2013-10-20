
app.EditView = app.Pane.extend({
  el: "#edit",

  events: {
    "click button": "save"
  },

  initialize: function() {
    this.$textarea = this.$('textarea');
  },

  show: function() {
    app.Pane.prototype.show.call(this);
    this.$textarea.focus();
  },

  save: function() {
    var text = app.formatText(this.$textarea.val());
    if ( text !== "" ) {
      this.$textarea.val('');
      var paste = new app.PasteModel({ text: text });
      app.pasteCollection.add(paste);
      app.router.navigate(paste.url(), {trigger: true});
    }
  }
});
