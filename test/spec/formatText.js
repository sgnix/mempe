describe("formatText", function() {
  it("removes heading new lines", function() {
    var text = "\n\n\n\n\nfoo";
    expect(app.formatText(text)).toEqual("foo");
  });

  it("removes heading new lines with spaces", function() {
    var text = "\n      \n      \n      \n  \nfoo";
    expect(app.formatText(text)).toEqual("foo");
  });

  it("does not remove the heading spaces of the first line", function() {
    var text = "\n      \n      \n      \n  \n   foo\nbar";
    expect(app.formatText(text)).toEqual("   foo\nbar");
  });

  it("removes the trailing new lines", function() {
    var text = "bar\n\n\n";
    expect(app.formatText(text)).toEqual("bar");
  });

  it("removes the trailing spaces", function() {
    var text = "bar      ";
    expect(app.formatText(text)).toEqual("bar");
  });

  it("removes the trailing new lines and spaces", function() {
    var text = "bar      \n   \n   \n";
    expect(app.formatText(text)).toEqual("bar");
  });

  it("evens out all lines to the smallest heading space", function() {
    expect(app.formatText("  a\n b")).toEqual(" a\nb");
    expect(app.formatText("   a\n b")).toEqual("  a\nb");
    expect(app.formatText("   a\n  b")).toEqual(" a\nb");
  });

});
