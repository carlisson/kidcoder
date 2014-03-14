var CodeStage = new Class({
  commands: {},
  memory: {},
  commandRE: /^(\w+(?:\w|\d)+)\((.*)?\)$/,
  numberRE: /^((\d+)\.?(\d+)?|\.(\d)+)$/,
  stringRE: /^(\".*\")|(\'.*\')$/,
  initialize: function() {
  },
  addCommand: function(k, fnc, help) {
    this.commands[k] = {
      name: k,
      exec: fnc,
      help: help
    };
  },
  setVar: function(v, val) {
    this.memory[v] = val;
  },
  buildHelp: function(helpID) {
    Object.keys(this.commands).each(function (c) {
      var block = new Element("div");
      block.adopt(new Element("h2").appendText(this.commands[c].name));
      block.adopt(new Element("p").appendText(this.commands[c].help));
      $(helpID).adopt(block);
    }.bind(this));
    if (Object.keys(this.memory).length > 0) {
      var t = new Element("table");
      var tr = new Element("tr");
      tr.adopt(new Element("th").appendText("Variável"));
      tr.adopt(new Element("th").appendText("Valor"));
      t.adopt(tr);
      Object.keys(this.memory).each(function (v) {
        var trv = new Element("tr");
        trv.adopt(new Element("td").appendText(v));
        trv.adopt(new Element("td").appendText(this.memory[v]));
        t.adopt(trv);
      }.bind(this));
      $(helpID).adopt(t);
    }
  },
  exec: function(cmd) {
    var r = this.commandRE.exec(cmd),
        c = "",
        p = [],
        p_final = [],
        p_temp = "",
        str_char = "",
        ch = "",
        i = 0,
        par = "";
    if (r) {
      c = r[1];
      if (r[2]) {
        for (i = 0; i < r[2].length; i++) {
          ch = r[2][i];
          if (str_char === "") {
            if ((ch == "\"") || (ch == "'")) {
              str_char = ch;
              p_temp += ch;
            } else {
              if (ch == ",") {
                p.push(p_temp);
                p_temp = "";
              } else {
                p_temp += ch;
              }
            }
          } else {
            p_temp += ch;
            if (str_char === ch) {
              str_char = "";
            }
          }
        }
      }
      if (str_char === "") {
        if (p_temp !== "") {
          p.push(p_temp);
          p_temp = "";
        }
        for (i = 0; i < p.length; i++) {
          this.stringRE.lastIndex = -1;
          this.numberRE.lastIndex = -1;
          par = p[i].replace(/^\ +/, "").replace(/\ +$/, "");
          if (this.stringRE.test(par)) {
            p_final.push(par.slice(1, par.length -1));
          } else if (this.numberRE.test(par)) {
            if (p[i].indexOf('.') > -1) {
              p_final.push(parseFloat(par));
            } else {
              p_final.push(parseInt(par, 0));
            }
          } else if (Object.keys(this.memory).contains(par)) {
            p_final.push(this.memory[par]);
          } else {
            return "variável desconhecida: " + par;
          }
        }
        if (this.commands[c]) {
          this.commands[c].exec(p_final);
        } else {
          return "Comando desconhecido";
        }
      } else {
        return "Comando mal construído";
      }
    } else {
      return "Comando inválido";
    }
    return "";
  }
});
