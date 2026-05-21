import type { Question, QuestionType } from "@/types";

type BankItem = {
  type: QuestionType;
  prompt: string;
  options?: string[];
  correct: string | string[];
  explain: string;
};

type TopicKey =
  | "present_be"
  | "present_continuous"
  | "present_simple"
  | "past_simple"
  | "present_perfect"
  | "past_continuous"
  | "future"
  | "modals"
  | "articles"
  | "prepositions"
  | "pronouns"
  | "comparatives"
  | "conditionals"
  | "passive"
  | "reported_speech"
  | "gerund_infinitive"
  | "phrasal"
  | "relative_clauses"
  | "questions_tags"
  | "default";

function resolveTopicKey(topic: string): TopicKey {
  const t = topic.toLowerCase();

  if (t.includes("question tag") || t.includes("tags review")) return "questions_tags";
  if (t.includes("reported")) return "reported_speech";
  if (t.includes("relative")) return "relative_clauses";
  if (t.includes("phrasal")) return "phrasal";
  if (
    t.includes("gerund") ||
    t.includes("infinitive") ||
    t.includes("enjoy") ||
    t.includes("want tell") ||
    t.includes("purpose infinitive")
  ) {
    return "gerund_infinitive";
  }
  if (
    t.includes("conditional") ||
    t.includes("wish") ||
    t.includes("unless") ||
    t.includes("as long as") ||
    t.includes("provided")
  ) {
    return "conditionals";
  }
  if (t.includes("passive")) return "passive";
  if (t.includes("present perfect") || t.includes("for since ago")) return "present_perfect";
  if (t.includes("past continuous")) return "past_continuous";
  if (t.includes("past simple") || t.includes("irregular verb")) return "past_simple";
  if (t.includes("present continuous")) return "present_continuous";
  if (t.includes("present simple") || t.includes("do auxiliary")) return "present_simple";
  if (
    t.includes("will") ||
    t.includes("going to") ||
    t.includes("future") ||
    t.includes("present for future") ||
    (t.includes("when") && t.includes("present"))
  ) {
    return "future";
  }
  if (
    t.includes("can") ||
    t.includes("could") ||
    t.includes("must") ||
    t.includes("may") ||
    t.includes("might") ||
    t.includes("should") ||
    t.includes("would") ||
    t.includes("have to") ||
    t.includes("able to")
  ) {
    return "modals";
  }
  if (t.includes("article") || t.includes("a/an")) return "articles";
  if (t.includes("preposition") || t.includes("at/in/on") || t.includes("movement")) {
    return "prepositions";
  }
  if (
    t.includes("pronoun") ||
    t.includes("possessive") ||
    t.includes("reflexive") ||
    t.includes("demonstrative") ||
    t.includes("somebody") ||
    t.includes("indefinite") ||
    t.includes("every") ||
    t.includes("one ones") ||
    t.includes("object pronoun")
  ) {
    return "pronouns";
  }
  if (t.includes("comparative") || t.includes("superlative") || t.includes("enough")) {
    return "comparatives";
  }
  if (
    t.includes("present be") ||
    t.includes("be questions") ||
    t.includes("past be") ||
    t.includes("there is") ||
    t.includes("there are") ||
    t.includes("there past") ||
    t.includes("it + be") ||
    t.includes("short forms neg")
  ) {
    return "present_be";
  }

  return "default";
}

function toQuestion(item: BankItem, id: string): Question {
  if (item.type === "multiple_choice" && item.options) {
    const correct = Array.isArray(item.correct) ? item.correct[0] : item.correct;
    return {
      id,
      type: item.type,
      prompt: item.prompt,
      options: item.options,
      correctAnswer: correct,
      explanation: item.explain,
      timeLimitSec: 25,
    };
  }
  if (item.type === "fill_blank") {
    return {
      id,
      type: item.type,
      prompt: item.prompt,
      correctAnswer: Array.isArray(item.correct) ? item.correct : [item.correct],
      explanation: item.explain,
      timeLimitSec: 30,
    };
  }
  return {
    id,
    type: "sentence_construction",
    prompt: item.prompt,
    correctAnswer: Array.isArray(item.correct) ? item.correct[0] : item.correct,
    explanation: item.explain,
    timeLimitSec: 45,
  };
}

const BANKS: Record<TopicKey, BankItem[]> = {
  present_be: [
    {
      type: "multiple_choice",
      prompt: "Choose the correct sentence.",
      options: ["She are happy.", "She is happy.", "She am happy.", "She be happy."],
      correct: "She is happy.",
      explain: "With she/he/it, use is: She is happy.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "They _____ students."',
      correct: ["are"],
      explain: "They + are (plural subject).",
    },
    {
      type: "sentence_construction",
      prompt: "Write a question with am/is/are: Ask if Tom is at home.",
      correct: "Is Tom at home?",
      explain: "Yes/no questions: Am/Is/Are + subject + rest?",
    },
    {
      type: "multiple_choice",
      prompt: 'Which question is correct?',
      options: ["Are you tired?", "You are tired?", "Do you tired?", "Are tired you?"],
      correct: "Are you tired?",
      explain: "Invert subject and be: Are + you + adjective?",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "I _____ not hungry."',
      correct: ["am", "'m not", "am not"],
      explain: "I + am (negative: am not / 'm not).",
    },
    {
      type: "multiple_choice",
      prompt: 'Choose the correct negative.',
      options: ["He not is here.", "He isn't here.", "He doesn't here.", "He aren't here."],
      correct: "He isn't here.",
      explain: "Negative of be: isn't / aren't / 'm not.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Where _____ your keys?"',
      correct: ["are"],
      explain: "Keys is plural → are.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: We are not ready.",
      correct: "We are not ready.",
      explain: "Plural we + are + not + adjective.",
    },
    {
      type: "multiple_choice",
      prompt: 'Past of be — choose the correct form for "they".',
      options: ["was", "were", "are", "been"],
      correct: "were",
      explain: "They were (past plural of be).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "It _____ cold yesterday."',
      correct: ["was"],
      explain: "It + was (past singular).",
    },
    {
      type: "multiple_choice",
      prompt: 'There _____ many people at the party.',
      options: ["was", "were", "is", "are being"],
      correct: "were",
      explain: "Many people (plural) → There were.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "_____ there a bank near here?"',
      correct: ["Is"],
      explain: "A bank (singular) → Is there...?",
    },
  ],

  present_continuous: [
    {
      type: "multiple_choice",
      prompt: "Which sentence describes an action happening now?",
      options: [
        "She reads a book.",
        "She is reading a book.",
        "She read a book.",
        "She has read a book.",
      ],
      correct: "She is reading a book.",
      explain: "Present continuous: am/is/are + verb-ing for now.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Listen! The baby _____." (cry)',
      correct: ["is crying", "'s crying"],
      explain: "Now → is + crying.",
    },
    {
      type: "sentence_construction",
      prompt: "Write a present continuous question: Ask what she is doing.",
      correct: "What is she doing?",
      explain: "Wh- + is + subject + doing?",
    },
    {
      type: "multiple_choice",
      prompt: 'Choose the correct form: "We _____ dinner at the moment."',
      options: ["have", "are having", "has", "having"],
      correct: "are having",
      explain: "At the moment → present continuous.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete the negative: "He _____ working today."',
      correct: ["isn't", "is not", "'s not"],
      explain: "Negative continuous: isn't + -ing.",
    },
    {
      type: "multiple_choice",
      prompt: "Which verb form is correct after is?",
      options: ["study", "studying", "studied", "to study"],
      correct: "studying",
      explain: "is + verb-ing.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Are they _____ TV?" (watch)',
      correct: ["watching"],
      explain: "Are they + watching?",
    },
    {
      type: "sentence_construction",
      prompt: "Write: They are not waiting for the bus.",
      correct: "They are not waiting for the bus.",
      explain: "are not + verb-ing.",
    },
    {
      type: "multiple_choice",
      prompt: "Present continuous vs simple: temporary situation",
      options: [
        "I live with my parents this month.",
        "I'm living with my parents this month.",
        "I lived with my parents.",
        "I've lived with my parents.",
      ],
      correct: "I'm living with my parents this month.",
      explain: "Temporary → continuous.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Why _____ you laughing?"',
      correct: ["are"],
      explain: "you + are in questions.",
    },
    {
      type: "multiple_choice",
      prompt: "Stative verb — which is NOT usually used in continuous?",
      options: ["run", "know", "wait", "rain"],
      correct: "know",
      explain: "Know, like, want are usually not continuous.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "It _____ raining. Take an umbrella." (now)',
      correct: ["is", "'s"],
      explain: "Now → It is raining.",
    },
  ],

  present_simple: [
    {
      type: "multiple_choice",
      prompt: "Third person singular — choose the correct verb.",
      options: ["She work in London.", "She works in London.", "She working in London.", "She workes in London."],
      correct: "She works in London.",
      explain: "He/she/it + verb-s in present simple.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "They _____ football every Saturday." (play)',
      correct: ["play"],
      explain: "They → base form play.",
    },
    {
      type: "sentence_construction",
      prompt: "Write a negative present simple sentence: He does not like tea.",
      correct: "He does not like tea.",
      explain: "does not + base verb (no -s on like).",
    },
    {
      type: "multiple_choice",
      prompt: "Which question is correct?",
      options: ["Do she like coffee?", "Does she like coffee?", "Does she likes coffee?", "Is she like coffee?"],
      correct: "Does she like coffee?",
      explain: "Does + subject + base verb.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "My brother _____ to the gym three times a week." (go)',
      correct: ["goes"],
      explain: "My brother → goes.",
    },
    {
      type: "multiple_choice",
      prompt: 'Choose the correct negative.',
      options: ["I don't eats meat.", "I don't eat meat.", "I not eat meat.", "I doesn't eat meat."],
      correct: "I don't eat meat.",
      explain: "don't + base verb.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "_____ you speak English?"',
      correct: ["Do"],
      explain: "You → Do you...?",
    },
    {
      type: "sentence_construction",
      prompt: "Write: The sun rises in the east.",
      correct: "The sun rises in the east.",
      explain: "General fact → present simple with -s.",
    },
    {
      type: "multiple_choice",
      prompt: "Frequency adverb position — correct sentence?",
      options: [
        "She always is late.",
        "She is always late.",
        "Always she is late.",
        "She is late always.",
      ],
      correct: "She is always late.",
      explain: "With be, adverb goes after am/is/are.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Water _____ at 100°C." (boil)',
      correct: ["boils"],
      explain: "Scientific fact → boils.",
    },
    {
      type: "multiple_choice",
      prompt: "Which uses do correctly as auxiliary?",
      options: ["Do she know?", "Does she know?", "Is she know?", "Know she does?"],
      correct: "Does she know?",
      explain: "Does for he/she/it questions.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete the short answer: "Do they live here?" — "Yes, they _____."',
      correct: ["do"],
      explain: "Short answer repeats auxiliary: Yes, they do.",
    },
  ],

  past_simple: [
    {
      type: "multiple_choice",
      prompt: "Regular past — choose the correct form.",
      options: ["They playd tennis.", "They played tennis.", "They playing tennis.", "They plays tennis."],
      correct: "They played tennis.",
      explain: "Regular verbs: add -ed.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "She _____ to Rome last year." (go — irregular)',
      correct: ["went"],
      explain: "go → went (irregular past).",
    },
    {
      type: "sentence_construction",
      prompt: "Write a past simple negative: I did not see him.",
      correct: "I did not see him.",
      explain: "did not + base verb.",
    },
    {
      type: "multiple_choice",
      prompt: "Which past question is correct?",
      options: ["Did you went home?", "Did you go home?", "Do you went home?", "You went home?"],
      correct: "Did you go home?",
      explain: "Did + subject + base verb.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "We _____ dinner at eight yesterday." (have)',
      correct: ["had"],
      explain: "have → had.",
    },
    {
      type: "multiple_choice",
      prompt: "Irregular past of buy",
      options: ["buyed", "bought", "buys", "buying"],
      correct: "bought",
      explain: "buy → bought.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "He _____ his phone in the taxi." (leave)',
      correct: ["left"],
      explain: "leave → left.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: When did they arrive?",
      correct: "When did they arrive?",
      explain: "Wh- + did + subject + base verb.",
    },
    {
      type: "multiple_choice",
      prompt: "Time expression with past simple",
      options: ["I have seen him yesterday.", "I saw him yesterday.", "I see him yesterday.", "I am seeing him yesterday."],
      correct: "I saw him yesterday.",
      explain: "Finished past time (yesterday) → past simple.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "They _____ very tired after the walk." (be — past)',
      correct: ["were"],
      explain: "They → were.",
    },
    {
      type: "multiple_choice",
      prompt: "Past of write",
      options: ["writed", "wrote", "written", "writing"],
      correct: "wrote",
      explain: "write → wrote (written is past participle).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "_____ she call you last night?"',
      correct: ["Did"],
      explain: "Past question with Did.",
    },
  ],

  present_perfect: [
    {
      type: "multiple_choice",
      prompt: "Choose the present perfect sentence.",
      options: [
        "I saw that film.",
        "I have seen that film.",
        "I am seeing that film.",
        "I see that film.",
      ],
      correct: "I have seen that film.",
      explain: "have/has + past participle.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "She has _____ finished her homework." (just)',
      correct: ["just"],
      explain: "has just + past participle.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: Have you ever been to Japan?",
      correct: "Have you ever been to Japan?",
      explain: "Have + subject + ever + past participle.",
    },
    {
      type: "multiple_choice",
      prompt: "Which sentence is correct?",
      options: [
        "I've already ate.",
        "I've already eaten.",
        "I've already eat.",
        "I already have ate.",
      ],
      correct: "I've already eaten.",
      explain: "already + past participle (eaten).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "How long _____ you known her?"',
      correct: ["have"],
      explain: "How long + have + subject + past participle.",
    },
    {
      type: "multiple_choice",
      prompt: "Past participle of break",
      options: ["breaked", "broke", "broken", "breaking"],
      correct: "broken",
      explain: "have + broken.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "He has lived here _____ 2019." (since/for)',
      correct: ["since"],
      explain: "since + point in time (2019).",
    },
    {
      type: "sentence_construction",
      prompt: "Write: They have not arrived yet.",
      correct: "They have not arrived yet.",
      explain: "have not + past participle; yet with negatives.",
    },
    {
      type: "multiple_choice",
      prompt: "Present perfect vs past simple — unfinished time",
      options: [
        "I did three tasks today.",
        "I've done three tasks today.",
        "I do three tasks today.",
        "I'm doing three tasks today.",
      ],
      correct: "I've done three tasks today.",
      explain: "Today still continuing → present perfect possible.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "We have been friends _____ ten years."',
      correct: ["for"],
      explain: "for + period of time.",
    },
    {
      type: "multiple_choice",
      prompt: "Choose the correct form after has",
      options: ["gone", "went", "goes", "going"],
      correct: "gone",
      explain: "has gone (past participle).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "I\'ve never _____ sushi." (try)',
      correct: ["tried"],
      explain: "never + past participle.",
    },
  ],

  past_continuous: [
    {
      type: "multiple_choice",
      prompt: "Which describes an action in progress in the past?",
      options: [
        "I watched TV at 8.",
        "I was watching TV at 8.",
        "I have watched TV.",
        "I watch TV at 8.",
      ],
      correct: "I was watching TV at 8.",
      explain: "was/were + verb-ing for past in progress.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "While I _____ , the phone rang." (cook)',
      correct: ["was cooking", "were cooking"],
      explain: "Longer action → was/were + -ing.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: What were you doing at midnight?",
      correct: "What were you doing at midnight?",
      explain: "Were + you + doing?",
    },
    {
      type: "multiple_choice",
      prompt: "Past continuous vs past simple — interrupted action",
      options: [
        "She was cooking when I arrived.",
        "She cooked when I was arriving.",
        "She has cooked when I arrived.",
        "She is cooking when I arrived.",
      ],
      correct: "She was cooking when I arrived.",
      explain: "was -ing (background) + past simple (interrupt).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "They _____ sleeping when the alarm went off."',
      correct: ["were"],
      explain: "They → were + -ing.",
    },
    {
      type: "multiple_choice",
      prompt: "Negative past continuous",
      options: [
        "He wasn't working.",
        "He didn't working.",
        "He not was working.",
        "He wasn't work.",
      ],
      correct: "He wasn't working.",
      explain: "wasn't/weren't + -ing.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Was it _____ when you left?" (rain)',
      correct: ["raining"],
      explain: "Was it + raining?",
    },
    {
      type: "sentence_construction",
      prompt: "Write: I was not listening to the teacher.",
      correct: "I was not listening to the teacher.",
      explain: "was not + verb-ing.",
    },
    {
      type: "multiple_choice",
      prompt: "Two simultaneous past actions",
      options: [
        "While he read, she cooked.",
        "While he was reading, she was cooking.",
        "While he reads, she cooks.",
        "While he has read, she has cooked.",
      ],
      correct: "While he was reading, she was cooking.",
      explain: "Both in progress → past continuous.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "I _____ along the beach at sunset." (walk)',
      correct: ["was walking", "were walking"],
      explain: "I → was walking.",
    },
    {
      type: "multiple_choice",
      prompt: "Which time expression fits past continuous?",
      options: ["yesterday at 6", "since Monday", "for two hours ago", "already"],
      correct: "yesterday at 6",
      explain: "Specific past moment → past continuous.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "_____ they waiting long?"',
      correct: ["Were"],
      explain: "They → Were they...?",
    },
  ],

  future: [
    {
      type: "multiple_choice",
      prompt: "Spontaneous decision — best form",
      options: [
        "I'll get it!",
        "I'm going to get it!",
        "I get it!",
        "I've got it!",
      ],
      correct: "I'll get it!",
      explain: "Will for instant decision.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "We _____ visit Grandma next Sunday." (plan)',
      correct: ["are going to", "'re going to", "are going to visit"],
      explain: "going to for prior plan.",
    },
    {
      type: "sentence_construction",
      prompt: "Write a prediction: It will rain tomorrow.",
      correct: "It will rain tomorrow.",
      explain: "will + base verb for prediction.",
    },
    {
      type: "multiple_choice",
      prompt: "Arrangement with a time — often",
      options: [
        "I meet John at six.",
        "I'm meeting John at six.",
        "I met John at six.",
        "I've met John at six.",
      ],
      correct: "I'm meeting John at six.",
      explain: "Present continuous for fixed future arrangement.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "_____ you help me with this bag?" (offer)',
      correct: ["Will", "Shall"],
      explain: "Will you...? for offers.",
    },
    {
      type: "multiple_choice",
      prompt: "First conditional",
      options: [
        "If it will rain, we stay home.",
        "If it rains, we will stay home.",
        "If it rained, we will stay home.",
        "If it rains, we stayed home.",
      ],
      correct: "If it rains, we will stay home.",
      explain: "if + present, will + verb.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "This time tomorrow I _____ on a plane." (fly)',
      correct: ["will be flying", "'ll be flying"],
      explain: "Future continuous: will be + -ing.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: They're going to move house in June.",
      correct: "They're going to move house in June.",
      explain: "going to + base verb for intention.",
    },
    {
      type: "multiple_choice",
      prompt: "Will vs going to — evidence now",
      options: [
        "Look at those clouds — it will rain.",
        "Look at those clouds — it's going to rain.",
        "Look at those clouds — it rains.",
        "Look at those clouds — it rained.",
      ],
      correct: "Look at those clouds — it's going to rain.",
      explain: "Present evidence → going to.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "By next year she _____ her degree." (finish — future perfect)',
      correct: ["will have finished", "'ll have finished"],
      explain: "will have + past participle.",
    },
    {
      type: "multiple_choice",
      prompt: "When-clause with future meaning",
      options: [
        "When I will arrive, I'll call you.",
        "When I arrive, I'll call you.",
        "When I arrived, I'll call you.",
        "When I'm arriving, I call you.",
      ],
      correct: "When I arrive, I'll call you.",
      explain: "After when, use present (not will).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "I think Real Madrid _____ the match." (win)',
      correct: ["will win", "'ll win"],
      explain: "Opinion/prediction → will win.",
    },
  ],

  modals: [
    {
      type: "multiple_choice",
      prompt: "Ability in the past",
      options: [
        "I can swim when I was five.",
        "I could swim when I was five.",
        "I must swim when I was five.",
        "I should swim when I was five.",
      ],
      correct: "I could swim when I was five.",
      explain: "could = past ability.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "You _____ smoke in hospitals." (prohibition)',
      correct: ["mustn't", "must not", "can't", "cannot"],
      explain: "mustn't/can't = not allowed.",
    },
    {
      type: "sentence_construction",
      prompt: "Write advice: You should see a doctor.",
      correct: "You should see a doctor.",
      explain: "should + base verb for advice.",
    },
    {
      type: "multiple_choice",
      prompt: "Logical deduction (present)",
      options: [
        "He must be tired.",
        "He can be tired.",
        "He should tired.",
        "He might tired.",
      ],
      correct: "He must be tired.",
      explain: "must + be for strong deduction.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "It _____ rain later — take an umbrella." (possibility)',
      correct: ["might", "may", "could"],
      explain: "might/may/could = possibility.",
    },
    {
      type: "multiple_choice",
      prompt: "External obligation — natural choice",
      options: [
        "I must wearing a uniform.",
        "I have to wear a uniform at work.",
        "I should to wear a uniform.",
        "I have wear a uniform.",
      ],
      correct: "I have to wear a uniform at work.",
      explain: "have to + base verb for rules from outside.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "_____ I open the window?" (polite request)',
      correct: ["Can", "Could", "May"],
      explain: "Can/Could I...? for requests.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: You don't have to pay now.",
      correct: "You don't have to pay now.",
      explain: "don't have to = no obligation.",
    },
    {
      type: "multiple_choice",
      prompt: "Can't for deduction",
      options: [
        "She can't be at home — her car is gone.",
        "She mustn't be at home — her car is gone.",
        "She shouldn't be at home — her car is gone.",
        "She don't can be at home.",
      ],
      correct: "She can't be at home — her car is gone.",
      explain: "can't = impossible (deduction).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "You _____ be more careful!" (advice)',
      correct: ["should", "ought to"],
      explain: "should + base verb.",
    },
    {
      type: "multiple_choice",
      prompt: "Would in polite requests",
      options: [
        "Would you pass the salt?",
        "Will you passing the salt?",
        "Do you would pass the salt?",
        "You would pass the salt?",
      ],
      correct: "Would you pass the salt?",
      explain: "Would you + base verb?",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "I\'m able _____ speak three languages."',
      correct: ["to"],
      explain: "able to + infinitive.",
    },
  ],

  articles: [
    {
      type: "multiple_choice",
      prompt: "Choose the correct article: ___ university",
      options: ["a", "an", "the", "—"],
      correct: "a",
      explain: "University starts with /j/ consonant sound → a.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "She is _____ honest person." (a/an)',
      correct: ["an"],
      explain: "Honest starts with vowel sound → an.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: I need the keys on the table.",
      correct: "I need the keys on the table.",
      explain: "the = specific keys.",
    },
    {
      type: "multiple_choice",
      prompt: "General vs specific",
      options: [
        "I love the music.",
        "I love music.",
        "I love a music.",
        "I love musics.",
      ],
      correct: "I love music.",
      explain: "Abstract/general → no article.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "We went to _____ cinema last night."',
      correct: ["the"],
      explain: "the cinema (specific place type).",
    },
    {
      type: "multiple_choice",
      prompt: "First mention vs second mention",
      options: [
        "I bought a car. The car is red.",
        "I bought the car. A car is red.",
        "I bought car. Car is red.",
        "I bought a car. A car is red.",
      ],
      correct: "I bought a car. The car is red.",
      explain: "a first time, the when known.",
    },
    {
      type: "multiple_choice",
      prompt: "Work without article — correct phrase?",
      options: ["go to the work", "go to work", "go to a work", "go at work"],
      correct: "go to work",
      explain: "go to work (no article before work).",
    },
    {
      type: "sentence_construction",
      prompt: "Write: This is an interesting book.",
      correct: "This is an interesting book.",
      explain: "an + vowel sound adjective + noun.",
    },
    {
      type: "multiple_choice",
      prompt: "Superlative needs",
      options: ["a", "an", "the", "no article"],
      correct: "the",
      explain: "the + superlative (the best).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Mount Everest is in _____ Himalayas."',
      correct: ["the"],
      explain: "Mountain ranges often take the.",
    },
    {
      type: "multiple_choice",
      prompt: "Countries with article",
      options: ["the France", "France", "the Japan", "the England"],
      correct: "France",
      explain: "Most countries: no article (France).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Can you pass me _____ salt, please?"',
      correct: ["the"],
      explain: "Specific salt on the table → the.",
    },
  ],

  prepositions: [
    {
      type: "multiple_choice",
      prompt: "Time — choose the correct preposition: ___ Monday",
      options: ["in", "on", "at", "by"],
      correct: "on",
      explain: "Days: on Monday.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "The meeting starts _____ 3 p.m."',
      correct: ["at"],
      explain: "Clock times: at 3 p.m.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: We arrived in Paris on Friday.",
      correct: "We arrived in Paris on Friday.",
      explain: "in + city; on + day.",
    },
    {
      type: "multiple_choice",
      prompt: "Place — picture on the wall",
      options: ["in the wall", "on the wall", "at the wall", "to the wall"],
      correct: "on the wall",
      explain: "Surface: on.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "She was born _____ 1998."',
      correct: ["in"],
      explain: "Years: in 1998.",
    },
    {
      type: "multiple_choice",
      prompt: "Movement",
      options: ["go at school", "go to school", "go in school", "go on school"],
      correct: "go to school",
      explain: "Direction: to.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "He lives _____ the end of the street."',
      correct: ["at"],
      explain: "at the end of.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: The cat jumped over the fence.",
      correct: "The cat jumped over the fence.",
      explain: "over = across/above.",
    },
    {
      type: "multiple_choice",
      prompt: "Transport — by vs in",
      options: ["by car", "in car", "on car", "with car"],
      correct: "by car",
      explain: "by + transport (no article).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "I\'m interested _____ learning Spanish."',
      correct: ["in"],
      explain: "interested in.",
    },
    {
      type: "multiple_choice",
      prompt: "Depend — correct phrase",
      options: ["depend of", "depend on", "depend at", "depend in"],
      correct: "depend on",
      explain: "depend on.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Wait _____ me outside."',
      correct: ["for"],
      explain: "wait for someone.",
    },
  ],

  pronouns: [
    {
      type: "multiple_choice",
      prompt: "Object pronoun after tell",
      options: ["Tell I.", "Tell me.", "Tell my.", "Tell mine."],
      correct: "Tell me.",
      explain: "tell + object pronoun (me).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "This is _____ book." (belonging to John)',
      correct: ["John's", "his"],
      explain: "possessive 's or his.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: That laptop is mine.",
      correct: "That laptop is mine.",
      explain: "mine = possessive pronoun.",
    },
    {
      type: "multiple_choice",
      prompt: "Reflexive — he hurt ___",
      options: ["him", "his", "himself", "he"],
      correct: "himself",
      explain: "Subject = object → reflexive.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Give _____ those papers." (to us)',
      correct: ["us"],
      explain: "give + person (us).",
    },
    {
      type: "multiple_choice",
      prompt: "Demonstratives — near plural",
      options: ["this", "that", "these", "those"],
      correct: "these",
      explain: "these = near plural.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Nobody called, _____?" (negative tag idea)',
      correct: ["did they"],
      explain: "nobody → positive tag did they.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: She enjoyed herself at the party.",
      correct: "She enjoyed herself at the party.",
      explain: "enjoy + reflexive when subject benefits.",
    },
    {
      type: "multiple_choice",
      prompt: "Indefinite — I need ___ to help me.",
      options: ["somebody", "anybody", "everybody", "nobody"],
      correct: "somebody",
      explain: "affirmative → somebody/someone.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Each student must bring _____ own lunch."',
      correct: ["their", "his or her"],
      explain: "each + singular; their common in modern English.",
    },
    {
      type: "multiple_choice",
      prompt: "One/ones replacement",
      options: [
        "I like the red one.",
        "I like the red oneses.",
        "I like red.",
        "I like the red.",
      ],
      correct: "I like the red one.",
      explain: "one replaces singular noun.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Between you and _____, I disagree."',
      correct: ["me"],
      explain: "after preposition → me (not I).",
    },
  ],

  comparatives: [
    {
      type: "multiple_choice",
      prompt: "Comparative of good",
      options: ["gooder", "more good", "better", "best"],
      correct: "better",
      explain: "good → better (irregular).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "This room is _____ than the other." (big)',
      correct: ["bigger"],
      explain: "short adjective + -er + than.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: She is not as tall as her brother.",
      correct: "She is not as tall as her brother.",
      explain: "not as + adjective + as.",
    },
    {
      type: "multiple_choice",
      prompt: "Superlative of far",
      options: ["farest", "farer", "the farthest", "the more far"],
      correct: "the farthest",
      explain: "far → farthest/furthest.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Tokyo is one of _____ cities in the world." (large)',
      correct: ["the largest", "largest"],
      explain: "one of the + superlative.",
    },
    {
      type: "multiple_choice",
      prompt: "Long adjective comparative",
      options: [
        "more interesting",
        "interestinger",
        "most interesting",
        "interestinger than",
      ],
      correct: "more interesting",
      explain: "two+ syllables often: more + adjective.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "The _____ you practice, the better you get." (much)',
      correct: ["more"],
      explain: "The more..., the better...",
    },
    {
      type: "sentence_construction",
      prompt: "Write: My car is less expensive than yours.",
      correct: "My car is less expensive than yours.",
      explain: "less + adjective + than.",
    },
    {
      type: "multiple_choice",
      prompt: "Comparative of badly",
      options: ["badder", "worse", "worst", "more badly"],
      correct: "worse",
      explain: "badly → worse.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "She runs as _____ as her sister." (fast)',
      correct: ["fast", "quickly"],
      explain: "as + adjective/adverb + as.",
    },
    {
      type: "multiple_choice",
      prompt: "Enough — correct sentence",
      options: [
        "Is the room enough big?",
        "Is the room big enough?",
        "Is enough big the room?",
        "Is the room big enoughly?",
      ],
      correct: "Is the room big enough?",
      explain: "adjective + enough.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "This bag is _____ heavy for me to carry." (too)',
      correct: ["too"],
      explain: "too + adjective + to-infinitive.",
    },
  ],

  conditionals: [
    {
      type: "multiple_choice",
      prompt: "First conditional",
      options: [
        "If I will see her, I tell her.",
        "If I see her, I will tell her.",
        "If I saw her, I will tell her.",
        "If I see her, I told her.",
      ],
      correct: "If I see her, I will tell her.",
      explain: "if + present, will + verb.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "If I _____ rich, I would travel the world." (be — unreal now)',
      correct: ["were", "was"],
      explain: "Second conditional: if + past, would + verb.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: I wish I knew the answer.",
      correct: "I wish I knew the answer.",
      explain: "wish + past for present regret.",
    },
    {
      type: "multiple_choice",
      prompt: "Third conditional",
      options: [
        "If I studied, I would pass.",
        "If I had studied, I would have passed.",
        "If I study, I will pass.",
        "If I had studied, I will pass.",
      ],
      correct: "If I had studied, I would have passed.",
      explain: "if + past perfect, would have + pp.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Unless it rains, we _____ a picnic." (have)',
      correct: ["will have", "'ll have"],
      explain: "unless = if not; same structure as first conditional.",
    },
    {
      type: "multiple_choice",
      prompt: "Wish about past",
      options: [
        "I wish I went.",
        "I wish I had gone.",
        "I wish I have gone.",
        "I wish I would go.",
      ],
      correct: "I wish I had gone.",
      explain: "wish + past perfect for past regret.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "You can go out _____ you finish your homework." (provided)',
      correct: ["provided", "as long as", "if"],
      explain: "provided/as long as = condition.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: If I were you, I would apologize.",
      correct: "If I were you, I would apologize.",
      explain: "Second conditional advice.",
    },
    {
      type: "multiple_choice",
      prompt: "In case meaning",
      options: [
        "Take an umbrella in case it rains.",
        "Take an umbrella in case it rained.",
        "Take an umbrella in case it will rain.",
        "Take an umbrella in case of rains.",
      ],
      correct: "Take an umbrella in case it rains.",
      explain: "in case + present for precaution.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "I wouldn\'t do that if I _____ you."',
      correct: ["were", "was"],
      explain: "If I were you.",
    },
    {
      type: "multiple_choice",
      prompt: "Mixed — wrong pairing",
      options: [
        "If he had called, I would have answered.",
        "If he calls, I will answer.",
        "If he called, I would answer.",
        "If he had called, I will answer.",
      ],
      correct: "If he had called, I will answer.",
      explain: "This mixes third conditional with will (incorrect).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Even though it was cold, we _____ outside." (go — past)',
      correct: ["went"],
      explain: "although/even though + clause; main verb past.",
    },
  ],

  passive: [
    {
      type: "multiple_choice",
      prompt: "Present simple passive",
      options: [
        "English speaks in many countries.",
        "English is spoken in many countries.",
        "English is speaking in many countries.",
        "English spoken in many countries.",
      ],
      correct: "English is spoken in many countries.",
      explain: "is/are + past participle.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "The window _____ yesterday." (break — past passive)',
      correct: ["was broken"],
      explain: "was + past participle.",
    },
    {
      type: "sentence_construction",
      prompt: "Write passive: The cake was made by my grandmother.",
      correct: "The cake was made by my grandmother.",
      explain: "was + past participle + by-agent.",
    },
    {
      type: "multiple_choice",
      prompt: "Present continuous passive",
      options: [
        "The road is repairing.",
        "The road is being repaired.",
        "The road is repaired.",
        "The road repairs.",
      ],
      correct: "The road is being repaired.",
      explain: "is being + past participle.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "This book _____ by millions of people." (read)',
      correct: ["has been read", "is read"],
      explain: "has been + pp (present perfect passive).",
    },
    {
      type: "multiple_choice",
      prompt: "Active to passive: They built the bridge in 1990.",
      options: [
        "The bridge built in 1990.",
        "The bridge was built in 1990.",
        "The bridge is built in 1990.",
        "The bridge was build in 1990.",
      ],
      correct: "The bridge was built in 1990.",
      explain: "Object becomes subject + was built.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Employees _____ to wear badges." (require)',
      correct: ["are required", "are required to"],
      explain: "are required to + infinitive.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: The emails will be sent tomorrow.",
      correct: "The emails will be sent tomorrow.",
      explain: "will be + past participle.",
    },
    {
      type: "multiple_choice",
      prompt: "Agent with by",
      options: [
        "Hamlet was written from Shakespeare.",
        "Hamlet was written by Shakespeare.",
        "Hamlet was written with Shakespeare.",
        "Hamlet written by Shakespeare was.",
      ],
      correct: "Hamlet was written by Shakespeare.",
      explain: "by + agent.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "The suspect is believed _____ left the country." (to)',
      correct: ["to have", "to have left"],
      explain: "is believed to have + pp.",
    },
    {
      type: "multiple_choice",
      prompt: "Get-passive (informal)",
      options: [
        "He got fired.",
        "He got fire.",
        "He was get fired.",
        "He got firing.",
      ],
      correct: "He got fired.",
      explain: "get + past participle.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Dinner _____ at seven tonight." (serve)',
      correct: ["will be served", "is served", "is being served"],
      explain: "Future arrangement passive: will be served.",
    },
  ],

  reported_speech: [
    {
      type: "multiple_choice",
      prompt: 'Direct: "I am tired." → Reported:',
      options: ["He said he is tired.", "He said he was tired.", "He said I was tired.", "He said he am tired."],
      correct: "He said he was tired.",
      explain: "Present → past after past reporting verb.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: She told me she _____ call later. (will → past)',
      correct: ["would"],
      explain: "will → would.",
    },
    {
      type: "sentence_construction",
      prompt: 'Report: "Where do you live?" → He asked me where I lived.',
      correct: "He asked me where I lived.",
      explain: "Questions: word order + past.",
    },
    {
      type: "multiple_choice",
      prompt: "Say vs tell",
      options: [
        "He said me the truth.",
        "He told me the truth.",
        "He told the truth me.",
        "He said the truth me.",
      ],
      correct: "He told me the truth.",
      explain: "tell + person; say (+ that).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Don\'t wait!" → She told us _____ wait.',
      correct: ["not to", "not to not"],
      explain: "tell + not to + infinitive.",
    },
    {
      type: "multiple_choice",
      prompt: "Time shift: today →",
      options: ["today", "that day", "yesterday", "tomorrow"],
      correct: "that day",
      explain: "today → that day in reported speech.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: He asked if I _____ to the party. (come — past)',
      correct: ["was coming", "would come", "had come"],
      explain: "Are you coming? → if I was coming.",
    },
    {
      type: "sentence_construction",
      prompt: 'Report: "I have finished." → She said she had finished.',
      correct: "She said she had finished.",
      explain: "have → had (backshift).",
    },
    {
      type: "multiple_choice",
      prompt: "No change when still true (sometimes)",
      options: [
        "The Earth is round.",
        "He said the Earth was round.",
        "He said the Earth is round.",
        "Both B and C can be acceptable in modern usage.",
      ],
      correct: "Both B and C can be acceptable in modern usage.",
      explain: "Universal truths may keep present tense.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "I can help you." → He said he _____ help me.',
      correct: ["could"],
      explain: "can → could.",
    },
    {
      type: "multiple_choice",
      prompt: "Commands — correct reported form",
      options: [
        "The doctor said to rest.",
        "The doctor told me to rest.",
        "The doctor told rest.",
        "The doctor said me rest.",
      ],
      correct: "The doctor told me to rest.",
      explain: "tell + object + to-infinitive.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Why are you late?" → She asked why I _____ late.',
      correct: ["was", "had been"],
      explain: "are → was in reported question.",
    },
  ],

  gerund_infinitive: [
    {
      type: "multiple_choice",
      prompt: "After enjoy",
      options: ["I enjoy to read.", "I enjoy reading.", "I enjoy read.", "I enjoy reads."],
      correct: "I enjoy reading.",
      explain: "enjoy + verb-ing.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "She decided _____ abroad." (study)',
      correct: ["to study"],
      explain: "decide + to-infinitive.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: He told me to wait here.",
      correct: "He told me to wait here.",
      explain: "tell + object + to + verb.",
    },
    {
      type: "multiple_choice",
      prompt: "Purpose infinitive",
      options: [
        "I went to the shop buying milk.",
        "I went to the shop to buy milk.",
        "I went to the shop for buy milk.",
        "I went to the shop buy milk.",
      ],
      correct: "I went to the shop to buy milk.",
      explain: "to + verb for purpose.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Would you mind _____ the door?" (close)',
      correct: ["closing"],
      explain: "mind + verb-ing.",
    },
    {
      type: "multiple_choice",
      prompt: "want + object",
      options: [
        "I want that you help.",
        "I want you to help.",
        "I want you helping.",
        "I want you help.",
      ],
      correct: "I want you to help.",
      explain: "want + person + to + verb.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "It\'s no use _____ about it now." (worry)',
      correct: ["worrying"],
      explain: "It's no use + -ing.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: I'm looking forward to seeing you.",
      correct: "I'm looking forward to seeing you.",
      explain: "look forward to + -ing (to is preposition).",
    },
    {
      type: "multiple_choice",
      prompt: "stop + -ing vs stop + to",
      options: [
        "I stopped smoking = I quit.",
        "I stopped to smoke = I quit.",
        "Both mean quit.",
        "stopped smoking means paused in order to smoke.",
      ],
      correct: "I stopped smoking = I quit.",
      explain: "stop + -ing = quit; stop + to = pause in order to.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "She avoided _____ him at the party." (meet)',
      correct: ["meeting"],
      explain: "avoid + verb-ing.",
    },
    {
      type: "multiple_choice",
      prompt: "adjective + preposition + -ing",
      options: [
        "good in play",
        "good at playing",
        "good to playing",
        "good for play",
      ],
      correct: "good at playing",
      explain: "good at + -ing.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Remember _____ the lights when you leave!" (turn off)',
      correct: ["to turn off", "to turn"],
      explain: "remember to + infinitive = don't forget future action.",
    },
  ],

  phrasal: [
    {
      type: "multiple_choice",
      prompt: "go away means",
      options: ["arrive", "leave", "enter", "return"],
      correct: "leave",
      explain: "go away = leave.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Please _____ your shoes before you come in." (take off)',
      correct: ["take off"],
      explain: "take off = remove clothing.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: She grew up in a small town.",
      correct: "She grew up in a small town.",
      explain: "grow up = spend childhood.",
    },
    {
      type: "multiple_choice",
      prompt: "look after",
      options: ["search for", "take care of", "look at", "find"],
      correct: "take care of",
      explain: "look after = take care of.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "The meeting was _____ until Friday." (put off)',
      correct: ["put off", "postponed"],
      explain: "put off = postpone.",
    },
    {
      type: "multiple_choice",
      prompt: "Separable phrasal — correct",
      options: [
        "Turn on it.",
        "Turn it on.",
        "Turn on.",
        "It turn on.",
      ],
      correct: "Turn it on.",
      explain: "pronoun goes between verb and particle.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "I need to _____ smoking." (give up)',
      correct: ["give up"],
      explain: "give up = quit.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: He ran away from home as a teenager.",
      correct: "He ran away from home as a teenager.",
      explain: "run away = escape.",
    },
    {
      type: "multiple_choice",
      prompt: "find out",
      options: ["discover", "lose", "hide", "forget"],
      correct: "discover",
      explain: "find out = discover information.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Can you _____ the children while I cook?" (look after)',
      correct: ["look after"],
      explain: "look after = babysit/care for.",
    },
    {
      type: "multiple_choice",
      prompt: "get on with",
      options: ["have a good relationship", "board a bus", "continue", "fall"],
      correct: "have a good relationship",
      explain: "get on with = have a good relationship.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "The plane took _____ on time."',
      correct: ["off"],
      explain: "take off = leave the ground.",
    },
  ],

  relative_clauses: [
    {
      type: "multiple_choice",
      prompt: "People — who or which?",
      options: [
        "The woman which called you.",
        "The woman who called you.",
        "The woman what called you.",
        "The woman whom called you.",
      ],
      correct: "The woman who called you.",
      explain: "who for people (subject).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "This is the house _____ I grew up." (place)',
      correct: ["where", "in which"],
      explain: "where for place.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: The book that you lent me is excellent.",
      correct: "The book that you lent me is excellent.",
      explain: "that/which for things.",
    },
    {
      type: "multiple_choice",
      prompt: "Object relative — can omit",
      options: [
        "The film (that) I saw was long.",
        "The film saw I was long.",
        "The film who I saw was long.",
        "The film which saw was long.",
      ],
      correct: "The film (that) I saw was long.",
      explain: "Object pronoun can be omitted.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "The man _____ car was stolen called the police." (possession)',
      correct: ["whose"],
      explain: "whose = possessive relative.",
    },
    {
      type: "multiple_choice",
      prompt: "Non-defining clause — punctuation",
      options: [
        "My brother who lives in Rome is visiting.",
        "My brother, who lives in Rome, is visiting.",
        "My brother who lives in Rome is visiting.",
        "My brother who lives in Rome, is visiting.",
      ],
      correct: "My brother, who lives in Rome, is visiting.",
      explain: "Extra info → commas.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "That\'s the reason _____ I left early."',
      correct: ["why", "that"],
      explain: "reason why / reason that.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: The students whose exams were cancelled were relieved.",
      correct: "The students whose exams were cancelled were relieved.",
      explain: "whose for possession.",
    },
    {
      type: "multiple_choice",
      prompt: "whom — formal object",
      options: [
        "The person whom I met was kind.",
        "The person whom met me was kind.",
        "The person whom is kind met I.",
        "The person whom kind was.",
      ],
      correct: "The person whom I met was kind.",
      explain: "whom as object (formal).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "July, _____ is hot here, is vacation time." (extra info)',
      correct: ["which"],
      explain: "which in non-defining clauses.",
    },
    {
      type: "multiple_choice",
      prompt: "Defining vs non-defining",
      options: [
        "Students who cheat fail.",
        "Students, who cheat, fail.",
        "Students, who cheat fail.",
        "Students who cheat, fail.",
      ],
      correct: "Students who cheat fail.",
      explain: "Defining = essential, no commas.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "The café _____ we met is closed now." (place — object)',
      correct: ["where", "that", "which"],
      explain: "where or that/which (with preposition: at which).",
    },
  ],

  questions_tags: [
    {
      type: "multiple_choice",
      prompt: "Tag for: She is leaving, _____?",
      options: ["is she", "isn't she", "doesn't she", "wasn't she"],
      correct: "isn't she",
      explain: "Positive clause → negative tag.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "You live here, _____?"',
      correct: ["don't you", "do you not"],
      explain: "live → do; you → don't you.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: They haven't finished yet, have they?",
      correct: "They haven't finished yet, have they?",
      explain: "Negative clause → positive tag (have they).",
    },
    {
      type: "multiple_choice",
      prompt: "Tag for: Let's go, _____?",
      options: ["shall we", "will we", "do we", "are we"],
      correct: "shall we",
      explain: "Let's → shall we.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "He can swim, _____?"',
      correct: ["can't he", "can he not"],
      explain: "can → can't he.",
    },
    {
      type: "multiple_choice",
      prompt: "Tag after I am",
      options: ["aren't I", "amn't I", "don't I", "isn't I"],
      correct: "aren't I",
      explain: "I'm right, aren't I? (exception).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Nobody called, _____?"',
      correct: ["did they"],
      explain: "nobody → they in tag.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: You're coming to the party, aren't you?",
      correct: "You're coming to the party, aren't you?",
      explain: "You're = You are → aren't you.",
    },
    {
      type: "multiple_choice",
      prompt: "Tag for: Don't forget, _____?",
      options: ["will you", "do you", "don't you", "shall you"],
      correct: "will you",
      explain: "Imperative negative → will you.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "There is a problem, _____?"',
      correct: ["isn't there", "is there not"],
      explain: "there is → isn't there.",
    },
    {
      type: "multiple_choice",
      prompt: "Same tense in tag",
      options: [
        "She went home, doesn't she?",
        "She went home, didn't she?",
        "She went home, wasn't she?",
        "She went home, hasn't she?",
      ],
      correct: "She went home, didn't she?",
      explain: "went → did (didn't she).",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "You\'ve met him before, _____?"',
      correct: ["haven't you", "have you not"],
      explain: "You've = have → haven't you.",
    },
  ],

  default: [
    {
      type: "multiple_choice",
      prompt: "Choose the grammatically correct sentence.",
      options: [
        "She don't like it.",
        "She doesn't like it.",
        "She not likes it.",
        "She doesn't likes it.",
      ],
      correct: "She doesn't like it.",
      explain: "Present simple negative: doesn't + base verb.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "There are _____ apples in the bowl." (some)',
      correct: ["some", "a few"],
      explain: "affirmative plural count → some.",
    },
    {
      type: "sentence_construction",
      prompt: "Write a correct sentence using because: I stayed home because I was ill.",
      correct: "I stayed home because I was ill.",
      explain: "because + clause (reason).",
    },
    {
      type: "multiple_choice",
      prompt: "Conjunction — contrast",
      options: ["and", "but", "so", "because"],
      correct: "but",
      explain: "but shows contrast.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "She speaks English very _____." (good/well)',
      correct: ["well"],
      explain: "Manner → adverb well.",
    },
    {
      type: "multiple_choice",
      prompt: "Quantifier — negative",
      options: ["I have some money.", "I don't have any money.", "I have no any money.", "I don't have some money."],
      correct: "I don't have any money.",
      explain: "negative → any.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Both answers are correct, _____ neither is perfect." (and/but)',
      correct: ["but"],
      explain: "contrast with neither → but.",
    },
    {
      type: "sentence_construction",
      prompt: "Write: Although it was late, we continued working.",
      correct: "Although it was late, we continued working.",
      explain: "Although + clause + main clause.",
    },
    {
      type: "multiple_choice",
      prompt: "Adjective order — natural phrase",
      options: ["a wooden small table", "a small wooden table", "a wood small table", "a small wood table"],
      correct: "a small wooden table",
      explain: "Opinion/size before material: small wooden.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "Do you know what time it _____?"',
      correct: ["is"],
      explain: "Embedded question: what time it is (statement order).",
    },
    {
      type: "multiple_choice",
      prompt: "So/neither agreement",
      options: ["I like coffee. — So do I.", "I like coffee. — Neither do I.", "I like coffee. — So am I.", "I like coffee. — So I do."],
      correct: "I like coffee. — So do I.",
      explain: "So + auxiliary + subject.",
    },
    {
      type: "fill_blank",
      prompt: 'Complete: "The meeting starts soon. Don\'t be _____." (late)',
      correct: ["late"],
      explain: "be + adjective.",
    },
  ],
};

function pickBankItems(bank: BankItem[], unitNum: number, count: number): BankItem[] {
  const offset = (unitNum - 1) % bank.length;
  return Array.from({ length: count }, (_, i) => bank[(offset + i) % bank.length]);
}

/**
 * Returns exactly 10 Cambridge-style questions for a grammar unit.
 * Topic string is matched (Essential Grammar in Use) to a question bank.
 */
export function getUnitQuestions(unitNum: number, topic: string, _title: string): Question[] {
  void _title;
  const key = resolveTopicKey(topic);
  const bank = BANKS[key];
  const items = pickBankItems(bank, unitNum, 10);

  return items.map((item, i) => toQuestion(item, `grammar-u${unitNum}-q${i + 1}`));
}
