describe("storageReset", function() {
  var arr;

  beforeEach(function() {
    arr = [
      {id:1, text:"text1", title: "title1"},
      {id:2, text:"text2", title: "title2"}
    ];
  });

  it("doesn't take a hash", function() {
    expect(function(){
      app.storage.reset("{}");
    }).toThrow();
  });
  it("doesn't take a string", function() {
    expect(function(){
      app.storage.reset("abs");
    }).toThrow();
  });
  it("doesn't take a number", function() {
    expect(function(){
      app.storage.reset(3);
    }).toThrow();
  });

  it("can't have elements that are not hashes", function() {
    expect(function(){
      arr.push(3);
      app.storage.reset(JSON.stringify(arr));
    }).toThrow();
  });
  it("can't have repeating ids", function() {
    expect(function(){
      arr[1].id = 1;
      app.storage.reset(JSON.stringify(arr));
    }).toThrow();
  });

  var fields = ['id', 'title', 'text'];
  for ( var i = 0; i < fields.length; i++) {
    var fld = fields[i];
    it("must have a " + fld, function() {
      expect(function(){
        delete arr[1][fld];
        app.storage.reset(JSON.stringify(arr));
      }).toThrow();
    });
  }

  it("works well if everything is ok", function() {
    expect(function(){
      app.storage.reset(JSON.stringify(arr));
    }).not.toThrow();
  });
});
