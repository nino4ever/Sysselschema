import { Member, Task, ScheduleItem } from '../types';

export interface SchedulerResult {
  items: ScheduleItem[];
  fairnessScore: number; // 0 to 100%
  memberLoadMap: Record<string, { taskCount: number }>;
}

export function generateFairWeeklySchedule(
  tasks: Task[],
  members: Member[],
  weekSeedOffset: number = 0
): SchedulerResult {
  if (tasks.length === 0 || members.length === 0) {
    return {
      items: [],
      fairnessScore: 100,
      memberLoadMap: {},
    };
  }

  const items: ScheduleItem[] = [];
  const memberTaskCount: Record<string, number> = {};
  const memberDailyTasks: Record<string, Record<number, number>> = {};

  members.forEach((m) => {
    memberTaskCount[m.id] = 0;
    memberDailyTasks[m.id] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  });

  // Calculate task instances to be placed throughout the 7 days (0..6)
  interface TaskInstance {
    task: Task;
    dayIndex: number;
  }

  const taskInstances: TaskInstance[] = [];

  tasks.forEach((task) => {
    const freq = Math.min(Math.max(1, task.frequencyPerWeek), 7);
    let chosenDays: number[] = [];

    if (task.preferredDays && task.preferredDays.length > 0) {
      chosenDays = [...task.preferredDays];
      // If preferred days count is less than frequency, fill remaining evenly
      if (chosenDays.length < freq) {
        const remaining = [0, 1, 2, 3, 4, 5, 6].filter((d) => !chosenDays.includes(d));
        while (chosenDays.length < freq && remaining.length > 0) {
          const nextDay = remaining.shift()!;
          chosenDays.push(nextDay);
        }
      } else if (chosenDays.length > freq) {
        chosenDays = chosenDays.slice(0, freq);
      }
    } else {
      // Spread evenly across week
      if (freq === 7) {
        chosenDays = [0, 1, 2, 3, 4, 5, 6];
      } else if (freq === 6) {
        chosenDays = [0, 1, 2, 3, 4, 5];
      } else if (freq === 5) {
        chosenDays = [0, 1, 2, 3, 4];
      } else if (freq === 4) {
        chosenDays = [0, 2, 4, 6];
      } else if (freq === 3) {
        chosenDays = [1, 3, 5]; // Tue, Thu, Sat
      } else if (freq === 2) {
        chosenDays = [1, 5]; // Tue, Sat
      } else {
        // freq === 1, rotate with seed offset
        const spreadDays = [5, 2, 0, 4, 6, 1, 3];
        const day = spreadDays[(task.title.length + weekSeedOffset) % 7];
        chosenDays = [day];
      }
    }

    chosenDays.forEach((d) => {
      taskInstances.push({
        task,
        dayIndex: d,
      });
    });
  });

  // Assign each task instance to the optimal member
  taskInstances.forEach((inst, idx) => {
    const { task, dayIndex } = inst;

    // Check if task is locked to a specific member
    if (task.lockedMemberId) {
      const lockedMember = members.find((m) => m.id === task.lockedMemberId);
      if (lockedMember) {
        assignTaskToMember(lockedMember.id, task, dayIndex, idx);
        return;
      }
    }

    // Filter available candidates
    let candidates = members.filter((m) => {
      const isDayAvailable = m.availableDays.includes(dayIndex);
      if (!isDayAvailable) return false;

      // Check age group suitability
      if (task.requiredAgeGroup === 'adult' && m.ageGroup !== 'adult') {
        return false;
      }
      return true;
    });

    // Fallback if no candidate meets strict requirements
    if (candidates.length === 0) {
      candidates = members.filter((m) => m.availableDays.includes(dayIndex));
    }
    if (candidates.length === 0) {
      candidates = [...members];
    }

    // Score candidates based on relative capacity workload
    // Normalized load = (current tasks) / (capacityWeight)
    // Add penalty if they already have tasks on the same day
    let bestMember = candidates[0];
    let lowestScore = Infinity;

    candidates.forEach((member) => {
      const weight = member.capacityWeight || 1.0;
      const currentCount = memberTaskCount[member.id] || 0;
      const normalizedLoad = currentCount / weight;
      const sameDayCount = memberDailyTasks[member.id]?.[dayIndex] || 0;

      const score = normalizedLoad + (sameDayCount * 2.5);

      if (score < lowestScore) {
        lowestScore = score;
        bestMember = member;
      }
    });

    assignTaskToMember(bestMember.id, task, dayIndex, idx);
  });

  function assignTaskToMember(memberId: string, task: Task, dayIndex: number, index: number) {
    items.push({
      id: `sched_${task.id}_${dayIndex}_${index}`,
      taskId: task.id,
      memberId,
      dayIndex,
      completed: false,
    });

    memberTaskCount[memberId] = (memberTaskCount[memberId] || 0) + 1;
    memberDailyTasks[memberId][dayIndex] = (memberDailyTasks[memberId][dayIndex] || 0) + 1;
  }

  // Calculate fairness index (0-100%) based on variance of normalized loads
  const normalizedLoads = members.map((m) => {
    const count = memberTaskCount[m.id] || 0;
    const weight = m.capacityWeight || 1.0;
    return count / weight;
  });

  const avgLoad = normalizedLoads.reduce((a, b) => a + b, 0) / (members.length || 1);
  let fairnessScore = 95;
  if (avgLoad > 0) {
    const variance =
      normalizedLoads.reduce((sum, val) => sum + Math.pow(val - avgLoad, 2), 0) /
      (members.length || 1);
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / avgLoad; // coefficient of variation
    fairnessScore = Math.max(60, Math.min(100, Math.round(100 - cv * 45)));
  }

  const memberLoadMap: Record<string, { taskCount: number }> = {};
  members.forEach((m) => {
    memberLoadMap[m.id] = {
      taskCount: memberTaskCount[m.id] || 0,
    };
  });

  // Sort items by dayIndex
  items.sort((a, b) => {
    return a.dayIndex - b.dayIndex;
  });

  return {
    items,
    fairnessScore,
    memberLoadMap,
  };
}

export function formatWeekTitle(weekNumber: number, year: number, lang: 'sv' | 'en' | 'ar'): string {
  if (lang === 'sv') return `Vecka ${weekNumber}, ${year}`;
  if (lang === 'ar') return `الأسبوع ${weekNumber} (${year})`;
  return `Week ${weekNumber}, ${year}`;
}

export function getWeekNumber(date: Date = new Date()): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { week: weekNo, year: d.getUTCFullYear() };
}
