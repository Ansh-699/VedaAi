export type Difficulty = "Easy" | "Moderate" | "Challenging" | "Hard";

export type Question = {
  id: string;
  text: string;
  difficulty: Difficulty;
  marks: number;
};

export type Section = {
  id: string;
  title: string;
  subtitle: string;
  instruction: string;
  questions: Question[];
};

export type QuestionPaper = {
  intro: string;
  school: string;
  subject: string;
  class: string;
  timeAllowed: string;
  maxMarks: number;
  instructions: string;
  sections: Section[];
  answerKey: string[];
};

export const mockQuestionPaper: QuestionPaper = {
  intro:
    "Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:",
  school: "Delhi Public School, Sector-4, Bokaro",
  subject: "English",
  class: "5th",
  timeAllowed: "45 minutes",
  maxMarks: 20,
  instructions: "All questions are compulsory unless stated otherwise.",
  sections: [
    {
      id: "A",
      title: "Section A",
      subtitle: "Short Answer Questions",
      instruction: "Attempt all questions. Each question carries 2 marks",
      questions: [
        { id: "q1", text: "Define electroplating. Explain its purpose.", difficulty: "Easy", marks: 2 },
        { id: "q2", text: "What is the role of a conductor in the process of electrolysis?", difficulty: "Moderate", marks: 2 },
        { id: "q3", text: "Why does a solution of copper sulfate conduct electricity?", difficulty: "Easy", marks: 2 },
        { id: "q4", text: "Describe one example of the chemical effect of electric current in daily life.", difficulty: "Moderate", marks: 2 },
        { id: "q5", text: "Explain why electric current is said to have chemical effects.", difficulty: "Moderate", marks: 2 },
        { id: "q6", text: "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved.", difficulty: "Challenging", marks: 2 },
        { id: "q7", text: "What happens at the cathode and anode during the electrolysis of water? Name the gases evolved.", difficulty: "Challenging", marks: 2 },
        { id: "q8", text: "Mention the type of current used in electroplating and justify why it is used.", difficulty: "Easy", marks: 2 },
        { id: "q9", text: "What is the importance of electric current in the field of metallurgy?", difficulty: "Moderate", marks: 2 },
        { id: "q10", text: "Explain with a chemical equation how copper is deposited during the electroplating of an object.", difficulty: "Challenging", marks: 2 },
      ],
    },
  ],
  answerKey: [
    "Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness.",
    "A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes.",
    "Copper sulfate solution contains free copper and sulfate ions which can carry electric charge, thus conducting electricity.",
    "An example is the electroplating of silver on jewelry to prevent tarnishing.",
    "Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects.",
    "Sodium hydroxide is formed at the cathode during brine electrolysis as water gains electrons:\n2H2O + 2e- → H2 + 2OH-\nNa+ + OH- → NaOH (in solution)",
    "At the cathode: water is reduced to hydrogen gas and hydroxide ions.\nAt the anode: water is oxidized to oxygen gas and hydrogen ions.",
  ],
};
