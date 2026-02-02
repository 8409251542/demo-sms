export default function Pricing() {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#64748b' }}>
                <span>🏠</span>
                <span>/</span>
                <span>SMS Pricing</span>
            </div>
            <div className="card">
                <h3>SMS Pricing</h3>
                <p style={{ marginTop: '16px', color: '#64748b' }}>Current Rate: $0.045 per SMS</p>
            </div>
        </div>
    )
}
