import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({ children }) {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <main style={{ padding: '24px', flex: 1, backgroundColor: '#f1f5f9' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
