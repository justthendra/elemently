import React from 'react';
import { BoxModel } from '../../types/element';
import { useI18n } from '../../hooks/useI18n';

interface BoxModelVisualizerProps {
  boxModel: BoxModel;
  onCopyValue?: (label: string, value: string) => void;
}

export const BoxModelVisualizer: React.FC<BoxModelVisualizerProps> = ({ boxModel, onCopyValue }) => {
  const { t } = useI18n();

  const handleValueClick = (label: string, val: number | string) => {
    if (onCopyValue) {
      onCopyValue(label, `${val}px`);
    } else {
      navigator.clipboard.writeText(`${val}px`);
    }
  };

  const { margin, border, padding, content } = boxModel;

  return (
    <div className="w-full flex flex-col items-center select-none font-mono text-[11px] text-slate-700 dark:text-zinc-300">
      {/* Margin Container (Outer) */}
      <div className="w-full bg-amber-500/[0.08] dark:bg-amber-500/[0.06] border border-amber-500/30 dark:border-amber-500/25 rounded-lg p-2 relative flex flex-col items-center">
        <span className="absolute top-1 left-2 text-[10px] text-amber-700 dark:text-amber-400/80 font-sans font-medium uppercase tracking-wider">
          {t('layout.margin')}
        </span>
        <button
          onClick={() => handleValueClick('margin-top', margin.top)}
          className="text-amber-700 dark:text-amber-300/90 hover:text-amber-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-amber-500/15 transition-colors"
        >
          {margin.top}
        </button>

        <div className="w-full flex items-center justify-between gap-2 my-1">
          <button
            onClick={() => handleValueClick('margin-left', margin.left)}
            className="text-amber-700 dark:text-amber-300/90 hover:text-amber-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-amber-500/15 transition-colors"
          >
            {margin.left}
          </button>

          {/* Border Container */}
          <div className="flex-1 bg-yellow-500/[0.1] dark:bg-yellow-500/[0.08] border border-yellow-500/30 dark:border-yellow-500/25 rounded-md p-2 relative flex flex-col items-center">
            <span className="absolute top-1 left-2 text-[10px] text-yellow-700 dark:text-yellow-400/80 font-sans font-medium uppercase tracking-wider">
              {t('layout.border')}
            </span>
            <button
              onClick={() => handleValueClick('border-top', border.top)}
              className="text-yellow-700 dark:text-yellow-300/90 hover:text-yellow-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-yellow-500/15 transition-colors"
            >
              {border.top}
            </button>

            <div className="w-full flex items-center justify-between gap-2 my-1">
              <button
                onClick={() => handleValueClick('border-left', border.left)}
                className="text-yellow-700 dark:text-yellow-300/90 hover:text-yellow-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-yellow-500/15 transition-colors"
              >
                {border.left}
              </button>

              {/* Padding Container */}
              <div className="flex-1 bg-emerald-500/[0.1] dark:bg-emerald-500/[0.08] border border-emerald-500/30 dark:border-emerald-500/25 rounded p-2 relative flex flex-col items-center">
                <span className="absolute top-1 left-2 text-[10px] text-emerald-700 dark:text-emerald-400/80 font-sans font-medium uppercase tracking-wider">
                  {t('layout.padding')}
                </span>
                <button
                  onClick={() => handleValueClick('padding-top', padding.top)}
                  className="text-emerald-700 dark:text-emerald-300/90 hover:text-emerald-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-emerald-500/15 transition-colors"
                >
                  {padding.top}
                </button>

                <div className="w-full flex items-center justify-between gap-2 my-1">
                  <button
                    onClick={() => handleValueClick('padding-left', padding.left)}
                    className="text-emerald-700 dark:text-emerald-300/90 hover:text-emerald-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-emerald-500/15 transition-colors"
                  >
                    {padding.left}
                  </button>

                  {/* Content Container (Center) */}
                  <div
                    onClick={() => handleValueClick('dimensions', `${content.width} × ${content.height}`)}
                    className="bg-violet-600/15 dark:bg-violet-500/20 border border-violet-500/35 rounded px-3 py-1.5 text-center cursor-pointer hover:bg-violet-600/25 dark:hover:bg-violet-500/30 transition-colors"
                  >
                    <span className="text-violet-800 dark:text-violet-200 font-bold block text-xs">
                      {content.width} × {content.height}
                    </span>
                    <span className="text-[9px] text-violet-600 dark:text-violet-400 font-sans uppercase font-medium">
                      {t('layout.content')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleValueClick('padding-right', padding.right)}
                    className="text-emerald-700 dark:text-emerald-300/90 hover:text-emerald-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-emerald-500/15 transition-colors"
                  >
                    {padding.right}
                  </button>
                </div>

                <button
                  onClick={() => handleValueClick('padding-bottom', padding.bottom)}
                  className="text-emerald-700 dark:text-emerald-300/90 hover:text-emerald-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-emerald-500/15 transition-colors"
                >
                  {padding.bottom}
                </button>
              </div>

              <button
                onClick={() => handleValueClick('border-right', border.right)}
                className="text-yellow-700 dark:text-yellow-300/90 hover:text-yellow-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-yellow-500/15 transition-colors"
              >
                {border.right}
              </button>
            </div>

            <button
              onClick={() => handleValueClick('border-bottom', border.bottom)}
              className="text-yellow-700 dark:text-yellow-300/90 hover:text-yellow-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-yellow-500/15 transition-colors"
            >
              {border.bottom}
            </button>
          </div>

          <button
            onClick={() => handleValueClick('margin-right', margin.right)}
            className="text-amber-700 dark:text-amber-300/90 hover:text-amber-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-amber-500/15 transition-colors"
          >
            {margin.right}
          </button>
        </div>

        <button
          onClick={() => handleValueClick('margin-bottom', margin.bottom)}
          className="text-amber-700 dark:text-amber-300/90 hover:text-amber-900 dark:hover:text-white font-semibold cursor-pointer px-1 rounded hover:bg-amber-500/15 transition-colors"
        >
          {margin.bottom}
        </button>
      </div>
    </div>
  );
};
