import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
    title: 'SMS Platform',
    description: 'SMS Management System',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
