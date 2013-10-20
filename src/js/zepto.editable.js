
$.fn.editable = function(onsave) {

  var el = this;
  var inEdit = false;
  var value = $(el).text();

  $(el)
    .on('mouseenter', function() {
      if (inEdit) return;
      $(el).addClass('editable');
    })
    .on('mouseleave', function() {
      if (inEdit) return;
      $(el).removeClass('editable');
    })
    .on('click', function(){
      if (inEdit) return;
      inEdit = true;

      $(el).empty().removeClass('editable');
      var $input = $("<input/>")
        .val(value)
        .appendTo($(this))
        .focus()
        .select();

      var saveHandler = function() {
        if ( !inEdit ) return;
        inEdit = false;
        $(el).text(value = $input.val());
        onsave && onsave(value);
      };

      $input.on('blur', saveHandler);
      $input.on('keydown', function(e) {
        if ( e.keyCode === 13 ) {
          saveHandler();
        } else if ( e.keyCode === 27 ) {
          inEdit = false;
          $(el).text(value);
        }
      });
    });
};

