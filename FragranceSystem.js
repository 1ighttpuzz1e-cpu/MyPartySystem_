// 향수병에서 뿜어져 나온 향기 입자들을 관리하는 시스템
class FragranceSystem {
  constructor() {
    this.particles = [];
    this.maxParticles = 700;
  }

  // 향수병의 분사구에서 count 만큼의 향기 입자를 내보냄
  spray(bottle, count) {
    for (let i = 0; i < count; i++) {
      const origin = bottle.nozzlePosition();
      this.particles.push(
        new FragranceParticle(origin, bottle.color, bottle.kind)
      );
    }

    // 입자가 너무 많아지면 오래된 것부터 정리
    while (this.particles.length > this.maxParticles) {
      this.particles.shift();
    }
  }

  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}
