
app.PasteCollection = Backbone.Collection.extend({
  model: app.PasteModel,

  initialize: function() {
    this.on('remove', this._remove, this);
  },

  _remove: function(model) {
    app.storage.remove(model.get('id'));
    if (model.view) {
      model.view.$el.remove();
    }
  }
});

app.ListPasteView = Backbone.View.extend({
  tagName: 'li',
  className: 'box',

  events: {
    "click .navigate": "navigate",
    "click .remove": "askRemove"
  },

  initialize: function() {
    this.model.view = this;
    this.model.on('change', this.render, this);
  },

  render: function() {
    this.$el.html(app.jst.pasteListView({m:this.model}));
    this.$("pre").code(this.model, {
      lines: false,
      compress: true,
      length: app.snippetLen
    });
    return this;
  },

  navigate: function() {
    app.router.navigate(this.model.url(), {trigger:true});
  },

  askRemove: function() {
    var _this = this;
    app.confirm({
      el: this.$('strong'),
      onYes: function() {
        app.pasteCollection.remove(_this.model);
      }
    });
  }
});

app.ListView = app.Pane.extend({
  el: "#list",

  events: {
    'click .edit': 'edit',
    'click .save': 'save',
    'click .cancel': 'cancel'
  },

  initialize: function() {
    this.rendered = false;
    this.inEdit = false;
    this.collection.on('add', this.add, this);
    this.collection.on('reset', this.render, this);
  },

  _addView: function(model) {
    var view = new app.ListPasteView({ model: model }).render();
    view.$el.appendTo(this.$('.boxen'));
  },

  render: function() {
    var _this = this;
    this.$el.html(app.jst.listView());
    this.collection.each(function(model) {
      _this._addView(model);
    });
    this.rendered = true;
    return this;
  },

  add: function(model) {
    var id = app.storage.set(model.toJSON());
    model.set({ id: id });

    if ( model.get('title') === null )
      model.set({ title: "untitled" + id });

    if ( this.rendered )
      this._addView(model);
  },

  edit: function() {
    if ( this.inEdit ) {
      this.$(".boxen").show();
      this.$(".editor").hide();
    } else {
      this.$(".boxen").hide();
      this.$(".editor").show().find('textarea').val( app.storage.stringify() );
    }
    this.inEdit = !this.inEdit;
  },

  save: function() {
    this.$('.error').hide();
    if ( this.$('textarea').val() ) {
      try {
        app.storage.reset(this.$('textarea').val());
      } catch (e) {
        this.$('.error').text(e.message).show();
        return;
      }
      this.inEdit = false;
      this.collection.reset( app.storage.collection() );
    }
  },

  cancel: function() {
    this.$('.error').hide();
    this.$('textarea').val(app.storage.stringify());
  }
});

