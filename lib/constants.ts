// CEFR (Common European Framework of Reference) Language Levels
export const CEFR_LEVELS = [
  { value: 'Beginner', label: 'A1 - Beginner' },
  { value: 'Pre-intermediate', label: 'A2 - Pre-intermediate' },
  { value: 'Intermediate', label: 'B1 - Intermediate' },
  { value: 'Upper-intermediate', label: 'B2 - Upper-intermediate' },
  { value: 'Advanced', label: 'C1 - Advanced' },
] as const;

// Lifestyle Learning Categories
export const LESSON_CATEGORIES = [
  { value: 'Health', label: 'Health' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Environment', label: 'Environment' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Food', label: 'Food' },
  { value: 'Culture', label: 'Culture' },
  { value: 'Science', label: 'Science' },
  { value: 'Other', label: 'Other' },
] as const;

// Type definitions for TypeScript
export type CEFRLevel = typeof CEFR_LEVELS[number]['value'];
export type LessonCategory = typeof LESSON_CATEGORIES[number]['value'];