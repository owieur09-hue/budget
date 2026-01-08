import React, { useState, useRef } from 'react';
import { Category, Profile, FixedItem, TransactionType, SettingsTab } from '../types';
import { X, Plus, Trash2, Edit2, Upload, Save, ChevronDown } from 'lucide-react';
import { generateId } from '../utils';

interface SettingsProps {
  tab: SettingsTab;
  onClose: () => void;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  fixedItems: FixedItem[];
  setFixedItems: React.Dispatch<React.SetStateAction<FixedItem[]>>;
}

const Settings: React.FC<SettingsProps> = ({
  tab, onClose, categories, setCategories, profiles, setProfiles, fixedItems, setFixedItems
}) => {
  const [isExpenseOpen, setIsExpenseOpen] = useState(true);
  const [isIncomeOpen, setIsIncomeOpen] = useState(true);

  // --- Category Logic ---
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<TransactionType>('EXPENSE');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    setCategories(prev => [...prev, { id: generateId(), name: newCatName.trim(), type: newCatType, isDefault: false }]);
    setNewCatName('');
  };

  const startEditingCat = (c: Category) => { setEditingCatId(c.id); setEditCatName(c.name); };
  const saveEditingCat = () => {
    if (!editingCatId || !editCatName.trim()) return;
    setCategories(prev => prev.map(c => c.id === editingCatId ? { ...c, name: editCatName } : c));
    setEditingCatId(null);
  };

  // --- Profile Logic ---
  const [newProfileName, setNewProfileName] = useState('');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const newProfileFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) setEditImage(reader.result as string);
        else setNewProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProfile = () => {
    if (!newProfileName.trim()) return;
    setProfiles(prev => [...prev, { id: generateId(), name: newProfileName.trim(), color: 'bg-black', image: newProfileImage }]);
    setNewProfileName(''); setNewProfileImage(null);
  };

  const startEditing = (p: Profile) => { setEditingProfileId(p.id); setEditName(p.name); setEditImage(p.image || null); };
  const saveEditing = () => {
    if (!editingProfileId || !editName.trim()) return;
    setProfiles(prev => prev.map(p => p.id === editingProfileId ? { ...p, name: editName, image: editImage } : p));
    setEditingProfileId(null);
  };

  // --- Fixed Item Logic ---
  const [fixedAmount, setFixedAmount] = useState('');
  const [fixedDay, setFixedDay] = useState(1);
  const [fixedType, setFixedType] = useState<TransactionType>('EXPENSE');
  const [fixedCatId, setFixedCatId] = useState('');
  const [fixedMemo, setFixedMemo] = useState('');

  const handleAddFixed = () => {
    const amount = parseInt(fixedAmount.replace(/,/g, ''), 10);
    if (!amount || !fixedCatId) return;
    setFixedItems(prev => [...prev, { id: generateId(), amount, day: fixedDay, categoryId: fixedCatId, profileId: profiles[0]?.id, memo: fixedMemo, type: fixedType }]);
    setFixedAmount(''); setFixedMemo('');
  };

  const getTitle = () => {
    switch(tab) {
        case 'FIXED': return '고정 예산';
        case 'CATEGORY': return '카테고리';
        case 'PROFILE': return '프로필';
        default: return '설정';
    }
  }

  const renderCategorySection = (type: TransactionType, isOpen: boolean, toggle: () => void, title: string) => (
    <div className="space-y-4">
        <button onClick={toggle} className="flex items-center justify-between w-full text-left py-2 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">{title} 
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{categories.filter(c => c.type === type).length}</span>
            </h3>
            <span className={`transform transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`}><ChevronDown size={20} /></span>
        </button>
        {isOpen && (
            <div className="grid grid-cols-4 gap-2">
                {categories.filter(c => c.type === type).map(c => {
                    const parts = c.name.split(' ');
                    const icon = parts.length > 1 ? parts[0] : (Array.from(c.name)[0] || '?');
                    const label = parts.length > 1 ? parts.slice(1).join(' ') : c.name;
                    return (
                        <div key={c.id} className="relative group flex flex-col items-center p-1">
                             {!c.isDefault && (
                                <button onClick={(e) => { e.stopPropagation(); setCategories(prev => prev.filter(x => x.id !== c.id)); }}
                                  className="absolute -top-1 -right-1 z-10 bg-white text-gray-300 border border-gray-100 rounded-full p-1 shadow-sm hover:text-red-500 hover:border-red-500"
                                >
                                    <X size={12} strokeWidth={3} />
                                </button>
                             )}
                             <div onClick={() => startEditingCat(c)} className="w-14 h-14 rounded-[1.2rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shadow-sm mb-2">
                                {icon}
                             </div>
                             <span className="text-[10px] font-bold text-gray-600 text-center w-full truncate px-1">{label}</span>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom-5 duration-300 overflow-hidden relative">
      
      {/* 상단 헤더 */}
      <div className="pt-12 pb-2 px-6 flex-none">
        <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full h-0.5 bg-black rounded-full"></div>
            </div>
            <div className="relative bg-black text-white px-6 py-2 rounded-full text-lg font-bold font-round z-10 shadow-lg">
                {getTitle()}
            </div>
        </div>
      </div>
      
      {/* 본문 스크롤 영역: pb-0 설정으로 하단 흰 영역을 제거합니다 */}
      <div className="flex-1 overflow-y-auto px-6 pb-0 scrollbar-hide">
        
        {tab === 'CATEGORY' && (
          <div className="space-y-8">
            <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 mb-3 ml-1">새 카테고리</h3>
              <div className="flex gap-2">
                 <select value={newCatType} onChange={(e) => setNewCatType(e.target.value as TransactionType)} className="bg-white border border-gray-200 rounded-xl text-xs px-2 font-bold h-11 outline-none">
                   <option value="EXPENSE">지출</option>
                   <option value="INCOME">수입</option>
                 </select>
                 <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="이모지 + 이름" className="flex-1 bg-white border border-gray-200 rounded-xl px-4 text-sm outline-none h-11" />
                 <button onClick={handleAddCategory} className="bg-black text-white px-4 rounded-xl h-11 shadow-md"><Plus size={20} /></button>
              </div>
            </div>

            <div className="space-y-8">
              {renderCategorySection('EXPENSE', isExpenseOpen, () => setIsExpenseOpen(!isExpenseOpen), '지출 목록')}
              {renderCategorySection('INCOME', isIncomeOpen, () => setIsIncomeOpen(!isIncomeOpen), '수입 목록')}
            </div>
          </div>
        )}

        {/* 나머지 탭 내용들... (생략되었으나 동일한 구조 유지) */}
        {tab === 'FIXED' && ( <div className="space-y-8"> {/* 고정항목 UI */} </div> )}
        {tab === 'PROFILE' && ( <div className="space-y-8"> {/* 프로필 UI */} </div> )}

      </div>
    </div>
  );
};

export default Settings;
