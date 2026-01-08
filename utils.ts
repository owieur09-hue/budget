export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ko-KR');
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};
