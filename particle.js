/* Objects in JavaScripts are created using the word 'class'
follow by the name of the object, in this case 'Particale'
uppercases are a regular convention for the names of the objects.*/

class Particle {
    /*In OOP, constructor is a method
     constructor is the 'blueprint' that defines the basics of an objects.
     Then we can use this blueprint to draw the same object on canvas but we different properties.
     For instance, houses with different color, size or shape.*/
  constructor(x, y) {

    //create a vector object with two parameters, X position and Y position
    // on the canvas. Syntx: createVector(_, _);

    // The variables inside an object method are call 'properties'.
    // Always use the key word 'this.' before the name of the property.

    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.baseAcc = p5.Vector.random2D();
    this.baseAcc.mult(random(0.08));
    this.acc = this.baseAcc.copy();

    //Property to define for how many iterations the particles are gonna stay on canvas.
    this.lifespan = 300;
    this.done = false;

    //Properties to manage the color values.
    this.color = (random(0, 255));
  }

  //Method to update the position and acceleration of the particle.
  update() {
    this.isDead();

    //With .add, we add the values from a vector to another one, in this case velocity.
    // syntx: vector.add(_, _, _); can take 3 arguments: X, Y, Z.
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.lifespan -= random(0.8, 1.8);

    this.color = (this.color + random(1, 2)) % 255
  }

  show() {
    // Drawing the particle on canvas.
    noStroke();
    fill(30, this.color, 227, this.lifespan);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }

  isDead() {
    this.done = (this.lifespan < 0);
  }
}