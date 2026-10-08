// Pyradox Complete Python 3 Curriculum Dataset
// Comprehensive 51-Topic Roadmap (Topic 0 to Topic 50)
// Structured with all 12 rigorous instructional sections per topic

import { TOPICS_00_TO_07 } from './topics/topics00to07';
import { TOPICS_08_TO_16 } from './topics/topics08to16';
import { TOPICS_17_TO_24 } from './topics/topics17to24';
import { TOPICS_25_TO_33 } from './topics/topics25to33';
import { TOPICS_34_TO_41 } from './topics/topics34to41';
import { TOPICS_42_TO_50 } from './topics/topics42to50';

export const CATEGORIES = [
  "Foundation",
  "Core Data Structures",
  "Functions",
  "Practical Python",
  "OOP & Protocols",
  "Python Internals",
  "Standard Library",
  "Professional Python",
  "Development & AI/ML",
  "Projects & Problem Solving"
];

// Unified Array of all 51 topics (0 to 50)
export const TOPICS = [
  ...TOPICS_00_TO_07,
  ...TOPICS_08_TO_16,
  ...TOPICS_17_TO_24,
  ...TOPICS_25_TO_33,
  ...TOPICS_34_TO_41,
  ...TOPICS_42_TO_50
];

export const TOPICS_BY_ID = TOPICS.reduce((acc, topic) => {
  acc[topic.id] = topic;
  return acc;
}, {});
