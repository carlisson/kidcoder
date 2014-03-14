
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
