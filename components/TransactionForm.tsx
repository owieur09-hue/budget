import React, { useState } from 'react';
import { format } from 'date-fns';
import { Category, Profile, Transaction, TransactionType } from '../types';
import { X, Check } from 'lucide-react';

interface TransactionFormProps {
  date: Date;
  categories: Category[];
  profiles: Profile[];
  onClose: () => void;
  onSubmit: (tx: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  date: initialDate, categories, profiles, onClose, onSubmit 
}) => {
  const [dateStr, setDateStr] = useState(format(initialDate, 'yyyy-MM-dd'));
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amountStr, setAmountStr] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [profileId] = useState(profiles[0]?.id || 'default'); 
  const [memo, setMemo] = useState('');

  const availableCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountStr.replace(/,/g, ''), 10);
    if (!amount || isNaN(amount)) return;
    
    let selectedCatId = categoryId;
    if (!selectedCatId && availableCategories.length > 0) {
      selectedCatId = availableCategories[0].id;
    }
    if (!selectedCatId) return;

    onSubmit({
      amount,
      date: dateStr,
      categoryId: selectedCatId,
      profileId,
      memo,
      type
    });
  };

  const handleAmountChange = (val: string) => {
    const num = val.replace(/[^0-9]/g, '');
    if (num) {
      setAmountStr(parseInt(num, 10).toLocaleString());
    } else {
      setAmountStr('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Increased width to max-w-sm and padding to p-7 for a bigger look */}
      <div className="bg-white w-full max-w-sm shadow-2xl p-7 animate-in zoom-in-95 duration-200 rounded-[2rem] border border-gray-100">
        
        <div className="flex justify-between items-center mb-6 px-1">
          <input 
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="text-lg font-bold font-round text-black outline-none bg-transparent"
          />
          <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full transition-colors text-gray-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => { setType('EXPENSE'); setCategoryId(''); }}
              className={`flex-1 py-2.5 text-sm font-bold transition-all rounded-xl font-round ${type === 'EXPENSE' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}
            >
              지출
            </button>
            <button
              type="button"
              onClick={() => { setType('INCOME'); setCategoryId(''); }}
              className={`flex-1 py-2.5 text-sm font-bold transition-all rounded-xl font-round ${type === 'INCOME' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}
            >
              수입
            </button>
          </div>

          {/* Amount */}
          <div className="px-1">
            <label className="block text-xs text-gray-400 mb-1 font-bold font-round">금액</label>
            <input 
              type="text" 
              inputMode="numeric"
              value={amountStr}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className="w-full text-4xl font-mono font-bold border-b-2 border-gray-100 focus:border-black outline-none py-2 bg-transparent text-right text-black placeholder-gray-200"
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="px-1">
            <label className="block text-xs text-gray-400 mb-2 font-bold font-round">카테고리</label>
            <div className="flex flex-wrap gap-2 h-36 overflow-y-auto content-start">
              {availableCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all h-9 whitespace-nowrap
                    ${categoryId === cat.id 
                      ? 'bg-black text-white border-black shadow-md' 
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Memo */}
          <div className="px-1">
             <label className="block text-xs text-gray-400 mb-1 font-bold font-round">메모</label>
             <input 
               type="text"
               value={memo}
               onChange={(e) => setMemo(e.target.value)}
               placeholder="간단한 메모를 남겨주세요"
               className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:border-black outline-none text-black placeholder-gray-400"
             />
          </div>

          <button 
            type="submit" 
            className="w-full bg-black text-white py-4 font-bold text-base rounded-2xl hover:bg-gray-800 transition-all flex justify-center items-center gap-2 shadow-xl font-round mt-2"
          >
            <Check size={20} />
            입력 완료
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;