import { describe, it, expect } from 'vitest';

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function pxToRem(px: number, base = 16): number {
  return Number((px / base).toFixed(4));
}

function remToPx(rem: number, base = 16): number {
  return Number((rem * base).toFixed(2));
}

describe('Developer Tools Converters', () => {
  it('converts RGB to HEX correctly', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
    expect(rgbToHex(139, 92, 246)).toBe('#8b5cf6');
  });

  it('converts PX to REM correctly with base 16px', () => {
    expect(pxToRem(16, 16)).toBe(1);
    expect(pxToRem(24, 16)).toBe(1.5);
    expect(pxToRem(32, 16)).toBe(2);
    expect(pxToRem(12, 16)).toBe(0.75);
  });

  it('converts REM to PX correctly', () => {
    expect(remToPx(1.5, 16)).toBe(24);
    expect(remToPx(2, 16)).toBe(32);
  });
});

