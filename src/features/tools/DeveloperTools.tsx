import React, { useState } from 'react';
import {
  Wrench,
  Copy,
  Check,
} from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const DeveloperTools: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'css' | 'convert' | 'utils'>('css');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // 1. Box Shadow Generator State
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(10);
  const [shadowBlur, setShadowBlur] = useState(25);
  const [shadowSpread, setShadowSpread] = useState(-5);
  const [shadowColor, setShadowColor] = useState('rgba(0, 0, 0, 0.4)');
  const [shadowInset, setShadowInset] = useState(false);

  const boxShadowCSS = `box-shadow: ${shadowInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor};`;

  // 2. Border Radius Generator State
  const [rTL, setRTL] = useState(16);
  const [rTR, setRTR] = useState(16);
  const [rBR, setRBR] = useState(16);
  const [rBL, setRBL] = useState(16);

  const borderRadiusCSS = `border-radius: ${rTL}px ${rTR}px ${rBR}px ${rBL}px;`;

  // 3. CSS Gradient Generator State
  const [gradAngle, setGradAngle] = useState(135);
  const [gradColor1, setGradColor1] = useState('#6366f1');
  const [gradColor2, setGradColor2] = useState('#8b5cf6');
  const [gradColor3, setGradColor3] = useState('#d946ef');

  const gradientCSS = `background: linear-gradient(${gradAngle}deg, ${gradColor1} 0%, ${gradColor2} 50%, ${gradColor3} 100%);`;

  // 4. Unit Converter State
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [pxVal, setPxVal] = useState(24);
  const [remVal, setRemVal] = useState(1.5);

  const handlePxChange = (px: number) => {
    setPxVal(px);
    setRemVal(Number((px / baseFontSize).toFixed(4)));
  };

  const handleRemChange = (rem: number) => {
    setRemVal(rem);
    setPxVal(Number((rem * baseFontSize).toFixed(2)));
  };

  // 5. JSON Formatter & Validator State
  const [jsonInput, setJsonInput] = useState('{"name":"Elemently","features":["Inspector","Colors","A11y"]}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const handleMinifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  // 6. Lorem Ipsum State
  const [loremType, setLoremType] = useState<'paragraphs' | 'words'>('paragraphs');
  const [loremCount, setLoremCount] = useState(2);
  const [loremOutput, setLoremOutput] = useState('');

  const generateLorem = () => {
    const words = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'elemently', 'explore', 'every', 'element', 'design', 'toolkit',
    ];

    if (loremType === 'words') {
      const res = Array.from({ length: loremCount }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
      setLoremOutput(res.charAt(0).toUpperCase() + res.slice(1) + '.');
    } else {
      const paras = Array.from({ length: loremCount }, () => {
        return Array.from({ length: 28 }, () => words[Math.floor(Math.random() * words.length)]).join(' ') + '.';
      });
      setLoremOutput(paras.join('\n\n'));
    }
  };

  return (
    <div className="p-3.5 space-y-4 max-w-full">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span>{t('tools.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">{t('tools.subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1 rounded-lg border border-slate-200 dark:border-white/[0.07] text-xs">
        <button
          onClick={() => setActiveTab('css')}
          className={`flex-1 py-1.5 rounded text-center font-medium transition-colors cursor-pointer ${
            activeTab === 'css'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t('tools.tabCss')}
        </button>
        <button
          onClick={() => setActiveTab('convert')}
          className={`flex-1 py-1.5 rounded text-center font-medium transition-colors cursor-pointer ${
            activeTab === 'convert'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t('tools.tabConvert')}
        </button>
        <button
          onClick={() => setActiveTab('utils')}
          className={`flex-1 py-1.5 rounded text-center font-medium transition-colors cursor-pointer ${
            activeTab === 'utils'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {t('tools.tabUtils')}
        </button>
      </div>

      {/* Tab: CSS Generators */}
      {activeTab === 'css' && (
        <div className="space-y-4">
          {/* Gradient Generator */}
          <Card>
            <CardHeader className="py-2.5 flex flex-row items-center justify-between">
              <CardTitle>{t('tools.gradientGen')}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(gradientCSS, 'grad')}
              >
                {copiedKey === 'grad' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div
                className="w-full h-18 rounded-xl shadow-inner border border-slate-200 dark:border-white/[0.12] transition-all"
                style={{
                  background: `linear-gradient(${gradAngle}deg, ${gradColor1} 0%, ${gradColor2} 50%, ${gradColor3} 100%)`,
                }}
              />

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-zinc-400 block mb-1">Color 1</label>
                  <input
                    type="color"
                    value={gradColor1}
                    onChange={(e) => setGradColor1(e.target.value)}
                    className="w-full h-8 rounded-lg bg-transparent cursor-pointer border border-slate-200 dark:border-white/[0.12]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-zinc-400 block mb-1">Color 2</label>
                  <input
                    type="color"
                    value={gradColor2}
                    onChange={(e) => setGradColor2(e.target.value)}
                    className="w-full h-8 rounded-lg bg-transparent cursor-pointer border border-slate-200 dark:border-white/[0.12]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-zinc-400 block mb-1">Color 3</label>
                  <input
                    type="color"
                    value={gradColor3}
                    onChange={(e) => setGradColor3(e.target.value)}
                    className="w-full h-8 rounded-lg bg-transparent cursor-pointer border border-slate-200 dark:border-white/[0.12]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-400 mb-1">
                  <span>Angle: {gradAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradAngle}
                  onChange={(e) => setGradAngle(Number(e.target.value))}
                  className="w-full accent-violet-600 cursor-pointer"
                />
              </div>

              <div className="p-2 bg-slate-100 dark:bg-black/40 font-mono text-[11px] text-violet-700 dark:text-violet-300 rounded-lg border border-slate-200 dark:border-white/[0.06] break-all">
                {gradientCSS}
              </div>
            </CardContent>
          </Card>

          {/* Box Shadow Generator */}
          <Card>
            <CardHeader className="py-2.5 flex flex-row items-center justify-between">
              <CardTitle>{t('tools.boxShadowGen')}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(boxShadowCSS, 'shadow')}
              >
                {copiedKey === 'shadow' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {/* Preview Box */}
              <div className="w-full py-8 bg-slate-100 dark:bg-black/35 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/[0.06]">
                <div
                  className="w-28 h-16 rounded-xl bg-violet-600 flex items-center justify-center text-white font-medium text-xs transition-all shadow-md"
                  style={{
                    boxShadow: `${shadowInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`,
                  }}
                >
                  Element
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-600 dark:text-zinc-400">X Offset: {shadowX}px</span>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadowX}
                    onChange={(e) => setShadowX(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-slate-600 dark:text-zinc-400">Y Offset: {shadowY}px</span>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadowY}
                    onChange={(e) => setShadowY(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-slate-600 dark:text-zinc-400">Blur: {shadowBlur}px</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shadowBlur}
                    onChange={(e) => setShadowBlur(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-slate-600 dark:text-zinc-400">Spread: {shadowSpread}px</span>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={shadowSpread}
                    onChange={(e) => setShadowSpread(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-2 bg-slate-100 dark:bg-black/40 font-mono text-[11px] text-violet-700 dark:text-violet-300 rounded-lg border border-slate-200 dark:border-white/[0.06] break-all">
                {boxShadowCSS}
              </div>
            </CardContent>
          </Card>

          {/* Border Radius Generator */}
          <Card>
            <CardHeader className="py-2.5 flex flex-row items-center justify-between">
              <CardTitle>{t('tools.borderRadiusGen')}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(borderRadiusCSS, 'radius')}
              >
                {copiedKey === 'radius' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="w-full py-8 bg-slate-100 dark:bg-black/35 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/[0.06]">
                <div
                  className="w-28 h-18 bg-violet-600 border-2 border-violet-400/80 transition-all flex items-center justify-center text-xs font-mono text-white"
                  style={{
                    borderRadius: `${rTL}px ${rTR}px ${rBR}px ${rBL}px`,
                  }}
                >
                  Radius
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-600 dark:text-zinc-400">Top Left: {rTL}px</span>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={rTL}
                    onChange={(e) => setRTL(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-slate-600 dark:text-zinc-400">Top Right: {rTR}px</span>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={rTR}
                    onChange={(e) => setRTR(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-slate-600 dark:text-zinc-400">Bottom Left: {rBL}px</span>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={rBL}
                    onChange={(e) => setRBL(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-slate-600 dark:text-zinc-400">Bottom Right: {rBR}px</span>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={rBR}
                    onChange={(e) => setRBR(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-2 bg-slate-100 dark:bg-black/40 font-mono text-[11px] text-violet-700 dark:text-violet-300 rounded-lg border border-slate-200 dark:border-white/[0.06] break-all">
                {borderRadiusCSS}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Converters */}
      {activeTab === 'convert' && (
        <div className="space-y-4">
          {/* PX to REM Converter */}
          <Card>
            <CardHeader className="py-2.5">
              <CardTitle>{t('tools.unitConverter')}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div>
                <label className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">
                  {t('tools.baseFontSize')}
                </label>
                <Input
                  type="number"
                  value={baseFontSize}
                  onChange={(e) => setBaseFontSize(Number(e.target.value) || 16)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">Pixels (px)</label>
                  <Input
                    type="number"
                    value={pxVal}
                    onChange={(e) => handlePxChange(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">REM (rem)</label>
                  <Input
                    type="number"
                    step="0.05"
                    value={remVal}
                    onChange={(e) => handleRemChange(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-100 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/[0.06] font-mono text-xs flex items-center justify-between">
                <span className="text-violet-700 dark:text-violet-300 font-bold">{pxVal}px = {remVal}rem</span>
                <button
                  onClick={() => copyToClipboard(`${remVal}rem`, 'rem-copy')}
                  className="text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer transition-colors"
                >
                  {copiedKey === 'rem-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* JSON Formatter & Validator */}
          <Card>
            <CardHeader className="py-2.5">
              <CardTitle>{t('tools.jsonFormatter')}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste raw JSON here..."
                rows={4}
                className="w-full bg-slate-50 dark:bg-black/35 border border-slate-200 dark:border-white/[0.08] rounded-lg p-2 font-mono text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-violet-500"
              />

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleFormatJson}>Format</Button>
                <Button size="sm" variant="secondary" onClick={handleMinifyJson}>Minify</Button>
                {jsonOutput && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(jsonOutput, 'json-out')}
                  >
                    {copiedKey === 'json-out' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{t('tools.copyResult')}</span>
                  </Button>
                )}
              </div>

              {jsonError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-mono bg-rose-500/10 p-2 rounded-lg border border-rose-500/25">
                  {jsonError}
                </p>
              )}

              {jsonOutput && (
                <pre className="p-2.5 bg-slate-100 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/[0.06] font-mono text-xs text-slate-800 dark:text-zinc-200 overflow-x-auto max-h-48">
                  {jsonOutput}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Utilities */}
      {activeTab === 'utils' && (
        <div className="space-y-4">
          {/* Lorem Ipsum Generator */}
          <Card>
            <CardHeader className="py-2.5">
              <CardTitle>{t('tools.loremIpsum')}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={loremCount}
                    onChange={(e) => setLoremCount(Number(e.target.value) || 1)}
                  />
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-0.5 rounded-lg border border-slate-200 dark:border-white/[0.07] text-xs font-mono">
                  <button
                    onClick={() => setLoremType('paragraphs')}
                    className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                      loremType === 'paragraphs' ? 'bg-violet-600 text-white' : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    Paragraphs
                  </button>
                  <button
                    onClick={() => setLoremType('words')}
                    className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                      loremType === 'words' ? 'bg-violet-600 text-white' : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    Words
                  </button>
                </div>
                <Button size="sm" onClick={generateLorem}>Generate</Button>
              </div>

              {loremOutput && (
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 dark:bg-black/40 rounded-lg border border-slate-200 dark:border-white/[0.06] text-xs text-slate-700 dark:text-zinc-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {loremOutput}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(loremOutput, 'lorem-copy')}
                  >
                    {copiedKey === 'lorem-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{t('tools.copyResult')}</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
