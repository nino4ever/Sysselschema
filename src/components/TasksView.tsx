import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckSquare, 
  LayoutList, 
  LayoutGrid, 
  Calendar, 
  RotateCcw,
  Palette
} from 'lucide-react';
import { Task, AgeGroup, Language } from '../types';
import { translations } from '../i18n/translations';
import { TASK_COLOR_OPTIONS } from '../utils/defaultData';

interface TasksViewProps {
  tasks: Task[];
  language: Language;
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onLoadDefaultTasks: () => void;
}

const COMMON_EMOJIS = [
  '🍽️', '🧹', '🧺', '🍳', '🛒', '🗑️', '🚿', '✨', 
  '🪴', '🧽', '🐱', '🐶', '🛏️', '📦', '🪟', '🚗', 
  '📚', '👶', '🔨', '🌿', '🍲', '☕', '🧼', '💡'
];

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  language,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onLoadDefaultTasks,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [displayMode, setDisplayMode] = useState<'list' | 'grid'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequencyPerWeek, setFrequencyPerWeek] = useState<number>(2);
  const [preferredDays, setPreferredDays] = useState<number[]>([]);
  const [requiredAgeGroup, setRequiredAgeGroup] = useState<AgeGroup>('adult');
  const [icon, setIcon] = useState<string>('✨');
  const [color, setColor] = useState<string>('#f59e0b');

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setFrequencyPerWeek(2);
    setPreferredDays([]);
    setRequiredAgeGroup('adult');
    setIcon('✨');
    setColor(TASK_COLOR_OPTIONS[Math.floor(Math.random() * TASK_COLOR_OPTIONS.length)].hex);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setFrequencyPerWeek(task.frequencyPerWeek);
    setPreferredDays(task.preferredDays || []);
    setRequiredAgeGroup(task.requiredAgeGroup || 'adult');
    setIcon(task.icon || '📌');
    setColor(task.color || '#f59e0b');
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim() || undefined,
        category: 'general',
        color: color || '#f59e0b',
        points: 2,
        estimatedMinutes: 15,
        frequencyPerWeek,
        preferredDays: preferredDays.length > 0 ? preferredDays : undefined,
        requiredAgeGroup,
        icon: icon.trim() || '📌',
      });
    } else {
      const newTask: Task = {
        id: `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        description: description.trim() || undefined,
        category: 'general',
        color: color || '#f59e0b',
        points: 2,
        estimatedMinutes: 15,
        frequencyPerWeek,
        preferredDays: preferredDays.length > 0 ? preferredDays : undefined,
        requiredAgeGroup,
        icon: icon.trim() || '✨',
      };
      onAddTask(newTask);
    }

    setIsModalOpen(false);
  };

  const togglePreferredDay = (dayIndex: number) => {
    if (preferredDays.includes(dayIndex)) {
      setPreferredDays(preferredDays.filter((d) => d !== dayIndex));
    } else {
      setPreferredDays([...preferredDays, dayIndex].sort());
    }
  };

  // Filter tasks by search query
  const filteredTasks = tasks.filter((task) => {
    return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#f2efeb]/10 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#f2efeb]/50 block mb-2">
            {t.nav.tasks}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#f2efeb] tracking-tight leading-none">
            {t.tasks.title}
          </h1>
          <p className="font-mono text-xs text-[#f2efeb]/50 mt-2">
            {tasks.length} {tasks.length === 1 ? 'syssla registrerad' : 'sysslor registrerade'} i hushållet
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Add New Task Button */}
          <button
            type="button"
            onClick={openCreateModal}
            className="px-6 py-3.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#111113] font-mono text-xs uppercase tracking-wider font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.tasks.addNewTask}</span>
          </button>
        </div>
      </section>

      {/* Toolbar: Search + View switch */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#f2efeb]/40 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.tasks.searchPlaceholder || 'Sök efter syssla...'}
            className="w-full bg-[#1d1d20] border border-[#f2efeb]/10 rounded-xl py-2.5 pl-9 pr-4 rtl:pl-4 rtl:pr-9 text-xs text-[#f2efeb] placeholder:text-[#f2efeb]/40 focus:outline-hidden focus:border-[#f59e0b] transition-colors"
          />
        </div>

        {/* View Layout Toggle (List vs Grid) */}
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center bg-[#1d1d20] p-1 rounded-xl border border-[#f2efeb]/10">
            <button
              type="button"
              onClick={() => setDisplayMode('list')}
              title="Listvy"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                displayMode === 'list'
                  ? 'bg-[#f59e0b] text-[#111113] font-bold shadow-xs'
                  : 'text-[#f2efeb]/50 hover:text-[#f2efeb]'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('grid')}
              title="Rutnätsvy"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                displayMode === 'grid'
                  ? 'bg-[#f59e0b] text-[#111113] font-bold shadow-xs'
                  : 'text-[#f2efeb]/50 hover:text-[#f2efeb]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="bg-[#1d1d20] rounded-2xl border border-[#f2efeb]/10 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/5 text-[#f59e0b] flex items-center justify-center mx-auto mb-3 border border-[#f2efeb]/10">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-[#f2efeb]">{t.tasks.emptyTasks}</h3>
          <p className="text-xs text-[#f2efeb]/50 max-w-sm mx-auto mt-1 mb-6 font-mono">
            Lägg till dina egna hushållssysslor eller ladda in en standarduppsättning.
          </p>
          <div className="flex items-center justify-center gap-3 font-mono text-xs">
            <button
              onClick={onLoadDefaultTasks}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-[#f2efeb] border border-[#f2efeb]/10 transition-colors cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.tasks.loadDefaultTasks}</span>
            </button>
            <button
              onClick={openCreateModal}
              className="px-5 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#111113] font-bold uppercase transition-all cursor-pointer"
            >
              {t.tasks.addNewTask}
            </button>
          </div>
        </div>
      ) : displayMode === 'list' ? (
        /* Clean Direct List View with Task Colors */
        <div className="bg-[#1d1d20] rounded-2xl border border-[#f2efeb]/10 divide-y divide-[#f2efeb]/5 overflow-hidden shadow-xs">
          {filteredTasks.map((task, idx) => {
            const taskColor = task.color || '#f59e0b';

            return (
              <div
                key={task.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group relative"
                style={{
                  borderLeft: `4px solid ${taskColor}`,
                }}
              >
                {/* Task info: Number, Colored Icon, Title, Description */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <span className="font-mono text-[11px] text-[#f2efeb]/30 w-5 shrink-0 hidden sm:inline-block">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  <span 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105 border"
                    style={{
                      backgroundColor: `${taskColor}18`,
                      borderColor: `${taskColor}40`,
                    }}
                  >
                    {task.icon || '▫️'}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-sans font-semibold text-base text-[#f2efeb] tracking-tight group-hover:text-[#f59e0b] transition-colors truncate">
                        {task.title}
                      </h3>
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: taskColor }}
                        title={taskColor}
                      />
                    </div>
                    {task.description && (
                      <p className="text-xs text-[#f2efeb]/50 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Task Meta & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 shrink-0 font-mono text-xs">
                  {/* Frequency & Days */}
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border"
                      style={{
                        backgroundColor: `${taskColor}15`,
                        borderColor: `${taskColor}30`,
                        color: '#f2efeb',
                      }}
                    >
                      {task.frequencyPerWeek}x / vecka
                    </span>

                    {task.preferredDays && task.preferredDays.length > 0 && (
                      <div className="hidden md:flex items-center gap-1 text-[10px] text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-2 py-0.5 rounded-md">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {task.preferredDays.map((d) => t.days.short[d]).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(task)}
                      title={t.common.edit}
                      aria-label={t.common.edit}
                      className="p-2 text-[#f2efeb]/40 hover:text-[#f59e0b] hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(t.tasks.deleteConfirm)) {
                          onDeleteTask(task.id);
                        }
                      }}
                      title={t.common.delete}
                      aria-label={t.common.delete}
                      className="p-2 text-[#f2efeb]/40 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid Cards View with Task Colors */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const taskColor = task.color || '#f59e0b';

            return (
              <div
                key={task.id}
                className="bg-[#1d1d20] rounded-2xl border p-5 transition-all flex flex-col justify-between relative overflow-hidden group hover:scale-[1.01]"
                style={{
                  borderColor: `${taskColor}30`,
                }}
              >
                {/* Color Top Stripe Accent */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: taskColor }}
                />

                <div>
                  {/* Top row: Icon & Actions */}
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <span 
                      className="w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shrink-0"
                      style={{
                        backgroundColor: `${taskColor}20`,
                        borderColor: `${taskColor}40`,
                      }}
                    >
                      {task.icon || '▫️'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(task)}
                        title={t.common.edit}
                        aria-label={t.common.edit}
                        className="p-1.5 text-[#f2efeb]/40 hover:text-[#f59e0b] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(t.tasks.deleteConfirm)) {
                            onDeleteTask(task.id);
                          }
                        }}
                        title={t.common.delete}
                        aria-label={t.common.delete}
                        className="p-1.5 text-[#f2efeb]/40 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-3.5">
                    <h3 className="text-base font-semibold text-[#f2efeb] leading-snug">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-[#f2efeb]/50 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Meta */}
                <div className="mt-4 pt-3 border-t border-[#f2efeb]/5 flex items-center justify-between gap-2 font-mono text-[11px]">
                  <span 
                    className="px-2.5 py-0.5 rounded-full border text-xs"
                    style={{
                      backgroundColor: `${taskColor}15`,
                      borderColor: `${taskColor}30`,
                      color: taskColor,
                    }}
                  >
                    {task.frequencyPerWeek}x / vecka
                  </span>

                  {task.preferredDays && task.preferredDays.length > 0 && (
                    <span className="text-[10px] text-[#f59e0b]">
                      {task.preferredDays.map((d) => t.days.short[d]).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#111113]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d1d20] rounded-2xl border border-[#f2efeb]/20 max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#f2efeb]/10 mb-4">
              <h3 className="font-serif text-2xl font-semibold text-[#f2efeb]">
                {editingTask ? t.tasks.updateTask : t.tasks.addNewTask}
              </h3>
              <div 
                className="w-5 h-5 rounded-full border border-white/20 shadow-xs"
                style={{ backgroundColor: color }}
                title="Vald färg"
              />
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1">
                  {t.tasks.taskName} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.tasks.taskNamePlaceholder || 't.ex. Dammsuga vardagsrummet'}
                  className="w-full bg-[#111113] border border-[#f2efeb]/10 rounded-xl px-4 py-2.5 text-xs text-[#f2efeb] placeholder:text-[#f2efeb]/40 focus:outline-hidden focus:border-[#f59e0b]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1">
                  Beskrivning (valfritt)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kort instruktion..."
                  className="w-full bg-[#111113] border border-[#f2efeb]/10 rounded-xl px-4 py-2.5 text-xs text-[#f2efeb] placeholder:text-[#f2efeb]/40 focus:outline-hidden focus:border-[#f59e0b]"
                />
              </div>

              {/* Task Color Palette Selection */}
              <div>
                <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Välj färg för sysslan</span>
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 bg-[#111113] p-2.5 rounded-xl border border-[#f2efeb]/10">
                  {TASK_COLOR_OPTIONS.map((c) => {
                    const isSelected = color.toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setColor(c.hex)}
                        title={c.name}
                        className={`w-7 h-7 rounded-xl transition-all cursor-pointer relative flex items-center justify-center ${
                          isSelected
                            ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#111113]'
                            : 'hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Symbol / Emoji Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[#f2efeb]/70 uppercase tracking-wider">
                    Ikon / Symbol
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-12 bg-[#111113] border border-[#f2efeb]/10 rounded-lg px-2 py-1 text-center text-sm focus:border-[#f59e0b] focus:outline-hidden"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-[#111113] rounded-xl border border-[#f2efeb]/5">
                  {COMMON_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-transform cursor-pointer ${
                        icon === emoji
                          ? 'bg-[#f59e0b] text-[#111113] scale-110 shadow-xs'
                          : 'bg-white/5 hover:bg-white/10 text-[#f2efeb]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1">
                  {t.tasks.frequencyLabel}: <span className="text-[#f59e0b] font-bold">{frequencyPerWeek}x</span> {t.tasks.frequencyTimesAWeek}
                </label>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={frequencyPerWeek}
                  onChange={(e) => setFrequencyPerWeek(Number(e.target.value))}
                  className="w-full accent-[#f59e0b] cursor-pointer"
                />
              </div>

              {/* Preferred Days Toggle */}
              <div>
                <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1.5">
                  {t.tasks.preferredDays}
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                    const isSelected = preferredDays.includes(dayIdx);
                    return (
                      <button
                        key={dayIdx}
                        type="button"
                        onClick={() => togglePreferredDay(dayIdx)}
                        className={`py-2 text-xs rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#f59e0b] text-[#111113] font-bold border-[#f59e0b]'
                            : 'bg-white/5 border-[#f2efeb]/10 text-[#f2efeb]/60 hover:bg-white/10'
                        }`}
                      >
                        {t.days.short[dayIdx]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 pt-4 border-t border-[#f2efeb]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-[#f2efeb]/60 hover:text-[#f2efeb] text-xs transition-colors cursor-pointer"
                >
                  {t.tasks.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#111113] text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  {editingTask ? t.tasks.updateTask : t.tasks.saveTask}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
