import React from 'react';
import { Layers, CalendarClock, Users, Calendar as CalendarIcon, BarChart3 } from 'lucide-react';
import { SettingsTab } from '../types';

export type BottomTab = SettingsTab | 'CALENDAR';

interface BottomBarProps {
  onTabClick: (tab: BottomTab) => void;
  activeTab: BottomTab;
}

const BottomBar: React.FC<BottomBarProps> = ({ onTabClick, activeTab }) => {
  const isActive = (tab: BottomTab) => activeTab === tab;
  
  return (
    <div className="fixed bottom-0 max-w-md w-full z-40 p-4 pointer-events-none">
      <div className="bg-white rounded-3xl h-16 grid grid-cols-5 pointer-events-auto shadow-2xl border border-gray-100">
         {[
           { id: 'CALENDAR', icon: CalendarIcon, label: '달력' },
           { id: 'STATISTICS', icon: BarChart3, label: '통계' },
           { id: 'FIXED', icon: CalendarClock, label: '고정' },
           { id: 'CATEGORY', icon: Layers, label: '카테고리' },
           { id: 'PROFILE', icon: Users, label: '프로필' }
         ].map(item => (
           <button 
            key={item.id}
            onClick={() => onTabClick(item.id as BottomTab)} 
            className="group flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-all rounded-2xl m-1"
           >
             <div className={`p-2 rounded-xl transition-all ${isActive(item.id as BottomTab) ? 'bg-black text-white shadow-md' : 'text-gray-400'}`}>
                <item.icon size={20} strokeWidth={isActive(item.id as BottomTab) ? 2.5 : 2} />
             </div>
           </button>
         ))}
      </div>
    </div>
  );
};

export default BottomBar;