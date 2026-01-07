
import { BanglaDate, BANGLA_MONTHS, BANGLA_MONTHS_BN } from "../types";

export const getBanglaDate = (date: Date): BanglaDate => {
  const year = date.getFullYear();
  const pohelaBoishakh = new Date(year, 3, 14);
  
  let bYear = year - 593;
  let bMonthIndex = 0;
  let bDay = 0;

  let daysPassed = Math.floor((date.getTime() - pohelaBoishakh.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysPassed < 0) {
    bYear = year - 594;
    const prevPohela = new Date(year - 1, 3, 14);
    daysPassed = Math.floor((date.getTime() - prevPohela.getTime()) / (1000 * 60 * 60 * 24));
  }

  const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];
  let remainingDays = daysPassed;
  for (let i = 0; i < 12; i++) {
    if (remainingDays < monthLengths[i]) {
      bMonthIndex = i;
      bDay = remainingDays + 1;
      break;
    }
    remainingDays -= monthLengths[i];
  }

  return {
    day: bDay,
    month: BANGLA_MONTHS[bMonthIndex],
    year: bYear,
    monthIndex: bMonthIndex
  };
};

export const toBengaliNumber = (num: number | string): string => {
  const numbers: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return num.toString().split('').map(char => numbers[char] || char).join('');
};

/**
 * Converts a Date object or ISO string to Bengali Time descriptors
 */
export const formatBengaliTime = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  
  let period = '';
  if (hours >= 4 && hours < 6) period = 'ভোর';
  else if (hours >= 6 && hours < 12) period = 'সকাল';
  else if (hours >= 12 && hours < 15) period = 'দুপুর';
  else if (hours >= 15 && hours < 18) period = 'বিকেল';
  else if (hours >= 18 && hours < 20) period = 'সন্ধ্যা';
  else period = 'রাত';

  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${period} ${toBengaliNumber(displayHours)}:${toBengaliNumber(displayMinutes)}`;
};
