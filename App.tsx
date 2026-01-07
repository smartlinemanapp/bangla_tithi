
import React, { useState, useEffect, useCallback } from 'react';
import { getBanglaDate, toBengaliNumber } from './utils/banglaUtils';
import { fetchTithisForMonth, getTithiAdvice } from './services/geminiService';
import { TithiEvent, DAYS_BN, BANGLA_MONTHS_BN } from './types';
import { TithiIcon } from './components/TithiIcon';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tithis, setTithis] = useState<TithiEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTithi, setSelectedTithi] = useState<TithiEvent | null>(null);
  const [advice, setAdvice] = useState<string>('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const banglaInfo = getBanglaDate(currentDate);

  const loadTithis = useCallback(async () => {
    setLoading(true);
    const data = await fetchTithisForMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setTithis(data);
    setLoading(false);
  }, [currentDate]);

  useEffect(() => {
    loadTithis();
  }, [loadTithis]);

  const handleDateChange = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
    setSelectedTithi(null);
    setAdvice('');
  };

  const handleTithiClick = async (tithi: TithiEvent) => {
    if (selectedTithi?.name === tithi.name) {
      setSelectedTithi(null);
      return;
    }
    setSelectedTithi(tithi);
    setAdviceLoading(true);
    const text = await getTithiAdvice(tithi);
    setAdvice(text);
    setAdviceLoading(false);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`pad-${i}`} className="h-16 border-b border-r border-orange-50 bg-orange-50/20"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = new Date(year, month, d).toISOString().split('T')[0];
      const dayTithis = tithis.filter(t => t.date.startsWith(dateStr));
      const bDate = getBanglaDate(new Date(year, month, d));
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      days.push(
        <div 
          key={d} 
          onClick={() => {
            if (dayTithis.length > 0) handleTithiClick(dayTithis[0]);
          }}
          className={`h-16 border-b border-r border-orange-100 p-1 transition-all hover:bg-orange-50 cursor-pointer flex flex-col justify-between ${isToday ? 'bg-orange-100/50' : ''}`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-[10px] ${isToday ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
              {d}
            </span>
            <span className="text-[10px] bangla-font text-orange-800 bg-orange-200/30 px-0.5 rounded">
              {toBengaliNumber(bDate.day)}
            </span>
          </div>
          <div className="flex justify-center">
            {dayTithis.map((t, idx) => (
              <TithiIcon key={idx} type={t.type} size="sm" />
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const getTithiColorClass = (type: string) => {
    switch (type) {
      case 'Purnima': return 'from-yellow-50 to-orange-50 border-yellow-200 text-yellow-900';
      case 'Amavasya': return 'from-gray-800 to-gray-900 border-gray-700 text-white';
      case 'Ekadashi': return 'from-orange-50 to-red-50 border-orange-200 text-orange-900';
      case 'Pratipada': return 'from-green-50 to-emerald-50 border-green-200 text-green-900';
      default: return 'from-blue-50 to-indigo-50 border-blue-200 text-blue-900';
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 p-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-orange-600 bangla-font tracking-tight">তিথি অনুস্মারক</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-sm font-bold text-orange-400 bangla-font">
                {BANGLA_MONTHS_BN[banglaInfo.monthIndex]} {toBengaliNumber(banglaInfo.year)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
              onClick={() => handleDateChange(-1)}
              className="p-2 hover:bg-orange-50 rounded-full border border-orange-100 transition-colors"
            >
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => handleDateChange(1)}
              className="p-2 hover:bg-orange-50 rounded-full border border-orange-100 transition-colors"
            >
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-4">
        {/* Toggle Calendar */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={() => setShowCalendar(!showCalendar)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm border ${showCalendar ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </button>
        </div>

        {/* Calendar Grid (Secondary) */}
        {showCalendar && (
          <div className="mb-10 bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100 animate-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-7 bg-orange-50/50 border-b border-orange-100">
              {DAYS_BN.map(day => (
                <div key={day} className="py-2 text-center font-bold text-orange-800/60 bangla-font text-[10px] uppercase">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {loading ? (
                <div className="col-span-7 h-32 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
                </div>
              ) : renderCalendarDays()}
            </div>
          </div>
        )}

        {/* Tithi Cards (Primary Focus) */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
            Upcoming Tithis for {currentDate.toLocaleString('default', { month: 'long' })}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-3xl border border-gray-200"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tithis.length > 0 ? tithis.map((t, idx) => {
                const isSelected = selectedTithi?.name === t.name;
                const colorClass = getTithiColorClass(t.type);
                const tithiDate = new Date(t.date);
                
                return (
                  <div key={idx} className="flex flex-col gap-3">
                    <div 
                      onClick={() => handleTithiClick(t)}
                      className={`relative overflow-hidden cursor-pointer group p-6 rounded-[2rem] border-2 transition-all duration-300 bg-gradient-to-br shadow-sm hover:shadow-xl active:scale-[0.98] ${colorClass} ${isSelected ? 'ring-4 ring-orange-200/50' : 'hover:translate-y-[-4px]'}`}
                    >
                      {/* Decorative background icon */}
                      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TithiIcon type={t.type} size="lg" />
                      </div>

                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <TithiIcon type={t.type} size="md" />
                          <div>
                            <span className="text-2xl font-black bangla-font block leading-none">{t.banglaName}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t.name}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold block leading-none">{tithiDate.getDate()}</span>
                          <span className="text-[10px] font-bold uppercase opacity-60">{tithiDate.toLocaleString('default', { month: 'short' })}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                          <span className="text-[9px] font-bold uppercase opacity-50 block mb-1">Starts At</span>
                          <span className="text-sm font-bold">{t.startTime}</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                          <span className="text-[9px] font-bold uppercase opacity-50 block mb-1">Ends At</span>
                          <span className="text-sm font-bold">{t.endTime}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                          <span className="text-[10px] font-black uppercase tracking-widest">Active Soon</span>
                        </div>
                        <button 
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-colors ${t.type === 'Amavasya' ? 'bg-white text-gray-900