
app.PasteModel = Backbone.Model.extend({
  defaults: {
    id: undefined,
    title: null,
    text: "",
    syntax: null,
    password: null,
    created: new Date()
  },

  initialize: function() {
    this.on('change', this.store, this);
  },

  app: function() {
    return app;
  },

  store: function() {
    if ( this.isOwn() ) {
      app.storage.set(this.toJSON());
    }
  },

  title: function( maxLen ) {
    var value = this.get('title');
    if ( !maxLen ) return value;
    return value.length > maxLen ? value.substr(0, maxLen) + "..." : value;
  },

  url: function() {
    return "#" + app.identity() + "/" + this.get('id');
  },

  syntax: function() {
    var syntax = this.get('syntax');
    return syntax && app.styles[syntax] ? app.styles[syntax][0] : null;
  },

  created: function() {
    return (new Date(this.get('created'))).toLocaleString();
  },

  isOwn: function() {
    return !this.has('name');
  }

});

