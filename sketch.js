/* 
Sketch02: ParticleMusicSystem
Andrés Serna
10 November 2025

Instructions: 
- Click to pause/start the sketch and music.
- Inside the 'particle.js' class change the color values in the 'show()' method to try different color reactions.
- Inside the preload function you can change the song's name between 01 to 06 on the default playlist.
- Add your own playlist to the 'assets' folder and experiment!

Acknowledgements:
I used the Sound_LoadClip_FFT_Vis code example from class for the audio adaptation.
Tutorial about making a basic particle system using classes or OOP:
https://www.youtube.com/watch?v=QlpadcXok8U
Also the online book 'The Nature of Code' chapter 4 about 'Particle Systems':
https://natureofcode.com/particles/
About 'for...of' loops and shorter if conditionals:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator

I acknowledge the use of ChatGPT (https://chat.openai.com/) from line 65 to 69 in 'sketch.js', and from line 34 to 47
in the class 'system.js' to generate a small piece of code that achieves the 'breathing' effect when the particles react to the music.
I entered the following prompts on 7 November 2025:

- Help me to make this particle system react more organically to a sound input, like a breathing.
*/

// Array to store the particle system.
let ps = [];

// Variables to store song data.
let song, fft, amplitude;
let isPlaying = false;

function preload() {
  // Change song's name between 01 to 06.
  song = loadSound('assets/06.mp3');
}

function setup() {

  // Equation to adapt the canva's size to the web screen.
  createCanvas(windowWidth, windowHeight);

  noStroke();

  fft = new p5.FFT();
  amplitude = new p5.Amplitude();

  textAlign(CENTER);
  textSize(16);
  fill(0);
  text("Click to Play / Pause", width / 2, height / 2);
}

function draw() {
  if (!isPlaying) return;

  background(0);

  // Analyse the song.
  let level = amplitude.getLevel();
  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");
  let treble = fft.getEnergy("treble");

  // Calculate breathing offset based on sound volume.
  let pulse = map(level, 0, 0.3, 0.8, 2.0);

  // The system center “pulses” outward/inward from the screen center.
  let offset = map(sin(frameCount * 0.05), -1, 1, -50, 50) * pulse;

  // Add new particle systems that originate from the moving center.
  let spawnChance = map(level, 0, 0.3, 0.01, 0.3);
  if (random() < spawnChance) {
    ps.push(new System(width / 2 + offset, height / 2 + offset, bass, treble, level, spectrum));
  }

  // Inverse loop equation to avoid errors when the array gets splice
  // This loop draws and remove each particle when is finished through every iteration
  for (let i = ps.length - 1; i >= 0; i--) {
    ps[i].update(bass, treble, level);
    ps[i].show();
    if (ps[i].done) ps.splice(i, 1);
  }
}

// Start/pause sketch when mouse's pressed
function mousePressed() {
  if (!song.isPlaying()) {
    song.loop();
    isPlaying = true;
  } else {
    song.pause();
    isPlaying = false;
  }
}

function keyPressed() {
  //  FULLSCREEN!!!
  if (key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

// Function to resize the canva's size to the web screen responsively.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}