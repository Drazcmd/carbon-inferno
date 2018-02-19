export const numChecker = num => (isNaN(num) ? 0 : num);

export const calculateDiff = (previous = 0, current = 0) => {
  const diff = current - previous;
  const ppmDiff = numChecker(diff.toFixed(2));
  if (diff > 0) {
    return `+${ppmDiff}`;
  }
  return `${ppmDiff}`;
};

export const calculatePercentageDiff = (previous, current) => {
  const diff = (current - previous) / current * 100; // eslint-disable-line
  const percentageDiff = numChecker(diff.toFixed(2));
  if (diff > 0) {
    return `+${percentageDiff}`;
  }
  return `${percentageDiff}`;
};

export const calculateAverageRate = (priorDatePpm, currentPpm, yearsBetween) => {
  if (!(priorDatePpm && currentPpm && yearsBetween)) {
    return 0;
  }

  const averageRate = (currentPpm - priorDatePpm) / yearsBetween;
  const ppmAverageRate = numChecker(averageRate.toFixed(2));
  if (ppmAverageRate > 0) {
    return `+${ppmAverageRate}`;
  }
  return `${ppmAverageRate}`;
};

export const calculateYearsUntil = (currentPpm, targetPpm, ppmAverageRate) => {
  if (!(currentPpm && targetPpm && ppmAverageRate)) {
    return '?'; // TODO - what's a better constant for this? Don't want to freak people out with 0 here
  }

  const yearsUntil = (targetPpm - currentPpm) / ppmAverageRate;
  const cleanedYearsUntil = numChecker(yearsUntil.toFixed(1));
  if (cleanedYearsUntil > 0) {
    return `~${cleanedYearsUntil}`;
  }
  return '0';
};
