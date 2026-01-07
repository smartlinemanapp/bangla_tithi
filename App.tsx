
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getBanglaDate, toBengaliNumber, formatBengaliTime } from './utils/banglaUtils';
import { fetchTithisForMonth, getTithiAdvice } from './services/geminiService';
import { TithiEvent, DAYS_BN, BANGLA_MONTHS_BN } from './types';
import { TithiIcon } from './components/TithiIcon';
import { LunarBackground } from './components/LunarBackground';

type Theme = 'saffron' | 'midnight' | 'emerald';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tithis, setTithis] = useState<TithiEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTithi, setSelectedTithi] = useState<TithiEvent | null>(null);
  const [advice, setAdvice] = useState<string>('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [theme, setTheme] = useState<Theme>('saffron');

  const banglaInfo = getBanglaDate(currentDate);

  const formatDateLabel = (date: Date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    const dayName = DAYS_BN[date.getDay()];
    return {
      formatted: `${toBengaliNumber(d)}/${toBengaliNumber(m)}/${toBengaliNumber(y)}`,
      dayName: dayName,
      dayNum: d
    };
  };

  const loadTithis = useCallback(async () => {
    setLoading(true);
    const dataCurrent = await fetchTithisForMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
    
    let combined = [...dataCurrent];
    const todayStr = new Date().toISOString().split('T')[0];
    const remainingThisMonth = dataCurrent.filter(t => t.date >= todayStr).length;
    
    if (remainingThisMonth < 5) {
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const dataNext = await fetchTithisForMonth(nextMonth.getFullYear(), nextMonth.getMonth() + 1);
      combined = [...combined, ...dataNext];
    }

    const unique = Array.from(new Map(combined.map(item => [item.date + item.name, item])).values());
    unique.sort((a, b) => a.date.localeCompare(b.date));
    
    setTithis(unique);
    setLoading(false);
  }, [currentDate]);

  useEffect(() => {
    loadTithis();
  }, [loadTithis]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayTithi = useMemo(() => tithis.find(t => t.date.startsWith(todayStr)), [tithis, todayStr]);
  const upcomingTithis = useMemo(() => tithis.filter(t => t.date > todayStr).slice(0, 5), [tithis, todayStr]);

  const handleDateChange = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
    setSelectedTithi(null);
    setAdvice('');
  };

  const handleTithiClick = async (tithi: TithiEvent) => {
    if (selectedTithi?.name === tithi.name && selectedTithi?.date === tithi.date) {
      setSelectedTithi(null);
      return;
    }
    setSelectedTithi(tithi);
    setAdviceLoading(true);
    const text = await getTithiAdvice(tithi);
    setAdvice(text);
    setAdviceLoading(false);
  };

  const getTithiColorClass = (type: string) => {
    if (theme === 'midnight') {
      switch (type) {
        case 'Purnima': return 'from-yellow-900/60 to-amber-950 border-amber-500/30 text-amber-50';
        case 'Amavasya': return 'from-slate-800 to-black border-slate-700 text-slate-100';
        case 'Ekadashi': return 'from-orange-950 to-red-950 border-orange-800/30 text-orange-50';
        case 'Pratipada': return 'from-emerald-950 to-teal-950 border-emerald-800/30 text-emerald-50';
        default: return 'from-indigo-950 to-slate-950 border-indigo-800/30 text-indigo-50';
      }
    }
    switch (type) {
      case 'Purnima': return 'from-amber-100 to-yellow-200 border-amber-300 text-amber-950';
      case 'Amavasya': return 'from-slate-700 to-slate-900 border-slate-600 text-white';
      case 'Ekadashi': return 'from-orange-100 to-orange-200 border-orange-300 text-orange-950';
      case 'Pratipada': return 'from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-950';
      default: return 'from-sky-100 to-indigo-200 border-indigo-300 text-indigo-950';
    }
  };

  const themeClasses = {
    saffron: {
      bg: 'bg-[#faf9f6]',
      header: 'bg-white/95 border-orange-200 text-orange-950',
      textMain: 'text-amber-950',
      textMuted: 'text-amber-800/70',
      textAccent: 'text-orange-700',
      card: 'bg-white border-orange-100 hover:border-orange-300 shadow-sm',
      secondary: 'bg-orange-600',
    },
    midnight: {
      bg: 'bg-[#020617]',
      header: 'bg-slate-950/95 border-slate-800 text-slate-100',
      textMain: 'text-slate-100',
      textMuted: 'text-slate-400',
      textAccent: 'text-indigo-400',
      card: 'bg-slate-900 border-slate-800/60 hover:border-indigo-500/40 shadow-sm',
      secondary: 'bg-indigo-600',
    },
    emerald: {
      bg: 'bg-[#f0fdf4]',
      header: 'bg-white/95 border-emerald-200 text-emerald-950',
      textMain: 'text-emerald-950',
      textMuted: 'text-emerald-800/70',
      textAccent: 'text-emerald-700',
      card: 'bg-white border-emerald-100 hover:border-emerald-300 shadow-sm',
      secondary: 'bg-emerald-600',
    }
  };

  const activeTheme = themeClasses[theme];
  const todayLabel = formatDateLabel(new Date());

  const TimeBlock = ({ label, isoDateTime, isEnd = false, isHero = false }: { label: string, isoDateTime: string, isEnd?: boolean, isHero?: boolean }) => {
    if (!isoDateTime) return null;
    const d = new Date(isoDateTime);
    const info = formatDateLabel(d);
    return (
      <div className={`flex flex-col gap-0.5 ${isEnd ? 'items-end text-right' : 'items-start text-left'}`}>
        <span className={`text-[9px] font-black uppercase tracking-widest bangla-font ${isHero ? 'opacity-50' : activeTheme.textMuted}`}>{label}</span>
        <div className="flex flex-col">
          <span className={`text-base font-black leading-tight tracking-tight ${isHero ? '' : activeTheme.textMain}`}>{formatBengaliTime(isoDateTime)}</span>
          <span className={`text-[9px] font-bold bangla-font ${isHero ? 'opacity-60' : activeTheme.textMuted}`}>{info.dayName}, {info.formatted}</span>
        </div>
      </div>
    );
  };

  const CompactTithiCard = ({ t, isHero = false }: { t: TithiEvent, isHero?: boolean }) => {
    const isSelected = selectedTithi?.name === t.name && selectedTithi?.date === t.date;
    const colorClass = getTithiColorClass(t.type);
    
    return (
      <div className="flex flex-col gap-3">
        <div 
          onClick={() => handleTithiClick(t)}
          className={`relative group p-5 rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden ${isHero ? `shadow-2xl border-none ${colorClass}` : `${activeTheme.card} ${isSelected ? 'ring-2 ring-current/10 border-current/40 scale-[1.01]' : ''}`}`}
        >
          {isHero && <LunarBackground type={t.type} />}
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shadow-inner ${isHero ? 'bg-white/20 backdrop-blur-3xl border border-white/30' : (theme === 'midnight' ? 'bg-slate-800' : 'bg-gray-100/60')}`}>
                  <TithiIcon type={t.type} size={isHero ? "md" : "sm"} />
                </div>
                <div>
                  <h3 className={`${isHero ? 'text-3xl' : 'text-xl'} font-black bangla-font tracking-tight leading-none ${isHero ? '' : activeTheme.textMain}`}>{t.banglaName}</h3>
                  <div className={`flex items-center gap-1.5 mt-0.5 ${isHero ? 'opacity-60' : activeTheme.textMuted}`}>
                    <span className="text-[8px] font-black uppercase tracking-widest">{t.name}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-20"></span>
                    <span className="text-[8px] font-black uppercase tracking-widest bangla-font">{t.type}</span>
                  </div>
                </div>
              </div>
              {!isHero && (
                <div className={`px-3 py-1.5 rounded-xl flex flex-col items-center justify-center min-w-[50px] ${theme === 'midnight' ? 'bg-slate-800/80' : 'bg-gray-100/40'}`}>
                   <span className={`text-lg font-black leading-none ${activeTheme.textMain}`}>{toBengaliNumber(new Date(t.date).getDate())}</span>
                   <span className={`text-[7px] font-black opacity-60 bangla-font mt-0.5 ${activeTheme.textMain}`}>{BANGLA_MONTHS_BN[getBanglaDate(new Date(t.date)).monthIndex]}</span>
                </div>
              )}
            </div>

            <div className={`flex justify-between items-center gap-2 py-3 px-0.5 border-y ${isHero ? 'border-white/10' : 'border-current/5'}`}>
              <TimeBlock label="আরম্ভ" isoDateTime={t.startDateTime} isHero={isHero} />
              <div className={`h-6 w-[1px] hidden sm:block ${isHero ? 'bg-white/10' : 'bg-current/10'}`}></div>
              <TimeBlock label="সমাপ্তি" isoDateTime={t.endDateTime} isEnd isHero={isHero} />
            </div>

            {isHero && (
              <button className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest bangla-font transition-all ${theme === 'midnight' ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg' : 'bg-black text-white hover:bg-gray-900 shadow-xl'}`}>রিমাইন্ডার সেট করুন</button>
            )}
          </div>
        </div>

        {isSelected && !isHero && (
          <div className={`rounded-[2rem] p-6 shadow-xl animate-in fade-in slide-in-from-top-3 duration-500 mx-3 -mt-5 relative z-10 border transition-all ${theme === 'midnight' ? 'bg-slate-950 border-indigo-900 text-slate-100' : 'bg-white border-orange-100 text-gray-900'}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-1 h-3.5 rounded-full ${activeTheme.secondary}`}></div>
              <h5 className={`text-[11px] font-black bangla-font tracking-widest uppercase opacity-60`}>তিথির গুরুত্ব</h5>
            </div>
            {adviceLoading ? (
              <div className="flex justify-center py-4"><div className={`w-5 h-5 border-2 border-t-transparent animate-spin rounded-full ${activeTheme.textAccent}`}></div></div>
            ) : (
              <p className="text-sm leading-relaxed bangla-font opacity-90">{advice}</p>
            )}
            <div className="mt-4 flex justify-end">
              <button onClick={() => setSelectedTithi(null)} className={`text-[9px] font-black opacity-30 hover:opacity-100 transition-opacity uppercase tracking-[0.2em] bangla-font`}>বন্ধ করুন</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={`h-20 border-r border-b ${theme === 'midnight' ? 'border-slate-800 bg-slate-900/10' : 'border-gray-50 bg-gray-50/10'}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const tithiOnDay = tithis.find(t => t.date.startsWith(dateStr));
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div key={d} className={`h-20 border-r border-b p-1.5 transition-all hover:bg-gray-500/5 relative ${theme === 'midnight' ? 'border-slate-800' : 'border-gray-100'} ${isToday ? (theme === 'midnight' ? 'bg-indigo-900/20' : 'bg-orange-50/30') : ''}`}>
          <span className={`text-[10px] font-black ${isToday ? activeTheme.textAccent : activeTheme.textMuted}`}>{toBengaliNumber(d)}</span>
          {tithiOnDay && (
            <div 
              onClick={() => handleTithiClick(tithiOnDay)}
              className="mt-1 flex flex-col items-center cursor-pointer transform transition-transform hover:scale-105"
            >
              <TithiIcon type={tithiOnDay.type} size="sm" />
              <span className={`text-[7px] font-black bangla-font mt-0.5 opacity-80 truncate w-full text-center ${activeTheme.textMain}`}>{tithiOnDay.banglaName}</span>
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 font-sans ${activeTheme.bg} ${activeTheme.textMain}`}>
      <header className={`backdrop-blur-xl border-b p-5 sticky top-0 z-50 transition-all duration-500 ${activeTheme.header}`}>
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme === 'midnight' ? 'bg-indigo-500/10' : 'bg-orange-500/10'}`}>
              <svg className={`w-5 h-5 ${activeTheme.textAccent}`} fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            </div>
            <div>
              <h1 className={`text-lg font-black bangla-font tracking-tight ${activeTheme.textAccent}`}>বঙ্গ তিথি দর্পণ</h1>
              <div className="flex items-center gap-1.5 mt-0.5 opacity-60">
                <span className="text-[8px] font-black uppercase tracking-widest bangla-font">{todayLabel.dayName}, {todayLabel.formatted}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex gap-1.5 bg-black/5 p-1 rounded-full border border-black/5">
                {(['saffron', 'midnight', 'emerald'] as Theme[]).map(t => (
                   <button key={t} onClick={() => setTheme(t)} className={`w-6 h-6 rounded-full border transition-all ${theme === t ? 'scale-110 border-white shadow-md' : 'border-transparent opacity-40 hover:opacity-100'} ${t === 'saffron' ? 'bg-orange-500' : t === 'midnight' ? 'bg-indigo-900' : 'bg-emerald-500'}`} />
                ))}
             </div>
             <button onClick={() => setShowCalendar(!showCalendar)} className={`p-2 rounded-lg border transition-all ${showCalendar ? 'bg-indigo-600 text-white border-indigo-600' : `bg-white/10 ${activeTheme.textMuted} border-current/10 hover:border-current/30`}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-8 px-5">
        {showCalendar && (
          <div className={`mb-10 rounded-[2rem] shadow-xl overflow-hidden border transition-all duration-500 animate-in slide-in-from-top-2 ${theme === 'midnight' ? 'bg-slate-950 border-slate-800' : 'bg-white border-orange-50'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${theme === 'midnight' ? 'bg-slate-900/40' : 'bg-gray-50/40'}`}>
              <button onClick={() => handleDateChange(-1)} className={`p-1.5 rounded-lg transition-all ${theme === 'midnight' ? 'hover:bg-slate-800' : 'hover:bg-white shadow-sm'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg></button>
              <h3 className={`font-black uppercase tracking-[0.1em] text-[11px] ${activeTheme.textMain}`}>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h3>
              <button onClick={() => handleDateChange(1)} className={`p-1.5 rounded-lg transition-all ${theme === 'midnight' ? 'hover:bg-slate-800' : 'hover:bg-white shadow-sm'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg></button>
            </div>
            <div className={`grid grid-cols-7 border-b ${theme === 'midnight' ? 'border-slate-800' : 'border-gray-50'}`}>
              {DAYS_BN.map(day => <div key={day} className={`py-3 text-center font-black bangla-font text-[9px] uppercase opacity-50 ${activeTheme.textMain}`}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
              {loading ? <div className="col-span-7 h-40 flex items-center justify-center"><div className={`animate-spin h-5 w-5 border-2 border-t-transparent rounded-full ${activeTheme.textAccent}`}></div></div> : renderCalendarDays()}
            </div>
          </div>
        )}

        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-6">
            <div className={`w-1.5 h-6 rounded-full ${activeTheme.secondary} shadow-md`}></div>
            <h2 className={`text-xl font-black bangla-font ${activeTheme.textMain}`}>আজকের মাহেন্দ্রক্ষণ</h2>
          </div>
          {todayTithi ? <CompactTithiCard t={todayTithi} isHero /> : (
            <div className={`p-12 rounded-[2rem] border-2 border-dashed text-center opacity-30 ${theme === 'midnight' ? 'border-slate-800' : 'border-orange-200'}`}>
              <h3 className="text-lg font-black bangla-font uppercase tracking-widest">আজ কোনো বিশেষ তিথি নেই</h3>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2.5 mb-6">
            <div className={`w-1.5 h-6 rounded-full bg-current opacity-10`}></div>
            <h2 className={`text-xl font-black bangla-font ${activeTheme.textMain}`}>আসন্ন তিথিসমূহ</h2>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {loading ? [1,2,3].map(i => <div key={i} className={`h-24 rounded-[2rem] animate-pulse ${theme === 'midnight' ? 'bg-slate-900' : 'bg-gray-100'}`}></div>) : 
              upcomingTithis.map((t, idx) => <CompactTithiCard key={idx} t={t} />)}
          </div>
        </section>
      </main>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-50">
        <button 
          onClick={() => { setCurrentDate(new Date()); setShowCalendar(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`pointer-events-auto group px-6 py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-3 border border-white/10 relative overflow-hidden ${theme === 'midnight' ? 'bg-slate-900 text-white shadow-black' : 'bg-black text-white shadow-gray-400/40'}`}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white"></div>
          <span className="bangla-font text-lg font-black relative z-10">আজকের দিন</span>
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
        </button>
      </div>
    </div>
  );
};

export default App;
