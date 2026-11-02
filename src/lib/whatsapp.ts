export const createWhatsAppUrl = (phoneNumber: string, message: string) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  if (cleanPhone.length < 8) {
    throw new Error('The WhatsApp number is not configured correctly.');
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
