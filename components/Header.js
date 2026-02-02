'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState({ username: '0022C0013', role: 'consumer' });
    const [balance, setBalance] = useState('0.00');
    const { language, switchLanguage, t } = useLanguage();

    useEffect(() => {
        // Fetch user balance and info
        fetch('/api/user')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setBalance(data.user.balance);
                    setUser(prev => ({ ...prev, username: data.user.username }));
                }
            })
            .catch(e => console.error(e));
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <header className="top-bar">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button style={{ background: 'none', fontSize: '24px', color: '#64748b' }}>☰</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span> UTC+05:30 </span>
                </div>

                <div style={{ fontWeight: 'bold', color: '#1f2937' }}>
                    {balance}
                </div>

                <div style={{ cursor: 'pointer' }}>💬</div>
                <div style={{ cursor: 'pointer' }}>🔔</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', position: 'relative' }} className="group">
                    <span onClick={() => switchLanguage(language === 'en' ? 'zh' : 'en')}>
                        {language === 'en' ? 'English' : 'Chinese'}
                    </span>
                    <span>▼</span>
                </div>

                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#3b82f6', padding: '6px 12px', borderRadius: '20px', color: 'white', cursor: 'pointer' }}
                    >
                        <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', textAlign: 'center', lineHeight: '20px', fontSize: '12px' }}>👤</div>
                        <span>{user.username}</span>
                        <span style={{ fontSize: '10px' }}>▼</span>
                    </div>

                    {showDropdown && (
                        <div style={{
                            position: 'absolute',
                            top: '120%',
                            right: 0,
                            background: '#1e293b',
                            color: 'white',
                            borderRadius: '8px',
                            width: '200px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            zIndex: 50,
                            overflow: 'hidden'
                        }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid #334155' }}>
                                <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>consumer</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <button className="dropdown-item" style={{ padding: '12px 16px', textAlign: 'left', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span>⚙️</span> {t('settings')}
                                </button>
                                <button className="dropdown-item" style={{ padding: '12px 16px', textAlign: 'left', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span>🔑</span> Password
                                </button>
                                <button onClick={handleLogout} className="dropdown-item" style={{ padding: '12px 16px', textAlign: 'left', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', borderTop: '1px solid #334155' }}>
                                    <span>⬅️</span> {t('logout')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
