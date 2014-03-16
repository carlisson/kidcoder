
var CommandLine = new Class({
  entry: false,
  historyID: false,
  command: function() {return;},
  history: [],
  actual: -1,
  initialize: function(id, comm) {
    this.entry = $(id);
    this.command = comm;
  },
  setHistory: function(his) {
    this.historyID = his;
  },
  print: function(msg) {
    if (this.historyID) {
      if ($$("#" + this.historyID + " li").length > 9) {
        $$("#" + this.historyID + " li")[0].destroy();
      }
      $(this.historyID).adopt(new Element("li").appendText(msg));
    }
  },
  build: function() {
    this.entry.addEvent("keypress", function(k) {
      if (k.key == "enter") {
        var c = this.entry.get("value");
        this.print(">>> " + c);
        this.history.unshift(c);
        this.actual = -1;
        var s = this.command(c);
        if (s !== "")
          this.print("    " + s);
        this.entry.set("value", "");
      } else if ((k.key == "up") && (k.shift === false)) {
        if (this.actual < this.history.length -1) {
          this.actual++;
          this.entry.set("value", this.history[this.actual]);
        } else {
          this.entry.highlight("#ff0000");
        }
      } else if ((k.key == "down") && (k.shift === false)) {
        if (this.actual > -1) {
          this.actual--;
          this.entry.set("value", this.history[this.actual]);
        } else {
          this.entry.highlight("#ff0000");
        }
      }
    }.bind(this));
  }
});
