import React, { useState } from 'react';
import { X, Palette } from 'lucide-react';
import { Task, Member, Language } from '../types';
import { translations } from '../i18n/translations';
import { TASK_COLOR_OPTIONS } from '../utils/defaultData';

interface QuickTaskModalProps {
  isOpen: boolean;
  dayIndex: number;
  tasks: Task[];
  members: Member[];
  language: Language;
  onClose: () => void;
  onAddScheduledItem: (taskId: string, memberId: string, dayIndex: number) => void;
  onAddNewTaskAndSchedule: (task: Task, memberId: string, dayIndex: number) => void;
}

export const QuickTaskModal: React.FC<QuickTaskModalProps> = ({
  isOpen,
  dayIndex,
  tasks,
  members,
  language,
  onClose,
  onAddScheduledItem,
  onAddNewTaskAndSchedule,
}) => {
  const t = translations[language];
  const [mode, setMode] = useState<'existing' | 'custom'>('existing');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  
  // Custom quick task states
  const [customTitle, setCustomTitle] = useState('');
  const [customIcon, setCustomIcon] = useState('📌');
  const [customColor, setCustomColor] = useState('#f59e0b');

  if (!isOpen) return null;

  const dayName = t.days.full[dayIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'existing') {
      if (!selectedTaskId || !selectedMemberId) return;
      onAddScheduledItem(selectedTaskId, selectedMemberId, dayIndex);
    } else {
      if (!customTitle.trim() || !selectedMemberId) return;
      const newTask: Task = {
        id: `tsk_${Date.now()}`,
        title: customTitle.trim(),
        category: 'general',
        color: customColor || '#f59e0b',
        points: 2,
        estimatedMinutes: 15,
        frequencyPerWeek: 1,
        icon: customIcon || '📌',
      };
      onAddNewTaskAndSchedule(newTask, selectedMemberId, dayIndex);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111113]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1d1d20] rounded-2xl border border-[#f2efeb]/20 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#f2efeb]/10">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-[#f2efeb] leading-tight">
              {t.calendar.addQuickTask}
            </h3>
            <span className="text-xs text-[#f59e0b]">{dayName}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#f2efeb]/40 hover:text-[#f2efeb] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch: Existing vs Custom */}
        <div className="flex items-center bg-[#111113] p-1 rounded-xl my-4 border border-[#f2efeb]/10">
          <button
            type="button"
            onClick={() => setMode('existing')}
            className={`flex-1 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'existing'
                ? 'bg-[#1d1d20] text-[#f59e0b] font-bold shadow-xs'
                : 'text-[#f2efeb]/50 hover:text-[#f2efeb]'
            }`}
          >
            Välj befintlig
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`flex-1 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'custom'
                ? 'bg-[#1d1d20] text-[#f59e0b] font-bold shadow-xs'
                : 'text-[#f2efeb]/50 hover:text-[#f2efeb]'
            }`}
          >
            Skapa ny direkt
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'existing' ? (
            <div>
              <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1">
                Välj syssla ur biblioteket
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full bg-[#111113] border border-[#f2efeb]/10 rounded-xl px-4 py-2.5 text-xs text-[#f2efeb] focus:outline-hidden"
              >
                {tasks.map((task) => (
                  <option key={task.id} value={task.id} className="bg-[#1d1d20]">
                    {task.icon || '▫️'} {task.title}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1">
                  Sysslans namn *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="t.ex. Byta sängkläder..."
                  className="w-full bg-[#111113] border border-[#f2efeb]/10 rounded-xl px-4 py-2.5 text-xs text-[#f2efeb] placeholder:text-[#f2efeb]/40 focus:outline-hidden focus:border-[#f59e0b]"
                />
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Färg</span>
                </label>
                <div className="flex flex-wrap gap-1.5 bg-[#111113] p-2 rounded-xl border border-[#f2efeb]/10">
                  {TASK_COLOR_OPTIONS.slice(0, 8).map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setCustomColor(c.hex)}
                      className={`w-6 h-6 rounded-lg transition-all cursor-pointer ${
                        customColor === c.hex
                          ? 'ring-2 ring-white scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assign to Member */}
          <div>
            <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1">
              Tilldela person
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-[#111113] border border-[#f2efeb]/10 rounded-xl px-4 py-2.5 text-xs text-[#f2efeb] focus:outline-hidden"
            >
              {members.map((member) => (
                <option key={member.id} value={member.id} className="bg-[#1d1d20]">
                  {member.avatar} {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 pt-4 border-t border-[#f2efeb]/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-[#f2efeb]/60 hover:text-[#f2efeb] text-xs transition-colors cursor-pointer"
            >
              {t.tasks.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#111113] text-xs font-bold uppercase transition-all cursor-pointer"
            >
              Lägg till på {dayName}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
