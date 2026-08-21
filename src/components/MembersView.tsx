import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Check 
} from 'lucide-react';
import { Member, Language, WeeklyPlan, Task } from '../types';
import { translations } from '../i18n/translations';
import { AVATAR_OPTIONS, COLOR_OPTIONS } from '../utils/defaultData';

interface MembersViewProps {
  members: Member[];
  plan: WeeklyPlan;
  tasks: Task[];
  language: Language;
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
  onLoadDefaultMembers: () => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  plan,
  tasks,
  language,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onLoadDefaultMembers,
}) => {
  const t = translations[language];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [availableDays, setAvailableDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [avatar, setAvatar] = useState<string>('👩‍🦰');
  const [color, setColor] = useState<string>('#6366f1');

  const openCreateModal = () => {
    setEditingMember(null);
    setName('');
    setAvailableDays([0, 1, 2, 3, 4, 5, 6]);
    setAvatar(AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)]);
    setColor(COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)].hex);
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setName(member.name);
    setAvailableDays(member.availableDays);
    setAvatar(member.avatar);
    setColor(member.color);
    setIsModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingMember) {
      onUpdateMember({
        ...editingMember,
        name: name.trim(),
        role: editingMember.role || '',
        ageGroup: editingMember.ageGroup || 'adult',
        capacityWeight: editingMember.capacityWeight || 1.0,
        availableDays,
        avatar,
        color,
      });
    } else {
      const newMember: Member = {
        id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: name.trim(),
        role: '',
        ageGroup: 'adult',
        capacityWeight: 1.0,
        availableDays,
        avatar,
        color,
      };
      onAddMember(newMember);
    }

    setIsModalOpen(false);
  };

  const toggleDay = (dayIndex: number) => {
    if (availableDays.includes(dayIndex)) {
      if (availableDays.length === 1) return; // at least 1 day
      setAvailableDays(availableDays.filter((d) => d !== dayIndex));
    } else {
      setAvailableDays([...availableDays, dayIndex].sort());
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#f2efeb]/10 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#f2efeb]/50 block mb-2">
            Hushållet & Profiler
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#f2efeb] tracking-tight leading-none">
            {t.members.title}
          </h1>
          <p className="font-mono text-xs text-[#f2efeb]/50 mt-2">
            {t.members.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="px-6 py-3.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#111113] font-mono text-xs uppercase tracking-wider font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.members.addNewMember}</span>
          </button>
        </div>
      </section>

      {/* Members Grid */}
      {members.length === 0 ? (
        <div className="bg-[#1d1d20] rounded-2xl border border-[#f2efeb]/10 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/5 text-[#f59e0b] flex items-center justify-center mx-auto mb-3 border border-[#f2efeb]/10">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-[#f2efeb]">{t.members.emptyMembers}</h3>
          <p className="text-xs text-[#f2efeb]/50 max-w-sm mx-auto mt-1 mb-6 font-mono">
            Lägg till familjens medlemmar eller rumskamrater för att dela upp hushållsarbetet rättvist.
          </p>
          <div className="flex items-center justify-center gap-3 font-mono text-xs">
            <button
              onClick={onLoadDefaultMembers}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-[#f2efeb] border border-[#f2efeb]/10 transition-colors cursor-pointer"
            >
              {t.members.loadDefaultMembers}
            </button>
            <button
              onClick={openCreateModal}
              className="px-5 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#111113] font-bold uppercase transition-all cursor-pointer"
            >
              {t.members.addNewMember}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => {
            const memberScheduleItems = plan.items.filter((i) => i.memberId === member.id);
            const memberPoints = memberScheduleItems.reduce((sum, item) => {
              const task = tasks.find((t) => t.id === item.taskId);
              return sum + (task?.points || 0);
            }, 0);

            return (
              <div
                key={member.id}
                className="bg-[#1d1d20] rounded-2xl border border-[#f2efeb]/10 p-5 hover:border-[#f59e0b]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Avatar, Name & Edit Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10"
                        style={{
                          backgroundColor: `${member.color}20`,
                        }}
                      >
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-[#f2efeb] leading-snug">
                          {member.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(member)}
                        title={t.common.edit}
                        aria-label={t.common.edit}
                        className="p-1.5 text-[#f2efeb]/40 hover:text-[#f59e0b] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(t.members.deleteConfirm)) {
                            onDeleteMember(member.id);
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

                  {/* Assigned Chores Stats */}
                  <div className="mt-4 space-y-2 bg-[#111113] p-3 rounded-xl border border-[#f2efeb]/10 font-mono text-xs">
                    <div className="flex items-center justify-between text-[#f2efeb]/70">
                      <span>Tilldelat denna vecka:</span>
                      <span className="text-[#f59e0b] font-bold">
                        {memberScheduleItems.length} {memberScheduleItems.length === 1 ? 'syssla' : 'sysslor'}
                      </span>
                    </div>
                  </div>

                  {/* Available Days */}
                  <div className="mt-4 pt-3.5 border-t border-[#f2efeb]/5">
                    <span className="font-mono text-[11px] text-[#f2efeb]/50 block mb-1.5 uppercase">
                      {t.members.availableDays}:
                    </span>
                    <div className="grid grid-cols-7 gap-1 font-mono text-xs">
                      {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                        const isAvail = member.availableDays.includes(dayIdx);
                        return (
                          <div
                            key={dayIdx}
                            className={`py-1 text-center text-[10px] rounded-lg border ${
                              isAvail
                                ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30 font-bold'
                                : 'bg-white/[0.02] text-[#f2efeb]/30 border-transparent'
                            }`}
                          >
                            {t.days.short[dayIdx]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#111113]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1d1d20] rounded-2xl border border-[#f2efeb]/20 max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 font-mono text-xs">
            <h3 className="font-serif text-2xl font-semibold text-[#f2efeb] mb-4">
              {editingMember ? t.members.updateMember : t.members.addNewMember}
            </h3>

            <form onSubmit={handleSaveMember} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1">
                  {t.members.memberName} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.members.memberNamePlaceholder}
                  className="w-full bg-[#111113] border border-[#f2efeb]/10 rounded-xl px-4 py-2.5 text-xs text-[#f2efeb] placeholder:text-[#f2efeb]/40 focus:outline-hidden focus:border-[#f59e0b]"
                />
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1.5">
                  {t.members.selectAvatar}
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {AVATAR_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setAvatar(em)}
                      className={`h-10 text-lg rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        avatar === em
                          ? 'bg-[#f59e0b] text-[#111113] scale-105'
                          : 'bg-white/5 hover:bg-white/10 text-[#f2efeb]'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1.5">
                  {t.members.selectColor}
                </label>
                <div className="flex items-center gap-2.5">
                  {COLOR_OPTIONS.map((col) => (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => setColor(col.hex)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                        color === col.hex ? 'ring-2 ring-[#f59e0b] scale-110' : ''
                      }`}
                      style={{ backgroundColor: col.hex }}
                    >
                      {color === col.hex && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Days */}
              <div>
                <label className="block text-[#f2efeb]/70 uppercase tracking-wider mb-1.5">
                  {t.members.availableDays}
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                    const isSelected = availableDays.includes(dayIdx);
                    return (
                      <button
                        key={dayIdx}
                        type="button"
                        onClick={() => toggleDay(dayIdx)}
                        className={`py-2 text-xs rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#f59e0b] text-[#111113] font-bold border-[#f59e0b]'
                            : 'bg-white/5 border-[#f2efeb]/10 text-[#f2efeb]/50 hover:bg-white/10'
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
                  {t.members.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#111113] text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  {editingMember ? t.members.updateMember : t.members.saveMember}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
