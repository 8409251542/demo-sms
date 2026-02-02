'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        dashboard: 'Dashboard',
        statistics: 'Statistics',
        newCampaign: 'New Campaign',
        settings: 'Settings',
        logout: 'Logout',
        balance: 'Balance',
        search: 'Search',
        time: 'Time',
        type: 'Type',
        phoneNumber: 'Phone Number',
        status: 'Status',
        cost: 'Cost',
        success: 'Success',
        error: 'Error',
        sending: 'Sending...',
        send: 'Send 🚀',
        welcome: 'Welcome',
        hello: 'Hello',
    },
    zh: {
        dashboard: '仪表盘',
        statistics: '统计',
        newCampaign: '新建活动',
        settings: '设置',
        logout: '登出',
        balance: '余额',
        search: '搜索',
        time: '时间',
        type: '类型',
        phoneNumber: '电话号码',
        status: '状态',
        cost: '费用',
        success: '成功',
        error: '错误',
        sending: '发送中...',
        send: '发送 🚀',
        welcome: '欢迎',
        hello: '你好',
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        // Load saved language from localStorage if available
        const savedLang = localStorage.getItem('appLanguage');
        if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
            setLanguage(savedLang);
        }
    }, []);

    const switchLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('appLanguage', lang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, switchLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
