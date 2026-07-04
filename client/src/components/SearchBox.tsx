import React, { useEffect, useMemo, useRef, useState } from 'react';

type Suggestion = {
  label: string;
  source: 'hot' | 'history' | 'match' | 'correction';
};

type SearchBoxProps = {
  value: string;
  products: Array<{ name: string; category: string }>;
  categories: string[];
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
};

const hotTerms = ['耳机', '保温杯', '跑步鞋', '家居', '数码'];
const corrections: Record<string, string> = {
  erji: '耳机',
  bwb: '保温杯',
  shuma: '数码',
  '平锅': '苹果'
};
const sourceText: Record<Suggestion['source'], string> = {
  hot: '热搜',
  history: '历史',
  match: '匹配',
  correction: '纠错'
};

function getHistory() {
  return JSON.parse(localStorage.getItem('searchHistory') || '[]') as string[];
}

function saveHistory(keyword: string) {
  const normalized = keyword.trim();
  if (!normalized) return;
  const next = [normalized, ...getHistory().filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 20);
  localStorage.setItem('searchHistory', JSON.stringify(next));
}

export default function SearchBox({ value, products, categories, onChange, onSearch }: SearchBoxProps) {
  const [open, setOpen] = useState(false);
  const [debounced, setDebounced] = useState(value);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), 300);
    return () => window.clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const suggestions = useMemo(() => {
    const keyword = debounced.trim().toLowerCase();
    const history = getHistory().slice(0, 5).map((label) => ({ label, source: 'history' as const }));
    const correction = corrections[keyword] ? [{ label: corrections[keyword], source: 'correction' as const }] : [];
    const sourceTerms = Array.from(new Set([...products.map((item) => item.name), ...categories]));
    const matches =
      keyword.length >= 1
        ? sourceTerms
            .filter((item) => item.toLowerCase().includes(keyword))
            .slice(0, 10)
            .map((label) => ({ label, source: 'match' as const }))
        : [];
    const hot = hotTerms.map((label) => ({ label, source: 'hot' as const }));

    return [...correction, ...matches, ...history, ...hot]
      .filter((item, index, array) => array.findIndex((other) => other.label.toLowerCase() === item.label.toLowerCase()) === index)
      .slice(0, 10) as Suggestion[];
  }, [categories, debounced, products]);

  const submit = (keyword: string) => {
    saveHistory(keyword);
    onChange(keyword);
    onSearch(keyword);
    setOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div ref={wrapperRef} className="relative sm:col-span-2">
      <div className="relative">
        <input
          type="search"
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1));
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((current) => Math.max(current - 1, 0));
            } else if (event.key === 'Enter') {
              event.preventDefault();
              submit(activeIndex >= 0 ? suggestions[activeIndex].label : value);
            } else if (event.key === 'Escape') {
              setOpen(false);
            }
          }}
          role="combobox"
          aria-expanded={open}
          aria-controls="search-suggestions"
          placeholder="搜索商品、分类"
          className="min-h-11 w-full rounded-md border border-theme bg-surface-raised px-3 py-2 pr-10 text-sm text-body"
        />
        {value && (
          <button
            type="button"
            aria-label="清空搜索"
            onClick={() => { onChange(''); onSearch(''); }}
            className="absolute right-2 top-1/2 min-h-8 min-w-8 -translate-y-1/2 rounded text-body"
          >
            ×
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-lg border border-theme bg-surface-raised p-2 shadow-xl"
        >
          {suggestions.map((item, index) => (
            <button
              key={`${item.source}-${item.label}`}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => submit(item.label)}
              className={`flex min-h-11 w-full items-center justify-between rounded-md px-3 text-left text-sm ${
                activeIndex === index ? 'bg-brand-50 text-brand-700' : 'text-body hover:bg-surface-soft'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-xs text-body">{sourceText[item.source]}</span>
            </button>
          ))}
          {getHistory().length > 0 && (
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('searchHistory');
                setOpen(false);
              }}
              className="mt-1 min-h-10 w-full rounded-md px-3 text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              清除历史
            </button>
          )}
        </div>
      )}
    </div>
  );
}
