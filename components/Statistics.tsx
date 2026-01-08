import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { Transaction, Category } from '../types';

interface StatisticsProps {
  transactions: Transaction[];
  categories: Category[];
}

const Statistics: React.FC<StatisticsProps> = ({ transactions, categories }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500 overflow-hidden">
      {/* 고정 헤더 */}
      <div className="pt-12 pb-2 px-6 flex-none bg-white z-10">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full h-0.5 bg-black rounded-full"></div></div>
          <div className="relative bg-black text-white px-6 py-2 rounded-full text-lg font-bold font-round z-10 shadow-lg">통계 분석</div>
        </div>
        
        <div className="flex items-center justify-center gap-8 mb-4">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={24}/></button>
          <span className="text-xl font-bold font-round tracking-tight">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight size={24}/></button>
        </div>
      </div>

      {/* 스크롤 영역: pb-32 적용으로 하단 바 일체화 */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
        <div className="space-y-6">
          {/* 총 지출 카드 */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-gray-400 text-xs font-bold mb-4 ml-1">총 지출</h3>
            <div className="flex justify-between items-end mb-6">
              <div className="text-center">
                <p className="text-[10px] text-gray-400 mb-1">지난달</p>
                <p className="text-gray-300 font-bold font-mono">0</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 mb-1">이번달</p>
                <p className="text-4xl font-black font-mono">0</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 flex items-center justify-center gap-2">
              <TrendingDown size={14} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-500">▼ 0 KRW 감소</span>
            </div>
          </div>

          {/* 지출 순위 카드 */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[200px] flex flex-col">
            <h3 className="text-gray-400 text-xs font-bold mb-4 ml-1">지출 순위</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-gray-300 text-xs font-bold font-round">데이터가 없습니다.</p>
            </div>
          </div>

          {/* 전월 대비 증감 */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[200px] flex flex-col">
            <h3 className="text-gray-400 text-xs font-bold mb-4 ml-1">전월 대비 증감</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-gray-300 text-xs font-bold font-round">비교할 데이터가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
