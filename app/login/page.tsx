'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/actions';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)',
      padding: '1rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: 'var(--primary-dark)', textAlign: 'center', marginBottom: '0.5rem' }}>Sistema de Venta de Temporada</h1>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Usuario" required autoFocus />
          <input type="password" name="password" placeholder="Contraseña" required />
          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>
          )}
          <button type="submit" className="btn" style={{ width: '100%' }}>Ingresar</button>
        </form>
      </div>
    </div>
  );
}
