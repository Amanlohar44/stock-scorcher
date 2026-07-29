import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function useReferral() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    
    if (refCode) {
      // 30 Days Expiry Time
      const expiryTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      
      const referralData = {
        code: refCode,
        expiry: expiryTime
      };

      // Save to localStorage securely
      localStorage.setItem('stock_scorcher_partner', JSON.stringify(referralData));
      
      console.log("✅ Partner Referral Tracked:", refCode);
    }
  }, [searchParams]);

  // Function to get valid referral code during checkout
  const getReferralCode = () => {
    try {
      const stored = localStorage.getItem('stock_scorcher_partner');
      if (!stored) return null;

      const { code, expiry } = JSON.parse(stored);

      // Check if 30 days have passed
      if (new Date().getTime() > expiry) {
        localStorage.removeItem('stock_scorcher_partner');
        return null;
      }

      return code;
    } catch (e) {
      return null;
    }
  };

  return { getReferralCode };
}