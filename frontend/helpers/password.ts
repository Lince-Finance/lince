export const getPasswordStrength = (password: string) => {
  const lengthCriteria = password.length >= 8;
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);

  if (lengthCriteria && hasLetters && hasNumbers && hasSymbols) return 3;
  if (password.length >= 6 && hasLetters && hasNumbers) return 2;
  if (password.length > 0) return 1;
  return 0;
};
