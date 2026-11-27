// Interactive 3D Rotating Wireframe Model of the 10-Nozzle Manual Push Seed Planter
interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  a: number;
  b: number;
  accent?: boolean;
}

export function initSpecsCanvas(canvas: HTMLCanvasElement | null): () => void {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let angle = -0.55;
  const targetSpeed = 0.008;
  let hoverBoost = 0;
  let isDragging = false;
  let lastPointerX = 0;
  let rafId = 0;

  const verts: Vec3[] = [];
  const edges: Edge[] = [];

  const addVert = (x: number, y: number, z: number): number => {
    verts.push({ x, y, z });
    return verts.length - 1;
  };

  const addEdge = (a: number, b: number, accent = false) => {
    edges.push({ a, b, accent });
  };

  // 1. Main Seed Drum Wheel (centered at cx=0.22, cy=-0.26, radius=0.42, halfWidth=0.14)
  const drumCx = 0.22;
  const drumCy = -0.26;
  const drumR = 0.42;
  const drumZ = 0.14;
  const ringSegs = 20;
  const frontRing: number[] = [];
  const backRing: number[] = [];
  const axleF = addVert(drumCx, drumCy, drumZ + 0.04);
  const axleB = addVert(drumCx, drumCy, -drumZ - 0.04);
  addEdge(axleF, axleB, true);

  for (let i = 0; i < ringSegs; i++) {
    const theta = (i / ringSegs) * Math.PI * 2;
    const vx = drumCx + Math.cos(theta) * drumR;
    const vy = drumCy + Math.sin(theta) * drumR;
    frontRing.push(addVert(vx, vy, drumZ));
    backRing.push(addVert(vx, vy, -drumZ));
  }

  for (let i = 0; i < ringSegs; i++) {
    const next = (i + 1) % ringSegs;
    addEdge(frontRing[i], frontRing[next]);
    addEdge(backRing[i], backRing[next]);
    addEdge(frontRing[i], backRing[i]);
    if (i % 4 === 0) {
      addEdge(axleF, frontRing[i]);
      addEdge(axleB, backRing[i]);
    }
  }

  // 2. 10 Bionic Duckbill Planting Nozzles around the Seed Drum
  const nozzleCount = 10;
  for (let i = 0; i < nozzleCount; i++) {
    const theta = (i / nozzleCount) * Math.PI * 2;
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const tipR = drumR + 0.17;
    const baseSpan = 0.065;

    const tip = addVert(drumCx + cosT * tipR, drumCy + sinT * tipR, 0);
    const b1 = addVert(
      drumCx + Math.cos(theta - baseSpan) * drumR,
      drumCy + Math.sin(theta - baseSpan) * drumR,
      0.055
    );
    const b2 = addVert(
      drumCx + Math.cos(theta - baseSpan) * drumR,
      drumCy + Math.sin(theta - baseSpan) * drumR,
      -0.055
    );
    const b3 = addVert(
      drumCx + Math.cos(theta + baseSpan) * drumR,
      drumCy + Math.sin(theta + baseSpan) * drumR,
      0
    );

    addEdge(b1, tip, true);
    addEdge(b2, tip, true);
    addEdge(b3, tip, true);
    addEdge(b1, b2, true);
  }

  // 3. Seed Storage Hopper Box (above & behind drum center)
  const hTopY = 0.62;
  const hMidY = 0.34;
  const hBotY = 0.14;
  const hX1 = -0.18;
  const hX2 = 0.24;
  const hZ = 0.15;

  const ht1 = addVert(hX1, hTopY, hZ);
  const ht2 = addVert(hX2, hTopY, hZ);
  const ht3 = addVert(hX2, hTopY, -hZ);
  const ht4 = addVert(hX1, hTopY, -hZ);

  const hm1 = addVert(hX1 + 0.03, hMidY, hZ * 0.85);
  const hm2 = addVert(hX2 - 0.02, hMidY, hZ * 0.85);
  const hm3 = addVert(hX2 - 0.02, hMidY, -hZ * 0.85);
  const hm4 = addVert(hX1 + 0.03, hMidY, -hZ * 0.85);

  const hb1 = addVert(0.0, hBotY, 0.07);
  const hb2 = addVert(0.14, hBotY, 0.07);
  const hb3 = addVert(0.14, hBotY, -0.07);
  const hb4 = addVert(0.0, hBotY, -0.07);

  // Hopper wireframe edges (accented)
  addEdge(ht1, ht2, true);
  addEdge(ht2, ht3, true);
  addEdge(ht3, ht4, true);
  addEdge(ht4, ht1, true);

  addEdge(hm1, hm2, true);
  addEdge(hm2, hm3, true);
  addEdge(hm3, hm4, true);
  addEdge(hm4, hm1, true);

  addEdge(ht1, hm1, true);
  addEdge(ht2, hm2, true);
  addEdge(ht3, hm3, true);
  addEdge(ht4, hm4, true);

  addEdge(hm1, hb1, true);
  addEdge(hm2, hb2, true);
  addEdge(hm3, hb3, true);
  addEdge(hm4, hb4, true);

  addEdge(hb1, hb2, true);
  addEdge(hb2, hb3, true);
  addEdge(hb3, hb4, true);
  addEdge(hb4, hb1, true);

  // 4. Rear Soil Compaction Roller Wheel
  const rearCx = -0.46;
  const rearCy = -0.46;
  const rearR = 0.21;
  const rearZ = 0.14;
  const rearSegs = 14;
  const rearF: number[] = [];
  const rearB: number[] = [];
  const rAxleF = addVert(rearCx, rearCy, rearZ + 0.02);
  const rAxleB = addVert(rearCx, rearCy, -rearZ - 0.02);
  addEdge(rAxleF, rAxleB);

  for (let i = 0; i < rearSegs; i++) {
    const theta = (i / rearSegs) * Math.PI * 2;
    const vx = rearCx + Math.cos(theta) * rearR;
    const vy = rearCy + Math.sin(theta) * rearR;
    rearF.push(addVert(vx, vy, rearZ));
    rearB.push(addVert(vx, vy, -rearZ));
  }

  for (let i = 0; i < rearSegs; i++) {
    const next = (i + 1) % rearSegs;
    addEdge(rearF[i], rearF[next]);
    addEdge(rearB[i], rearB[next]);
    addEdge(rearF[i], rearB[i]);
  }

  // Chassis linkage rails between drum axle and rear compaction roller
  addEdge(axleF, rAxleF);
  addEdge(axleB, rAxleB);

  // 5. Twin Angled Push Handles & Top T-Bar Grip
  const handleBaseF = addVert(-0.04, -0.14, 0.11);
  const handleBaseB = addVert(-0.04, -0.14, -0.11);
  const handleTopF = addVert(-0.84, 0.92, 0.09);
  const handleTopB = addVert(-0.84, 0.92, -0.09);
  const handleCrossF = addVert(-0.42, 0.36, 0.1);
  const handleCrossB = addVert(-0.42, 0.36, -0.1);

  const gripL = addVert(-0.84, 0.92, -0.28);
  const gripR = addVert(-0.84, 0.92, 0.28);

  addEdge(axleF, handleBaseF);
  addEdge(axleB, handleBaseB);
  addEdge(handleBaseF, handleTopF);
  addEdge(handleBaseB, handleTopB);
  addEdge(handleCrossF, handleCrossB);
  addEdge(gripL, gripR, true);

  // Support brace from hopper frame to push handles
  addEdge(hm1, handleCrossF);
  addEdge(hm4, handleCrossB);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const onEnter = () => {
    hoverBoost = 0.015;
  };
  const onLeave = () => {
    hoverBoost = 0;
    isDragging = false;
  };
  const onPointerDown = (e: PointerEvent) => {
    isDragging = true;
    lastPointerX = e.clientX;
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPointerX;
    lastPointerX = e.clientX;
    angle += dx * 0.012;
  };
  const onPointerUp = () => {
    isDragging = false;
  };

  const parent = canvas.parentElement;
  parent?.addEventListener('pointerenter', onEnter);
  parent?.addEventListener('pointerleave', onLeave);
  parent?.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const draw = () => {
    resize();
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const strokeMain = isDark
      ? 'rgba(239, 243, 241, 0.34)'
      : 'rgba(17, 22, 20, 0.28)';
    const strokeAccent = isDark
      ? 'rgba(104, 152, 114, 0.9)'
      : 'rgba(61, 87, 64, 0.9)';

    const isRtl = document.documentElement.dir === 'rtl';
    const cx = isRtl ? w * 0.30 : w * 0.67;
    const cy = h * 0.50;
    const scale = Math.min(w, h) * 0.44;

    if (!prefersReduced && !isDragging) {
      angle += targetSpeed + hoverBoost;
    }

    const cosY = Math.cos(angle);
    const sinY = Math.sin(angle);
    const pitch = 0.28;
    const cosX = Math.cos(pitch);
    const sinX = Math.sin(pitch);

    const projected: { x: number; y: number }[] = new Array(verts.length);
    for (let i = 0; i < verts.length; i++) {
      const v = verts[i];
      // Rotate around Y axis
      const x1 = v.x * cosY - v.z * sinY;
      const z1 = v.x * sinY + v.z * cosY;
      // Pitch slightly around X axis for isometric-like 3D depth
      const y2 = v.y * cosX - z1 * sinX;
      const z2 = v.y * sinX + z1 * cosX;
      const persp = 3.6 / (3.6 - z2);

      projected[i] = {
        x: cx + x1 * scale * persp,
        y: cy - y2 * scale * persp,
      };
    }

    ctx.lineWidth = Math.max(1.2, w / 440);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const p1 = projected[e.a];
      const p2 = projected[e.b];
      ctx.beginPath();
      ctx.strokeStyle = e.accent ? strokeAccent : strokeMain;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    if (!prefersReduced) {
      rafId = requestAnimationFrame(draw);
    }
  };

  rafId = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(rafId);
    parent?.removeEventListener('pointerenter', onEnter);
    parent?.removeEventListener('pointerleave', onLeave);
    parent?.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('resize', resize);
  };
}
