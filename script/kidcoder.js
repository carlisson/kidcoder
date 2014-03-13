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
      if ($$("#" + this.historyID + " li").length > 7) {
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

var Thing = new Class({
  size: [5, 5],  
  pos: [100, 100],
  velocity: [0, 0],
  layer: 10,
  maxVelocity: 50,
  friction: 0.98,
  color: "#ff0000",
  element: false,
  accel: function(vx, vy) {
    if ((this.velocity[0] + vx > this.maxVelocity) || (this.velocity[0] + vx < -20))
      this.velocity[0] *= -1;
    else
      this.velocity[0] += vx;
    if ((this.velocity[1] + vy > this.maxVelocity) || (this.velocity[1] + vy < -20))
      this.velocity[1] *= -1;
    else
      this.velocity[1] += vy;
  },
  stop: function() {
    this.velocity = [0, 0];
    this.element.highlight();
  },
  update: function() {console.log();
    this.velocity[0] *= this.friction;
    this.velocity[1] *= this.friction;
    var x = this.pos[0] + this.velocity[0];
    if (x < 0) {
      x = 0;
      this.velocity[0] *= -1;
    } else if (x > 400 - this.size[0]) {
      x = 400 - this.size[0];
      this.velocity[0] *= -1;
    }
    var y = this.pos[1] + this.velocity[1];
    if (y < 0) {
      y = 0;
      this.velocity[1] *= -1;
    } else if (y > 300 - this.size[1]) {
      y = 300 - this.size[1];
      this.velocity[1] *= -1;
    }
    this.pos = [x, y];
    this.element.setStyle("background-color", this.color);
    this.element.setStyle("top", this.pos[1]);
    this.element.setStyle("left", this.pos[0]);
  },
  initialize: function(domid, style) {
    this.element = new Element("div", {"class": style});
    $(domid).adopt(this.element);
  },
  collision: function(other) {
    return ((this.pos[0] < other.pos[0] + other.size[0]) &&
        (this.pos[0] + this.size[0] > other.pos[0]) &&
        (this.pos[1] < other.pos[1] + other.size[1]) &&
        (this.pos[1] + this.size[1] > other.pos[1]));
  },
  animate: function() {
    this.element.setStyle("z-index", this.layer);
    window.setInterval(function() {
      this.update();
    }.bind(this), 100);
  }
});

document.addEvent("domready", function() {
  var ball = new Thing("arena", "ball");
  var rect = new Thing("arena", "rect");
  rect.size = [50, 50];
  rect.color = "#ffff00";
  rect.friction = 1;
  rect.pos = [100, 300];
  rect.velocity = [3, 0];
  rect.layer = 5;
  ball.animate();
  rect.animate();
  var ballStage = new CodeStage();
  ballStage.addCommand("left", function(args) {
    ball.accel(-3, 0);
  }, "Movimenta a bola para a esquerda");
  ballStage.addCommand("right", function(args) {
    ball.accel(3, 0);
  }, "Movimenta a bola para a direita");
  ballStage.addCommand("up", function(args) {
    ball.accel(0, -3);
  }, "Movimenta a bola para cima");
  ballStage.addCommand("down", function(args) {
    ball.accel(0, 3);
  }, "Movimenta a bola para baixo");
  ballStage.addCommand("stop", function(args) {
    ball.stop();
  }, "Para a bola imediatamente");
  ballStage.addCommand("shot", function(args) {
    if (ball.collision(rect)){ 
      $("arena").highlight(rect.color);
      cline.print("Bom trabalho!");
    } else {
      $("arena").highlight(ball.color);
    }
  }, "Dispara um tiro no alvo");
  ballStage.setVar("azul", "#0000ff");
  ballStage.setVar("vermelho", "#ff0000");
  ballStage.setVar("verde", "#00ff00");
  ballStage.setVar("branco", "#ffffff");
  ballStage.setVar("preto", "#000000");
  ballStage.addCommand("chcolor", function(args) {
    console.log(args);
    ball.color = args[0];
  }, "Muda a cor da bola");
  ballStage.buildHelp("help");
  var cline = new CommandLine("command", function(c) {
    return ballStage.exec(c);
  });
  cline.setHistory("history");
  cline.build();
});
