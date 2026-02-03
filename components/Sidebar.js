'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const icons = {
    dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, // Changed to something looking like trend
    mail: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    book: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path></svg>,
    bar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    tool: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"></path></svg>
};

export default function Sidebar() {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState({ campaign: true });
    const { t } = useLanguage();

    const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));

    return (
        <div className="sidebar" style={{ minHeight: '100vh', padding: '20px 0' }}>
            <div style={{ padding: '0 24px', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{t('smsPlatform')}</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <NavItem href="/dashboard" icon={icons.dashboard} label={t('dashboard')} active={pathname === '/dashboard'} />

                <NavItem href="/pricing" icon={icons.chart} label={t('pricing')} active={pathname === '/pricing'} />

                {/* Campaign Group */}
                <div onClick={() => toggle('campaign')} style={{ cursor: 'pointer' }}>
                    <NavItem href="#" icon={icons.mail} label={t('newCampaign')} hasSub safeClick />
                </div>
                {expanded.campaign && (
                    <div style={{ paddingLeft: '44px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <NavItem href="/campaign" label={t('newCampaign')} active={pathname === '/campaign'} small />
                        <NavItem href="#" label={t('dynamicTemplates')} small disabled />
                        <NavItem href="#" label={t('messageQueue')} small disabled />
                        <NavItem href="#" label={t('smsBatches')} small disabled />
                    </div>
                )}



                <NavItem href="/statistics" icon={icons.bar} label={t('statistics')} active={pathname === '/statistics'} hasSub />


            </div>
        </div>
    );
}

function NavItem({ href, icon, label, active, hasSub, small, disabled, safeClick }) {
    const style = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: small ? '8px 12px' : '12px 24px',
        color: active ? '#fff' : '#94a3b8',
        background: active ? 'linear-gradient(90deg, #3b82f6 0%, rgba(59,130,246,0) 100%)' : 'transparent',
        borderLeft: active ? '3px solid #60a5fa' : '3px solid transparent',
        fontSize: small ? '13px' : '14px',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: 'none'
    };

    if (!active) {
        style.hover = { color: '#fff' }; // Hard to do inline hover logic without CSS module or state, but it handles basically.
    }

    const content = (
        <div style={style}>
            {icon && <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>}
            <span style={{ flex: 1 }}>{label}</span>
            {hasSub && <span style={{ fontSize: '10px' }}>▼</span>}
        </div>
    );

    if (safeClick) return content;

    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            {content}
        </Link>
    );
}
