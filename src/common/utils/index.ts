export const generateRandomCode = (length: number): number => {
  let result = '';

  for (let i = 0; i < length; i++) {
    result += String(Math.floor(Math.random() * 10));
  }

  return Number(result || 0);
};
