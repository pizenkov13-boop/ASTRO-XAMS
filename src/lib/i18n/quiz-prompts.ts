import type { Locale } from "./locale";

/** Localize common quiz prompt prefixes when UI locale is Russian (English learning content kept in quotes). */
export function localizeQuizPrompt(prompt: string, locale: Locale): string {
  if (locale !== "ru") return prompt;

  let p = prompt;

  p = p.replace(/^What does "(.+)" mean\?$/, "Что означает «$1»?");
  p = p.replace(
    /^Write one sentence using "(.+)" correctly\.$/,
    "Напишите одно предложение со словом «$1»."
  );
  p = p.replace(/^Complete with "(.+)": /, "Вставьте «$1»: ");

  p = p.replace(/^Complete the negative: /, "Заполните отрицание: ");
  p = p.replace(/^Complete the short answer: /, "Заполните краткий ответ: ");
  p = p.replace(/^Complete: /, "Заполните: ");

  p = p.replace(/^Choose the correct sentence\.$/, "Выберите правильное предложение.");
  p = p.replace(/^Choose the correct negative\.$/, "Выберите правильное отрицание.");
  p = p.replace(
    /^Choose the present perfect sentence\.$/,
    "Выберите предложение в Present Perfect."
  );
  p = p.replace(/^Choose the correct form after has$/, "Выберите правильную форму после has");
  p = p.replace(/^Choose the correct form: /, "Выберите правильную форму: ");
  p = p.replace(/^Choose the correct article: /, "Выберите правильный артикль: ");
  p = p.replace(/^Choose the correct /, "Выберите правильный вариант: ");

  p = p.replace(/^Which question is correct\?$/, "Какой вопрос правильный?");
  p = p.replace(/^Which sentence /, "Какое предложение ");
  p = p.replace(/^Which verb /, "Какая форма глагола ");
  p = p.replace(/^Which is /, "Что ");
  p = p.replace(/^Which /, "Какой вариант: ");

  p = p.replace(/^Write a /, "Напишите ");
  p = p.replace(/^Write: /, "Напишите: ");
  p = p.replace(/^Write /, "Напишите ");

  p = p.replace(
    /^Past of be — choose the correct form for /,
    "Прошедшее от be — выберите форму для "
  );
  p = p.replace(
    /^Third person singular — choose the correct verb\.$/,
    "3-е лицо ед. ч. — выберите правильный глагол."
  );
  p = p.replace(/^Time — choose the correct preposition: /, "Время — выберите предлог: ");
  p = p.replace(/^Present continuous vs simple: /, "Present Continuous vs Simple: ");
  p = p.replace(/^Comparative of good$/, "Сравнительная степень good");

  p = p.replace(/^\[Lesson (\d+)\] /, "[Урок $1] ");

  return p;
}

/** Localize static quiz feedback strings when UI locale is Russian. */
export function localizeQuizExplanation(explanation: string, locale: Locale): string {
  if (locale !== "ru") return explanation;

  return explanation
    .replace(
      /^A clear sentence shows you know: /,
      "Хорошее предложение показывает что ты знаешь: "
    )
    .replace(/^"(.+)" fits: /, "«$1» подходит: ");
}
