import React, { useEffect, useRef } from 'react';

// Soap bubbles that rise, drift away from the pointer, and pop with a ring and a few droplets.
// Drawn on a canvas so a few dozen iridescent bubbles stay smooth on phones.

const FILM_COLORS = ['#63E2BC', '#9FB8FF', '#C9A8FF', '#FFB8D2', '#F4DFA2', '#63E2BC'];
const POINTER_RADIUS = 130;
const MIN_HIT_RADIUS = 20;

const rand = (min, max) => min + Math.random() * (max - min);

const makeBubble = (width, height, scatter) => {
  const r = 10 + 48 * Math.pow(Math.random(), 1.8);
  return {
    x: rand(r, Math.max(r + 1, width - r)),
    y: scatter ? rand(r, height - r) : height + r + rand(0, 120),
    r,
    vx: 0,
    rise: (40 - r * 0.42) * rand(0.7, 1.15),
    phase: rand(0, Math.PI * 2),
    wobble: rand(0.6, 1.4),
    sway: rand(6, 16),
    born: performance.now() - (scatter ? 10000 : 0),
  };
};

const BubbleField = ({ onPop, className }) => {
  const canvasRef = useRef(null);
  const onPopRef = useRef(onPop);
  onPopRef.current = onPop;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasConic = typeof ctx.createConicGradient === 'function';

    let width = 0;
    let height = 0;
    let bubbles = [];
    let rings = [];
    let drops = [];
    let pointer = null;
    let hovered = null;
    let frame = 0;
    let last = performance.now();

    const targetCount = () => Math.round(Math.min(34, Math.max(12, (width * height) / 24000)));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = targetCount();
      if (bubbles.length === 0) {
        bubbles = Array.from({ length: count }, () => makeBubble(width, height, true));
      } else {
        bubbles = bubbles.filter((b) => b.x < width + b.r);
        while (bubbles.length < count) bubbles.push(makeBubble(width, height, true));
      }
      if (reduceMotion) draw(performance.now());
    };

    const drawBubble = (b, now) => {
      const t = now / 1000;
      const fadeIn = Math.min(1, (now - b.born) / 900);
      const grow = b === hovered ? 1.06 : 1;
      const squash = reduceMotion ? 0 : Math.sin(t * b.wobble * 2 + b.phase) * 0.028;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(grow * (1 + squash), grow * (1 - squash));
      ctx.globalAlpha = fadeIn;

      // Thin film: nearly clear in the middle, catching light at the edge
      const body = ctx.createRadialGradient(-b.r * 0.3, -b.r * 0.35, b.r * 0.1, 0, 0, b.r);
      body.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      body.addColorStop(0.72, 'rgba(170, 220, 255, 0.05)');
      body.addColorStop(1, 'rgba(210, 240, 255, 0.24)');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, Math.PI * 2);
      ctx.fill();

      // Iridescent rim that slowly turns
      let film;
      if (hasConic) {
        film = ctx.createConicGradient(t * 0.35 + b.phase, 0, 0);
        FILM_COLORS.forEach((c, i) => film.addColorStop(i / (FILM_COLORS.length - 1), c));
      } else {
        film = ctx.createLinearGradient(-b.r, -b.r, b.r, b.r);
        FILM_COLORS.forEach((c, i) => film.addColorStop(i / (FILM_COLORS.length - 1), c));
      }
      ctx.strokeStyle = film;
      ctx.globalAlpha = fadeIn * (b === hovered ? 0.85 : 0.55);
      ctx.lineWidth = Math.max(1, b.r * 0.055);
      ctx.beginPath();
      ctx.arc(0, 0, b.r - ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Window highlight and a soft bounce light
      ctx.globalAlpha = fadeIn;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.ellipse(-b.r * 0.4, -b.r * 0.42, b.r * 0.2, b.r * 0.1, -0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath();
      ctx.arc(b.r * 0.42, b.r * 0.46, b.r * 0.07, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, width, height);
      bubbles.forEach((b) => drawBubble(b, now));

      rings.forEach((ring) => {
        const p = ring.age / ring.life;
        ctx.save();
        ctx.globalAlpha = (1 - p) * 0.7;
        ctx.strokeStyle = '#EEF3FA';
        ctx.lineWidth = Math.max(0.75, ring.r * 0.04 * (1 - p));
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r * (1 + p * 0.55), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      drops.forEach((d) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - d.age / d.life);
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      bubbles.forEach((b) => {
        if (pointer) {
          const dx = b.x - pointer.x;
          const dy = b.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < POINTER_RADIUS + b.r) {
            const force = (1 - dist / (POINTER_RADIUS + b.r)) * 220;
            b.vx += (dx / dist) * force * dt;
            b.y += (dy / dist) * force * dt * 0.35;
          }
        }
        b.vx *= 0.94;
        b.x += b.vx * dt + Math.cos(t * b.wobble + b.phase) * b.sway * dt;
        b.y -= b.rise * dt;

        if (b.y < -b.r * 2) Object.assign(b, makeBubble(width, height, false));
        if (b.x < -b.r) b.x = width + b.r;
        if (b.x > width + b.r) b.x = -b.r;
      });

      rings = rings.filter((ring) => (ring.age += dt) < ring.life);
      drops = drops.filter((d) => {
        d.age += dt;
        d.vy += 420 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        return d.age < d.life;
      });

      draw(now);
      frame = requestAnimationFrame(step);
    };

    const toLocal = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const hitTest = (p) => {
      for (let i = bubbles.length - 1; i >= 0; i -= 1) {
        const b = bubbles[i];
        if (Math.hypot(b.x - p.x, b.y - p.y) <= Math.max(b.r, MIN_HIT_RADIUS)) return b;
      }
      return null;
    };

    const pop = (b) => {
      rings.push({ x: b.x, y: b.y, r: b.r, age: 0, life: reduceMotion ? 0.2 : 0.38 });
      if (!reduceMotion) {
        const count = 7 + Math.round(b.r / 6);
        for (let i = 0; i < count; i += 1) {
          const angle = (i / count) * Math.PI * 2 + rand(-0.2, 0.2);
          const speed = rand(70, 190) * (0.6 + b.r / 80);
          drops.push({
            x: b.x + Math.cos(angle) * b.r * 0.8,
            y: b.y + Math.sin(angle) * b.r * 0.8,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 60,
            size: rand(1.1, 2.6),
            age: 0,
            life: rand(0.45, 0.8),
            color: FILM_COLORS[i % FILM_COLORS.length],
          });
        }
      }
      bubbles = bubbles.filter((other) => other !== b);
      // A new bubble rises from below a moment later
      setTimeout(() => {
        if (bubbles.length < targetCount()) bubbles.push(makeBubble(width, height, reduceMotion));
        if (reduceMotion) draw(performance.now());
      }, rand(600, 1600));
      if (navigator.vibrate) navigator.vibrate(8);
      if (onPopRef.current) onPopRef.current();
      if (reduceMotion) {
        draw(performance.now());
        setTimeout(() => draw(performance.now()), 250);
      }
    };

    const handleMove = (e) => {
      pointer = toLocal(e);
      hovered = hitTest(pointer);
      canvas.style.cursor = hovered ? 'pointer' : 'default';
      if (reduceMotion) draw(performance.now());
    };

    const handleLeave = () => {
      pointer = null;
      hovered = null;
    };

    const handleDown = (e) => {
      const hit = hitTest(toLocal(e));
      if (hit) pop(hit);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerleave', handleLeave);
    canvas.addEventListener('pointerdown', handleDown);

    if (reduceMotion) {
      draw(performance.now());
    } else {
      frame = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('pointermove', handleMove);
      canvas.removeEventListener('pointerleave', handleLeave);
      canvas.removeEventListener('pointerdown', handleDown);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default BubbleField;
