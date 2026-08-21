import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  ArrowRightLeft, 
  Trash2, 
  Filter,
  Check,
  RotateCcw,
  Columns3,
  Rows3
} from 'lucide-react';
import { Member, Task, Language, WeeklyPlan, ScheduleItem } from '../types';
import { translations } from '../i18n/translations';
import { formatWeekTitle } from '../utils/scheduler';

interface CalendarViewProps {
  plan: WeeklyPlan;
  tasks: Task[];
  members: Member[];
  language: Language;
  onUpdatePlan: (updatedPlan: WeeklyPlan) => void;
  onGenerateSchedule: () => void;
  isGenerating: boolean;
  onNavigateWeek: (delta: number) => void;
  onOpenQuickTaskModal: (dayIndex: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  plan,
  tasks,
  members,
  language,
  onUpdatePlan,
  onGenerateSchedule,
  isGenerating,
  onNavigateWeek,
  onOpenQuickTaskModal,
}) => {
  const t = translations[language];
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'member'>('grid');
  
  // Horizontal (columns) vs Vertical (rows) orientation option
  const [layoutOrientation, setLayoutOrientation] = useState<'horizontal' | 'vertical'>(() => {
    const saved = localStorage.getItem('sysselschema_calendar_orientation');
    return saved === 'vertical' ? 'vertical' : 'horizontal';
  });

  const [reassigningItemId, setReassigningItemId] = useState<string | null>(null);

  const handleOrientationChange = (orient: 'horizontal' | 'vertical') => {
    setLayoutOrientation(orient);
    localStorage.setItem('sysselschema_calendar_orientation', orient);
  };

  // Calculate stats
  const totalItems = plan.items.length;
  const completedItems = plan.items.filter((i) => i.completed).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const toggleTaskCompletion = (itemId: string, event: React.MouseEvent) => {
    const item = plan.items.find((i) => i.id === itemId);
    if (!item) return;

    const willBeCompleted = !item.completed;
    
    // Confetti effect on completion
    if (willBeCompleted) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x, y },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    }

    const updatedItems = plan.items.map((i) => {
      if (i.id === itemId) {
        return {
          ...i,
          completed: willBeCompleted,
          completedAt: willBeCompleted ? new Date().toISOString() : undefined,
        };
      }
      return i;
    });

    onUpdatePlan({
      ...plan,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
  };

  const reassignTask = (itemId: string, newMemberId: string) => {
    const updatedItems = plan.items.map((i) => {
      if (i.id === itemId) {
        return { ...i, memberId: newMemberId };
      }
      return i;
    });

    onUpdatePlan({
      ...plan,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
    setReassigningItemId(null);
  };

  const moveTaskDay = (itemId: string, newDayIndex: number) => {
    const updatedItems = plan.items.map((i) => {
      if (i.id === itemId) {
        return { ...i, dayIndex: newDayIndex };
      }
      return i;
    });

    onUpdatePlan({
      ...plan,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteScheduleItem = (itemId: string) => {
    const updatedItems = plan.items.filter((i) => i.id !== itemId);
    onUpdatePlan({
      ...plan,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
  };

  const clearAllTasks = () => {
    if (window.confirm(t.calendar.clearScheduleConfirm)) {
      onUpdatePlan({
        ...plan,
        items: [],
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Filter items
  const getFilteredItemsForDay = (dayIndex: number) => {
    return plan.items.filter((item) => {
      if (item.dayIndex !== dayIndex) return false;
      if (selectedMemberFilter !== 'all' && item.memberId !== selectedMemberFilter) return false;
      return true;
    });
  };

  const getMemberById = (id: string) => members.find((m) => m.id === id);
  const getTaskById = (id: string) => tasks.find((t) => t.id === id);

  // Render individual task card with custom colors and without points/minutes
  const renderTaskCard = (item: ScheduleItem) => {
    const task = getTaskById(item.taskId);
    const member = getMemberById(item.memberId);
    const isDone = item.completed;
    const isReassigning = reassigningItemId === item.id;

    if (!task) return null;
    const taskColor = task.color || '#f59e0b';

    return (
      <div
        key={item.id}
        className={`group relative rounded-xl border p-3 transition-all ${
          isDone
            ? 'bg-white/[0.01] border-[#f2efeb]/5 text-[#f2efeb]/30'
            : 'bg-white/[0.03] hover:bg-white/[0.06]'
        }`}
        style={{
          borderLeft: `3.5px solid ${isDone ? `${taskColor}40` : taskColor}`,
          borderColor: isDone ? undefined : `${taskColor}25`,
        }}
      >
        {/* Task Header & Title */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            <span 
              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 select-none mt-0.5 border"
              style={{
                backgroundColor: `${taskColor}20`,
                borderColor: `${taskColor}40`,
              }}
            >
              {task.icon || '▫️'}
            </span>
            <div className="min-w-0">
              <h4
                className={`text-xs font-medium leading-snug line-clamp-2 ${
                  isDone ? 'line-through text-[#f2efeb]/30' : 'text-[#f2efeb]'
                }`}
              >
                {task.title}
              </h4>
            </div>
          </div>

          {/* Checkbox */}
          <button
            onClick={(e) => toggleTaskCompletion(item.id, e)}
            className="shrink-0 p-0.5 text-[#f2efeb]/40 hover:text-[#f59e0b] transition-colors cursor-pointer"
            title={isDone ? t.calendar.markUndone : t.calendar.markDone}
            aria-label={isDone ? t.calendar.markUndone : t.calendar.markDone}
          >
            {isDone ? (
              <CheckCircle2 className="w-4 h-4" style={{ color: taskColor }} />
            ) : (
              <Circle className="w-4 h-4 text-[#f2efeb]/30 hover:text-[#f59e0b]" />
            )}
          </button>
        </div>

        {/* Member Pill & Action buttons */}
        {member && (
          <div className="mt-2.5 pt-2 border-t border-[#f2efeb]/5 text-xs text-[#f2efeb]/70 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <span 
                className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                style={{ backgroundColor: `${member.color}25` }}
              >
                {member.avatar}
              </span>
              <span className="truncate text-[11px] font-mono text-[#f2efeb]/80">{member.name}</span>
            </div>

            {/* Reassign / Delete actions */}
            <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() =>
                  setReassigningItemId(isReassigning ? null : item.id)
                }
                title={t.calendar.reassign}
                aria-label={t.calendar.reassign}
                className="p-1 text-[#f2efeb]/40 hover:text-[#f59e0b] rounded transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => deleteScheduleItem(item.id)}
                title={t.common.delete}
                aria-label={t.common.delete}
                className="p-1 text-[#f2efeb]/40 hover:text-red-400 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        )}

        {/* In-place Reassign Popover */}
        {isReassigning && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#1d1d20] rounded-xl shadow-2xl border border-[#f2efeb]/20 p-2.5 font-mono text-xs">
            <p className="text-[10px] text-[#f2efeb]/60 uppercase mb-1.5">
              {t.calendar.reassign}:
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => reassignTask(item.id, m.id)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                    item.memberId === m.id
                      ? 'bg-[#f59e0b] text-[#111113] font-bold'
                      : 'hover:bg-white/5 text-[#f2efeb]'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{m.avatar}</span>
                    <span className="truncate">{m.name}</span>
                  </span>
                  {item.memberId === m.id && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
            
            {/* Day Mover */}
            <div className="mt-2 pt-2 border-t border-[#f2efeb]/10">
              <p className="text-[10px] text-[#f2efeb]/60 uppercase mb-1">
                Flytta dag:
              </p>
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      moveTaskDay(item.id, d);
                      setReassigningItemId(null);
                    }}
                    className={`py-1 text-[10px] rounded cursor-pointer ${
                      item.dayIndex === d
                        ? 'bg-[#f59e0b] text-[#111113] font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-[#f2efeb]'
                    }`}
                  >
                    {t.days.short[d]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#f2efeb]/10 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#f2efeb]/50 block mb-2">
            {t.appTagline || "Veckans Hushållsschema"}
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f2efeb] tracking-tight leading-none">
              {formatWeekTitle(plan.weekNumber, plan.year, language)}
            </h1>
            
            {/* Week Stepper Controls */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => onNavigateWeek(-1)}
                title={t.calendar.previousWeek}
                aria-label={t.calendar.previousWeek}
                className="p-2 rounded-full bg-[#1d1d20] border border-[#f2efeb]/10 hover:border-[#f59e0b] text-[#f2efeb]/70 hover:text-[#f59e0b] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                onClick={() => onNavigateWeek(1)}
                title={t.calendar.nextWeek}
                aria-label={t.calendar.nextWeek}
                className="p-2 rounded-full bg-[#1d1d20] border border-[#f2efeb]/10 hover:border-[#f59e0b] text-[#f2efeb]/70 hover:text-[#f59e0b] transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero CTA Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGenerateSchedule}
            disabled={isGenerating}
            className="px-6 py-3.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#111113] font-mono text-xs uppercase tracking-wider font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? t.calendar.generating : t.calendar.generateSchedule}</span>
          </button>
        </div>
      </section>

      {/* Control & Filter Surface */}
      <div className="bg-[#1d1d20] border border-[#f2efeb]/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        {/* Left: Filter by Member & Views */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Member Filter */}
          <div className="flex items-center bg-[#111113] border border-[#f2efeb]/10 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-[#f2efeb]/40 mr-2 rtl:mr-0 rtl:ml-2" />
            <select
              value={selectedMemberFilter}
              aria-label={t.calendar.filterMember}
              onChange={(e) => setSelectedMemberFilter(e.target.value)}
              className="bg-transparent text-xs text-[#f2efeb] focus:outline-hidden cursor-pointer"
            >
              <option value="all" className="bg-[#1d1d20] text-[#f2efeb]">{t.calendar.allMembers}</option>
              {members.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#1d1d20] text-[#f2efeb]">
                  {m.avatar} {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle (Dag för dag vs Per person) */}
          <div className="bg-[#111113] p-1 rounded-xl border border-[#f2efeb]/10 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#1d1d20] text-[#f59e0b] font-bold shadow-xs'
                  : 'text-[#f2efeb]/50 hover:text-[#f2efeb]'
              }`}
            >
              {t.calendar.viewModeGrid}
            </button>
            <button
              onClick={() => setViewMode('member')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'member'
                  ? 'bg-[#1d1d20] text-[#f59e0b] font-bold shadow-xs'
                  : 'text-[#f2efeb]/50 hover:text-[#f2efeb]'
              }`}
            >
              {t.calendar.viewModeMember}
            </button>
          </div>

          {/* Orientation Toggle: Horizontal vs Vertical (Shown when in Day-by-Day mode) */}
          {viewMode === 'grid' && (
            <div className="bg-[#111113] p-1 rounded-xl border border-[#f2efeb]/10 flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleOrientationChange('horizontal')}
                title={t.calendar.viewHorizontal}
                aria-label={t.calendar.viewHorizontal}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  layoutOrientation === 'horizontal'
                    ? 'bg-[#1d1d20] text-[#f59e0b] font-bold shadow-xs'
                    : 'text-[#f2efeb]/50 hover:text-[#f2efeb]'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">{t.calendar.viewHorizontal}</span>
              </button>

              <button
                type="button"
                onClick={() => handleOrientationChange('vertical')}
                title={t.calendar.viewVertical}
                aria-label={t.calendar.viewVertical}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  layoutOrientation === 'vertical'
                    ? 'bg-[#1d1d20] text-[#f59e0b] font-bold shadow-xs'
                    : 'text-[#f2efeb]/50 hover:text-[#f2efeb]'
                }`}
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">{t.calendar.viewVertical}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Progress & Clear */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#f2efeb]/50">{t.calendar.completionProgress}:</span>
            <span className="text-[#f59e0b] font-bold">{completionPercentage}%</span>
          </div>

          {plan.items.length > 0 && (
            <button
              onClick={clearAllTasks}
              title={t.calendar.clearSchedule}
              aria-label={t.calendar.clearSchedule}
              className="p-1.5 text-[#f2efeb]/40 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Schedule Content */}
      {viewMode === 'grid' ? (
        layoutOrientation === 'horizontal' ? (
          /* Horizontal Columns Layout (7 columns side by side) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
              const dayName = t.days.full[dayIndex];
              const dayNumber = `[0${dayIndex + 1}]`;
              const dayItems = getFilteredItemsForDay(dayIndex);

              return (
                <div
                  key={dayIndex}
                  className="bg-[#1d1d20] border border-[#f2efeb]/10 rounded-2xl p-4 flex flex-col gap-3.5 min-h-[440px] shadow-sm transition-all"
                >
                  {/* Day Header */}
                  <div className="flex justify-between items-baseline border-b border-[#f2efeb]/10 pb-3">
                    <span className="font-serif text-xl italic font-semibold text-[#f2efeb] tracking-tight">
                      {dayName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[#f2efeb]/40">
                        {dayNumber}
                      </span>
                      <button
                        onClick={() => onOpenQuickTaskModal(dayIndex)}
                        title={t.calendar.addQuickTask}
                        aria-label={t.calendar.addQuickTask}
                        className="p-1 text-[#f2efeb]/40 hover:text-[#f59e0b] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Day Tasks List */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto">
                    {dayItems.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-3 text-[#f2efeb]/30 font-mono text-xs">
                        <p>{t.calendar.noTasksScheduled}</p>
                        <button
                          onClick={() => onOpenQuickTaskModal(dayIndex)}
                          className="mt-2 text-[#f59e0b] hover:underline font-mono text-[11px] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t.calendar.addQuickTask}</span>
                        </button>
                      </div>
                    ) : (
                      dayItems.map((item) => renderTaskCard(item))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Vertical Rows Layout (Days stacked vertically with expansive rows) */
          <div className="space-y-4">
            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
              const dayName = t.days.full[dayIndex];
              const dayNumber = `[0${dayIndex + 1}]`;
              const dayItems = getFilteredItemsForDay(dayIndex);
              const completedDayItems = dayItems.filter((i) => i.completed).length;

              return (
                <div
                  key={dayIndex}
                  className="bg-[#1d1d20] border border-[#f2efeb]/10 rounded-2xl p-5 shadow-sm transition-all flex flex-col md:flex-row md:items-start gap-5"
                >
                  {/* Left Day Identity Column */}
                  <div className="md:w-56 shrink-0 space-y-2 border-b md:border-b-0 md:border-r md:rtl:border-r-0 md:rtl:border-l border-[#f2efeb]/10 pb-4 md:pb-0 md:pr-5 md:rtl:pr-0 md:rtl:pl-5">
                    <div className="flex items-baseline justify-between md:justify-start md:gap-2">
                      <span className="font-serif text-2xl font-semibold italic text-[#f2efeb] tracking-tight">
                        {dayName}
                      </span>
                      <span className="font-mono text-xs text-[#f2efeb]/40">{dayNumber}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                      <span className="text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2 py-0.5 rounded-md">
                        {dayItems.length} {dayItems.length === 1 ? 'syssla' : 'sysslor'}
                      </span>
                      {dayItems.length > 0 && (
                        <span className="text-[#f2efeb]/50">
                          {completedDayItems}/{dayItems.length} {t.common.done.toLowerCase()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenQuickTaskModal(dayIndex)}
                      className="w-full mt-2 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-[#f2efeb]/10 text-xs font-mono text-[#f2efeb] hover:text-[#f59e0b] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.calendar.addQuickTask}</span>
                    </button>
                  </div>

                  {/* Right Day Tasks Grid */}
                  <div className="flex-1 min-w-0">
                    {dayItems.length === 0 ? (
                      <div className="py-6 flex items-center justify-center text-center text-[#f2efeb]/30 font-mono text-xs">
                        <p>{t.calendar.noTasksScheduled}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {dayItems.map((item) => renderTaskCard(item))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Member-Centric Matrix View */
        <div className="space-y-4">
          {members.map((member) => {
            const memberItems = plan.items.filter((i) => i.memberId === member.id);
            const memberCompleted = memberItems.filter((i) => i.completed).length;

            return (
              <div
                key={member.id}
                className="bg-[#1d1d20] border border-[#f2efeb]/10 rounded-2xl p-5 shadow-sm space-y-4"
              >
                {/* Member Row Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f2efeb]/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10"
                      style={{ backgroundColor: `${member.color}20` }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-medium text-[#f2efeb]">{member.name}</h3>
                      </div>
                      <p className="font-mono text-xs text-[#f59e0b] mt-0.5">
                        {memberItems.length} {memberItems.length === 1 ? 'syssla' : 'sysslor'}
                      </p>
                    </div>
                  </div>

                  {/* Completion status */}
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-[#f2efeb]/70">
                      {memberCompleted} / {memberItems.length} {t.common.done.toLowerCase()}
                    </span>
                    <div className="w-28 bg-white/5 rounded-full h-2 overflow-hidden border border-[#f2efeb]/10">
                      <div
                        className="h-2 rounded-full transition-all bg-[#f59e0b]"
                        style={{
                          width: `${memberItems.length > 0 ? (memberCompleted / memberItems.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Chores for each day assigned to this member */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                    const dayItems = memberItems.filter((i) => i.dayIndex === dayIdx);
                    return (
                      <div
                        key={dayIdx}
                        className="bg-white/[0.02] rounded-xl p-3 border border-[#f2efeb]/5 min-h-[90px]"
                      >
                        <div className="font-mono text-[11px] text-[#f2efeb]/50 mb-2 flex items-center justify-between">
                          <span>{t.days.short[dayIdx]}</span>
                          {dayItems.length > 0 && (
                            <span className="text-[#f59e0b]">
                              {dayItems.length}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          {dayItems.map((item) => {
                            const task = getTaskById(item.taskId);
                            if (!task) return null;
                            const taskColor = task.color || '#f59e0b';
                            return (
                              <div
                                key={item.id}
                                onClick={(e) => toggleTaskCompletion(item.id, e)}
                                className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                                  item.completed
                                    ? 'bg-white/[0.01] border-transparent text-[#f2efeb]/30 line-through'
                                    : 'bg-white/[0.04] text-[#f2efeb]'
                                }`}
                                style={{
                                  borderLeft: `3px solid ${item.completed ? `${taskColor}40` : taskColor}`,
                                  borderColor: item.completed ? undefined : `${taskColor}30`,
                                }}
                              >
                                <div className="flex items-center gap-1.5 leading-snug">
                                  <span>{task.icon || '▫️'}</span>
                                  <span className="truncate">{task.title}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
