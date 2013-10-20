
app.MessageModel = Backbone.Model.extend({
  defaults: {
    type: "error",
    name: null,
    args: {}
  }
});

app.MessageView = app.Pane.extend({
  el: "#message",

  initialize: function() {
    this.model.on('show', this.update, this);
  },

  update: function() {
    this.render().show();
  },

  render: function() {
    var model = this.model.toJSON();
    this.$el.removeClass().addClass(model.type);
    this.$el.html( app.jst[model.type + "_" + model.name](model.args || {}) );
    return this;
  }
});

