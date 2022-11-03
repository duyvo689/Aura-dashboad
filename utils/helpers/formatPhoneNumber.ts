export function formatPhoneNumber(phone: string) {
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1-$2-$3");
}
