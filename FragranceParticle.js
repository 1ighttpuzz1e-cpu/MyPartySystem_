// 향수에서 퍼져 나가는 향기 입자
// kind: "heart" (하트), "drop" (물방울), "sparkle" (반짝임)
class FragranceParticle {
  constructor(origin, color, kind) {
    this.kind = kind;
    this.color = color;

    this.position = origin.copy();
    this.position.x += random(-5, 5);
    this.position.y += random(-4, 4);

    this.velocity = createVector(random(-1.8, 1.8), random(-2.0, -0.9));
    this.acceleration = createVector(0, 0);

    this.maxLifespan = random(70, 125);
    this.lifespan = this.maxLifespan;
    this.age = 0;

    // 향기의 투명도는 40~60% 사이에서 시작해 40%까지 서서히 옅어짐
    this.alpha = random(0.4, 0.6);

    this.noiseOffset = random(1000);
    this.phase = random(TWO_PI);

    if (kind === "heart") {
      this.size = random(9, 14);
    } else if (kind === "drop") {
      this.size = random(7, 12);
    } else {
      this.size = random(6, 11);
    }
  }

  run() {
    this.update();
    this.display();
  }

  update() {
    this.age++;
    this.lifespan--;

    const t = this.age * 0.01;

    if (this.kind === "heart") {
      // 하트는 두근거리며 위로 떠오름
      this.velocity.y -= 0.008;
      this.velocity.x += map(noise(this.noiseOffset, t), 0, 1, -0.05, 0.05);
      this.velocity.mult(0.986);
    } else if (this.kind === "drop") {
      // 물방울은 살짝 튀어 올랐다가 다시 떨어지는 궤적
      this.velocity.y += 0.022;
      this.velocity.x += map(noise(this.noiseOffset, t), 0, 1, -0.04, 0.04);
      this.velocity.mult(0.989);
    } else {
      // 반짝임은 위로 빠르게 흩어지며 반짝임
      this.velocity.y -= 0.012;
      this.velocity.x += sin(this.age * 0.08 + this.phase) * 0.035;
      this.velocity.mult(0.978);
    }

    // 너무 빠르게 솟구쳐 화면 밖으로 사라지지 않도록 속도를 제한
    this.velocity.y = constrain(this.velocity.y, -1.8, 4);

    this.position.add(this.velocity);
  }

  display() {
    // 남은 수명에 따라 40~60% 범위 안에서 투명도가 변함
    const life = constrain(this.lifespan / this.maxLifespan, 0, 1);
    const alpha = lerp(0.4, this.alpha, life) * 255;
    const shrink = life < 0.25 ? life / 0.25 : 1;

    let scaleFactor = 1;
    let rotation = 0;

    if (this.kind === "heart") {
      rotation = sin(this.age * 0.05 + this.phase) * 0.35;
    } else if (this.kind === "drop") {
      rotation = sin(this.age * 0.06 + this.phase) * 0.2;
    } else {
      rotation = this.age * 0.02;
      scaleFactor = 0.6 + 0.4 * abs(sin(this.age * 0.18 + this.phase));
    }

    const s = this.size * shrink * scaleFactor * (0.9 + 0.2 * (1 - life));

    push();
    translate(this.position.x, this.position.y);
    rotate(rotation);

    // p5 2.x에서는 bezierVertex 도형 렌더링이 불안정해서 캔버스 컨텍스트로 직접 그립니다.
    const ctx = drawingContext;

    if (this.kind === "heart") {
      this.drawHeart(ctx, s, alpha);
    } else if (this.kind === "drop") {
      this.drawDrop(ctx, s, alpha);
    } else {
      // 빛 파티클은 더하기 혼합으로 은은하게 빛나 보이게 함
      const previousOperation = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "lighter";
      this.drawSparkle(ctx, s, alpha);
      ctx.globalCompositeOperation = previousOperation;
    }

    pop();
  }

  drawHeart(ctx, s, alpha) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.9);
    ctx.bezierCurveTo(-s * 1.15, s * 0.05, -s * 0.75, -s * 0.95, 0, -s * 0.35);
    ctx.bezierCurveTo(s * 0.75, -s * 0.95, s * 1.15, s * 0.05, 0, s * 0.9);
    ctx.closePath();
    ctx.fillStyle = this.rgba(alpha);
    ctx.fill();
  }

  drawDrop(ctx, s, alpha) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.15);
    ctx.bezierCurveTo(
      s * 0.55, -s * 0.5,
      s * 0.8, s * 0.15,
      s * 0.55, s * 0.65
    );
    ctx.bezierCurveTo(
      s * 0.3, s * 1.05,
      -s * 0.3, s * 1.05,
      -s * 0.55, s * 0.65
    );
    ctx.bezierCurveTo(
      -s * 0.8, s * 0.15,
      -s * 0.55, -s * 0.5,
      0, -s * 1.15
    );
    ctx.closePath();
    ctx.fillStyle = this.rgba(alpha);
    ctx.fill();

    // 물방울 하이라이트
    ctx.beginPath();
    ctx.ellipse(-s * 0.18, s * 0.15, s * 0.17, s * 0.26, 0, 0, TWO_PI);
    ctx.fillStyle = this.rgba(alpha * 0.35, 255, 255, 255);
    ctx.fill();
  }

  drawSparkle(ctx, s, alpha) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.2);
    ctx.bezierCurveTo(s * 0.16, -s * 0.35, s * 0.35, -s * 0.16, s * 1.2, 0);
    ctx.bezierCurveTo(s * 0.35, s * 0.16, s * 0.16, s * 0.35, 0, s * 1.2);
    ctx.bezierCurveTo(-s * 0.16, s * 0.35, -s * 0.35, s * 0.16, -s * 1.2, 0);
    ctx.bezierCurveTo(-s * 0.35, -s * 0.16, -s * 0.16, -s * 0.35, 0, -s * 1.2);
    ctx.closePath();
    ctx.fillStyle = this.rgba(alpha);
    ctx.fill();

    // 반짝이는 십자 빛
    ctx.beginPath();
    ctx.moveTo(-s * 1.55, 0);
    ctx.lineTo(s * 1.55, 0);
    ctx.moveTo(0, -s * 1.55);
    ctx.lineTo(0, s * 1.55);
    ctx.strokeStyle = this.rgba(alpha * 0.4, 255, 255, 255);
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // 투명도를 0~255가 아닌 0~1 비율로 받아 rgba 문자열로 변환
  rgba(alpha, r = this.color.r, g = this.color.g, b = this.color.b) {
    return `rgba(${r}, ${g}, ${b}, ${(alpha / 255).toFixed(3)})`;
  }

  isDead() {
    return this.lifespan < 0;
  }
}
