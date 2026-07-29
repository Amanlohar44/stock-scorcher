/**
 * 100% COMPLETE FILE: src/utils/tracking.js
 * Pura code copy-paste karein. Ise dubara edit karne ki zaroorat nahi hai.
 */

// Function 1: URL se referral link capture karna
export const captureReferral = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    
    // Agar URL me 'ref' hai aur wo 'SSC' se shuru hota hai (Stock Scorcher Partner)
    if (ref && ref.startsWith('SSC')) {
      // 30 days ki expiry set kar rahe hain
      const expiry = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      
      const referralData = { 
        partnerId: ref, 
        expiry 
      };
      
      localStorage.setItem('stock_scorcher_ref', JSON.stringify(referralData));
      console.log('✅ Partner Referral Tracked:', ref);
    }
  } catch (error) {
    console.error('Error tracking referral:', error);
  }
};

// Function 2: Payment ke time par partnerId get karna
export const getActiveReferral = () => {
  try {
    const data = localStorage.getItem('stock_scorcher_ref');
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    
    // Agar 30 din nikal gaye hain toh delete kardo
    if (new Date().getTime() > parsed.expiry) {
      localStorage.removeItem('stock_scorcher_ref');
      return null;
    }
    
    return parsed.partnerId;
  } catch (error) {
    console.error('Error reading referral:', error);
    return null;
  }
};