import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  CheckSquare, 
  Users, 
  Share2, 
  Sparkles, 
  RotateCcw, 
  Palette,
  Check
} from 'lucide-react';
import { Language, Theme } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  currentTab: 'calendar' | 'tasks' | 'members' | 'share' | 'stats';
  setCurrentTab: (tab: 'calendar' | 'tasks' | 'members' | 'share' | 'stats') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onGenerateSchedule: () => void;
  isGenerating: boolean;
  onResetDefaults: () => void;
}

interface ThemeOption {
  id: Theme;
  bgHex: string;
  accentHex: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  { id: 'dark', bgHex: '#111113', accentHex: '#f59e0b' },
  { id: 'light', bgHex: '#f8f6f0', accentHex: '#d97706' },
  { id: 'nordic', bgHex: '#0d1520', accentHex: '#38bdf8' },
  { id: 'forest', bgHex: '#0e1713', accentHex: '#10b981' },
  { id: 'sunset', bgHex: '#1a1213', accentHex: '#f43f5e' },
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  theme,
  setTheme,
  onGenerateSchedule,
  isGenerating,
  onResetDefaults,
}) => {
  const t = translations[language];
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'calendar', label: t.nav.calendar, icon: Calendar },
    { id: 'tasks', label: t.nav.tasks, icon: CheckSquare },
    { id: 'members', label: t.nav.members, icon: Users },
    { id: 'share', label: t.nav.share, icon: Share2 },
  ] as const;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    if (isThemeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-[#111113]/95 backdrop-blur-md border-b border-[#f2efeb]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo / Brand Zone */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setCurrentTab('calendar')}>
            <span className="font-serif italic font-semibold text-2xl sm:text-3xl text-[#f2efeb] tracking-tight">
              SysselSchema
            </span>
          </div>

          {/* Meta Navigation Links (Zone 2) */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`transition-opacity duration-150 cursor-pointer ${
                    isActive
                      ? 'text-[#f59e0b] font-bold opacity-100'
                      : 'text-[#f2efeb] opacity-50 hover:opacity-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions, Theme Switcher & Language Switcher Zone (Zone 3) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 font-mono text-xs">
            
            {/* Theme Selector Dropdown Menu (Bouton Choix du Thème) */}
            <div className="relative" ref={themeMenuRef}>
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                title={t.common.chooseTheme}
                aria-label={t.common.chooseTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#f2efeb]/10 hover:border-[#f59e0b] transition-all cursor-pointer text-[#f2efeb]"
              >
                <Palette className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span className="text-[11px] uppercase tracking-wider hidden sm:inline text-[#f2efeb]/80 font-medium">
                  {t.common.themes[theme] || t.common.theme}
                </span>
                {/* Active Theme Color Preview Dot */}
                <span 
                  className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-xs shrink-0" 
                  style={{ backgroundColor: THEME_OPTIONS.find((o) => o.id === theme)?.accentHex || '#f59e0b' }} 
                />
              </button>

              {/* Theme Dropdown Panel */}
              {isThemeMenuOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-[#1d1d20] border border-[#f2efeb]/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-[#f2efeb]/10 mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#f2efeb]/50 font-bold block">
                      {t.common.chooseTheme}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {THEME_OPTIONS.map((opt) => {
                      const isSelected = theme === opt.id;
                      const label = t.common.themes[opt.id];

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setTheme(opt.id);
                            setIsThemeMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white/10 text-[#f59e0b] font-bold border border-[#f59e0b]/30'
                              : 'text-[#f2efeb]/80 hover:bg-white/5 hover:text-[#f2efeb]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {/* Color Swatch Pill */}
                            <div 
                              className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center shrink-0 shadow-inner"
                              style={{ backgroundColor: opt.bgHex }}
                            >
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: opt.accentHex }}
                              />
                            </div>
                            <span className="truncate">{label}</span>
                          </div>

                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switch */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#f2efeb]/60 uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setLanguage('sv')}
                className={`transition-colors cursor-pointer ${
                  language === 'sv' ? 'text-[#f59e0b] font-bold' : 'hover:text-[#f2efeb]'
                }`}
              >
                SV
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`transition-colors cursor-pointer ${
                  language === 'en' ? 'text-[#f59e0b] font-bold' : 'hover:text-[#f2efeb]'
                }`}
              >
                EN
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`transition-colors cursor-pointer ${
                  language === 'ar' ? 'text-[#f59e0b] font-bold' : 'hover:text-[#f2efeb]'
                }`}
              >
                AR
              </button>
            </div>

            {/* Quick Auto-Distribute / Generate Button */}
            <button
              onClick={onGenerateSchedule}
              disabled={isGenerating}
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#111113] text-xs font-mono font-bold uppercase tracking-wider transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? t.calendar.generating : t.calendar.generateSchedule}</span>
            </button>

            {/* Reset sample button */}
            <button
              onClick={onResetDefaults}
              title={t.common.resetDefaults}
              aria-label={t.common.resetDefaults}
              className="p-2 text-[#f2efeb]/40 hover:text-[#f59e0b] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-[#f2efeb]/10 overflow-x-auto font-mono text-xs uppercase tracking-wider">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`py-1 px-3 transition-opacity ${
                  isActive ? 'text-[#f59e0b] font-bold opacity-100' : 'text-[#f2efeb] opacity-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
