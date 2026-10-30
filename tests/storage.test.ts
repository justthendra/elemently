import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../src/services/storage-service';

describe('StorageService', () => {
  beforeEach(async () => {
    await StorageService.clearAllData();
  });

  it('loads default settings when storage is empty', async () => {
    const settings = await StorageService.getSettings();
    expect(settings).toBeDefined();
    expect(settings.theme).toBe('dark');
    expect(settings.density).toBe('comfortable');
    expect(settings.accentColor).toBe('#8b5cf6');
  });

  it('saves and retrieves updated settings', async () => {
    await StorageService.saveSettings({ theme: 'light', density: 'compact' });
    const updated = await StorageService.getSettings();
    expect(updated.theme).toBe('light');
    expect(updated.density).toBe('compact');
  });

  it('manages favorite colors', async () => {
    const favs = await StorageService.getFavorites();
    expect(favs.colors).toEqual([]);

    const newFavs = {
      ...favs,
      colors: [
        {
          hex: '#8b5cf6',
          rgb: 'rgb(139, 92, 246)',
          rgba: 'rgba(139, 92, 246, 1)',
          hsl: 'hsl(258, 90%, 66%)',
          hsla: 'hsla(258, 90%, 66%, 1)',
          types: ['background' as const],
          count: 5,
          contrastWithWhite: 3.8,
          contrastWithBlack: 5.5,
        },
      ],
    };

    await StorageService.saveFavorites(newFavs);
    const loaded = await StorageService.getFavorites();
    expect(loaded.colors.length).toBe(1);
    expect(loaded.colors[0].hex).toBe('#8b5cf6');
  });

  it('exports and imports backup data correctly', async () => {
    await StorageService.saveSettings({ theme: 'light' });
    const exportedJSON = await StorageService.exportAllData();
    expect(exportedJSON).toContain('"theme": "light"');

    await StorageService.clearAllData();
    const cleared = await StorageService.getSettings();
    expect(cleared.theme).toBe('dark'); // default

    const imported = await StorageService.importData(exportedJSON);
    expect(imported).toBe(true);

    const restored = await StorageService.getSettings();
    expect(restored.theme).toBe('light');
  });
});

