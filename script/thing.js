
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
