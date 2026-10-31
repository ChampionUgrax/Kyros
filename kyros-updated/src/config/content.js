// Marketing copy only (no user data). Edit freely or swap for a CMS later.
export const BRAND = { name: 'Kyros', tagline: 'Learn what you actually don’t know. Stay focused while you do.' };
export const DEMO_CARD = { front: 'Why does spaced repetition work?', back: 'Reviewing right before you forget strengthens the memory, so each gap can grow longer.' };
export const FEATURES = [
  { icon: '🧠', title: 'Adaptive learning paths', text: 'Upload notes or a syllabus. Kyros finds your gaps and builds quizzes around them.' },
  { icon: '🃏', title: 'Flashcards that remember for you', text: 'Spaced repetition schedules each card for the moment you’re about to forget it.' },
  { icon: '💡', title: 'Hints, not answers', text: 'Mira asks guiding questions so you build understanding instead of copying.' },
  { icon: '🔥', title: 'Focus streaks', text: 'Track focus sessions, earn streaks and study with friends in accountability groups.' },
  { icon: '📊', title: 'Class-wide misconceptions', text: 'Teachers see which ideas the whole class is stuck on, before the exam does.' },
  { icon: '🏫', title: 'Institute overview', text: 'Coaching institutes track batches, teachers and progress in one place.' },
];
export const EXT_STEPS = [
  'Download the ZIP and extract it first. Chrome cannot load the ZIP directly.',
  'In Google Chrome, open chrome://extensions and turn on Developer mode.',
  'Choose Load unpacked and select the extracted folder containing manifest.json.',
  'Keep one Kyros Focus copy enabled. To update, replace its loaded folder and click Reload on its Chrome card.',
  'Open the same Kyros address in Google Chrome. Click the puzzle-piece Extensions button and pin Kyros Focus if you want one-click access.',
  'Open Kyros Focus from the Extensions menu and click Connect this tab. Allow localhost access if Chrome asks.',
  'Return to Focus. The connection indicator updates as soon as Chrome attaches the bridge.',
  'In Focus, select Instagram and/or YouTube, then start the timer.',
];
export const EXT_PERKS = ['Instagram and YouTube site cards with checkboxes', 'Blocks matching tabs and new navigations during focus', 'Blocking automatically ends when you pause or the timer finishes'];
