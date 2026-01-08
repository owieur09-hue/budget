import React, { useMemo } from 'react';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, format, isSameMonth, isSameDay, 
  isToday, getDay
} from 'date-fns';
import { Transaction, Category, Profile } from '../types';
import TransactionDetails from './TransactionDetails';

interface CalendarProps {
  currentDate: Date;
  transactions: Transaction[];
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  categories: Category[];
  profiles: Profile[];
  onDeleteTransaction: (id: string) => void;
  onOpenAddForm: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  currentDate, transactions, selectedDate, onDateClick, 
  categories, profiles, onDeleteTransaction, onOpenAddForm 
}) => {

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const start = startOfWeek(monthStart, { weekStartsOn: 0 }); 
    const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  calendarDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getDailyStats = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const daysTransactions = transactions.filter(t => t.date === dateStr);
    const income = daysTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = daysTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  };

  const getDayColor = (dayIndex: number) => {
    if (dayIndex === 0) return 'text-red-500'; // Sunday
    if (dayIndex === 6) return 'text-blue-500'; // Saturday
    return 'text-gray-400';
  };

  return (
    <div className="w-full pb-24 px-4 pt-4">
      {/* Day Headers */}
      <div className="grid grid-cols-7 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
          <div 
            key={day} 
            className={`text-center text-xs font-round font-bold ${getDayColor(idx)}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="flex flex-col gap-2">
        {weeks.map((week, weekIdx) => {
          const isSelectedInThisWeek = selectedDate && week.some(day => isSameDay(day, selectedDate));
          const hasTransactionsForSelected = selectedDate 
            ? transactions.some(t => t.date === format(selectedDate, 'yyyy-MM-dd'))
            : false;

          return (
            <React.Fragment key={weekIdx}>
              <div className="grid grid-cols-7 gap-1">
                {week.map((day) => {
                  const { income, expense } = getDailyStats(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const dayNum = getDay(day);
                  
                  return (
                    <div 
                      key={day.toISOString()}
                      onClick={() => onDateClick(day)}
                      className={`
                        flex flex-col items-center p-1 cursor-pointer min-h-[75px] rounded-2xl transition-all border-2 box-border
                        ${!isCurrentMonth ? 'opacity-20' : ''}
                        ${isSelected ? 'border-black bg-white shadow-xl transform scale-105 z-10' : 'border-transparent hover:bg-gray-50'}
                      `}
                    >
                      <div className={`
                        w-7 h-7 flex items-center justify-center rounded-full text-sm font-round font-bold mb-1
                        ${isToday(day) ? 'bg-gray-200 text-black' : (dayNum === 0 || dayNum === 6 ? getDayColor(dayNum) : 'text-black')}
                      `}>
                        {format(day, 'd')}
                      </div>

                      {/* Transaction Markers */}
                      <div className="flex flex-col gap-1 w-full items-center">
                        {income > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        )}
                        {expense > 0 && (
                          <span className="text-[9px] font-mono font-bold -tracking-tight text-red-500">
                            -{expense.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Detail View */}
              {isSelectedInThisWeek && selectedDate && hasTransactionsForSelected && (
                <div className="w-full mt-3 mb-6 bg-gray-50 rounded-3xl border border-gray-100 p-2 shadow-inner">
                   <TransactionDetails 
                      date={selectedDate}
                      transactions={transactions.filter(t => t.date === format(selectedDate, 'yyyy-MM-dd'))}
                      categories={categories}
                      profiles={profiles}
                      onClose={() => onDateClick(selectedDate)}
                      onDelete={onDeleteTransaction}
                      onAdd={onOpenAddForm}
                   />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;