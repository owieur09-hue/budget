import React, { useState } from 'react';
import { Category, Profile, FixedItem, SettingsTab } from '../types';
import { generateId } from '../utils';
import { Plus, X, Trash2 } from 'lucide-react';

interface SettingsProps {
  tab: SettingsTab;
  onClose: () => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  profiles: Profile[];
  setProfiles: (profiles: Profile[]) => void;
  fixedItems: FixedItem[];
  setFixedItems: (items: FixedItem[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  tab, onClose, categories, setCategories, profiles, setProfiles, fixedItems, setFixedItems 
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (!inputValue.trim()) return;
    if (tab === 'CATEGORIES') {
      const newCat: Category = { id: generateId(), name: inputValue, type: 'EXPENSE', color: '#000000' };
      setCategories([...categories, newCat]);
    } else if (tab === 'PROFILES') {
      const newProf: Profile = { id: generateId(), name: inputValue };
      setProfiles([...profiles, newProf]);
    }
    setInputValue('');
  };

  const handleRemoveItem = (id: string) => {
    if (tab === 'CATEGORIES') setCategories(categories.filter(c => c.id !== id));
    else if (tab === 'PROFILES') setProfiles(profiles.filter(p => p.id !== id));
  };

  const currentItems = tab === 'CATEGORIES' ? categories : profiles;

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-xl font-bold font-round">
          {tab === 'CATEGORIES' ? '카테고리 관리' : tab === 'PROFILES' ? '프로필 관리' : '고정 지출 관리'}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 입력창 영역 (핵심 수정 부분) */}
        {(tab === 'CATEGORIES' || tab === 'PROFILES') && (
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={tab === 'CATEGORIES' ? "이모지 + 이름 (예: 🍔 식비)" : "이름 입력"}
              className="flex-1 min-w-0 h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
            <button
              onClick={handleAddItem}
              className="flex-none w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center active:scale-90"
            >
              <Plus size={24} />
            </button>
          </div>
        )}

        {/* 목록 영역 */}
        <div className="space-y-3">
          {currentItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="font-round font-medium">{item.name}</span>
              <button 
                onClick={() => handleRemoveItem(item.id)}
                className="text-gray-400 hover:text-red-500 p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
