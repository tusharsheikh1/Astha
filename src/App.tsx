import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Types ---
interface Member {
  id: number;
  name: string;
  deposit: number;
  meals: number;
}

// --- Icons (SVG Components) ---
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
);
const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);

const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: 'Tushar Sheikh', deposit: 0, meals: 0 },
  { id: 2, name: 'Abu Bakar', deposit: 0, meals: 0 },
  { id: 3, name: 'Shahin', deposit: 0, meals: 0 },
  { id: 4, name: 'Mehedi bhai', deposit: 0, meals: 0 },
  { id: 5, name: 'Mahmud', deposit: 0, meals: 0 },
  { id: 6, name: 'Riyad', deposit: 0, meals: 0 },
  { id: 7, name: 'Kamirul', deposit: 0, meals: 0 },
  { id: 8, name: 'Tarik', deposit: 0, meals: 0 },
  { id: 9, name: 'Ibrahim', deposit: 0, meals: 0 },
  { id: 10, name: 'Faruk mama', deposit: 0, meals: 0 },
];

function App() {
  // Load initial state from LocalStorage if available
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('meal_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });
  
  const [newMemberName, setNewMemberName] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Auto-save whenever members change
  useEffect(() => {
    localStorage.setItem('meal_members', JSON.stringify(members));
  }, [members]);

  // --- Calculations ---
  const totalDeposit = members.reduce((sum, m) => sum + m.deposit, 0);
  const totalMeals = members.reduce((sum, m) => sum + m.meals, 0);
  const mealRate = totalMeals > 0 ? totalDeposit / totalMeals : 0;
  
  // Find top depositor for visual badge
  const maxDeposit = Math.max(...members.map(m => m.deposit));

  // --- Handlers ---
  const handleInputChange = (id: number, field: 'deposit' | 'meals', value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: numValue } : m));
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
    setMembers([...members, { id: newId, name: newMemberName, deposit: 0, meals: 0 }]);
    setNewMemberName('');
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure? This will clear all numbers.')) {
      setMembers(members.map(m => ({ ...m, deposit: 0, meals: 0 })));
    }
  };

  // --- Export Functions ---
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Mess Manager Report', 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
    
    // Stats Block in PDF
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 35, 180, 20, 'F');
    doc.text(`Total Deposit: ${totalDeposit}`, 20, 47);
    doc.text(`Total Meals: ${totalMeals}`, 80, 47);
    doc.text(`Rate: ${mealRate.toFixed(2)}`, 140, 47);

    const data = members.map(m => {
      const cost = m.meals * mealRate;
      const balance = m.deposit - cost;
      return [m.name, m.deposit, m.meals, cost.toFixed(2), balance >= 0 ? `+${balance.toFixed(2)}` : balance.toFixed(2)];
    });

    autoTable(doc, {
      startY: 65,
      head: [['Member', 'Deposit', 'Meals', 'Cost', 'Balance']],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });
    doc.save('meal-report.pdf');
    setShowExportMenu(false);
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,Deposit,Meals,Cost,Balance\n";
    members.forEach(m => {
      const cost = m.meals * mealRate;
      const balance = m.deposit - cost;
      csvContent += `${m.name},${m.deposit},${m.meals},${cost.toFixed(2)},${balance.toFixed(2)}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "meal_data.csv");
    document.body.appendChild(link);
    link.click();
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans text-slate-800 pb-20">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Mess<span className="text-indigo-600">Mate</span></span>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={handleReset} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Reset All Data">
               <RefreshIcon />
             </button>
             
             <div className="relative">
               <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95"
               >
                 <DownloadIcon /> Export
               </button>
               
               {/* Export Dropdown */}
               {showExportMenu && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button onClick={exportPDF} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm flex items-center gap-2">
                      <FileTextIcon /> Download PDF
                    </button>
                    <button onClick={exportCSV} className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm flex items-center gap-2 border-t border-slate-100">
                      <span className="font-mono font-bold text-green-600 px-1">X</span> Download CSV
                    </button>
                 </div>
               )}
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* --- Dashboard Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Deposit" value={totalDeposit.toLocaleString()} color="blue" />
          <StatCard label="Total Meals" value={totalMeals.toString()} color="orange" />
          <StatCard label="Meal Rate" value={mealRate.toFixed(2)} subValue={`Tk / Meal`} color="emerald" />
        </div>

        {/* --- Input & Table Section --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-700">Member Overview</h2>
            <div className="flex w-full sm:w-auto shadow-sm rounded-lg overflow-hidden border border-slate-200 focus-within:ring-2 ring-indigo-500 ring-offset-1 transition-all">
              <input 
                type="text" 
                placeholder="Add new member..." 
                className="px-4 py-2 outline-none w-full sm:w-48 text-sm"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
              />
              <button onClick={handleAddMember} className="bg-white px-3 hover:bg-slate-100 border-l border-slate-200 text-indigo-600">
                <UserPlusIcon />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4 text-center">Deposit</th>
                  <th className="px-6 py-4 text-center">Meals</th>
                  <th className="px-6 py-4">Status & Balance</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => {
                  const cost = member.meals * mealRate;
                  const balance = member.deposit - cost;
                  const isPositive = balance >= 0;
                  const isTopDepositor = member.deposit > 0 && member.deposit === maxDeposit;

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${isTopDepositor ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-400 ring-offset-1' : 'bg-slate-100 text-slate-600'}`}>
                            {member.name.substring(0,2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-700">{member.name}</span>
                            {isTopDepositor && <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded w-fit mt-0.5">Top Depositor</span>}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all shadow-sm"
                          value={member.deposit || ''}
                          placeholder="0"
                          onChange={(e) => handleInputChange(member.id, 'deposit', e.target.value)}
                        />
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                         <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 shadow-sm">
                           <input
                            type="number"
                            className="w-16 px-2 py-1 bg-transparent text-center font-medium focus:outline-none"
                            value={member.meals || ''}
                            placeholder="0"
                            onChange={(e) => handleInputChange(member.id, 'meals', e.target.value)}
                          />
                         </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-400">Cost: {cost.toFixed(0)}</span>
                            <span className={`font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {isPositive ? 'Gets' : 'Pays'} {Math.abs(balance).toFixed(0)}
                            </span>
                          </div>
                          {/* Visual Balance Bar */}
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${isPositive ? 'bg-emerald-400' : 'bg-rose-400'}`}
                              style={{ width: `${Math.min(Math.abs(balance) / (totalDeposit/members.length || 1) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {members.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <p>No members found. Add someone to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- Sub Components ---

const StatCard = ({ label, value, subValue, color }: { label: string, value: string, subValue?: string, color: 'blue' | 'orange' | 'emerald' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-20 ${colors[color].split(' ')[0]}`}></div>
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider relative z-10">{label}</p>
      <div className="flex items-baseline gap-2 mt-1 relative z-10">
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        {subValue && <span className="text-sm font-medium text-slate-400">{subValue}</span>}
      </div>
    </div>
  );
};

export default App;