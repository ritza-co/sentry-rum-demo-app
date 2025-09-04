'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function HomePageContent() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/slow-data').then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowImage(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleAddToCart = () => {
    const startTime = Date.now();
    while (Date.now() - startTime < 1000) {}
    setCartCount(prev => prev + 1);
  };

  if (isLoading) {
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif'}}>
            <h2>Loading Store...</h2>
        </div>
    );
  }

  return (
    <div style={{fontFamily: 'Arial, sans-serif', color: '#333'}}>
      <header style={{backgroundColor: '#fff', padding: '1rem 2rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>The Unstable Thread</h1>
        <button onClick={() => router.push('/checkout')} style={{background: '#0070f3', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem'}}>
          Cart ({cartCount})
        </button>
      </header>

      <main style={{padding: '2rem'}}>
        <div style={{height: '400px', width: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', overflow: 'hidden'}}>
          {showImage ? 
            <img src="https://picsum.photos/id/1060/1200/400" alt="Hero Image" style={{width: '100%', height: '100%', objectFit: 'cover'}}/> : 
            <p>Loading Banner...</p>
          }
        </div>

        <h2 style={{fontSize: '2rem', margin: '3rem 0 2rem 0', textAlign: 'center'}}>Our Products</h2>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem'}}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
              <img src={`https://picsum.photos/id/${10 + i}/400/300`} alt={`Product ${i+1}`} style={{width: '100%', height: '200px', objectFit: 'cover'}}/>
              <div style={{padding: '1.5rem'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem'}}>Product {i + 1}</h3>
                <p style={{marginBottom: '1rem', color: '#666'}}>A fine selection of quality goods.</p>
                <button onClick={handleAddToCart} style={{width: '100%', padding: '0.75rem', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
    return <HomePageContent />;
}
