import { Category, Profile } from './types';

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'inc-1', name: '💰 생활비', type: 'INCOME', isDefault: true },
];

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'exp-1', name: '🍚 식비', type: 'EXPENSE', isDefault: true },
  { id: 'exp-2', name: '🍰 디저트', type: 'EXPENSE', isDefault: true },
  { id: 'exp-3', name: '🛒 장보기', type: 'EXPENSE', isDefault: true },
  { id: 'exp-4', name: '💡 공과금', type: 'EXPENSE', isDefault: true },
  { id: 'exp-5', name: '🏠 주거비', type: 'EXPENSE', isDefault: true },
  { id: 'exp-6', name: '🍻 술/유흥', type: 'EXPENSE', isDefault: true },
  { id: 'exp-7', name: '💕 데이트', type: 'EXPENSE', isDefault: true },
  { id: 'exp-8', name: '💊 건강', type: 'EXPENSE', isDefault: true },
  { id: 'exp-9', name: '🚌 교통', type: 'EXPENSE', isDefault: true },
  { id: 'exp-10', name: '✈️ 여행', type: 'EXPENSE', isDefault: true },
  { id: 'exp-11', name: '🎸 기타', type: 'EXPENSE', isDefault: true },
];

export const DEFAULT_PROFILES: Profile[] = [
  { id: 'p-1', name: '나', color: 'bg-blue-500' },
];

export const PROFILE_COLORS = [
  'bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500', 'bg-gray-500', 'bg-teal-500'
];