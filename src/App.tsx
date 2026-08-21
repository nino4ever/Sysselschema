/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CalendarView } from './components/CalendarView';
import { TasksView } from './components/TasksView';
import { MembersView } from './components/MembersView';
import { ShareExportView } from './components/ShareExportView';
import { FairnessMeter } from './components/FairnessMeter';
import { QuickTaskModal } from './components/QuickTaskModal';
import { Task, Member, WeeklyPlan, Language, SavedPreset, ScheduleItem, Theme } from './types';
import { getDefaultMembers, getDefaultTasks } from './utils/defaultData';
import { generateFairWeeklySchedule, getWeekNumber } from './utils/scheduler';
import { translations } from './i18n/translations';

const STORAGE_KEYS = {
  LANGUAGE: 'sysselschema_lang',
  THEME: 'sysselschema_theme',
  TASKS: 'sysselschema_tasks',
  MEMBERS: 'sysselschema_members',
  PLAN: 'sysselschema_current_plan',
  PRESETS: 'sysselschema_saved_presets',
};

export default function App() {
  // 1. Language state (Default: Swedish 'sv')
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (saved === 'sv' || saved === 'en' || saved === 'ar') ? saved : 'sv';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  // Theme state (Default: 'dark')
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as Theme;
    const validThemes: Theme[] = ['dark', 'light', 'nordic', 'forest', 'sunset'];
    return validThemes.includes(saved) ? saved : 'dark';
  });

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, nextTheme);
  };

  // Synchronize theme with documentElement
  useEffect(() => {
    const allThemes: Theme[] = ['dark', 'light', 'nordic', 'forest', 'sunset'];
    allThemes.forEach((t) => {
      document.documentElement.classList.remove(t);
    });
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync RTL / LTR document attributes
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  // 2. Navigation Tab
  const [currentTab, setCurrentTab] = useState<'calendar' | 'tasks' | 'members' | 'share' | 'stats'>('tasks');

  // 3. Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return getDefaultTasks('sv');
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  // 4. Members state
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return getDefaultMembers('sv');
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  // 5. Current Weekly Plan state
  const [plan, setPlan] = useState<WeeklyPlan>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const currentWeekInfo = getWeekNumber(new Date());
    const initialDistribution = generateFairWeeklySchedule(
      getDefaultTasks('sv'),
      getDefaultMembers('sv')
    );

    return {
      id: `plan_${currentWeekInfo.year}_w${currentWeekInfo.week}`,
      title: `Vecka ${currentWeekInfo.week}, ${currentWeekInfo.year}`,
      weekNumber: currentWeekInfo.week,
      year: currentWeekInfo.year,
      startDate: new Date().toISOString(),
      items: initialDistribution.items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
  }, [plan]);

  // 6. Saved Presets / Archive
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRESETS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(savedPresets));
  }, [savedPresets]);

  // 7. Modal & Generating states
  const [isGenerating, setIsGenerating] = useState(false);
  const [quickTaskModal, setQuickTaskModal] = useState<{ isOpen: boolean; dayIndex: number }>({
    isOpen: false,
    dayIndex: 0,
  });

  // Handlers
  const handleGenerateSchedule = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateFairWeeklySchedule(tasks, members, plan.weekNumber);
      setPlan((prev) => ({
        ...prev,
        items: result.items,
        updatedAt: new Date().toISOString(),
      }));
      setIsGenerating(false);
      setCurrentTab('calendar');
    }, 350);
  };

  const handleNavigateWeek = (delta: number) => {
    let nextWeek = plan.weekNumber + delta;
    let nextYear = plan.year;

    if (nextWeek > 52) {
      nextWeek = 1;
      nextYear += 1;
    } else if (nextWeek < 1) {
      nextWeek = 52;
      nextYear -= 1;
    }

    // Auto-generate or maintain week plan
    const result = generateFairWeeklySchedule(tasks, members, nextWeek);
    setPlan({
      id: `plan_${nextYear}_w${nextWeek}`,
      title: `Vecka ${nextWeek}, ${nextYear}`,
      weekNumber: nextWeek,
      year: nextYear,
      startDate: new Date().toISOString(),
      items: result.items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleResetDefaults = () => {
    const t = translations[language];
    if (window.confirm(t.common.resetDefaultsConfirm)) {
      const defaultTasks = getDefaultTasks(language);
      const defaultMembers = getDefaultMembers(language);
      const currentWeekInfo = getWeekNumber(new Date());
      const distribution = generateFairWeeklySchedule(defaultTasks, defaultMembers);

      setTasks(defaultTasks);
      setMembers(defaultMembers);
      setPlan({
        id: `plan_${currentWeekInfo.year}_w${currentWeekInfo.week}`,
        title: `Vecka ${currentWeekInfo.week}, ${currentWeekInfo.year}`,
        weekNumber: currentWeekInfo.week,
        year: currentWeekInfo.year,
        startDate: new Date().toISOString(),
        items: distribution.items,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Task actions
  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setPlan((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.taskId !== taskId),
    }));
  };

  // Member actions
  const handleAddMember = (newMember: Member) => {
    setMembers((prev) => [...prev, newMember]);
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updatedMember.id ? updatedMember : m)));
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setPlan((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.memberId !== memberId),
    }));
  };

  // Presets / Archive
  const handleSavePreset = (name: string) => {
    const newPreset: SavedPreset = {
      id: `preset_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      tasks: [...tasks],
      members: [...members],
      plan: { ...plan },
    };
    setSavedPresets((prev) => [newPreset, ...prev]);
  };

  const handleLoadPreset = (preset: SavedPreset) => {
    setTasks(preset.tasks);
    setMembers(preset.members);
    setPlan(preset.plan);
    setCurrentTab('calendar');
  };

  const handleDeletePreset = (presetId: string) => {
    setSavedPresets((prev) => prev.filter((p) => p.id !== presetId));
  };

  // Quick Task Modal handlers
  const handleAddScheduledItem = (taskId: string, memberId: string, dayIndex: number) => {
    const newItem: ScheduleItem = {
      id: `sched_adhoc_${Date.now()}`,
      taskId,
      memberId,
      dayIndex,
      completed: false,
    };
    setPlan((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleAddNewTaskAndSchedule = (newTask: Task, memberId: string, dayIndex: number) => {
    setTasks((prev) => [...prev, newTask]);
    const newItem: ScheduleItem = {
      id: `sched_adhoc_${Date.now()}`,
      taskId: newTask.id,
      memberId,
      dayIndex,
      completed: false,
    };
    setPlan((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Calculate global summary stats for footer
  const totalItems = plan.items.length;
  const completedItems = plan.items.filter((i) => i.completed).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#111113] text-[#f2efeb] flex flex-col font-sans antialiased selection:bg-[#f59e0b] selection:text-[#111113]">
      {/* Top Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        onGenerateSchedule={handleGenerateSchedule}
        isGenerating={isGenerating}
        onResetDefaults={handleResetDefaults}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'calendar' && (
          <CalendarView
            plan={plan}
            tasks={tasks}
            members={members}
            language={language}
            onUpdatePlan={setPlan}
            onGenerateSchedule={handleGenerateSchedule}
            isGenerating={isGenerating}
            onNavigateWeek={handleNavigateWeek}
            onOpenQuickTaskModal={(dayIndex) =>
              setQuickTaskModal({ isOpen: true, dayIndex })
            }
          />
        )}

        {currentTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            language={language}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onLoadDefaultTasks={() => setTasks(getDefaultTasks(language))}
          />
        )}

        {currentTab === 'members' && (
          <MembersView
            members={members}
            plan={plan}
            tasks={tasks}
            language={language}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onLoadDefaultMembers={() => setMembers(getDefaultMembers(language))}
          />
        )}

        {currentTab === 'share' && (
          <ShareExportView
            plan={plan}
            tasks={tasks}
            members={members}
            language={language}
            savedPresets={savedPresets}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
          />
        )}

        {currentTab === 'stats' && (
          <FairnessMeter
            plan={plan}
            tasks={tasks}
            members={members}
            language={language}
          />
        )}
      </main>

      {/* Quick Task Modal */}
      <QuickTaskModal
        isOpen={quickTaskModal.isOpen}
        dayIndex={quickTaskModal.dayIndex}
        tasks={tasks}
        members={members}
        language={language}
        onClose={() => setQuickTaskModal({ isOpen: false, dayIndex: 0 })}
        onAddScheduledItem={handleAddScheduledItem}
        onAddNewTaskAndSchedule={handleAddNewTaskAndSchedule}
      />

      {/* Dashboard Editorial Footer */}
      <footer className="mt-auto border-t border-[#f2efeb]/10 bg-[#111113] px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-8 text-[#f2efeb]">
          <div>
            STATUS: <span className="text-[#f59e0b] font-bold">{completionPercentage}% KLART</span>
          </div>
          <div>
            TOTALT SYSSLOR: <span className="text-[#f59e0b] font-bold">{totalItems}</span>
          </div>
          <div>
            UTFÖRDA: <span className="text-[#f59e0b] font-bold">{completedItems} / {totalItems}</span>
          </div>
        </div>
        <div className="text-[#f2efeb]/30 text-[11px] tracking-wider uppercase">
          EST. 2026 / SYSSELSCHEMA CORE
        </div>
      </footer>
    </div>
  );
}
