'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [subtotal, setSubtotal] = useState(50);
  const [voucherCode, setVoucherCode] = useState('FREE-SHIPPING');
  const [voucherMessage, setVoucherMessage] = useState('');
  const [isVoucherLoading, setIsVoucherLoading] = useState(false);
  const [simulateSlowConnection, setSimulateSlowConnection] = useState(false);
  const [voucher, setVoucher] = useState(null);

  const handleApplyVoucher = async () => {
    setIsVoucherLoading(true);
    setVoucherMessage('');
    try {
      const res = await fetch('/api/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherCode, isSlowConnection: simulateSlowConnection }),
      });
      const data = await res.json();
      if (res.ok) {
        setVoucher(data.voucher);
        setVoucherMessage('Voucher applied!');
      } else {
        setVoucher(null);
        setVoucherMessage(data.message || 'Failed to apply voucher.');
      }
    } catch (error) {
      setVoucher(null);
      setVoucherMessage('An error occurred.');
    } finally {
      setIsVoucherLoading(false);
    }
  };

  const handleCheckout = () => {
    const query = {
      subtotal: subtotal,
      voucherString: JSON.stringify(voucher),
    };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/payment?${queryString}`);
  };

  return (
    <div style={{fontFamily: 'Arial, sans-serif', color: '#333'}}>
      <header style={{backgroundColor: '#fff', padding: '1rem 2rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>The Unstable Thread</h1>
        <button onClick={() => router.push('/')} style={{background: 'transparent', color: '#0070f3', border: 'none', cursor: 'pointer', fontSize: '1rem'}}>
          &larr; Back to Store
        </button>
      </header>

      <main style={{padding: '2rem', display: 'flex', justifyContent: 'center'}}>
        <div style={{width: '100%', maxWidth: '500px'}}>
          <h2 style={{fontSize: '2rem', margin: '0 0 2rem 0', textAlign: 'center'}}>Shopping Cart</h2>
          
          <div style={{border: '1px solid #ddd', borderRadius: '8px', padding: '2rem', backgroundColor: '#f9f9f9'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: '600', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem'}}>Order Summary</h3>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', color: voucher ? 'green' : '#666'}}>
              <span>Voucher</span>
              <span>{voucher ? `-${(voucher.discountPercentage * 100).toFixed(0)}%` : 'N/A'}</span>
            </div>
            <hr style={{margin: '1.5rem 0'}}/>
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem'}}>
              <span>Total</span>
              <span>${(subtotal * (1 - (voucher ? voucher.discountPercentage : 0))).toFixed(2)}</span>
            </div>

            <div style={{marginTop: '2rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>Voucher Code</label>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="FREE-SHIPPING"
                  style={{padding: '0.75rem', border: '1px solid #ccc', borderRadius: '5px', flexGrow: 1}}
                />
                <button onClick={handleApplyVoucher} disabled={isVoucherLoading} style={{background: '#555', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '5px', cursor: 'pointer'}}>
                  {isVoucherLoading ? '... ' : 'Apply'}
                </button>
              </div>
              {voucherMessage && <p style={{fontSize: '0.9rem', color: voucher ? 'green' : 'red', marginTop: '0.5rem'}}>{voucherMessage}</p>}
            </div>

            <div style={{marginTop: '1rem'}}>
                <input type="checkbox" id="slow" checked={simulateSlowConnection} onChange={() => setSimulateSlowConnection(!simulateSlowConnection)} />
                <label htmlFor="slow" style={{marginLeft: '0.5rem'}}>Simulate Slow Connection</label>
            </div>

            <button 
              onClick={handleCheckout} 
              style={{width: '100%', padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '2rem'}}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
