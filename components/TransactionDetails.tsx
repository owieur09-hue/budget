import React from 'react';
import { format } from 'date-fns';
import { Transaction, Category, Profile } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface TransactionDetailsProps {
  date: Date;
  transactions: Transaction[];
  categories: Category[];
  profiles: Profile[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ 
  date, transactions, categories, profiles, onClose, onDelete, onAdd 
}) => {
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '미분류';
  const getProfile = (id: string) => profiles.find(p => p.id === id);

  return (
    <div className="p-2 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4 px-2 pt-1">
        <h3 className="text-sm font-round font-bold text-gray-800">
          {format(date, 'yyyy년 MM월 dd일')}
        </h3>
        <div className="flex items-center gap-3">
           <button 
            onClick={onAdd}
            className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100"
           >
             추가
           </button>
           <button onClick={onClose} className="hover:bg-gray-200 rounded-full p-1.5 transition-colors text-gray-400">
             <X size={16} />
           </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-6 text-gray-400 font-medium text-sm">
          내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map(t => {
            const profile = getProfile(t.profileId);
            return (
              <div key={t.id} className="group flex justify-between items-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-800">{getCategoryName(t.categoryId)}</span>
                  </div>
                  {t.memo && <div className="text-xs text-gray-500 font-medium">{t.memo}</div>}
                </div>
                <div className="text-right flex items-center gap-4">
                  <span className={`font-mono text-sm font-bold ${t.type === 'INCOME' ? 'text-blue-500' : 'text-red-500'}`}>
                    {t.type === 'INCOME' ? '+' : '-'}{t.amount.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;