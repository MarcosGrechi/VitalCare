export function formatDataNascimento(dataNascimento: string): string {
  const cleanDate = dataNascimento.replace(/\D/g, '');
  if (cleanDate.length === 8) {
    const year = cleanDate.slice(4, 8);
    const month = cleanDate.slice(2, 4);
    const day = cleanDate.slice(0, 2);
    return `${year}-${month}-${day}`;
  }
  return '';
}