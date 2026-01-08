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
  // --- UI State ---
  const [isExpenseOpen, setIsExpenseOpen] = useState(true);
  const [isIncomeOpen, setIsIncomeOpen] = useState(true);

  // --- Category Logic ---
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<TransactionType>('EXPENSE');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    setCategories(prev => [...prev, {
      id: generateId(),
      name: newCatName.trim(),
      type: newCatType,
      isDefault: false
    }]);
    setNewCatName('');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const startEditingCat = (c: Category) => {
    setEditingCatId(c.id);
    setEditCatName(c.name);
  };

  const saveEditingCat = () => {
    if (!editingCatId || !editCatName.trim()) return;
    setCategories(prev => prev.map(c => 
      c.id === editingCatId ? { ...c, name: editCatName } : c
    ));
    setEditingCatId(null);
    setEditCatName('');
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
    setProfiles(prev => [...prev, {
      id: generateId(),
      name: newProfileName.trim(),
      color: 'bg-black',
      image: newProfileImage
    }]);
    setNewProfileName('');
    setNewProfileImage(null);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      alert("최소 1개의 프로필은 필요합니다.");
      return;
    }
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  const startEditing = (p: Profile) => {
    setEditingProfileId(p.id);
    setEditName(p.name);
    setEditImage(p.image || null);
  };

  const saveEditing = () => {
    if (!editingProfileId || !editName.trim()) return;
    setProfiles(prev => prev.map(p => 
      p.id === editingProfileId ? { ...p, name: editName, image: editImage } : p
    ));
    setEditingProfileId(null);
    setEditName('');
    setEditImage(null);
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
    
    setFixedItems(prev => [...prev, {
      id: generateId(),
      amount,
      day: fixedDay,
      categoryId: fixedCatId,
      profileId: profiles[0]?.id,
      memo: fixedMemo,
      type: fixedType
    }]);
    setFixedAmount('');
    setFixedMemo('');
  };

  const handleDeleteFixed = (id: string) => {
    setFixedItems(prev => prev.filter(f => f.id !== id));
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
        <button 
          onClick={toggle}
          className="flex items-center justify-between w-full text-left py-2 border-b border-gray-100"
        >
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                {title} 
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {categories.filter(c => c.type === type).length}
                </span>
            </h3>
            <span className={`transform transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown size={20} />
            </span>
        </button>
        
        {isOpen && (
            <div className="grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {categories.filter(c => c.type === type).map(c => {
                    const parts = c.name.split(' ');
                    const icon = parts.length > 1 ? parts[0] : (Array.from(c.name)[0] || '?');
                    const label = parts.length > 1 ? parts.slice(1).join(' ') : c.name;
                    
                    return (
                        <div key={c.id} className="relative group">
                             {!c.isDefault && editingCatId !== c.id && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteCategory(c.id); }}
                                  className="absolute -top-1 -right-1 z-10 bg-white text-gray-300 border border-gray-100 rounded-full p-1 shadow-sm hover:text-red-500 hover:border-red-500 transition-colors"
                                >
                                    <X size={12} strokeWidth={3} />
                                </button>
                             )}

                             {editingCatId === c.id ? (
                                <div className="flex flex-col items-center gap-2 p-2 bg-white rounded-3xl shadow-xl border border-gray-100 absolute inset-0 z-20 min-h-[110px] justify-center">
                                    <input 
                                      type="text" 
                                      value={editCatName} 
                                      onChange={(e) => setEditCatName(e.target.value)}
                                      className="w-full text-center bg-gray-50 rounded-lg px-1 py-2 text-xs outline-none border border-gray-200"
                                      autoFocus
                                      placeholder="이모지 + 이름"
                                    />
                                    <div className="flex gap-1 w-full">
                                        <button onClick={saveEditingCat} className="flex-1 bg-black text-white rounded-lg py-1.5 text-[10px] font-bold">저장</button>
                                        <button onClick={() => setEditingCatId(null)} className="bg-gray-100 text-gray-500 rounded-lg px-2 text-[10px]">취소</button>
                                    </div>
                                </div>
                             ) : (
                                <div onClick={() => startEditingCat(c)} className="flex flex-col items-center cursor-pointer p-1">
                                    <div className="w-14 h-14 rounded-[1.2rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shadow-sm mb-2 hover:bg-white hover:border-black transition-all group-active:scale-95">
                                        {icon}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-600 text-center w-full truncate px-1 group-hover:text-black leading-tight">
                                        {label}
                                    </span>
                                </div>
                             )}
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom-5 duration-300 overflow-x-hidden">
      
      {/* Header */}
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
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-28">
        
        {/* --- CATEGORY TAB --- */}
        {tab === 'CATEGORY' && (
          <div className="space-y-8">
            <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 mb-3 ml-1 font-round">새 카테고리</h3>
              <div className="flex gap-2 w-full">
                 <select 
                   value={newCatType} 
                   onChange={(e) => setNewCatType(e.target.value as TransactionType)}
                   className="flex-none bg-white border border-gray-200 rounded-xl text-xs px-2 font-bold text-black outline-none h-11"
                 >
                   <option value="EXPENSE">지출</option>
                   <option value="INCOME">수입</option>
                 </select>
                 <input 
                  type="text" 
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="이모지 + 이름"
                  /* flex-1 min-w-0 적용 */
                  className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-black h-11"
                 />
                 <button onClick={handleAddCategory} className="flex-none bg-black text-white px-4 rounded-xl hover:bg-gray-800 h-11 shadow-md">
                   <Plus size={20} />
                 </button>
              </div>
            </div>

            <div className="space-y-8">
              {renderCategorySection('EXPENSE', isExpenseOpen, () => setIsExpenseOpen(!isExpenseOpen), '지출 목록')}
              {renderCategorySection('INCOME', isIncomeOpen, () => setIsIncomeOpen(!isIncomeOpen), '수입 목록')}
            </div>
          </div>
        )}

        {/* --- FIXED ITEMS TAB --- */}
        {tab === 'FIXED' && (
          <div className="space-y-8">
             <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 mb-3 ml-1 font-round">고정 항목 추가</h3>
              <div className="space-y-3">
                 <div className="flex gap-2 w-full">
                    <select 
                      value={fixedType} 
                      onChange={(e) => { setFixedType(e.target.value as TransactionType); setFixedCatId(''); }}
                      className="flex-none bg-white border border-gray-200 rounded-xl text-xs px-2 font-bold text-black outline-none h-10"
                    >
                      <option value="EXPENSE">지출</option>
                      <option value="INCOME">수입</option>
                    </select>
                    <select 
                      value={fixedDay}
                      onChange={(e) => setFixedDay(parseInt(e.target.value))}
                      className="flex-none bg-white border border-gray-200 rounded-xl text-xs px-2 font-bold text-black outline-none h-10"
                    >
                      {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                         <option key={d} value={d}>{d}일</option>
                      ))}
                      <option value={32}>말일</option>
                    </select>
                    <select 
                      value={fixedCatId}
                      onChange={e => setFixedCatId(e.target.value)}
                      /* flex-1 min-w-0 적용 */
                      className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl text-xs px-2 text-black outline-none h-10"
                    >
                      <option value="">카테고리 선택</option>
                      {categories.filter(c => c.type === fixedType).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                 </div>
                 
                 <input 
                    type="text" 
                    value={fixedAmount}
                    onChange={e => {
                      const num = e.target.value.replace(/[^0-9]/g, '');
                      setFixedAmount(num ? parseInt(num).toLocaleString() : '');
                    }}
                    placeholder="금액 (KRW)"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-right outline-none focus:border-black"
                 />
                 <input 
                    type="text" 
                    value={fixedMemo}
                    onChange={e => setFixedMemo(e.target.value)}
                    placeholder="메모"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black"
                 />
                 <button onClick={handleAddFixed} className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 mt-1 shadow-md font-round">
                   추가하기
                 </button>
              </div>
            </div>

            <div className="space-y-3">
              {fixedItems.map(item => {
                 const cat = categories.find(c => c.id === item.categoryId);
                 return (
                   <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            {item.day === 32 ? '말일' : `${item.day}일`}
                          </span>
                          <span className="text-xs font-bold text-gray-800 truncate">
                            {cat?.name || '삭제됨'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 pl-1 truncate">{item.memo}</div>
                      </div>
                      <div className="flex items-center gap-4 flex-none ml-2">
                         <span className="font-mono text-sm font-bold text-black">{item.amount.toLocaleString()}</span>
                         <button onClick={() => handleDeleteFixed(item.id)} className="text-gray-300 hover:text-red-500">
                           <Trash2 size={16} />
                         </button>
                      </div>
                   </div>
                 );
              })}
              {fixedItems.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400 text-xs">고정 항목이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- PROFILE TAB --- */}
        {tab === 'PROFILE' && (
          <div className="space-y-8">
            <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 mb-3 ml-1 font-round">새 프로필</h3>
              <div className="flex gap-2 items-center w-full">
                 <button 
                   onClick={() => newProfileFileInputRef.current?.click()}
                   className="flex-none w-11 h-11 bg-white flex items-center justify-center text-gray-400 rounded-full border border-gray-200 hover:border-black overflow-hidden relative shadow-sm"
                 >
                   {newProfileImage ? (
                     <img src={newProfileImage} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <Upload size={18} />
                   )}
                 </button>
                 <input type="file" ref={newProfileFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                 <input 
                  type="text" 
                  value={newProfileName}
                  onChange={e => setNewProfileName(e.target.value)}
                  placeholder="이름"
                  /* flex-1 min-w-0 적용 */
                  className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-black h-11"
                 />
                 <button onClick={handleAddProfile} className="flex-none bg-black text-white px-4 rounded-xl hover:bg-gray-800 h-11 shadow-md">
                   <Plus size={20} />
                 </button>
              </div>
            </div>

            <div className="space-y-3">
               {profiles.map(p => (
                 <div key={p.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                    {editingProfileId === p.id ? (
                      <div className="flex items-center gap-3 w-full">
                        <button onClick={() => fileInputRef.current?.click()} className="flex-none w-10 h-10 bg-white flex items-center justify-center text-gray-400 rounded-full border border-gray-200 overflow-hidden">
                           {editImage ? <img src={editImage} alt="Edit" className="w-full h-full object-cover" /> : <Upload size={16} />}
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                        <input 
                          type="text" 
                          value={editName} 
                          onChange={e => setEditName(e.target.value)}
                          className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                        />
                        <button onClick={saveEditing} className="flex-none text-black bg-gray-100 rounded-lg p-2">
                          <Save size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex-none w-10 h-10 bg-black rounded-full flex items-center justify-center text-white overflow-hidden shadow-sm">
                             {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span className="font-bold text-sm font-round">{p.name.substring(0, 1)}</span>}
                          </div>
                          <span className="font-bold text-gray-800 text-sm truncate">{p.name}</span>
                        </div>
                        <div className="flex gap-2 flex-none ml-2">
                           <button onClick={() => startEditing(p)} className="text-gray-300 hover:text-black p-2"><Edit2 size={16} /></button>
                           {profiles.length > 1 && (
                            <button onClick={() => handleDeleteProfile(p.id)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                          )}
                        </div>
                      </div>
                    )}
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
