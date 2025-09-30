import { useCallback, useState, useEffect } from 'react';
import moment from 'moment';

const STORAGE_KEY = 'dateRangeFilter';

const getDefaultDateRange = () => {
  const today = moment().format('YYYY-MM-DD');
  return {
    beginDate: today,
    endDate: today,
    preset: 'today'
  };
};

const computeRangeFromPreset = (preset) => {
  const today = moment();
  let begin;
  let end;

  switch (preset) {
    case 'today':
      begin = today.clone().format('YYYY-MM-DD');
      end = today.clone().format('YYYY-MM-DD');
      break;
    case 'yesterday':
      begin = today.clone().subtract(1, 'day').format('YYYY-MM-DD');
      end = today.clone().subtract(1, 'day').format('YYYY-MM-DD');
      break;
    case 'last7':
      begin = today.clone().subtract(6, 'days').format('YYYY-MM-DD');
      end = moment().format('YYYY-MM-DD');
      break;
    case 'last14':
      begin = today.clone().subtract(13, 'days').format('YYYY-MM-DD');
      end = moment().format('YYYY-MM-DD');
      break;
    case 'last30':
      begin = today.clone().subtract(29, 'days').format('YYYY-MM-DD');
      end = moment().format('YYYY-MM-DD');
      break;
    case 'thisMonth':
      begin = today.clone().startOf('month').format('YYYY-MM-DD');
      end = moment().format('YYYY-MM-DD');
      break;
    case 'lastMonth':
      begin = today.clone().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
      end = today.clone().endOf('month').format('YYYY-MM-DD');
      break;
    case 'last3months':
      begin = today.clone().subtract(3, 'months').startOf('month').format('YYYY-MM-DD');
      end = moment().format('YYYY-MM-DD');
      break;
    case 'last6months':
      begin = today.clone().subtract(6, 'months').startOf('month').format('YYYY-MM-DD');
      end = moment().format('YYYY-MM-DD');
      break;
    case 'last12months':
      begin = today.clone().subtract(12, 'months').startOf('month').format('YYYY-MM-DD');
      end = moment().format('YYYY-MM-DD');
      break;
    default:
      return null;
  }

  return { beginDate: begin, endDate: end, preset };
};

const isValidDateString = (value) => moment(value).isValid();

const getSavedDateRange = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.preset) {
        const computed = computeRangeFromPreset(parsed.preset);
        if (computed) return computed;
      }
      if (
        parsed.beginDate &&
        parsed.endDate &&
        isValidDateString(parsed.beginDate) &&
        isValidDateString(parsed.endDate)
      ) {
        return { ...parsed, preset: parsed.preset || null };
      }
    }
  } catch (error) {
    console.warn('Error parsing saved date range:', error);
  }
  return getDefaultDateRange();
};

const useDateRangeFilter = () => {
  const [currentPeriod, setCurrentPeriod] = useState(null);

  const saveDateRange = useCallback((dateRange) => {
    try {
      let toPersist = null;
      if (dateRange.preset) {
        toPersist = { preset: dateRange.preset };
      } else if (dateRange.beginDate && dateRange.endDate) {
        toPersist = { beginDate: dateRange.beginDate, endDate: dateRange.endDate };
      }

      if (!toPersist) return;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
      setCurrentPeriod(toPersist);

      const detail = toPersist.preset
        ? computeRangeFromPreset(toPersist.preset)
        : { ...toPersist, preset: null };

      window.dispatchEvent(new CustomEvent('dateRangeChanged', { detail }));
    } catch (error) {
      console.warn('Error saving date range:', error);
    }
  }, []);

  const applyDateFilter = useCallback((dateRange) => {
    if (!dateRange) return;

    if (dateRange.preset) {
      const computed = computeRangeFromPreset(dateRange.preset);
      if (!computed) return;
      saveDateRange({ preset: dateRange.preset });
      return;
    }

    if (!dateRange.beginDate || !dateRange.endDate) return;

    const { beginDate, endDate } = dateRange;
    if (!isValidDateString(beginDate) || !isValidDateString(endDate)) {
      console.error('Invalid date range provided');
      return;
    }

    saveDateRange({ beginDate, endDate });
  }, [saveDateRange]);

  const getCurrentPeriod = useCallback(() => {
    const base = currentPeriod || getSavedDateRange();
    if (base.preset) {
      const computed = computeRangeFromPreset(base.preset);
      if (computed) return computed;
    }
    return { ...base, preset: base.preset || null };
  }, [currentPeriod]);

  const hasDateFilter = useCallback(() => {
    const period = getCurrentPeriod();
    return !!(period?.beginDate && period?.endDate);
  }, [getCurrentPeriod]);

  const clearDateFilter = useCallback(() => {
    saveDateRange({ preset: 'today' });
  }, [saveDateRange]);

  useEffect(() => {
    const saved = getSavedDateRange();
    if (saved.preset) {
      setCurrentPeriod({ preset: saved.preset });
    } else {
      setCurrentPeriod({ beginDate: saved.beginDate, endDate: saved.endDate });
    }
  }, []);

  return {
    applyDateFilter,
    getCurrentPeriod,
    hasDateFilter,
    currentPeriod,
    clearDateFilter,
    saveDateRange
  };
};

const useDateRangeListener = (callback) => {
  useEffect(() => {
    const handleDateRangeChange = (event) => {
      callback(event.detail);
    };

    window.addEventListener('dateRangeChanged', handleDateRangeChange);
    
    return () => {
      window.removeEventListener('dateRangeChanged', handleDateRangeChange);
    };
  }, [callback]);
};

export { getSavedDateRange, getDefaultDateRange, useDateRangeListener };
export default useDateRangeFilter; 