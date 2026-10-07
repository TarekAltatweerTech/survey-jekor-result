const integerFormat = new Intl.NumberFormat('ar-IQ', { maximumFractionDigits: 0 });
const decimalFormat = new Intl.NumberFormat('ar-IQ', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const percentageFormat = new Intl.NumberFormat('ar-IQ', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});
const pluralRules = new Intl.PluralRules('ar');

const countForms = {
  votes: {
    zero: (number) => number + ' صوت',
    one: () => 'صوت واحد',
    two: () => 'صوتان',
    few: (number) => number + ' أصوات',
    many: (number) => number + ' صوتاً',
    other: (number) => number + ' صوت',
  },
  ratings: {
    zero: (number) => number + ' تقييم',
    one: () => 'تقييم واحد',
    two: () => 'تقييمان',
    few: (number) => number + ' تقييمات',
    many: (number) => number + ' تقييماً',
    other: (number) => number + ' تقييم',
  },
  people: {
    zero: (number) => number + ' شخص',
    one: () => 'شخص واحد',
    two: () => 'شخصان',
    few: (number) => number + ' أشخاص',
    many: (number) => number + ' شخصاً',
    other: (number) => number + ' شخص',
  },
};

export function formatInteger(value) {
  return integerFormat.format(Number(value) || 0);
}

export function formatDecimal(value) {
  return decimalFormat.format(Number(value) || 0);
}

export function formatPercentage(value) {
  return percentageFormat.format(Number(value) || 0);
}

export function formatCount(value, type) {
  const count = Number(value) || 0;
  const forms = countForms[type];
  const category = pluralRules.select(count);
  return forms[category](formatInteger(count));
}

const DEFAULT_COUNTDOWN_SECONDS = 30;

export function countdownSeconds() {
  const raw = new URLSearchParams(window.location.search).get('seconds');
  const value = raw === null || raw.trim() === '' ? NaN : Number(raw);
  return Number.isFinite(value) ? Math.min(60, Math.max(3, Math.round(value))) : DEFAULT_COUNTDOWN_SECONDS;
}

export function isDemoMode() {
  return new URLSearchParams(window.location.search).get('demo') === '1';
}
