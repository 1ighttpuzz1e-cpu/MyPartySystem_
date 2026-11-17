let system;
let spout;

function setup() {
  createCanvas(720, 400);
  // 물뿌리개 주둥이 끝에서 물이 나온다
  spout = createVector(225, 193);
  system = new ParticleSystem(spout);
}

function draw() {
  background(51);
  drawFlowerBed();
  drawWateringCan();

  system.addParticle();
  system.run();
}

function drawWateringCan() {
  // 손잡이
  noFill();
  stroke(190, 200, 210);
  strokeWeight(9);
  arc(135, 198, 72, 62, PI, TWO_PI);

  // 주둥이
  strokeWeight(15);
  line(150, 205, spout.x, spout.y);

  // 주둥이 끝(물이 나오는 곳)
  noStroke();
  fill(190, 200, 210);
  ellipse(spout.x, spout.y, 18, 18);

  // 몸통
  ellipse(135, 235, 115, 100);
}

function drawFlowerBed() {
  // 화분
  noStroke();
  fill(160, 100, 70);
  rect(525, 300, 130, 70, 8);

  // 줄기
  stroke(90, 165, 95);
  strokeWeight(5);
  line(560, 300, 555, 250);
  line(590, 300, 585, 225);
  line(620, 300, 615, 255);

  // 꽃
  drawFlower(555, 250, 34, color(240, 130, 165));
  drawFlower(585, 225, 40, color(250, 200, 110));
  drawFlower(615, 255, 34, color(200, 140, 230));
}

function drawFlower(x, y, size, petalColor) {
  noStroke();
  fill(petalColor);
  for (let i = 0; i < 5; i++) {
    let angle = (TWO_PI / 5) * i;
    ellipse(x + cos(angle) * size * 0.55, y + sin(angle) * size * 0.55, size, size);
  }
  fill(255, 235, 150);
  ellipse(x, y, size * 0.5, size * 0.5);
}
