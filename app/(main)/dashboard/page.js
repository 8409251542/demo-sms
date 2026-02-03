'use client';
import { DailyStatsChart, MonthlyStatsChart } from '@/components/DashboardCharts';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [user, setUser] = useState(null);

    const router = useRouter();

    useEffect(() => {
        fetch('/api/user')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Not authenticated');
                }
                return res.json();
            })
            .then(data => {
                setUser(data.user);
                setStats(data.statistics);
            })
            .catch(() => {
                router.push('/login');
            });
    }, [router]);

    const { t } = useLanguage();

    useEffect(() => {
        // ... (existing fetch logic)
    }, [router]);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#64748b' }}>
                <span>🏠</span>
                <span>/</span>
                <span>{t('dashboard')}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px', marginBottom: '24px' }}>
                {/* Welcome Card */}
                <div className="card" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '220px' }}>
                    <div style={{ zIndex: 1 }}>
                        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{t('hello')}, {user ? user.username : '...'}</h1>
                        <p style={{ opacity: 0.9, marginBottom: '24px' }}>{t('welcomeBack')}</p>
                        <button style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '10px 20px', borderRadius: '8px' }}>
                            {t('getStarted')} →
                        </button>
                    </div>
                    {/* Illustration placeholder */}
                    <div style={{ height: '180px', width: '200px', background: 'url(https://img.freepik.com/free-vector/business-team-brainstorming-discussing-startup-project_74855-6909.jpg?w=740) no-repeat center/contain', opacity: 0.9, mixBlendMode: 'overlay' }}></div>
                </div>

                {/* Info Card */}
                <div className="card" style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ flex: 1 }}>
                        <img src="https://img.freepik.com/free-vector/api-concept-illustration_114360-9854.jpg?w=740" alt="API" style={{ width: '100%', height: 'auto' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>{t('authName')}</div>
                            <div style={{ fontWeight: 500 }}>{user ? user.name : '...'}</div>
                        </div>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>{t('apiKey')}</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{t('forgotPassword')} <span style={{ color: '#3b82f6', cursor: 'pointer' }}>{t('regenerate')}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', color: '#64748b' }}>{t('dailyStats')}</h3>
                        <span style={{ fontSize: '12px', color: '#fbbf24' }}>{t('swipeToLoad')}</span>
                    </div>
                    <div style={{ height: '250px' }}>
                        <DailyStatsChart stats={stats ? stats.daily : []} />
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', color: '#64748b' }}>{t('monthlyStats')}</h3>
                        <span style={{ fontSize: '12px', color: '#fbbf24' }}>{t('swipeToLoad')}</span>
                    </div>
                    <div style={{ height: '250px' }}>
                        <MonthlyStatsChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
