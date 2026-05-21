import type { Locale } from "./locale";

export const translations = {
  en: {
    "nav.home": "HOME",
    "nav.vision": "VISION",
    "nav.review": "REVIEW",
    "nav.settings": "SETTINGS",
    "lang.ru": "RU",
    "lang.en": "EN",

    "streak.label": "streak",
    "streak.level": "Level",
    "streak.xp": "XP",
    "streak.dailyGoal": "Daily goal",

    "dashboard.hero": "Launch Your Learning Orbit",
    "dashboard.subtitle":
      "Three modules. SM-2 spaced repetition. 10+ questions per session. Random ad-libs on every correct answer.",
    "dashboard.nextLevel": "Next level: {percent}%",
    "dashboard.quickLaunch": "Quick launch",
    "dashboard.quickLaunchHint": "Jump into due reviews or start the next unit",
    "dashboard.grammarGalaxy": "Grammar galaxy →",
    "dashboard.visionWall": "Vision wall",
    "dashboard.notifications": "Notifications",
    "dashboard.dueReviews": "Due reviews",

    "galaxy.retention": "{percent}% retention",
    "galaxy.explored": "{completed} / {total} units explored",

    "module.units": "{count} units",
    "module.galaxyProgress": "Galaxy progress",
    "module.retentionCompleted": "{retention}% retention · {completed} completed",

    "module.grammar.title": "Essential Grammar in Use",
    "module.grammar.subtitle": "4th Edition · 115 Units",
    "module.grammar.description":
      "Master A1–B1 grammar from articles to conditionals. Spaced repetition locks each pattern into long-term memory.",
    "module.grammar.level": "A1 – B1",

    "module.vocabulary.title": "4000 Essential English Words",
    "module.vocabulary.subtitle": "Book 1 · All Chapters",
    "module.vocabulary.description":
      "Core high-frequency vocabulary with context sentences, collocations, and recall drills.",
    "module.vocabulary.level": "A2 – B1",

    "module.sat.title": "SAT Prep",
    "module.sat.subtitle": "Math + Reading/Writing → 1600",
    "module.sat.description":
      "Zero to hero: algebra, data, rhetoric, and grammar for a perfect score trajectory.",
    "module.sat.level": "Zero → 1600",

    "level.spaceCadet": "Space Cadet",
    "level.orbitRookie": "Orbit Rookie",
    "level.nebulaScout": "Nebula Scout",
    "level.cosmicScholar": "Cosmic Scholar",
    "level.galaxyAce": "Galaxy Ace",
    "level.supernova": "Supernova",
    "level.blackHoleBrain": "Black Hole Brain",
    "level.quasarKing": "Quasar King",
    "level.universeMaster": "Universe Master",
    "level.satGod": "SAT God",

    "common.dashboard": "← Dashboard",
    "common.allUnits": "← All units",
    "common.loading": "Loading…",

    "review.title": "Study queue",
    "review.subtitle": "Due reviews first, then new material — SM-2 spaced repetition",
    "review.empty": "No units yet. Start a module from the dashboard!",
    "review.dueNow": "Due now ({count})",
    "review.newMaterial": "New material ({count})",
    "review.caughtUp":
      "You're caught up! Check back when cards come due, or revisit any unit from a module page.",

    "settings.title": "Settings",

    "notifications.title": "Notifications",
    "notifications.hint": "Get reminded when SM-2 cards are due and at your daily study time.",
    "notifications.unsupported": "Browser notifications are not supported in this environment.",
    "notifications.blocked": "Notifications are blocked. Enable them in your browser site settings.",
    "notifications.enable": "Enable notifications",
    "notifications.on": "Notifications on",
    "notifications.dueReminders": "Remind when review cards are due",
    "notifications.dailyReminder": "Daily study reminder",
    "notifications.dailyTime": "Daily reminder time",

    "unit.due": "Due",
    "unit.new": "New",
    "unit.completed": "✓ Completed",
    "unit.questions": "{count} Q",

    "grammar.pageTitle": "Essential Grammar in Use",
    "grammar.pageSubtitle": "4th Edition · {count} units · Due first, then new",

    "vocabulary.pageTitle": "4000 Essential English Words — Book 1",
    "vocabulary.pageSubtitle": "{count} units · Due first, then new",

    "sat.pageTitle": "SAT Prep",
    "sat.pageSubtitle": "{count} lessons · Due first, then new",

    "quiz.question": "Question {current} / {total}",
    "quiz.submit": "Submit",
    "quiz.next": "Next",
    "quiz.finish": "Finish unit",
    "quiz.placeholder": "Type your answer...",
    "quiz.explainAi": "Explain with AI tutor",
    "quiz.aiTutor": "Groq AI tutor · llama-3.3-70b",
    "quiz.aiThinking": "Thinking like a space kid...",
    "quiz.aiError": "Could not load AI explanation. Try again later.",
    "quiz.scheduled": "Scheduled · {rating} · SM-2 updated",
    "quiz.ratingPrompt": "How well did you know this? (SM-2)",
    "quiz.rating.hard": "Hard",
    "quiz.rating.hardHint": "×1.2 interval",
    "quiz.rating.good": "Good",
    "quiz.rating.goodHint": "SM-2 ladder",
    "quiz.rating.easy": "Easy",
    "quiz.rating.easyHint": "×2.5 interval",

    "spotify.rewardTitle": "Mission reward",
    "spotify.rewardBody":
      "{percent}% — you crushed this unit! 30s preview · Travis Scott or Playboi Carti:",
    "spotify.loading": "Loading from the cosmos...",
    "spotify.error": "Could not load your reward track.",
    "spotify.noPreview":
      "No preview for this track. Connect Spotify Premium for full playback.",
    "spotify.sdk": "Playing via Spotify SDK",
    "spotify.preview": "30s preview",
    "spotify.connect": "Connect Spotify for full playback (Premium)",
    "spotify.continue": "Continue",

    "vision.noExcuses": "No excuses",
    "vision.line1": "Did you forget?",
    "vision.line2": "Do it for life.",
    "vision.quote": "— Travis Scott",
    "vision.tileHint":
      "Every tile is a receipt for what happens when you don't quit. Close this tab when you're ready to work — not when you're comfortable.",
    "vision.footer": "You already know what to do.",
    "vision.cta": "GET BACK TO WORK",
    "vision.stats.streak": "Streak",
    "vision.stats.days": "days",
    "vision.stats.grammar": "Grammar units",
    "vision.stats.sat": "SAT trajectory",
    "vision.stats.words": "4000 Essential Words",
    "vision.mosaic.loading": "Loading vision images…",
    "vision.mosaic.empty": "Add images to public/images/vision/ (e.g. img (1).jpg)",
    "vision.mosaic.error": "Could not load vision images.",
    "vision.lightbox.close": "Close lightbox",
    "vision.lightbox.prev": "Previous image",
    "vision.lightbox.next": "Next image",
    "vision.lightbox.esc": "ESC",

    "notify.dueTitle": "ASTRO'XAMS — Reviews due",
    "notify.dueBody": "{count} card ready. Knock them out before you forget.",
    "notify.dueBodyPlural": "{count} cards ready. Knock them out before you forget.",
    "notify.dailyTitle": "ASTRO'XAMS — Daily orbit",
    "notify.dailyBody": "Time to study. Grammar, words, SAT — pick one and move.",
  },
  ru: {
    "nav.home": "ГЛАВНАЯ",
    "nav.vision": "ВИДЕНИЕ",
    "nav.review": "ПОВТОР",
    "nav.settings": "НАСТРОЙКИ",
    "lang.ru": "RU",
    "lang.en": "EN",

    "streak.label": "серия",
    "streak.level": "Уровень",
    "streak.xp": "Опыт",
    "streak.dailyGoal": "Цель на день",

    "dashboard.hero": "Запусти орбиту обучения",
    "dashboard.subtitle":
      "Три модуля. Интервальное повторение SM-2. 10+ вопросов за сессию. Случайные ад-libs за каждый правильный ответ.",
    "dashboard.nextLevel": "До след. уровня: {percent}%",
    "dashboard.quickLaunch": "Быстрый старт",
    "dashboard.quickLaunchHint": "Повтори due-карточки или начни следующий юнит",
    "dashboard.grammarGalaxy": "Грамматика →",
    "dashboard.visionWall": "Стена видения",
    "dashboard.notifications": "Уведомления",
    "dashboard.dueReviews": "Due-повторы",

    "galaxy.retention": "Удержание {percent}%",
    "galaxy.explored": "{completed} / {total} юнитов пройдено",

    "module.units": "{count} юнитов",
    "module.galaxyProgress": "Прогресс галактики",
    "module.retentionCompleted": "Удержание {retention}% · завершено {completed}",

    "module.grammar.title": "Essential Grammar in Use",
    "module.grammar.subtitle": "4-е издание · 115 юнитов",
    "module.grammar.description":
      "Грамматика A1–B1: от артиклей до условных. SM-2 закрепляет каждую конструкцию в долгой памяти.",
    "module.grammar.level": "A1 – B1",

    "module.vocabulary.title": "4000 Essential English Words",
    "module.vocabulary.subtitle": "Книга 1 · все главы",
    "module.vocabulary.description":
      "Частотная лексика с контекстом, коллокациями и упражнениями на вспоминание.",
    "module.vocabulary.level": "A2 – B1",

    "module.sat.title": "Подготовка к SAT",
    "module.sat.subtitle": "Math + Reading/Writing → 1600",
    "module.sat.description":
      "С нуля до максимума: алгебра, данные, риторика и грамматика для траектории на 1600.",
    "module.sat.level": "0 → 1600",

    "level.spaceCadet": "Космический кадет",
    "level.orbitRookie": "Новичок орбиты",
    "level.nebulaScout": "Разведчик туманности",
    "level.cosmicScholar": "Космический учёный",
    "level.galaxyAce": "Ас галактики",
    "level.supernova": "Сверхновая",
    "level.blackHoleBrain": "Мозг чёрной дыры",
    "level.quasarKing": "Король квазара",
    "level.universeMaster": "Повелитель вселенной",
    "level.satGod": "Бог SAT",

    "common.dashboard": "← Главная",
    "common.allUnits": "← Все юниты",
    "common.loading": "Загрузка…",

    "review.title": "Очередь учёбы",
    "review.subtitle": "Сначала due-повторы, потом новый материал — SM-2",
    "review.empty": "Пока нет юнитов. Начни с модуля на главной!",
    "review.dueNow": "Сейчас due ({count})",
    "review.newMaterial": "Новый материал ({count})",
    "review.caughtUp":
      "Всё повторено! Загляни, когда карточки снова станут due, или открой любой юнит в модуле.",

    "settings.title": "Настройки",

    "notifications.title": "Уведомления",
    "notifications.hint":
      "Напоминания, когда карточки SM-2 due, и в выбранное время для ежедневной учёбы.",
    "notifications.unsupported": "Уведомления браузера здесь недоступны.",
    "notifications.blocked":
      "Уведомления заблокированы. Включи их в настройках сайта в браузере.",
    "notifications.enable": "Включить уведомления",
    "notifications.on": "Уведомления включены",
    "notifications.dueReminders": "Напоминать о due-карточках",
    "notifications.dailyReminder": "Ежедневное напоминание учиться",
    "notifications.dailyTime": "Время ежедневного напоминания",

    "unit.due": "Due",
    "unit.new": "Новый",
    "unit.completed": "✓ Пройден",
    "unit.questions": "{count} вопр.",

    "grammar.pageTitle": "Essential Grammar in Use",
    "grammar.pageSubtitle": "4-е издание · {count} юнитов · сначала due, потом новые",

    "vocabulary.pageTitle": "4000 Essential English Words — Книга 1",
    "vocabulary.pageSubtitle": "{count} юнитов · сначала due, потом новые",

    "sat.pageTitle": "Подготовка к SAT",
    "sat.pageSubtitle": "{count} уроков · сначала due, потом новые",

    "quiz.question": "Вопрос {current} / {total}",
    "quiz.submit": "Ответить",
    "quiz.next": "Далее",
    "quiz.finish": "Завершить юнит",
    "quiz.placeholder": "Введи ответ…",
    "quiz.explainAi": "Объяснить с AI-репетитором",
    "quiz.aiTutor": "Groq AI · llama-3.3-70b",
    "quiz.aiThinking": "Думаю, как космический ребёнок…",
    "quiz.aiError": "Не удалось загрузить объяснение. Попробуй позже.",
    "quiz.scheduled": "Запланировано · {rating} · SM-2 обновлён",
    "quiz.ratingPrompt": "Насколько хорошо знал? (SM-2)",
    "quiz.rating.hard": "Трудно",
    "quiz.rating.hardHint": "интервал ×1.2",
    "quiz.rating.good": "Норм",
    "quiz.rating.goodHint": "лестница SM-2",
    "quiz.rating.easy": "Легко",
    "quiz.rating.easyHint": "интервал ×2.5",

    "spotify.rewardTitle": "Награда за миссию",
    "spotify.rewardBody":
      "{percent}% — юнит разнесён! 30 с превью · Travis Scott или Playboi Carti:",
    "spotify.loading": "Гружу из космоса…",
    "spotify.error": "Не удалось загрузить трек-награду.",
    "spotify.noPreview":
      "Нет превью. Подключи Spotify Premium для полного воспроизведения.",
    "spotify.sdk": "Воспроизведение через Spotify SDK",
    "spotify.preview": "Превью 30 с",
    "spotify.connect": "Подключить Spotify для полного трека (Premium)",
    "spotify.continue": "Продолжить",

    "vision.noExcuses": "Без отговорок",
    "vision.line1": "Ты забыл?",
    "vision.line2": "Делай это всю жизнь.",
    "vision.quote": "— Travis Scott",
    "vision.tileHint":
      "Каждая плитка — чек за то, что ты не сдался. Закрой вкладку, когда готов работать — не когда удобно.",
    "vision.footer": "Ты уже знаешь, что делать.",
    "vision.cta": "ВЕРНУТЬСЯ К РАБОТЕ",
    "vision.stats.streak": "Серия",
    "vision.stats.days": "дн.",
    "vision.stats.grammar": "Юниты грамматики",
    "vision.stats.sat": "Траектория SAT",
    "vision.stats.words": "4000 Essential Words",
    "vision.mosaic.loading": "Загрузка изображений…",
    "vision.mosaic.empty": "Добавь файлы в public/images/vision/ (напр. img (1).jpg)",
    "vision.mosaic.error": "Не удалось загрузить изображения.",
    "vision.lightbox.close": "Закрыть",
    "vision.lightbox.prev": "Предыдущее",
    "vision.lightbox.next": "Следующее",
    "vision.lightbox.esc": "ESC",

    "notify.dueTitle": "ASTRO'XAMS — Повторы due",
    "notify.dueBody": "{count} карточка готова. Пройди, пока не забыл.",
    "notify.dueBodyPlural": "{count} карточек готовы. Пройди, пока не забыл.",
    "notify.dailyTitle": "ASTRO'XAMS — Ежедневная орбита",
    "notify.dailyBody": "Время учиться. Грамматика, слова, SAT — выбери и вперёд.",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function translate(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const table = translations[locale] ?? translations.en;
  let text: string = table[key] ?? translations.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
  }
  return text;
}
