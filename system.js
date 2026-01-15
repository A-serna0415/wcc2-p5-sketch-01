class System {
  constructor(x, y, bass = 0, treble = 0, level = 0) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.num = 50;
    this.done = false;

    // The isFinite function checks whether the variable contains a finite numeric value
    // so it can be translate to another value using map without an error.

    // This is a shorter way to write a conditional in JavaScript
    // Sytx: condition ? exprIfTrue : exprIfFalse.
    let bassVal = isFinite(bass) ? bass : 0;
    let mult = map(bassVal, 0, 255, 0.3, 1.5);

    for (let i = 0; i < this.num; i++) {
      let p = new Particle(this.x, this.y);
      p.acc = p5.Vector.mult(p.baseAcc, mult);
      this.particles.push(p);
    }
  }

  update(bass, treble, level) {
    this.isDead();

    // Same logic as with the bassVal variable.
    let levelVal = isFinite(level) ? level : 0;
    let trebleVal = isFinite(treble) ? treble : 0;

    let accelFactor = map(levelVal, 0, 0.3, 0.8, 1.4);
    accelFactor = constrain(accelFactor, 0.1, 3);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];

      // Breathing-like scaling of acceleration
      p.acc = p5.Vector.mult(p.baseAcc, accelFactor);

      // Subtle color shift with treble
      p.hueValue += map(trebleVal, 0, 255, 0, 5);

      // Particles subtly drawn toward or away from the center (breathing motion)
      let toCenter = createVector(width / 2 - p.pos.x, height / 2 - p.pos.y);
      toCenter.normalize();
      toCenter.mult(map(levelVal, 0, 0.3, -0.5, 0.5)); // Negative pulls inward, Positive pushes outward
      p.vel.add(toCenter);

      p.update();

      if (p.done) this.particles.splice(i, 1);
    }
  }

  show() {
    // “for…of” loop to iterates through all the particles inside the 'p' array
    // Is a shorter more clean version of a for loop
    for (let p of this.particles) p.show();
  }

  isDead() {
    this.done = (this.particles.length === 0);
  }
}