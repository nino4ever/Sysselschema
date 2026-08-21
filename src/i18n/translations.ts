import { Language, TaskCategory, AgeGroup, Theme } from '../types';

export interface Translations {
  appName: string;
  appTagline: string;
  nav: {
    calendar: string;
    tasks: string;
    members: string;
    share: string;
    stats: string;
  };
  days: {
    full: string[];
    short: string[];
  };
  categories: Record<TaskCategory, string>;
  ageGroups: Record<AgeGroup, string>;
  calendar: {
    title: string;
    subtitle: string;
    weekLabel: string;
    previousWeek: string;
    nextWeek: string;
    currentWeek: string;
    viewModeGrid: string;
    viewModeMember: string;
    viewHorizontal: string;
    viewVertical: string;
    orientation: string;
    generateSchedule: string;
    generating: string;
    fairnessScore: string;
    fairDistributionDesc: string;
    noTasksScheduled: string;
    addQuickTask: string;
    reassign: string;
    markDone: string;
    markUndone: string;
    completed: string;
    pending: string;
    completionProgress: string;
    clearSchedule: string;
    clearScheduleConfirm: string;
    filterMember: string;
    allMembers: string;
    allDays: string;
    totalPoints: string;
    totalMinutes: string;
    min: string;
    pts: string;
    taskSwapped: string;
    pointsAssigned: string;
    streakMessage: string;
  };
  tasks: {
    title: string;
    subtitle: string;
    addNewTask: string;
    taskName: string;
    taskNamePlaceholder: string;
    category: string;
    pointsLabel: string;
    pointsDesc: string;
    estimatedTime: string;
    frequencyLabel: string;
    frequencyTimesAWeek: string;
    preferredDays: string;
    anyDay: string;
    suitability: string;
    saveTask: string;
    updateTask: string;
    cancel: string;
    deleteTask: string;
    deleteConfirm: string;
    emptyTasks: string;
    loadDefaultTasks: string;
    totalTasks: string;
    easy: string;
    medium: string;
    hard: string;
    searchPlaceholder: string;
    allCategories: string;
    filterBy: string;
  };
  members: {
    title: string;
    subtitle: string;
    addNewMember: string;
    memberName: string;
    memberNamePlaceholder: string;
    roleOrRelationship: string;
    rolePlaceholder: string;
    ageGroup: string;
    capacityWeight: string;
    capacityHelp: string;
    availableDays: string;
    selectColor: string;
    selectAvatar: string;
    saveMember: string;
    updateMember: string;
    cancel: string;
    deleteMember: string;
    deleteConfirm: string;
    emptyMembers: string;
    loadDefaultMembers: string;
    totalMembers: string;
    workloadRatio: string;
    tasksAssigned: string;
  };
  share: {
    title: string;
    subtitle: string;
    exportPoster: string;
    exportPosterDesc: string;
    downloadImage: string;
    generatingImage: string;
    printFriendly: string;
    printSchedule: string;
    whatsappShare: string;
    copyWhatsapp: string;
    copied: string;
    whatsappTextPreview: string;
    memberCards: string;
    shareMyTasks: string;
    saveSnapshot: string;
    saveSnapshotDesc: string;
    snapshotName: string;
    savedSchedules: string;
    loadSchedule: string;
    deleteSchedule: string;
    noSavedSchedules: string;
    scheduleSavedSuccess: string;
    fridgeReady: string;
    exportJson: string;
    importJson: string;
    shareWithFamily: string;
  };
  fairness: {
    balanced: string;
    imbalanced: string;
    fairnessDistribution: string;
    explanation: string;
    pointsSummary: string;
    tasksCount: string;
  };
  categoryManagement: {
    title: string;
    subtitle: string;
    manageBtn: string;
    addCategory: string;
    editCategory: string;
    categoryName: string;
    categoryNamePlaceholder: string;
    categorySymbol: string;
    symbolPicker: string;
    customSymbol: string;
    saveCategory: string;
    createCategory: string;
    deleteCategory: string;
    deleteCategoryConfirm: string;
    resetDefaults: string;
    resetDefaultsConfirm: string;
    totalCategories: string;
    presetIcons: string;
  };
  common: {
    edit: string;
    delete: string;
    close: string;
    save: string;
    success: string;
    done: string;
    points: string;
    minutes: string;
    options: string;
    actions: string;
    language: string;
    switchLang: string;
    theme: string;
    chooseTheme: string;
    themes: Record<Theme, string>;
    lightMode: string;
    darkMode: string;
    dayNight: string;
    resetDefaults: string;
    resetDefaultsConfirm: string;
  };
}

export const translations: Record<Language, Translations> = {
  sv: {
    appName: 'SysselSchema',
    appTagline: 'Rättvis veckofördelning av hushållets sysslor',
    nav: {
      calendar: 'Veckoschema',
      tasks: 'Sysslor & Uppgifter',
      members: 'Familjemedlemmar',
      share: 'Dela & Spara',
      stats: 'Rättvisemätare',
    },
    days: {
      full: ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'],
      short: ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'],
    },
    categories: {
      kitchen: 'Kök & Disk',
      cleaning: 'Städning & Dammsugning',
      laundry: 'Tvätt & Kläder',
      cooking: 'Matlagning',
      shopping: 'Handling & Ärenden',
      outdoor: 'Trädgård & Sopor',
      pets: 'Husdjur',
      organization: 'Ordning & Plock',
      bathroom: 'Badrum & Toalett',
    },
    ageGroups: {
      adult: 'Vuxen (100% kapacitet)',
      teen: 'Tonåring (75% kapacitet)',
      child: 'Barn (50% kapacitet)',
    },
    calendar: {
      title: 'Veckokalender',
      subtitle: 'Se och bocka av veckans fördelade hushållssysslor',
      weekLabel: 'Vecka',
      previousWeek: 'Föregående vecka',
      nextWeek: 'Nästa vecka',
      currentWeek: 'Denna vecka',
      viewModeGrid: 'Dag för dag',
      viewModeMember: 'Per person',
      viewHorizontal: 'Horisontell',
      viewVertical: 'Vertikal',
      orientation: 'Orientering',
      generateSchedule: 'Generera rättvist schema',
      generating: 'Fördelar rättvist...',
      fairnessScore: 'Rättviseindex',
      fairDistributionDesc: 'Sysslorna har fördelats jämnt baserat på kapacitet och tillgänglighet.',
      noTasksScheduled: 'Inga sysslor inlagda för denna dag.',
      addQuickTask: 'Lägg till snabbsyssla',
      reassign: 'Byt person',
      markDone: 'Klart!',
      markUndone: 'Ångra avbockning',
      completed: 'Slutförda',
      pending: 'Återstår',
      completionProgress: 'Framsteg denna vecka',
      clearSchedule: 'Rensa schemat',
      clearScheduleConfirm: 'Är du säker på att du vill rensa alla tilldelade sysslor denna vecka?',
      filterMember: 'Filtrera person',
      allMembers: 'Alla medlemmar',
      allDays: 'Hela veckan',
      totalPoints: 'Totala poäng',
      totalMinutes: 'Total tid',
      min: 'min',
      pts: 'p',
      taskSwapped: 'Sysslan har flyttats!',
      pointsAssigned: 'Poängfördelning',
      streakMessage: 'Bra jobbat! En syssla till avklarad! 🎉',
    },
    tasks: {
      title: 'Sysslor & Uppgifter',
      subtitle: 'Hantera hushållets alla sysslor, tidsåtgång och svårighetsgrad',
      addNewTask: 'Skapa ny syssla',
      taskName: 'Sysslans namn',
      taskNamePlaceholder: 't.ex. Plocka ur diskmaskinen, Dammsuga vardagsrummet...',
      category: 'Kategori',
      pointsLabel: 'Poäng / Svårighet (1-5)',
      pointsDesc: '1 = Enkel/snabb (5-10 min), 3 = Normal (20-30 min), 5 = Storstädning (45+ min)',
      estimatedTime: 'Uppskattad tid (minuter)',
      frequencyLabel: 'Hur ofta i veckan?',
      frequencyTimesAWeek: 'gånger per vecka',
      preferredDays: 'Föredragna dagar (valfritt)',
      anyDay: 'Vilken dag som helst',
      suitability: 'Lämplig för',
      saveTask: 'Spara syssla',
      updateTask: 'Uppdatera syssla',
      cancel: 'Avbryt',
      deleteTask: 'Ta bort',
      deleteConfirm: 'Vill du verkligen ta bort denna syssla?',
      emptyTasks: 'Inga sysslor är tillagda ännu.',
      loadDefaultTasks: 'Ladda vanliga standardsysslor',
      totalTasks: 'Registrerade sysslor',
      easy: 'Lätt',
      medium: 'Medel',
      hard: 'Krävande',
      searchPlaceholder: 'Sök bland sysslor...',
      allCategories: 'Alla kategorier',
      filterBy: 'Filtrera',
    },
    members: {
      title: 'Familjemedlemmar',
      subtitle: 'Lägg till personer som ska dela på hushållsarbetet och deras tillgänglighet',
      addNewMember: 'Lägg till person',
      memberName: 'Namn',
      memberNamePlaceholder: 't.ex. Anna, Johan, Liam...',
      roleOrRelationship: 'Roll / Beskrivning',
      rolePlaceholder: 't.ex. Mamma, Pappa, Äldsta barnet...',
      ageGroup: 'Åldersgrupp / Kapacitet',
      capacityWeight: 'Arbetsbörda / Kapacitet',
      capacityHelp: 'Justerar hur många poäng personen tilldelas jämfört med en full vuxenkvot.',
      availableDays: 'Tillgängliga dagar denna vecka',
      selectColor: 'Färgprofil',
      selectAvatar: 'Avatar / Symbol',
      saveMember: 'Spara person',
      updateMember: 'Uppdatera person',
      cancel: 'Avbryt',
      deleteMember: 'Ta bort person',
      deleteConfirm: 'Vill du ta bort denna medlem ur hushållet?',
      emptyMembers: 'Inga familjemedlemmar har lagts till ännu.',
      loadDefaultMembers: 'Ladda exempelfamilj',
      totalMembers: 'Personer i hushållet',
      workloadRatio: 'Andel av hushållssysslorna',
      tasksAssigned: 'Tilldelade uppgifter',
    },
    share: {
      title: 'Dela & Exportera Schemat',
      subtitle: 'Spara, skriv ut eller dela schemat direkt i familjens gruppchatt',
      exportPoster: 'Ladda ner bild (Affisch)',
      exportPosterDesc: 'Skapar en tydlig och snygg bildfil som kan sparas eller skrivas ut.',
      downloadImage: 'Ladda ner som PNG-bild',
      generatingImage: 'Skapar bild...',
      printFriendly: 'Utskriftsvänligt schema',
      printSchedule: 'Skriv ut schemat',
      whatsappShare: 'Dela via WhatsApp / Meddelande',
      copyWhatsapp: 'Kopiera veckotext för chatt',
      copied: 'Kopierat till urklipp! 📋',
      whatsappTextPreview: 'Förhandsvisning av meddelandetext:',
      memberCards: 'Individuella scheman per person',
      shareMyTasks: 'Kopiera mina sysslor',
      saveSnapshot: 'Spara veckans schema i arkivet',
      saveSnapshotDesc: 'Spara nuvarande schema för att kunna återanvända eller titta tillbaka.',
      snapshotName: 'Namn på schemat',
      savedSchedules: 'Sparade schemasamlingar',
      loadSchedule: 'Ladda detta schema',
      deleteSchedule: 'Radera från arkiv',
      noSavedSchedules: 'Inga sparade scheman än.',
      scheduleSavedSuccess: 'Schemat har sparats i arkivet!',
      fridgeReady: 'Perfekt att sätta upp på kylskåpet! 📌',
      exportJson: 'Exportera säkerhetskopia (JSON)',
      importJson: 'Importera säkerhetskopia',
      shareWithFamily: 'Dela schemat med familjen',
    },
    fairness: {
      balanced: 'Perfekt balanserad fördelning! ⚖️',
      imbalanced: 'Viss obalans i arbetsbördan',
      fairnessDistribution: 'Rättvis fördelning av hushållsarbetet',
      explanation: 'Poängen baseras på uppskattad ansträngning och varje medlems inställda kapacitet.',
      pointsSummary: 'Poängöversikt',
      tasksCount: 'Antal sysslor',
    },
    categoryManagement: {
      title: 'Kategorier',
      subtitle: 'Anpassa kategoriernas namn och symboler, eller skapa nya.',
      manageBtn: 'Hantera kategorier',
      addCategory: 'Lägg till kategori',
      editCategory: 'Redigera kategori',
      categoryName: 'Kategorinamn',
      categoryNamePlaceholder: 't.ex. Trädgård, Bilvård, Läxor...',
      categorySymbol: 'Symbol / Ikon',
      symbolPicker: 'Välj symbol',
      customSymbol: 'Egen emoji eller symbol',
      saveCategory: 'Spara kategori',
      createCategory: 'Skapa kategori',
      deleteCategory: 'Ta bort kategori',
      deleteCategoryConfirm: 'Är du säker på att du vill ta bort denna kategori? Befintliga sysslor kommer behållas.',
      resetDefaults: 'Återställ standardkategorier',
      resetDefaultsConfirm: 'Vill du återställa alla kategorier och symboler till standardläget?',
      totalCategories: 'kategorier',
      presetIcons: 'Populära symboler',
    },
    common: {
      edit: 'Redigera',
      delete: 'Ta bort',
      close: 'Stäng',
      save: 'Spara',
      success: 'Klart!',
      done: 'Genomfört',
      points: 'poäng',
      minutes: 'minuter',
      options: 'Alternativ',
      actions: 'Åtgärder',
      language: 'Språk',
      switchLang: 'Byt språk',
      theme: 'Tema',
      chooseTheme: 'Välj färgtema',
      themes: {
        dark: 'Mörk Obsidian',
        light: 'Ljust Papper',
        nordic: 'Nordisk Skiffer',
        forest: 'Skogsgrön',
        sunset: 'Solnedgång',
      },
      lightMode: 'Dagläge',
      darkMode: 'Nattläge',
      dayNight: 'Dag / Natt',
      resetDefaults: 'Återställ till standarddata',
      resetDefaultsConfirm: 'Vill du återställa till standarduppgifter och exempelfamilj?',
    },
  },
  en: {
    appName: 'ChoreSync',
    appTagline: 'Fair weekly household chore distribution & calendar',
    nav: {
      calendar: 'Weekly Calendar',
      tasks: 'Chores & Tasks',
      members: 'Family Members',
      share: 'Share & Save',
      stats: 'Fairness Meter',
    },
    days: {
      full: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    categories: {
      kitchen: 'Kitchen & Dishes',
      cleaning: 'Cleaning & Vacuuming',
      laundry: 'Laundry & Clothes',
      cooking: 'Cooking & Meal Prep',
      shopping: 'Groceries & Errands',
      outdoor: 'Garden & Trash',
      pets: 'Pet Care',
      organization: 'Tidying & Organizing',
      bathroom: 'Bathroom & Toilet',
    },
    ageGroups: {
      adult: 'Adult (100% capacity)',
      teen: 'Teen (75% capacity)',
      child: 'Child (50% capacity)',
    },
    calendar: {
      title: 'Weekly Calendar',
      subtitle: 'View and check off distributed weekly household chores',
      weekLabel: 'Week',
      previousWeek: 'Previous week',
      nextWeek: 'Next week',
      currentWeek: 'This week',
      viewModeGrid: 'Day by Day',
      viewModeMember: 'By Person',
      viewHorizontal: 'Horizontal',
      viewVertical: 'Vertical',
      orientation: 'Orientation',
      generateSchedule: 'Generate Fair Schedule',
      generating: 'Balancing chores...',
      fairnessScore: 'Fairness Index',
      fairDistributionDesc: 'Chores have been evenly distributed based on capacity and availability.',
      noTasksScheduled: 'No chores scheduled for this day.',
      addQuickTask: 'Add Quick Chore',
      reassign: 'Reassign Person',
      markDone: 'Done!',
      markUndone: 'Mark pending',
      completed: 'Completed',
      pending: 'Pending',
      completionProgress: 'Weekly Progress',
      clearSchedule: 'Clear Schedule',
      clearScheduleConfirm: 'Are you sure you want to clear all assigned chores for this week?',
      filterMember: 'Filter Member',
      allMembers: 'All Members',
      allDays: 'Full Week',
      totalPoints: 'Total Points',
      totalMinutes: 'Total Time',
      min: 'min',
      pts: 'pts',
      taskSwapped: 'Chore moved successfully!',
      pointsAssigned: 'Points Breakdown',
      streakMessage: 'Awesome job! Another chore completed! 🎉',
    },
    tasks: {
      title: 'Chores & Tasks',
      subtitle: 'Manage household tasks, time estimates, and effort points',
      addNewTask: 'Create New Task',
      taskName: 'Task Name',
      taskNamePlaceholder: 'e.g. Empty the dishwasher, Vacuum living room...',
      category: 'Category',
      pointsLabel: 'Points / Effort (1-5)',
      pointsDesc: '1 = Easy/Quick (5-10m), 3 = Moderate (20-30m), 5 = Heavy cleaning (45m+)',
      estimatedTime: 'Estimated Time (minutes)',
      frequencyLabel: 'Frequency per week',
      frequencyTimesAWeek: 'times per week',
      preferredDays: 'Preferred Days (optional)',
      anyDay: 'Any available day',
      suitability: 'Suitable for',
      saveTask: 'Save Task',
      updateTask: 'Update Task',
      cancel: 'Cancel',
      deleteTask: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this task?',
      emptyTasks: 'No tasks added yet.',
      loadDefaultTasks: 'Load Standard Household Tasks',
      totalTasks: 'Registered Tasks',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      searchPlaceholder: 'Search chores...',
      allCategories: 'All Categories',
      filterBy: 'Filter',
    },
    members: {
      title: 'Family Members',
      subtitle: 'Add household members who share chores and configure their availability',
      addNewMember: 'Add Member',
      memberName: 'Name',
      memberNamePlaceholder: 'e.g. Anna, John, Liam...',
      roleOrRelationship: 'Role / Description',
      rolePlaceholder: 'e.g. Mom, Dad, Oldest Child...',
      ageGroup: 'Age Group / Capacity',
      capacityWeight: 'Workload Capacity Weight',
      capacityHelp: 'Adjusts how many chore points this person receives relative to a standard adult.',
      availableDays: 'Available Days this week',
      selectColor: 'Color Badge',
      selectAvatar: 'Avatar / Emoji',
      saveMember: 'Save Member',
      updateMember: 'Update Member',
      cancel: 'Cancel',
      deleteMember: 'Delete Member',
      deleteConfirm: 'Do you want to remove this member from the household?',
      emptyMembers: 'No family members added yet.',
      loadDefaultMembers: 'Load Sample Family',
      totalMembers: 'Household Members',
      workloadRatio: 'Chore Load Target',
      tasksAssigned: 'Assigned Chores',
    },
    share: {
      title: 'Share & Export Schedule',
      subtitle: 'Save, print, or share the weekly schedule directly with family members',
      exportPoster: 'Download Image (Poster)',
      exportPosterDesc: 'Generates a clean, crisp visual poster to save or print.',
      downloadImage: 'Download as PNG Image',
      generatingImage: 'Generating image...',
      printFriendly: 'Printable Sheet',
      printSchedule: 'Print Schedule',
      whatsappShare: 'Share via WhatsApp / Text',
      copyWhatsapp: 'Copy Weekly Text for Chat',
      copied: 'Copied to clipboard! 📋',
      whatsappTextPreview: 'Message Text Preview:',
      memberCards: 'Individual Member Breakdowns',
      shareMyTasks: 'Copy My Chores',
      saveSnapshot: 'Save Schedule to Archive',
      saveSnapshotDesc: 'Save the current weekly arrangement to reuse or review later.',
      snapshotName: 'Schedule Name',
      savedSchedules: 'Saved Schedule Archive',
      loadSchedule: 'Load this Schedule',
      deleteSchedule: 'Delete from Archive',
      noSavedSchedules: 'No saved schedules yet.',
      scheduleSavedSuccess: 'Schedule saved to archive successfully!',
      fridgeReady: 'Ready to stick on the fridge! 📌',
      exportJson: 'Export Backup (JSON)',
      importJson: 'Import Backup',
      shareWithFamily: 'Share with Family',
    },
    fairness: {
      balanced: 'Fair & balanced distribution! ⚖️',
      imbalanced: 'Slight workload imbalance detected',
      fairnessDistribution: 'Household Workload Fairness',
      explanation: 'Points are calibrated to estimated effort and each person’s target capacity.',
      pointsSummary: 'Points Overview',
      tasksCount: 'Chore Count',
    },
    categoryManagement: {
      title: 'Categories',
      subtitle: 'Customize category names and symbols, or create new custom ones.',
      manageBtn: 'Manage Categories',
      addCategory: 'Add Category',
      editCategory: 'Edit Category',
      categoryName: 'Category Name',
      categoryNamePlaceholder: 'e.g. Garden, Car Care, Homework...',
      categorySymbol: 'Symbol / Icon',
      symbolPicker: 'Choose Symbol',
      customSymbol: 'Custom Emoji or Symbol',
      saveCategory: 'Save Category',
      createCategory: 'Create Category',
      deleteCategory: 'Delete Category',
      deleteCategoryConfirm: 'Are you sure you want to delete this category? Existing chores will be kept.',
      resetDefaults: 'Reset Default Categories',
      resetDefaultsConfirm: 'Do you want to reset all categories and symbols to default values?',
      totalCategories: 'categories',
      presetIcons: 'Popular Symbols',
    },
    common: {
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
      save: 'Save',
      success: 'Done!',
      done: 'Completed',
      points: 'points',
      minutes: 'minutes',
      options: 'Options',
      actions: 'Actions',
      language: 'Language',
      switchLang: 'Switch Language',
      theme: 'Theme',
      chooseTheme: 'Choose Color Theme',
      themes: {
        dark: 'Dark Obsidian',
        light: 'Light Paper',
        nordic: 'Nordic Slate',
        forest: 'Forest Emerald',
        sunset: 'Sunset Terracotta',
      },
      lightMode: 'Day Mode',
      darkMode: 'Night Mode',
      dayNight: 'Day / Night',
      resetDefaults: 'Reset to Sample Data',
      resetDefaultsConfirm: 'Do you want to reset tasks and members to default sample data?',
    },
  },
  ar: {
    appName: 'جدول مهام المنزل',
    appTagline: 'التوزيع العادل والذكي للأعمال المنزلية على مدار الأسبوع',
    nav: {
      calendar: 'الجدول الأسبوعي',
      tasks: 'إدخال المهام',
      members: 'أفراد العائلة',
      share: 'حفظ ومشاركة',
      stats: 'مؤشر العدالة',
    },
    days: {
      full: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'],
      short: ['إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت', 'أحد'],
    },
    categories: {
      kitchen: 'المطبخ وغسيل الأواني',
      cleaning: 'التنظيف والكنس',
      laundry: 'الغسيل وترتيب الملابس',
      cooking: 'الطبخ وإعداد الوجبات',
      shopping: 'التسوق وشراء الحاجيات',
      outdoor: 'الحديقة وإخراج القمامة',
      pets: 'رعاية الحيوانات الأليفة',
      organization: 'الترتيب والتنظيم',
      bathroom: 'الحمام والتعقيم',
    },
    ageGroups: {
      adult: 'بالغ (طاقة كاملة 100%)',
      teen: 'مراهق (طاقة 75%)',
      child: 'طفل (طاقة 50%)',
    },
    calendar: {
      title: 'الكلاندر الأسبوعي',
      subtitle: 'متابعة وتأكيد إنجاز المهام المنزلية الموزعة على مدار الأسبوع',
      weekLabel: 'الأسبوع',
      previousWeek: 'الأسبوع السابق',
      nextWeek: 'الأسبوع القادم',
      currentWeek: 'الأسبوع الحالي',
      viewModeGrid: 'يومياً (أيام الأسبوع)',
      viewModeMember: 'حسب الشخص',
      viewHorizontal: 'أفقي (أعمدة)',
      viewVertical: 'عمودي (صفوف)',
      orientation: 'الاتجاه',
      generateSchedule: 'توزيع المهام بشكل عادل ⚖️',
      generating: 'جاري الحساب والتوزيع العادل...',
      fairnessScore: 'مؤشر العدالة',
      fairDistributionDesc: 'تم توزيع المهام بناءً على طاقة كل فرد وأيام تواجده.',
      noTasksScheduled: 'لا توجد مهام مجدولة لهذا اليوم.',
      addQuickTask: 'إضافة مهمة سريعة',
      reassign: 'إسناد لشخص آخر',
      markDone: 'تم الإنجاز!',
      markUndone: 'إلغاء الإنجاز',
      completed: 'المكتملة',
      pending: 'المتبقية',
      completionProgress: 'نسبة الإنجاز الأسبوعي',
      clearSchedule: 'إفراغ الجدول',
      clearScheduleConfirm: 'هل أنت متأكد من مسح جميع المهام الموزعة لهذا الأسبوع؟',
      filterMember: 'تصفية حسب الشخص',
      allMembers: 'جميع أفراد العائلة',
      allDays: 'كامل الأسبوع',
      totalPoints: 'مجموع النقاط',
      totalMinutes: 'الوقت المقدر',
      min: 'دقيقة',
      pts: 'نقطة',
      taskSwapped: 'تم نقل المهمة بنجاح!',
      pointsAssigned: 'توزيع النقاط والجهد',
      streakMessage: 'عمل رائع! تم إنجاز مهمة منزلية أخرى بنجاح! 🎉',
    },
    tasks: {
      title: 'إدارة وإدخال المهام',
      subtitle: 'حدد المهام المنزلية، وقت إنجازها ودرجة صعوبتها وعدد مرات تكرارها',
      addNewTask: 'إضافة مهمة جديدة',
      taskName: 'اسم المهمة',
      taskNamePlaceholder: 'مثال: تفريغ غسالة الصحون، كنس الصالة، غسيل الملابس...',
      category: 'التصنيف',
      pointsLabel: 'نقاط الجهد / الصعوبة (1-5)',
      pointsDesc: '1 = مهمة سريعة وسهلة (5-10 د)، 3 = متوسطة (20-30 د)، 5 = تنظيف عميق (45+ د)',
      estimatedTime: 'الوقت المقدر (بالدقائق)',
      frequencyLabel: 'كم مرة في الأسبوع؟',
      frequencyTimesAWeek: 'مرات في الأسبوع',
      preferredDays: 'الأيام المفضلة (اختياري)',
      anyDay: 'أي يوم متاح',
      suitability: 'مناسب لـ',
      saveTask: 'حفظ المهمة',
      updateTask: 'تحديث المهمة',
      cancel: 'إلغاء',
      deleteTask: 'حذف المهمة',
      deleteConfirm: 'هل أنت متأكد من رغبتك في حذف هذه المهمة؟',
      emptyTasks: 'لم تتم إضافة مهام بعد.',
      loadDefaultTasks: 'تحميل المهام المنزلية الشائعة جاهزة',
      totalTasks: 'إجمالي المهام المسجلة',
      easy: 'سهل',
      medium: 'متوسط',
      hard: 'صعب / مجهد',
      searchPlaceholder: 'ابحث في المهام...',
      allCategories: 'جميع التصنيفات',
      filterBy: 'تصفية',
    },
    members: {
      title: 'أفراد العائلة والأشخاص',
      subtitle: 'أدخل أسماء المشاركين في المنزل وحدد قدرتهم وأيام تواجدهم',
      addNewMember: 'إضافة فرد جديد',
      memberName: 'الاسم',
      memberNamePlaceholder: 'مثال: سارة، أحمد، يوسف...',
      roleOrRelationship: 'الدور / الصفة',
      rolePlaceholder: 'مثال: الأم، الأب، الابن الأكبر...',
      ageGroup: 'الفئة العمرية / الطاقة',
      capacityWeight: 'نسبة تحمّل الجهد',
      capacityHelp: 'تحدد كمية المهام والنقاط التي تسند للشخص مقارنة بالبالغ الكامل.',
      availableDays: 'أيام التواجد والجاهزية هذا الأسبوع',
      selectColor: 'اللون المميز',
      selectAvatar: 'الصورة الرمزية / الإيموجي',
      saveMember: 'حفظ الشخص',
      updateMember: 'تحديث البيانات',
      cancel: 'إلغاء',
      deleteMember: 'حذف الشخص',
      deleteConfirm: 'هل تريد حذف هذا الشخص من قائمة العائلة؟',
      emptyMembers: 'لم يتم إدخال أسماء بعد.',
      loadDefaultMembers: 'تحميل عائلة تجريبية جاهزة',
      totalMembers: 'عدد أفراد المنزل',
      workloadRatio: 'النسبة المستهدفة من الجهد',
      tasksAssigned: 'المهام المسندة',
    },
    share: {
      title: 'حفظ ومشاركة جدول النتائج',
      subtitle: 'احفظ الجدول كصورة، اطبعه على الثلاجة، أو شاركه في جروب الواتساب العائلي',
      exportPoster: 'تحميل كصورة (بوستر عالي الجودة)',
      exportPosterDesc: 'إنشاء صورة بتصميم أنيق جاهزة للحفظ والمشاركة على الهاتف.',
      downloadImage: 'تحميل كصورة PNG',
      generatingImage: 'جاري تجهيز الصورة...',
      printFriendly: 'تنسيق جاهز للطباعة',
      printSchedule: 'طباعة الجدول الورقي',
      whatsappShare: 'مشاركة عبر واتساب / رسالة نصية',
      copyWhatsapp: 'نسخ نص الجدول لجروب العائلة',
      copied: 'تم النسخ بنجاح إلى الحافظة! 📋',
      whatsappTextPreview: 'معاينة نص الرسالة للمشاركة:',
      memberCards: 'جداول المهام الفردية لكل شخص',
      shareMyTasks: 'نسخ مهامي الخاصة',
      saveSnapshot: 'حفظ الخطة في أرشيف الأسابيع',
      saveSnapshotDesc: 'احتفظ بنسخة من جدول هذا الأسبوع للرجوع إليها أو تكرارها.',
      snapshotName: 'اسم الخطة / الأسبوع',
      savedSchedules: 'الخطط المحفوظة سابقاً',
      loadSchedule: 'استعادة هذا الجدول',
      deleteSchedule: 'حذف من الأرشيف',
      noSavedSchedules: 'لا توجد خطط محفوظة في الأرشيف بعد.',
      scheduleSavedSuccess: 'تم حفظ الجدول في الأرشيف بنجاح!',
      fridgeReady: 'تنسيق أنيق ومثالي للتعليق على باب الثلاجة! 📌',
      exportJson: 'تصدير نسخة احتياطية (JSON)',
      importJson: 'استيراد نسخة احتياطية',
      shareWithFamily: 'مشاركة مع أفراد العائلة',
    },
    fairness: {
      balanced: 'توزيع عادل ومتوازن تماماً! ⚖️',
      imbalanced: 'يوجد تفاوت طفيف في توزيع الجهد',
      fairnessDistribution: 'معدل عدالة توزيع الأعمال المنزلية',
      explanation: 'النقاط محسوبة بدقة بناءً على المجهود والوقت وقدرة كل فرد.',
      pointsSummary: 'ملخص النقاط الإجمالي',
      tasksCount: 'عدد المهام المسندة',
    },
    categoryManagement: {
      title: 'فئات وتصنيفات المهام',
      subtitle: 'تعديل أسماء ورموز الفئات، أو إضافة فئات مخصصة جديدة.',
      manageBtn: 'إدارة الفئات',
      addCategory: 'إضافة فئة جديدة',
      editCategory: 'تعديل الفئة',
      categoryName: 'اسم الفئة',
      categoryNamePlaceholder: 'مثال: الحديقة، غسيل السيارة، الواجبات...',
      categorySymbol: 'الرمز / الأيقونة',
      symbolPicker: 'اختر الرمز',
      customSymbol: 'رمز أو إيموجي مخصص',
      saveCategory: 'حفظ التعديلات',
      createCategory: 'إنشاء الفئة',
      deleteCategory: 'حذف الفئة',
      deleteCategoryConfirm: 'هل أنت متأكد من حذف هذه الفئة؟ سيتم الاحتفاظ بالمهام المرتبطة بها.',
      resetDefaults: 'استعادة الفئات الافتراضية',
      resetDefaultsConfirm: 'هل تريد استعادة جميع الفئات والرموز إلى الإعدادات الافتراضية؟',
      totalCategories: 'فئات',
      presetIcons: 'رموز شائعة',
    },
    common: {
      edit: 'تعديل',
      delete: 'حذف',
      close: 'إغلاق',
      save: 'حفظ',
      success: 'تم بنجاح!',
      done: 'منجز',
      points: 'نقاط',
      minutes: 'دقائق',
      options: 'خيارات',
      actions: 'إجراءات',
      language: 'اللغة',
      switchLang: 'تغيير اللغة',
      theme: 'المظهر والسمات',
      chooseTheme: 'اختر السمة اللونية',
      themes: {
        dark: 'ليلي داكن (أوبسيديان)',
        light: 'نهاري ورق دافئ',
        nordic: 'أزرق قطبي نورديك',
        forest: 'زمرد الغابة',
        sunset: 'غروب دافئ',
      },
      lightMode: 'الوضع النهاري',
      darkMode: 'الوضع الليلي',
      dayNight: 'نهار / ليل',
      resetDefaults: 'استعادة البيانات الافتراضية',
      resetDefaultsConfirm: 'هل ترغب في إعادة ضبط البيانات إلى الأمثلة الافتراضية؟',
    },
  },
};
