
var Thing = new Class({
	size: [50, 50],  
	crop: [0, 0],
	cropSize: [0, 0],
	pos: [100, 100],
	velocity: [0, 0],
	layer: 10,
	maxVelocity: 50,
	reflexion: 1,
	friction: 0.98,
	color: "#ff0000",
	element: false,
	iterates: [],
	animateControl: false,
	addIterate: function(f) {
		this.iterates.push(f);
	},
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
	update: function() {
		this.velocity[0] *= this.friction;
		this.velocity[1] *= this.friction;
		var x = this.pos[0] + this.velocity[0];
		if (x < 0) {
			x = 0;
			this.velocity[0] *= -1 * this.reflexion;
		} else if (x > 400 - this.size[0]) {
			x = 400 - this.size[0];
			this.velocity[0] *= -1 * this.reflexion;
		}
		var y = this.pos[1] + this.velocity[1];
		if (y < 0) {
			y = 0;
			this.velocity[1] *= -1 * this.reflexion;
		} else if (y > 300 - this.size[1]) {
			y = 300 - this.size[1];
			this.velocity[1] *= -1 * this.reflexion;
		}
		this.pos = [x, y];
		if (this.style == "sprite") {
			
			var opcrop = (this.crop[0] === 0) ? "0 " : "-" + (this.crop[0] * this.size[0]) + "px ";
			opcrop += (this.crop[1] === 0) ? "0": (this.crop[1] * this.size[1]) + "px";
			this.element.setStyle("background-position", opcrop);
		} else {
			this.element.setStyle("background-color", this.color);
		}
		this.element.setStyle("top", this.pos[1]);
		this.element.setStyle("left", this.pos[0]);
		this.iterates.each(function (i) {
			i();
		});
	},
	initialize: function(domid, style) {
		this.element = new Element("div", {"class": style});
		this.style = style;
		$(domid).adopt(this.element);
	},
	setImage: function(img, width, height, cols, rows) {
		this.element.setStyle("background-repeat", "no-repeat");
		this.element.setStyle("background-image", "url(" + img + ")");
		this.element.setStyle("width", width);
		this.element.setStyle("height", height);
		this.cropSize = [cols, rows];
		this.size = [width, height];
	},
	setCrop: function(x, y) {
		if ((x < this.cropSize[0]) && (y < this.cropSize[1])) {
			this.crop = [x, y];
		}
	},
	collision: function(other) {
		return ((this.pos[0] < other.pos[0] + other.size[0]) &&
			(this.pos[0] + this.size[0] > other.pos[0]) &&
			(this.pos[1] < other.pos[1] + other.size[1]) &&
			(this.pos[1] + this.size[1] > other.pos[1]));
	},
	animate: function() {
		this.element.setStyle("z-index", this.layer);
		this.animateControl = window.setInterval(function() {
			this.update();
		}.bind(this), 100);
	},
	stopAnimation: function() {
		window.clearInterval(this.animateControl);
	}
});
