/**
 * Utilitário para abrir o WhatsApp de forma inteligente (Web no desktop, App no mobile)
 * @param {Object} params
 * @param {string} params.phone - Número de telefone (opcional)
 * @param {string} params.message - Mensagem a ser enviada (opcional)
 */
export const openWhatsApp = ({ phone, message }) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // No desktop, o WhatsApp Web é mais direto.
  // No mobile, o api.whatsapp.com ou wa.me dispara o aplicativo.
  const baseUrl = isMobile 
    ? 'https://api.whatsapp.com/send' 
    : 'https://web.whatsapp.com/send';
  
  const params = new URLSearchParams();
  
  if (phone) {
    // Remove tudo que não é dígito
    let cleanPhone = phone.replace(/\D/g, '');
    // Garante o DDI 55 se não houver
    if (cleanPhone.length > 0 && !cleanPhone.startsWith('55')) {
      cleanPhone = `55${cleanPhone}`;
    }
    params.append('phone', cleanPhone);
  }
  
  if (message) {
    params.append('text', message);
  }
  
  const finalUrl = `${baseUrl}?${params.toString()}`;
  window.open(finalUrl, '_blank');
};
