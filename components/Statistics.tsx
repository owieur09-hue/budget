import React, { useMemo } from 'react';
import { startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO, format } from 'date-fns';
import { Transaction, Category } from '../types';

interface StatisticsProps {
  currentDate: Date;
  transactions: Transaction[];
  categories: Category[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ currentDate, transactions, categories, onPrevMonth, onNextMonth }) => {
  const stats = useMemo(() => {
    // Dates
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    const prevMonthDate = subMonths(currentDate, 1);
    const prevMonthStart = startOfMonth(prevMonthDate);
    const prevMonthEnd = endOfMonth(prevMonthDate);

    // Helpers
    const getExpense = (txs: Transaction[]) => 
      txs.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

    // Filter Transactions
    const currentMonthTxs = transactions.filter(t => 
      isWithinInterval(parseISO(t.date), { start: currentMonthStart, end: currentMonthEnd })
    );
    const prevMonthTxs = transactions.filter(t => 
      isWithinInterval(parseISO(t.date), { start: prevMonthStart, end: prevMonthEnd })
    );

    // Total Expenses
    const currentTotal = getExpense(currentMonthTxs);
    const prevTotal = getExpense(prevMonthTxs);
    const totalDiff = currentTotal - prevTotal;

    // Category Stats
    const categoryStats = categories
      .filter(c => c.type === 'EXPENSE')
      .map(cat => {
        const currentCatTotal = currentMonthTxs
          .filter(t => t.categoryId === cat.id)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const prevCatTotal = prevMonthTxs
          .filter(t => t.categoryId === cat.id)
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          ...cat,
          current: currentCatTotal,
          prev: prevCatTotal,
          diff: currentCatTotal - prevCatTotal
        };
      })
      .filter(s => s.current > 0 || s.prev > 0) // Hide unused categories
      .sort((a, b) => b.current - a.current); // Sort by current expense desc

    return {
      currentTotal,
      prevTotal,
      totalDiff,
      categoryStats
    };
  }, [currentDate, transactions, categories]);

  const maxCategoryAmount = Math.max(...stats.categoryStats.map(s => s.current), 1);

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom-5 duration-300">
      
      {/* Header with Black Line and Rounded Pill */}
      <div className="pt-12 pb-2 px-6">
        <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full h-0.5 bg-black rounded-full"></div>
            </div>
            <div className="relative bg-black text-white px-6 py-2 rounded-full text-lg font-bold font-round z-10 shadow-lg">
                통계 분석
            </div>
        </div>
        
        {/* Month Navigation */}
        <div className="flex justify-center items-center gap-6 mb-4">
             <button onClick={onPrevMonth} className="hover:bg-gray-100 p-2 rounded-full transition-colors font-round font-bold text-xl">
               {'<'}
             </button>
             <span className="text-lg font-bold text-gray-800 tracking-wide font-round min-w-[100px] text-center">
                {format(currentDate, 'yyyy년 M월')}
             </span>
             <button onClick={onNextMonth} className="hover:bg-gray-100 p-2 rounded-full transition-colors font-round font-bold text-xl">
               {'>'}
             </button>
        </div>
      </div>

      {/* Content starts here */}
      <div className="flex-1 overflow-y-auto px-6 pb-28 space-y-6">
        
        {/* 1. Total Comparison */}
        <div className="bg-white border border-gray-200 rounded-[2rem] p-6 shadow-sm">
           <h3 className="text-xs font-bold text-gray-400 mb-4 font-round ml-1">총 지출</h3>
           <div className="flex justify-between items-end mb-4 px-1">
              <div className="text-right flex-1 opacity-50">
                 <span className="text-[10px] text-gray-500 block mb-1 font-round">지난달</span>
                 <span className="text-lg font-mono font-bold text-gray-600 line-through decoration-gray-400">{stats.prevTotal.toLocaleString()}</span>
              </div>
              <div className="w-px h-10 bg-gray-200 mx-4"></div>
              <div className="text-right flex-1">
                 <span className="text-[10px] text-black font-bold block mb-1 font-round">이번달</span>
                 <span className="text-2xl font-mono font-bold text-black">{stats.currentTotal.toLocaleString()}</span>
              </div>
           </div>
           
           <div className={`text-right text-xs font-bold py-3 px-4 rounded-xl ${stats.totalDiff > 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
              {stats.totalDiff > 0 ? '▲' : '▼'} {Math.abs(stats.totalDiff).toLocaleString()} KRW 
              {stats.totalDiff > 0 ? ' 증가' : ' 감소'}
           </div>
        </div>

        {/* 2. Category Rank Graph */}
        <div className="bg-white border border-gray-200 rounded-[2rem] p-6 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 mb-6 font-round ml-1">지출 순위</h3>
          <div className="space-y-6">
            {stats.categoryStats.map((stat, idx) => (
              <div key={stat.id}>
                <div className="flex justify-between items-center mb-2 text-sm px-1">
                   <div className="flex items-center gap-3">
                     <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${idx < 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>{idx + 1}</span>
                     <span className="text-gray-800 font-bold">{stat.name}</span>
                   </div>
                   <span className="font-mono font-bold text-black">{stat.current.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                   <div 
                     className="bg-black h-full rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stat.current / maxCategoryAmount) * 100}%` }}
                   ></div>
                </div>
              </div>
            ))}
            {stats.categoryStats.length === 0 && (
              <p className="text-center text-gray-400 text-xs font-medium py-4">데이터가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 3. Category Comparison List */}
        <div className="bg-gray-50 border border-gray-200 rounded-[2rem] p-6">
          <h3 className="text-xs font-bold text-gray-400 mb-4 font-round ml-1">전월 대비 증감</h3>
          <div className="space-y-1">
             {stats.categoryStats.map(stat => (
               <div key={stat.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0 px-1">
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-gray-800">{stat.name}</span>
                  </div>
                  <div className={`text-right font-mono text-xs font-bold ${stat.diff > 0 ? 'text-black' : 'text-gray-400'}`}>
                     {stat.diff > 0 ? '+' : ''}{stat.diff.toLocaleString()}
                  </div>
               </div>
             ))}
             {stats.categoryStats.length === 0 && (
               <p className="text-center text-gray-400 text-xs py-4">비교할 데이터가 없습니다.</p>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Statistics;
