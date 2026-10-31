
export const mockData = {
  // STUDENT
  "/student/overview": [
    { label: "Study Hours", value: "24 hrs", hint: "This week" },
    { label: "Topics Completed", value: "18", hint: "Across all subjects" },
    { label: "Revision Streak", value: "7 days", hint: "Keep going!" },
    { label: "Accuracy", value: "86%", hint: "Practice performance" },
  ],

  "/student/decks": [
    { id: "deck-1", title: "JavaScript Basics", dueCount: 8 },
    { id: "deck-2", title: "React Fundamentals", dueCount: 5 },
  ],

  "/student/weak-topics": [
    { topic: "Arrays", score: 45 },
    { topic: "Functions", score: 62 },
    { topic: "Objects", score: 38 },
    { topic: "DOM Manipulation", score: 72 },
  ],

  "/student/leaderboard": [
    { id: "s1", name: "Aarav", value: 920, rank: 1 },
    { id: "s2", name: "Ananya", value: 850, rank: 2 },
    { id: "s3", name: "You", value: 780, rank: 3 },
  ],

  "/student/groups": [
    {
      id: "g1",
      title: "Frontend Developers",
      subtitle: "12 learners",
      meta: "JavaScript and React",
    },
    {
      id: "g2",
      title: "DSA Practice Group",
      subtitle: "8 learners",
      meta: "Problem solving",
    },
  ],

  // TEACHER
  "/teacher/overview": [
    { label: "Total Students", value: "120", hint: "Across your classes" },
    { label: "Active Classes", value: "4", hint: "Currently running" },
    { label: "Topics Covered", value: "32", hint: "This semester" },
  ],

  "/teacher/misconceptions": [
    {
      id: "m1",
      title: "Array indexing",
      subtitle: "Common student difficulty",
      meta: "Programming",
    },
    {
      id: "m2",
      title: "Asynchronous JavaScript",
      subtitle: "Needs further explanation",
      meta: "JavaScript",
    },
  ],

  "/teacher/class-heatmap": [
    { topic: "Arrays", score: 65 },
    { topic: "Functions", score: 80 },
    { topic: "Objects", score: 48 },
  ],

  "/teacher/classes": [
    {
      id: "c1",
      title: "Web Development - Batch A",
      subtitle: "35 students",
      meta: "Active",
    },
    {
      id: "c2",
      title: "JavaScript - Batch B",
      subtitle: "28 students",
      meta: "Active",
    },
  ],

  // INSTITUTE
  "/institute/overview": [
    { label: "Total Students", value: "450", hint: "Across all batches" },
    { label: "Faculty Members", value: "24", hint: "Active faculty" },
    { label: "Active Batches", value: "12", hint: "Currently running" },
  ],

  "/institute/teachers": [
    {
      id: "t1",
      title: "Rohit Sharma",
      subtitle: "Frontend Development",
      meta: "Faculty",
    },
    {
      id: "t2",
      title: "Priya Verma",
      subtitle: "Programming Fundamentals",
      meta: "Faculty",
    },
  ],

  "/institute/batches": [
    {
      id: "b1",
      title: "BTech - Batch A",
      subtitle: "45 students",
      meta: "2026",
    },
    {
      id: "b2",
      title: "Web Development - Batch B",
      subtitle: "32 students",
      meta: "2026",
    },
  ],
};

export const mockCards = {
  "deck-1": [
    {
      id: "card-1",
      front: "What is JavaScript?",
      back: "A programming language used to create dynamic web experiences.",
    },
    {
      id: "card-2",
      front: "What is an array?",
      back: "An ordered collection of values.",
    },
  ],

  "deck-2": [
    {
      id: "card-3",
      front: "What is React?",
      back: "A JavaScript library for building user interfaces.",
    },
    {
      id: "card-4",
      front: "What is a component?",
      back: "A reusable piece of UI.",
    },
  ],
};
