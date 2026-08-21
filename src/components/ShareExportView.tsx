import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Share2, 
  Sparkles,
  FileText
} from 'lucide-react';
import { Member, Task, WeeklyPlan, Language, SavedPreset } from '../types';
import { translations } from '../i18n/translations';
import { formatWeekTitle } from '../utils/scheduler';

interface ShareExportViewProps {
  plan: WeeklyPlan;
  tasks: Task[];
  members: Member[];
  language: Language;
  savedPresets: SavedPreset[];
  onSavePreset: (name: string) => void;
  onLoadPreset: (preset: SavedPreset) => void;
  onDeletePreset: (presetId: string) => void;
}

export const ShareExportView: React.FC<ShareExportViewProps> = ({
  plan,
  tasks,
  members,
  language,
}) => {
  const t = translations[language];
  const posterRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedMemberId, setCopiedMemberId] = useState<string | null>(null);

  const getTaskById = (id: string) => tasks.find((t) => t.id === id);
  const getMemberById = (id: string) => members.find((m) => m.id === id);

  // Generate WhatsApp / text formatted schedule
  const generateFormattedText = (): string => {
    const title = `📅 *${t.appName} - ${formatWeekTitle(plan.weekNumber, plan.year, language)}*\n\n`;
    
    let body = '';
    [0, 1, 2, 3, 4, 5, 6].forEach((dayIdx) => {
      const dayName = t.days.full[dayIdx];
      const dayItems = plan.items.filter((i) => i.dayIndex === dayIdx);
      
      body += `📌 *${dayName.toUpperCase()}*\n`;
      if (dayItems.length === 0) {
        body += `  - _${t.calendar.noTasksScheduled}_\n`;
      } else {
        dayItems.forEach((item) => {
          const task = getTaskById(item.taskId);
          const member = getMemberById(item.memberId);
          const check = item.completed ? '✅' : '⏳';
          const icon = task?.icon || '▫️';
          body += `  ${check} ${icon} ${task?.title || 'Syssla'} ➔ *${member?.name || 'Alla'}*\n`;
        });
      }
      body += '\n';
    });

    const footer = `✨ _${t.appTagline}_`;
    return title + body + footer;
  };

  // Generate specific member text
  const generateMemberText = (member: Member): string => {
    const title = `📋 *${member.name} - ${formatWeekTitle(plan.weekNumber, plan.year, language)}*\n\n`;
    let body = '';
    
    [0, 1, 2, 3, 4, 5, 6].forEach((dayIdx) => {
      const dayName = t.days.full[dayIdx];
      const dayItems = plan.items.filter((i) => i.dayIndex === dayIdx && i.memberId === member.id);
      
      if (dayItems.length > 0) {
        body += `*${dayName}:*\n`;
        dayItems.forEach((item) => {
          const task = getTaskById(item.taskId);
          const check = item.completed ? '✅' : '▫️';
          body += `  ${check} ${task?.icon || '📌'} ${task?.title}\n`;
        });
        body += '\n';
      }
    });

    if (!body) {
      body = `_Inga tilldelade sysslor denna vecka._\n\n`;
    }

    return title + body + `💪 Bra jobbat!`;
  };

  const copyToClipboard = (text: string, isGeneral: boolean = true, memId: string | null = null) => {
    navigator.clipboard.writeText(text);
    if (isGeneral) {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } else if (memId) {
      setCopiedMemberId(memId);
      setTimeout(() => setCopiedMemberId(null), 2500);
    }
  };

  const downloadAsImage = async () => {
    if (!posterRef.current) return;
    setIsCapturing(true);

    try {
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 2,
        backgroundColor: '#111113',
        cacheBust: true,
        skipFonts: true,
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `SysselSchema_${plan.year}_V${plan.weekNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to capture image', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#f2efeb]/10 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#f2efeb]/50 block mb-2">
            Utskrift & Export
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#f2efeb] tracking-tight leading-none">
            {t.share.title}
          </h1>
          <p className="font-mono text-xs text-[#f2efeb]/50 mt-2">
            {t.share.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            onClick={downloadAsImage}
            disabled={isCapturing}
            className="px-6 py-3.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#111113] uppercase tracking-wider font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isCapturing ? t.share.generatingImage : t.share.downloadImage}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-[#f2efeb] border border-[#f2efeb]/10 uppercase tracking-wider font-bold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.share.printSchedule}</span>
          </button>
        </div>
      </section>

      {/* Main Split: Printable Poster Preview & WhatsApp Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: High-Resolution Poster Card Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#f2efeb]/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f59e0b]" />
              <span>{t.share.exportPoster}</span>
            </h3>
            <span className="font-mono text-xs text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-3 py-1 rounded-full">
              {t.share.fridgeReady}
            </span>
          </div>

          {/* Capture Area */}
          <div
            ref={posterRef}
            className="bg-[#1d1d20] border border-[#f2efeb]/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black"
          >
            {/* Header of Poster */}
            <div className="flex items-center justify-between border-b border-[#f2efeb]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-2 py-0.5 rounded-md">
                  {t.appName}
                </span>
                <h2 className="font-serif text-3xl font-bold text-[#f2efeb] tracking-tight mt-2">
                  {formatWeekTitle(plan.weekNumber, plan.year, language)}
                </h2>
              </div>

              {/* Family avatars badge bar */}
              <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-lg bg-[#111113]"
                    title={m.name}
                  >
                    {m.avatar}
                  </div>
                ))}
              </div>
            </div>

            {/* Poster Days Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2.5">
              {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                const dayName = t.days.full[dayIdx];
                const dayShort = t.days.short[dayIdx];
                const dayItems = plan.items.filter((i) => i.dayIndex === dayIdx);
                const isWeekend = dayIdx === 5 || dayIdx === 6;

                return (
                  <div
                    key={dayIdx}
                    className={`rounded-xl p-3 border font-mono ${
                      isWeekend
                        ? 'bg-[#111113] border-[#f59e0b]/30'
                        : 'bg-[#111113]/60 border-[#f2efeb]/10'
                    }`}
                  >
                    <div className="border-b border-[#f2efeb]/10 pb-1 mb-2">
                      <span className="text-[10px] text-[#f2efeb]/40 uppercase tracking-wider block">
                        {dayShort}
                      </span>
                      <h4 className="text-xs font-bold text-[#f2efeb]">
                        {dayName}
                      </h4>
                    </div>

                    <div className="space-y-2 min-h-[140px]">
                      {dayItems.length === 0 ? (
                        <p className="text-[10px] text-[#f2efeb]/30 italic text-center pt-4">
                          Inga sysslor
                        </p>
                      ) : (
                        dayItems.map((item) => {
                          const task = getTaskById(item.taskId);
                          const member = getMemberById(item.memberId);
                          if (!task) return null;
                          const taskColor = task.color || '#f59e0b';

                          return (
                            <div
                              key={item.id}
                              className="text-[11px] bg-[#1d1d20] border rounded-lg p-2 flex flex-col justify-between"
                              style={{
                                borderLeft: `3px solid ${taskColor}`,
                                borderColor: `${taskColor}30`,
                              }}
                            >
                              <div className="flex items-start gap-1 font-sans text-xs text-[#f2efeb] leading-tight">
                                <span className="shrink-0">{task.icon || '▫️'}</span>
                                <span className="line-clamp-2 font-medium">{task.title}</span>
                              </div>

                              {member && (
                                <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                                  <span
                                    className="px-1.5 py-0.5 rounded-md truncate max-w-[100px] text-[#f59e0b] bg-[#f59e0b]/10 font-bold"
                                  >
                                    {member.name}
                                  </span>
                                  <span 
                                    className="w-2 h-2 rounded-full" 
                                    style={{ backgroundColor: member.color }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Poster Footer: Legend */}
            <div className="border-t border-[#f2efeb]/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#f2efeb]/60 font-mono">
              <div className="flex flex-wrap items-center gap-3">
                {members.map((m) => (
                  <span key={m.id} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-[#f2efeb] font-bold">{m.name}</span>
                  </span>
                ))}
              </div>
              <span className="text-[#f59e0b]">
                ✦ Tillsammans håller vi ordning och harmoni
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: WhatsApp & Text Share */}
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <h3 className="uppercase tracking-wider text-[#f2efeb]/70 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#f59e0b]" />
              <span>{t.share.copyText}</span>
            </h3>
          </div>

          {/* Master Copy Box */}
          <div className="bg-[#1d1d20] border border-[#f2efeb]/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#f2efeb]">Hela veckoplanen</span>
              <button
                onClick={() => copyToClipboard(generateFormattedText(), true)}
                className="px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-[#111113] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.common.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopiera text</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-[#111113] p-3 rounded-xl border border-[#f2efeb]/5 text-[11px] text-[#f2efeb]/60 max-h-40 overflow-y-auto whitespace-pre-wrap">
              {generateFormattedText()}
            </div>
          </div>

          {/* Per-Member Personalized Copy */}
          <div className="bg-[#1d1d20] border border-[#f2efeb]/10 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-[#f2efeb] block">
              Skicka schema till person
            </span>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#111113] border border-[#f2efeb]/5 hover:border-[#f2efeb]/20 transition-all"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{member.avatar}</span>
                    <span className="text-xs text-[#f2efeb] truncate">{member.name}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generateMemberText(member), false, member.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-[#f59e0b] hover:text-[#111113] text-[#f2efeb]/70 transition-all cursor-pointer"
                    title={`Kopiera ${member.name}s schema`}
                  >
                    {copiedMemberId === member.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
