'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const [username, setUsername] = useState('0022C0013');
    const [password, setPassword] = useState('079eUI&H');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (data.success) {
                router.push('/dashboard');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    return (
        <div style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.7)'
            }}></div>

            <div className="card" style={{
                position: 'relative',
                zIndex: 10,
                width: '400px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                padding: '40px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 600 }}>SMS Management System</h2>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1' }}>Account</label>
                        <input
                            type="text"
                            className="input-field"
                            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #475569', color: 'white' }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#cbd5e1' }}>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #475569', color: 'white' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p style={{ color: '#ef4444', marginBottom: '20px', fontSize: '14px' }}>{error}</p>}

                    <button
                        type="submit"
                        className="btn"
                        style={{
                            width: '100%',
                            background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                            color: 'white',
                            padding: '12px'
                        }}
                    >
                        SYSTEM LOGIN
                    </button>
                </form>
            </div>
        </div>
    );
}
