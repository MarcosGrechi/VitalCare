export function formatTelefone(telefone: string) {
  telefone = telefone.replace(/[^\d]/g, "");
  return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1)$2-$3");
}