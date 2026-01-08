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
    /**
     * ✅ 핵심 수정: 
     * 1. absolute 대신 'fixed inset-0'을 사용하여 화면 전체 높이를 강제로 점유합니다.
     * 2. 'h-screen'을 주어 하단바 영역 아래까지 흰색 배경이 꽉 차도록 합니다.
     */
    <div className="fixed inset-0 h-screen z-40 bg-white flex flex-col animate-in slide-in-from-bottom-5 duration-300">
      
      {/* 상단 헤더: flex-none */}
      <div className="pt-12 pb-2 px-6 flex-none bg-white">
        <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full h-0.5 bg-black rounded-full"></div>
            </div>
            <div className="relative bg-black text-white px-6 py-2 rounded-full text-lg font-bold font-round z-10 shadow-lg">
                {getTitle()}
            </div>
        </div>
      </div>
      
      {/* ✅ 핵심 수정:
          'flex-1'로 남은 공간을 다 먹게 하고, 'pb-32' 정도의 여백을 안쪽에 주어 
          아이템들이 하단 바 영역 "뒤"까지 흐르면서도, 스크롤을 끝까지 내렸을 땐 하단바 위로 다 올라오게 만듭니다.
      */}
      <div className="flex-1 overflow-y-auto px-6 pb-40 scrollbar-hide bg-white">
        
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
                 <button onClick={handleAddCategory} className="bg-black text-white px-4 rounded-xl h-11"><Plus size={20} /></button>
              </div>
            </div>
            <div className="space-y-8">
              {renderCategorySection('EXPENSE', isExpenseOpen, () => setIsExpenseOpen(!isExpenseOpen), '지출 목록')}
              {renderCategorySection('INCOME', isIncomeOpen, () => setIsIncomeOpen(!isIncomeOpen), '수입 목록')}
            </div>
          </div>
        )}

        {tab === 'FIXED' && (
          <div className="space-y-8">
             <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 mb-3 ml-1">고정 항목 추가</h3>
              <div className="space-y-3">
                 <div className="flex gap-2">
                    <select value={fixedType} onChange={(e) => { setFixedType(e.target.value as TransactionType); setFixedCatId(''); }} className="bg-white border border-gray-200 rounded-xl text-xs px-2 font-bold h-10 outline-none">
                      <option value="EXPENSE">지출</option>
                      <option value="INCOME">수입</option>
                    </select>
                    <select value={fixedDay} onChange={(e) => setFixedDay(parseInt(e.target.value))} className="bg-white border border-gray-200 rounded-xl text-xs px-2 font-bold h-10 outline-none">
                      {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}일</option>)}
                    </select>
                    <select value={fixedCatId} onChange={e => setFixedCatId(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-xl text-xs px-2 h-10 outline-none">
                      <option value="">카테고리 선택</option>
                      {categories.filter(c => c.type === fixedType).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <input type="text" value={fixedAmount} onChange={e => setFixedAmount(e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ","))} placeholder="금액 (KRW)" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-right outline-none font-mono" />
                 <button onClick={handleAddFixed} className="w-full bg-black text-white py-3.5 rounded-xl font-bold font-round">추가하기</button>
              </div>
            </div>
            <div className="space-y-3">
              {fixedItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-gray-800">{categories.find(c => c.id === item.categoryId)?.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold">{item.amount.toLocaleString()}</span>
                    <button onClick={() => setFixedItems(prev => prev.filter(f => f.id !== item.id))} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'PROFILE' && (
          <div className="space-y-8">
            <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 mb-3 ml-1">새 프로필</h3>
              <div className="flex gap-2">
                 <button onClick={() => newProfileFileInputRef.current?.click()} className="w-11 h-11 bg-white flex items-center justify-center text-gray-400 rounded-full border border-gray-200 overflow-hidden shadow-sm">
                   {newProfileImage ? <img src={newProfileImage} className="w-full h-full object-cover" /> : <Upload size={18} />}
                 </button>
                 <input type="file" ref={newProfileFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                 <input type="text" value={newProfileName} onChange={e => setNewProfileName(e.target.value)} placeholder="이름" className="flex-1 bg-white border border-gray-200 rounded-xl px-4 text-sm h-11 outline-none" />
                 <button onClick={handleAddProfile} className="bg-black text-white px-4 rounded-xl h-11"><Plus size={20} /></button>
              </div>
            </div>
            <div className="space-y-3">
               {profiles.map(p => (
                 <div key={p.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white overflow-hidden">
                           {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <span className="font-bold text-sm">{p.name[0]}</span>}
                        </div>
                        <span className="font-bold text-sm">{p.name}</span>
                    </div>
                    <button onClick={() => setProfiles(prev => prev.filter(x => x.id !== p.id))} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={16}/></button>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
