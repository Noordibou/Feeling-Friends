const generateRandAnswers = () => {
  const emotions = [
    "Hurt",
    "Lonely",
    "Guilty",
    "Sad",
    "Disappointed",
    "Ashamed",
    "Grumpy",
    "Disgusted",
    "Jealous",
    "Frustrated",
    "Annoyed",
    "Angry",
    "Threatened",
    "Insecure",
    "Scared",
    "Intimidated",
    "Rejected",
    "Secure",
    "Excited",
    "Confident",
    "Ambitious",
    "Determined",
    "Proud",
    "Hopeful",
    "Grateful",
    "Glad",
    "Thoughtful",
    "Peaceful",
    "Content",
    "Confused",
    "Embarrassed",
    "Pressured",
    "Overwhelmed",
    "Worried",
    "Anxious",
  ];
  const ZORS = ["Unmotivated", "Ready to Learn", "Wiggly", "Explosive"];
  const goals = [
    "Finish homework during study hall",
    "Better manage my energy",
    "Do my best in class",
    "Be more present",
  ];
  const needs = [
    "Check in with my teacher",
    "Help with homework",
    "Extra practice",
    "Help with focusing",
  ];

  const randomAnswers = {
    emotion: emotions[Math.floor(Math.random() * emotions.length)],
    ZOR: ZORS[Math.floor(Math.random() * ZORS.length)],
    goal: goals[Math.floor(Math.random() * goals.length)],
    need: needs[Math.floor(Math.random() * needs.length)],
  };

  return randomAnswers;
};

module.exports = {
  generateRandAnswers,
};
