import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  RotateCw,
  ExternalLink,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useElementlyData } from '../../hooks/useElementlyData';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

interface DevicePreset {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  width: number;
  height: number;
}

const PRESETS: DevicePreset[] = [
  { id: 'mobile-sm', name: 'Mobile (iPhone SE)', icon: Smartphone, width: 375, height: 667 },
  { id: 'mobile-lg', name: 'Mobile (iPhone 14 Pro)', icon: Smartphone, width: 393, height: 852 },
  { id: 'tablet', name: 'Tablet (iPad Mini)', icon: Tablet, width: 768, height: 1024 },
  { id: 'tablet-lg', name: 'Tablet (iPad Pro 11")', icon: Tablet, width: 834, height: 1194 },
  { id: 'laptop', name: 'Laptop (MacBook Air)', icon: Laptop, width: 1280, height: 800 },
  { id: 'desktop', name: 'Desktop (Full HD)', icon: Monitor, width: 1920, height: 1080 },
];

export const ResponsiveInspector: React.FC = () => {
  const { t } = useI18n();
  const { pageOverview } = useElementlyData();

  const [selectedWidth, setSelectedWidth] = useState(375);
  const [selectedHeight, setSelectedHeight] = useState(667);
  const [isRotated, setIsRotated] = useState(false);

  const curW = isRotated ? selectedHeight : selectedWidth;
  const curH = isRotated ? selectedWidth : selectedHeight;

  const handleApplyPreset = (preset: DevicePreset) => {
    setSelectedWidth(preset.width);
    setSelectedHeight(preset.height);
    setIsRotated(false);
  };

  const handleRotate = () => {
    setIsRotated(!isRotated);
  };

  const openResizedWindow = () => {
    if (typeof chrome !== 'undefined' && chrome.windows) {
      chrome.windows.getCurrent((win) => {
        if (win.id) {
          chrome.windows.update(win.id, { width: curW, height: curH });
        }
      });
    } else {
      window.open(pageOverview.url, '_blank', `width=${curW},height=${curH}`);
    }
  };

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span>{t('responsive.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">{t('responsive.subtitle')}</p>
      </div>

      {/* Current Dimensions Card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Target Dimensions
            </span>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" onClick={handleRotate} title={t('responsive.rotate')}>
                <RotateCw className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              </Button>
              <Badge variant="brand" className="text-xs font-mono">
                {curW} × {curH}px
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-500 dark:text-zinc-400 block mb-1">
                {t('responsive.currentWidth')}
              </label>
              <Input
                type="number"
                value={curW}
                onChange={(e) => setSelectedWidth(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 dark:text-zinc-400 block mb-1">
                {t('responsive.currentHeight')}
              </label>
              <Input
                type="number"
                value={curH}
                onChange={(e) => setSelectedHeight(Number(e.target.value))}
              />
            </div>
          </div>

          <Button
            size="sm"
            onClick={openResizedWindow}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Resize Browser Window</span>
          </Button>
        </CardContent>
      </Card>

      {/* Device Presets List */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
          {t('responsive.presets')}
        </h3>

        <div className="grid grid-cols-1 gap-2">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedWidth === preset.width && selectedHeight === preset.height;

            return (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600/10 dark:bg-violet-500/15 border-violet-500/40 text-violet-900 dark:text-violet-200 shadow-xs'
                    : 'bg-white dark:bg-[#10121a]/90 hover:bg-slate-50 dark:hover:bg-[#141724] border-slate-200 dark:border-white/[0.07]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.06] flex items-center justify-center text-slate-700 dark:text-zinc-300">
                    <Icon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-zinc-200 block">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">
                      {preset.width} × {preset.height}px
                    </span>
                  </div>
                </div>

                <Badge variant={isSelected ? 'brand' : 'default'}>
                  {preset.width < 768 ? 'Mobile' : preset.width < 1200 ? 'Tablet' : 'Desktop'}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
