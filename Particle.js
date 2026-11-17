class Particle {
    constructor(position) {
        // 물뿌리개 주둥이에서 앞쪽으로 물이 뿜어져 나온다
        this.acceleration = createVector(0, 0.03);
        this.velocity = createVector(random(3.5, 4.8), random(-0.8, 0.2));
        this.position = position.copy();
        this.lifespan = 255;
    }

    run() {
        this.update();
        this.display();
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        // 꽃에 닿으면 물방울이 스며들며 사라진다
        if (this.position.y > 265 && this.position.x > 515) {
            this.lifespan -= 45;
        } else {
            this.lifespan -= 1;
        }
    }

    display() {
        noStroke();
        fill(120, 190, 255, this.lifespan);
        ellipse(this.position.x, this.position.y, 7, 9);
    }

    isDead() {
        return this.lifespan < 0;
    }
}



// // A simple Particle class
// let Particle = function(position) {
//   this.acceleration = createVector(0, 0.05);
//   this.velocity = createVector(random(-1, 1), random(-1, 0));
//   this.position = position.copy();
//   this.lifespan = 255;
// };

// Particle.prototype.run = function() {
//   this.update();
//   this.display();
// };

// // Method to update position
// Particle.prototype.update = function(){
//   this.velocity.add(this.acceleration);
//   this.position.add(this.velocity);
//   this.lifespan -= 2;
// };

// // Method to display
// Particle.prototype.display = function() {
//   stroke(200, this.lifespan);
//   strokeWeight(2);
//   fill(127, this.lifespan);
//   ellipse(this.position.x, this.position.y, 12, 12);
// };

// // Is the particle still useful?
// Particle.prototype.isDead = function(){
//   return this.lifespan < 0;
// };
