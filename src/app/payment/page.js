'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import * as Sentry from "@sentry/nextjs";

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subtotal = parseFloat(searchParams.get('subtotal') || '0');
  const voucher = JSON.parse(searchParams.get('voucherString'));

  let finalTotal = subtotal;
  if (voucher) {
    finalTotal = subtotal * (1 - voucher.discountPercentage);
  }

  const handlePay = () => {
    try {
      const discount = voucher.discountPercentage;
      const finalPrice = subtotal * (1 - discount);
      alert(`Successfully paid $${finalPrice.toFixed(2)}`);
    } catch (error) {
      Sentry.captureException(error);
    }
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
          <h2 style={{fontSize: '2rem', margin: '0 0 2rem 0', textAlign: 'center'}}>Confirm Payment</h2>
          
          <div style={{border: '1px solid #ddd', borderRadius: '8px', padding: '2rem', backgroundColor: '#f9f9f9'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: '600', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem'}}>Payment Details</h3>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {voucher && (
              <div style={{display: 'flex', justifyContent: 'space-between', color: 'green'}}>
                <span>Voucher Discount</span>
                <span>-{voucher.discountPercentage * 100}%</span>
              </div>
            )}

            <hr style={{margin: '1.5rem 0'}}/>

            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.5rem'}}>
              <span>Amount to Pay</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>

            <button 
              onClick={handlePay}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '2rem'
              }}
            >
              Pay Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
