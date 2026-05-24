function rng(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function rndInt(digits: number, excludeZero: boolean = false) {
  if (digits < 1) {
    throw new Error('Digits must be greater than 0');
  }

  const min = excludeZero ? 1 : 0;
  const max = Math.pow(10, digits);

  return Math.floor(rng(min, max));
}