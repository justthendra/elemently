import { describe, it, expect } from 'vitest';
import { translate, formatNumber } from '../src/locales';

describe('Universal Language System (i18n)', () => {
  it('translates basic keys in English (en-US)', () => {
    expect(translate('en-US', 'app.name')).toBe('Elemently');
    expect(translate('en-US', 'nav.inspector')).toBe('Inspector');
    expect(translate('en-US', 'nav.colors')).toBe('Colors');
  });

  it('translates basic keys in Turkish (tr-TR)', () => {
    expect(translate('tr-TR', 'app.name')).toBe('Elemently');
    expect(translate('tr-TR', 'nav.inspector')).toBe('İnceleyici');
    expect(translate('tr-TR', 'nav.colors')).toBe('Renkler');
    expect(translate('tr-TR', 'nav.typography')).toBe('Tipografi');
  });

  it('interpolates parameters correctly', () => {
    const textEn = translate('en-US', 'inspector.children', { count: 5 });
    expect(textEn).toBe('Children (5)');

    const textTr = translate('tr-TR', 'inspector.children', { count: 3 });
    expect(textTr).toBe('Alt Elementler (3)');
  });

  it('handles pluralization rules', () => {
    const single = translate('en-US', 'common.count', { count: 1 });
    expect(single).toBe('1 item');

    const plural = translate('en-US', 'common.count', { count: 4 });
    expect(plural).toBe('4 items');
  });

  it('falls back to English when a key is missing', () => {
    const fallback = translate('tr-TR', 'non.existent.key');
    expect(fallback).toBe('non.existent.key');
  });

  it('formats numbers according to locale', () => {
    const num = 1250000;
    const formattedEn = formatNumber('en-US', num);
    expect(formattedEn).toContain('1,250,000');
  });
});

