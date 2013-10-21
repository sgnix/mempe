
app.SettingsView = app.Pane.extend({
  el: "#settings",

  events: {
    "click button": "update",
  },

  render: function() {
    var settings = app.settings();
    this.$el.html(app.jst.settingsView(settings));
    return this;
  },

  error: function(message) {
    if ( message ) {
      this.$('.error').text(message).show();
    } else {
      this.$('.error').hide();
    }
  },

  update: function() {
    var settings = {
      username: this.$('input[name="username"]').val(),
      tabsize: parseInt(this.$('input[name="tabsize"]').val())
    };

    this.error('');

    if ( !settings.username.match(/^\w{3,15}$/) ) {
      this.error('The username must be 3 - 15 alphanumeric');
      return;
    }

    if ( typeof settings.tabsize !== "number"
      || settings.tabsize < 1
      || settings.tabsize > 8  ) {
      this.error('Tabsize must be 1 to 8');
      return;
    }

    // If the username was changed reload the app
    var reload = settings.username !== app.settings().username;
    app.settings(settings);

    if ( reload ) location.reload();
  }
});
