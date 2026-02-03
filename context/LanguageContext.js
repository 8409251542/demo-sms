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

        // Sidebar
        smsPlatform: 'SMS Platform',
        pricing: 'SMS Pricing',
        dynamicTemplates: 'Dynamic Templates',
        messageQueue: 'Message Queue',
        smsBatches: 'SMS Batches',

        // Dashboard
        welcomeBack: 'Welcome back',
        getStarted: 'Get started',
        authName: 'Auth name',
        apiKey: 'API key',
        forgotPassword: 'Forgot password, please regenerate',
        regenerate: 'Regenerate',
        dailyStats: 'Daily SMS Statistics',
        monthlyStats: 'Statistics for the last 12 months',
        swipeToLoad: 'Swipe down to load data',

        // Statistics
        userStatistics: 'User Statistics',
        noData: 'There are no data records under the current search conditions!',
        mcc: 'MCC',
        mnc: 'MNC',

        // Campaign
        sms: 'SMS',
        mms: 'MMS',
        estimated: 'Estimated',
        number: 'Number',
        enterNumbers: 'Enter or paste phone numbers, comma required',
        numberFiles: 'Number files',
        clickToUpload: 'Click to upload',
        fileTypesInfo: 'Accept file types: .txt, .csv (txt file: one number per line)',
        mmsAttachment: 'MMS attachment',
        sizeExceeded: 'Size Exceeded',
        totalSize: 'Total size of all files',
        senderId: 'SenderId',
        selectConsumer: 'Select the consumer user...',
        mmsTitle: 'MMS title',
        mmsTitlePlaceholder: 'When the message type is MMS, the value is valid',
        content: 'Content',
        smsContentPlaceholder: 'SMS content is required.',
        mmsContentPlaceholder: 'MMS attachment or content must be filled in.',
        replaceKeyword: 'Replace keyword',
        replaceKeywordPlaceholder: 'What needs to be replaced',
        replaceContent: 'Replace content',
        replaceContentPlaceholder: 'Multiple separated by newlines',
        smsGroup: 'SMS group',
        selectedTotal: '(Selected/Total)',
        smsContent: 'SMS Content',
        selectedData: 'Selected Data',
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

        // Sidebar
        smsPlatform: '短信平台',
        pricing: '短信定价',
        dynamicTemplates: '动态模版',
        messageQueue: '消息队列',
        smsBatches: '短信批次',

        // Dashboard
        welcomeBack: '欢迎回来',
        getStarted: '开始使用',
        authName: '认证名称',
        apiKey: 'API 密钥',
        forgotPassword: '忘记密码，请重新生成',
        regenerate: '重新生成',
        dailyStats: '每日短信统计',
        monthlyStats: '过去12个月的统计',
        swipeToLoad: '向下滑动加载数据',

        // Statistics
        userStatistics: '用户统计',
        noData: '当前搜索条件下没有数据记录！',
        mcc: '移动国家代码',
        mnc: '移动网络代码',

        // Campaign
        sms: '短信',
        mms: '彩信',
        estimated: '预估',
        number: '号码',
        enterNumbers: '输入或粘贴电话号码，需要逗号分隔',
        numberFiles: '号码文件',
        clickToUpload: '点击上传',
        fileTypesInfo: '接受文件类型: .txt, .csv (txt文件: 每行一个号码)',
        mmsAttachment: '彩信附件',
        sizeExceeded: '大小超出',
        totalSize: '所有文件总大小',
        senderId: '发送者ID',
        selectConsumer: '选择消费者用户...',
        mmsTitle: '彩信标题',
        mmsTitlePlaceholder: '当消息类型为彩信时，该值有效',
        content: '内容',
        smsContentPlaceholder: '需要填写短信内容。',
        mmsContentPlaceholder: '必须填写彩信附件 or 内容。',
        replaceKeyword: '替换关键字',
        replaceKeywordPlaceholder: '需要替换的内容',
        replaceContent: '替换内容',
        replaceContentPlaceholder: '多个内容用换行符分隔',
        smsGroup: '短信组',
        selectedTotal: '(选中/总数)',
        smsContent: '短信内容',
        selectedData: '选中数据',
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
