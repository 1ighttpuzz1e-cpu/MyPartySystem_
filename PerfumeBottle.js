// 캔버스 위에 놓이는 향수병
// kind: "heart" (분홍), "drop" (파랑), "sparkle" (노랑)
class PerfumeBottle {
  constructor(x, baseY, config) {
    this.x = x;
    this.baseY = baseY;

    this.name = config.name;
    this.typeLabel = config.typeLabel;
    this.kind = config.kind;
    this.color = config.color;

    this.bodyW = 96;
    this.bodyH = 112;
    this.neckW = 24;
    this.neckH = 18;
    this.capW = 34;
    this.capH = 24;

    this.pulse = 0;
    this.hover = false;
  }

  get topY() {
    return this.baseY - this.bodyH - this.neckH - this.capH - 10;
  }

  // 향기가 뿜어져 나오는 분사구 위치
  nozzlePosition() {
    return createVector(this.x, this.topY - 2 - this.pulse * 10);
  }

  contains(px, py) {
    return (
      abs(px - this.x) < this.bodyW / 2 + 14 &&
      py > this.topY - 16 &&
      py < this.baseY + 12
    );
  }

  trigger() {
    this.pulse = 1;
  }

  hold() {
    this.pulse = max(this.pulse, 0.8);
  }

  updateHover() {
    this.hover = this.contains(mouseX, mouseY);
    this.pulse = lerp(this.pulse, 0, 0.06);
  }

  display() {
    const bob = sin(frameCount * 0.02 + this.x * 0.05) * 2;
    const half = this.bodyW / 2;
    const bodyTop = -this.bodyH;
    const lift = this.pulse * 10;
    const scaleFactor = 1 + this.pulse * 0.05;

    push();
    translate(this.x, this.baseY + bob);

    // 바닥 그림자
    noStroke();
    fill(0, 0, 0, 120);
    ellipse(0, 12, this.bodyW * 1.4, 14);
    fill(this.color.r, this.color.g, this.color.b, this.hover ? 46 : 26);
    ellipse(0, 10, this.bodyW * 1.15, 10);

    scale(scaleFactor);

    // 목 부분
    noStroke();
    fill(255, 255, 255, 18);
    rect(-this.neckW / 2, bodyTop - this.neckH, this.neckW, this.neckH + 6, 3);
    noFill();
    stroke(255, 255, 255, 42);
    strokeWeight(1);
    rect(-this.neckW / 2, bodyTop - this.neckH, this.neckW, this.neckH + 6, 3);

    // 금장 고리
    noStroke();
    fill(206, 174, 120);
    rect(-this.neckW / 2 - 4, bodyTop - this.neckH - 2, this.neckW + 8, 6, 3);
    fill(238, 215, 172, 200);
    rect(-this.neckW / 2 - 4, bodyTop - this.neckH - 2, this.neckW + 8, 2, 1);

    // 뚜껑 (분사할 때 살짝 들림)
    const capTop = bodyTop - this.neckH - this.capH - lift;
    fill(203, 170, 116);
    rect(-this.capW / 2, capTop, this.capW, this.capH, 6);
    fill(238, 214, 170, 210);
    rect(-this.capW / 2 + 5, capTop + 4, 5, this.capH - 8, 3);
    fill(255, 255, 255, 46);
    rect(-this.capW / 2 + 13, capTop + 4, 2, this.capH - 8, 1);

    // 분사구
    fill(226, 229, 240, 220);
    rect(-4, capTop - 6, 8, 6, 2);

    // 유리병 몸통
    noStroke();
    fill(255, 255, 255, 14);
    rect(-half, bodyTop, this.bodyW, this.bodyH, 22);

    // 향수 액체
    const liquidTop = bodyTop + this.bodyH * 0.32;
    fill(this.color.r, this.color.g, this.color.b, 60);
    rect(-half + 6, liquidTop, this.bodyW - 12, this.bodyH * 0.68 - 6, 16);
    fill(255, 255, 255, 62);
    rect(-half + 10, liquidTop, this.bodyW - 20, 2, 1);

    // 유리 테두리
    noFill();
    stroke(255, 255, 255, this.hover ? 92 : 60);
    strokeWeight(1.4);
    rect(-half, bodyTop, this.bodyW, this.bodyH, 22);

    // 유리 하이라이트
    noStroke();
    fill(255, 255, 255, 34);
    rect(-half + 11, bodyTop + 15, 7, this.bodyH * 0.42, 4);
    fill(255, 255, 255, 18);
    rect(half - 18, bodyTop + 26, 4, this.bodyH * 0.3, 2);

    // 라벨
    const labelY = bodyTop + this.bodyH * 0.5;
    fill(9, 7, 14, 100);
    rect(-27, labelY - 14, 54, 28, 5);
    noFill();
    stroke(255, 255, 255, 55);
    strokeWeight(1);
    rect(-27, labelY - 14, 54, 28, 5);
    noStroke();
    fill(this.color.r, this.color.g, this.color.b, 150);
    ellipse(0, labelY, 9, 9);
    fill(255, 255, 255, 90);
    ellipse(0, labelY, 4, 4);

    pop();

    // 향수병 이름표
    push();
    textAlign(CENTER, TOP);
    noStroke();
    fill(255, 255, 255, this.hover ? 235 : 155);
    textSize(16);
    text(this.name, this.x, this.baseY + 32);
    fill(this.color.r, this.color.g, this.color.b, this.hover ? 235 : 170);
    textSize(12);
    text(this.typeLabel, this.x, this.baseY + 56);
    pop();
  }
}
