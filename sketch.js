let system;
let spout;
let canPos;
let following = false;
let clouds = [];
let butterflies = [];

const BUTTERFLY_COLORS = [
  [255, 200, 120],
  [255, 150, 180],
  [170, 210, 255],
];

function setup() {
  createCanvas(720, 400);
  // 물뿌리개 몸통의 중심
  canPos = createVector(135, 235);
  // 물뿌리개 주둥이 끝에서 물이 나온다
  spout = createVector(canPos.x + 90, canPos.y - 42);
  system = new ParticleSystem(spout);

  // 천천히 흘러가는 구름
  for (let i = 0; i < 4; i++) {
    clouds.push({
      x: random(-100, width),
      y: random(40, 170),
      scale: random(0.7, 1.4),
      speed: random(0.15, 0.4),
    });
  }

  // 날아다니는 나비
  for (let i = 0; i < 4; i++) {
    butterflies.push({
      x: random(120, width - 100),
      y: random(80, 220),
      phase: random(TWO_PI),
      speed: random(0.7, 1.3),
      size: random(12, 18),
      color: random(BUTTERFLY_COLORS),
    });
  }
}

function draw() {
  background(51);

  updateClouds();
  drawClouds();
  drawButterflies();

  drawFlowerBed();
  followMouse();
  drawWateringCan();

  system.addParticle();
  system.run();
}

// 마우스를 움직이면 물뿌리개가 그쪽으로 따라온다
function mouseMoved() {
  following = true;
}

function mouseDragged() {
  following = true;
}

function followMouse() {
  if (!following) return;

  canPos.x = lerp(canPos.x, constrain(mouseX, 70, width - 120), 0.15);
  canPos.y = lerp(canPos.y, constrain(mouseY, 90, height - 70), 0.15);

  // 물이 나오는 위치도 물뿌리개를 따라간다
  spout.set(canPos.x + 90, canPos.y - 42);
  system.origin.set(spout.x, spout.y);
}

function updateClouds() {
  for (let c of clouds) {
    c.x += c.speed;
    if (c.x > width + 140) {
      c.x = -160;
      c.y = random(40, 170);
    }
  }
}

function drawClouds() {
  noStroke();
  fill(76, 87, 104);
  for (let c of clouds) {
    push();
    translate(c.x, c.y);
    scale(c.scale);
    ellipse(0, 0, 130, 48);
    ellipse(-45, 6, 80, 38);
    ellipse(45, 8, 90, 40);
    ellipse(-8, -18, 80, 50);
    ellipse(32, -12, 60, 42);
    pop();
  }
}

function drawButterflies() {
  for (let b of butterflies) {
    b.x += sin(frameCount * 0.012 * b.speed + b.phase) * 1.1 + 0.25;
    b.y += cos(frameCount * 0.017 * b.speed + b.phase) * 0.7;
    b.y = constrain(b.y, 70, 250);

    if (b.x > width + 40) b.x = -40;
    if (b.x < -40) b.x = width + 40;

    let flap = 0.35 + abs(sin(frameCount * 0.25 + b.phase)) * 0.65;
    let tilt = sin(frameCount * 0.01 * b.speed + b.phase) * 0.4;

    push();
    translate(b.x, b.y);
    rotate(tilt);
    noStroke();

    // 더듬이
    stroke(70);
    strokeWeight(1.5);
    line(0, -b.size * 0.5, -b.size * 0.3, -b.size * 1.1);
    line(0, -b.size * 0.5, b.size * 0.3, -b.size * 1.1);
    noStroke();

    // 날개
    fill(b.color);
    ellipse(-b.size * 0.5 * flap, -b.size * 0.35, b.size * 0.9, b.size * 1.1);
    ellipse(b.size * 0.5 * flap, -b.size * 0.35, b.size * 0.9, b.size * 1.1);
    ellipse(-b.size * 0.4 * flap, b.size * 0.35, b.size * 0.7, b.size * 0.8);
    ellipse(b.size * 0.4 * flap, b.size * 0.35, b.size * 0.7, b.size * 0.8);

    // 몸통
    fill(70);
    ellipse(0, 0, b.size * 0.26, b.size * 1.1);

    pop();
  }
}

function drawWateringCan() {
  push();
  translate(canPos.x, canPos.y);

  // 손잡이
  noFill();
  stroke(190, 200, 210);
  strokeWeight(9);
  arc(0, -37, 72, 62, PI, TWO_PI);

  // 주둥이
  strokeWeight(15);
  line(15, -30, 90, -42);

  // 주둥이 끝(물이 나오는 곳)
  noStroke();
  fill(190, 200, 210);
  ellipse(90, -42, 18, 18);

  // 몸통
  ellipse(0, 0, 115, 100);

  pop();
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
