import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Member, Task, WeeklyPlan, Language } from '../types';
import { translations } from '../i18n/translations';

interface FairnessMeterProps {
  plan: WeeklyPlan;
  tasks: Task[];
  members: Member[];
  language: Language;
}

export const FairnessMeter: React.FC<FairnessMeterProps> = ({
  plan,
  members,
  language,
}) => {
  const t = translations[language];

  // Compute metrics per member based on count of tasks
  const memberMetrics = members.map((member) => {
    const assignedItems = plan.items.filter((i) => i.memberId === member.id);
    const completedItems = assignedItems.filter((i) => i.completed);
    
    const assignedCount = assignedItems.length;
    const targetCapacity = member.capacityWeight || 1.0;
    const loadPerCapacityUnit = targetCapacity > 0 ? (assignedCount / targetCapacity) : assignedCount;

    return {
      member,
      assignedCount,
      completedCount: completedItems.length,
      loadPerCapacityUnit,
    };
  });

  const totalAssignedTasks = memberMetrics.reduce((sum, m) => sum + m.assignedCount, 0);

  // Fairness index calculation based on task load
  const loads = memberMetrics.map((m) => m.loadPerCapacityUnit);
  const avgLoad = loads.length > 0 ? loads.reduce((a, b) => a + b, 0) / loads.length : 0;
  
  let fairnessScore = 100;
  if (avgLoad > 0 && loads.length > 1) {
    const variance = loads.reduce((sum, val) => sum + Math.pow(val - avgLoad, 2), 0) / loads.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / avgLoad;
    fairnessScore = Math.max(60, Math.min(100, Math.round(100 - cv * 40)));
  }

  return (
    <div className="space-y-8">
      {/* Top Fairness Overview Banner */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#f2efeb]/10 pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#f2efeb]/50 block mb-2">
            Balans & Fördelning
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#f2efeb] tracking-tight leading-none">
              {t.fairness.fairnessDistribution}
            </h1>
            <span className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] font-mono text-xs px-3 py-1 rounded-full font-bold">
              {fairnessScore}% Rättvist fördelat
            </span>
          </div>
          <p className="font-mono text-xs text-[#f2efeb]/50 mt-2">
            {t.fairness.explanation}
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#1d1d20] border border-[#f2efeb]/10 px-4 py-2.5 rounded-xl">
            <span className="text-[#f2efeb]/50 uppercase tracking-wider block text-[10px]">{t.fairness.tasksCount}</span>
            <span className="text-lg font-bold text-[#f59e0b]">
              {plan.items.length} {plan.items.length === 1 ? 'syssla' : 'sysslor'}
            </span>
          </div>
        </div>
      </section>

      {/* Member Breakdown Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memberMetrics.map(({ member, assignedCount, completedCount }) => {
          const taskShare = totalAssignedTasks > 0 ? Math.round((assignedCount / totalAssignedTasks) * 100) : 0;
          const targetShare = Math.round(
            (member.capacityWeight /
              members.reduce((acc, m) => acc + (m.capacityWeight || 1), 0)) *
              100
          );

          return (
            <div
              key={member.id}
              className="bg-[#1d1d20] rounded-2xl border border-[#f2efeb]/10 p-5 space-y-4 font-mono text-xs hover:border-[#f59e0b]/50 transition-all"
            >
              {/* Member Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl border border-white/10"
                    style={{
                      backgroundColor: `${member.color}20`,
                    }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-sans font-medium text-[#f2efeb]">{member.name}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-[#f59e0b]">
                    {assignedCount} {assignedCount === 1 ? 'syssla' : 'sysslor'}
                  </span>
                </div>
              </div>

              {/* Share of Workload Progress Bar */}
              <div className="space-y-1.5 bg-[#111113] p-3 rounded-xl border border-[#f2efeb]/10">
                <div className="flex justify-between text-xs text-[#f2efeb]/70">
                  <span>Faktisk andel: <strong className="text-[#f2efeb]">{taskShare}%</strong></span>
                  <span className="text-[#f59e0b]">Målandel: {targetShare}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-[#f2efeb]/10">
                  <div
                    className="h-full rounded-full transition-all bg-[#f59e0b]"
                    style={{
                      width: `${taskShare}%`,
                    }}
                  />
                </div>
              </div>

              {/* Tasks Count & Completion */}
              <div className="pt-2 border-t border-[#f2efeb]/5 flex items-center justify-between text-xs text-[#f2efeb]/60">
                <span>{assignedCount} tilldelade uppgifter</span>
                <span className="text-[#f59e0b] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedCount} klara</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
