'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
// import { readDB } from '@/lib/db'; // Removed server-side import

export default function Statistics() {
    const [campaigns, setCampaigns] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const fetchData = (pageNum) => {
        setLoading(true);
        fetch(`/api/statistics?page=${pageNum}&limit=10`)
            .then(res => res.json())
            .then(data => {
                if (data.data) {
                    setCampaigns(data.data);
                    setTotalPages(data.pagination.totalPages);
                } else {
                    setCampaigns([]);
                }
                setLoading(false);
            })
            .catch(err => {
                setCampaigns([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleNext = () => {
        if (page < totalPages) setPage(p => p + 1);
    };

    const handlePrev = () => {
        if (page > 1) setPage(p => p - 1);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#64748b' }}>
                <span>🏠</span>
                <span>/</span>
                <span>Statistics</span>
                <span>/</span>
                <span>User Statistics</span>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>{t('statistics')}</h3>
                    <button className="btn btn-primary" style={{ fontSize: '12px' }}>{t('search')}</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>MCC</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>MNC</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Phone Number</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: '#ef4444' }}>
                                        There are no data records under the current search conditions!
                                    </td>
                                </tr>
                            ) : (
                                campaigns.map(msg => (
                                    <tr key={msg._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px' }}>{new Date(msg.createdAt).toLocaleString()}</td>
                                        <td style={{ padding: '12px' }}>{msg.type}</td>
                                        <td style={{ padding: '12px' }}>{msg.mcc}</td>
                                        <td style={{ padding: '12px' }}>{msg.mnc}</td>
                                        <td style={{ padding: '12px' }}>{msg.phoneNumber}</td>
                                        <td style={{ padding: '12px', color: msg.status === 'Delivered' ? '#10b981' : '#ef4444' }}>
                                            {msg.status}
                                        </td>
                                        <td style={{ padding: '12px' }}>${msg.cost}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '20px' }}>
                <button
                    onClick={handlePrev}
                    disabled={page === 1 || loading}
                    style={{ padding: '8px 16px', background: page === 1 ? '#e2e8f0' : '#3b82f6', color: page === 1 ? '#94a3b8' : 'white', border: 'none', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >
                    Previous
                </button>
                <span style={{ color: '#64748b' }}>Page {page} of {totalPages}</span>
                <button
                    onClick={handleNext}
                    disabled={page === totalPages || loading}
                    style={{ padding: '8px 16px', background: page === totalPages ? '#e2e8f0' : '#3b82f6', color: page === totalPages ? '#94a3b8' : 'white', border: 'none', borderRadius: '4px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
