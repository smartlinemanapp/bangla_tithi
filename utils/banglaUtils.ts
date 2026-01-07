
import { BanglaDate, BANGLA_MONTHS, BANGLA_MONTHS_BN } from "../types";

// A simplified Gregorian to Bangla Date conversion (approximate)
// Usually Pohela Boishakh is April 14th.
export const getBanglaDate = (date: Date): BanglaDate => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  let bYear = year - 593;
  let bMonthIndex = 0;
  let bDay = 0;

  // Approximate logic for demonstration
  // April 14 is 1st Boishakh
  const pohelaBoishakh = new Date(year, 3, 14);
  
  if (date < pohelaBoishakh) {
    bYear = year - 594;
    // Calculate days since previous year's Pohela Boishakh or simplified mapping
  }

  // Simplified monthly mapping for the app's visuals
  // In reality, this is more complex (31 days for first 5 months, 30 for rest)
  const daysPassed = Math.floor((date.getTime() - pohelaBoishakh.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysPassed >= 0) {
    // Current Bangla Year
    let remainingDays = daysPassed;
    const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];
    
    for (let i = 0; i < 12; i++) {
      if (remainingDays < monthLengths[i]) {
        bMonthIndex = i;
        bDay = remainingDays + 1;
        break;
      }
      remainingDays -= monthLengths[i];
    }
  } else {
    // Previous Bangla Year
    bYear = year - 594;
    const prevPohela = new Date(year - 1, 3, 14);
    let remainingDays = Math.floor((date.getTime() - prevPohela.getTime()) / (1000 * 60 * 60 * 24));
    const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];
    for (let i = 0; i < 12; i++) {
        if (remainingDays < monthLengths[i]) {
          bMonthIndex = i;
          bDay = remainingDays + 1;
          break;
        }
        remainingDays -= monthLengths[i];
      }
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
