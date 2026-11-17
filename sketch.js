let bottles = [];
let fragrance;
let hoveredBottle = null;

function setup() {
  createCanvas(720, 540);
  textFont("Pretendard");

  fragrance = new FragranceSystem();

  const baseY = height - 120;

  bottles = [
    new PerfumeBottle(width * 0.2, baseY, {
      name: "로즈",
      typeLabel: "하트 파티클",
      kind: "heart",
      color: { r: 255, g: 110, b: 170 },
    }),
    new PerfumeBottle(width * 0.5, baseY, {
      name: "마린",
      typeLabel: "물방울 파티클",
      kind: "drop",
      color: { r: 110, g: 185, b: 255 },
    }),
    new PerfumeBottle(width * 0.8, baseY, {
      name: "루미에르",
      typeLabel: "반짝임 파티클",
      kind: "sparkle",
      color: { r: 255, g: 210, b: 95 },
    }),
  ];
}

function draw() {
  drawBackground();

  hoveredBottle = null;
  for (const bottle of bottles) {
    bottle.updateHover();
    if (bottle.hover) hoveredBottle = bottle;
  }

  for (const bottle of bottles) {
    bottle.display();
  }

  fragrance.run();

  // 마우스를 누르고 있는 동안 계속 향기가 분사됨
  if (mouseIsPressed && hoveredBottle) {
    hoveredBottle.hold();
    fragrance.spray(hoveredBottle, 2);
  }

  cursor(hoveredBottle ? HAND : ARROW);

  drawHint();
}

function drawBackground() {
  const ctx = drawingContext;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#181226");
  gradient.addColorStop(0.55, "#0e0b16");
  gradient.addColorStop(1, "#07060c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 향수병이 놓이는 선반
  const shelfY = height - 106;
  noStroke();
  fill(255, 255, 255, 8);
  rect(0, shelfY, width, height - shelfY);
  stroke(255, 255, 255, 20);
  strokeWeight(1);
  line(0, shelfY, width, shelfY);

  // 선반 위 은은한 반사
  noStroke();
  for (let i = 0; i < bottles.length; i++) {
    const bottle = bottles[i];
    fill(bottle.color.r, bottle.color.g, bottle.color.b, 10);
    ellipse(bottle.x, shelfY + 26, 190, 26);
  }
}

function drawHint() {
  push();
  textAlign(CENTER, TOP);
  noStroke();

  fill(255, 255, 255, 150);
  textSize(15);
  text("향수병을 클릭하면 향기가 퍼져요", width / 2, 34);

  fill(255, 255, 255, 90);
  textSize(12);
  text("분홍은 하트, 파랑은 물방울, 노랑은 반짝임", width / 2, 58);
  pop();
}

function bottleAt(px, py) {
  for (const bottle of bottles) {
    if (bottle.contains(px, py)) return bottle;
  }
  return null;
}

function mousePressed() {
  const bottle = bottleAt(mouseX, mouseY);
  if (!bottle) return;

  bottle.trigger();
  fragrance.spray(bottle, bottle.kind === "sparkle" ? 30 : 24);
}
