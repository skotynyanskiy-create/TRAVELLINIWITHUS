import * as THREE from 'three';

const W = 1024;

/** Rasterize an act title so the shader can press it into the cloth. */
export function makeTitleTexture(title: string, aspect: number): THREE.CanvasTexture {
  const h = Math.round(W / Math.max(aspect, 0.5));
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, h);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const size = Math.min(W / (title.length * 0.62), h * 0.42);
  ctx.font = `italic 500 ${size}px Fraunces, serif`;
  ctx.filter = 'blur(1.5px)'; // soft press, not laser-cut
  ctx.fillText(title, W / 2, h / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
