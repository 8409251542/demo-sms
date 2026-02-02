'use client';
import { useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

export default function NewCampaign() {
    const { t } = useLanguage();
    const [numbers, setNumbers] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('SMS'); // 'SMS' or 'MMS'
    const [mmsTitle, setMmsTitle] = useState('');
    const [replaceKeyword, setReplaceKeyword] = useState('');
    const [replaceContent, setReplaceContent] = useState('');
    const [mmsFiles, setMmsFiles] = useState([]);

    const handleMmsUpload = (e) => {
        const files = Array.from(e.target.files);
        setMmsFiles(prev => [...prev, ...files]);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            const data = evt.target.result;

            // Dynamic import to avoid SSR issues with xlsx if any
            const XLSX = await import('xlsx');
            const workbook = XLSX.read(data, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Get all rows as array of arrays
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Extract first column (index 0) and filter valid numbers
            const extractedNumbers = jsonData
                .map(row => row[0])
                .filter(cell => cell && (typeof cell === 'string' || typeof cell === 'number'))
                .map(cell => String(cell).trim())
                .filter(s => s.length > 5); // Basic length check

            if (extractedNumbers.length > 0) {
                setNumbers(extractedNumbers.join(', '));
            } else {
                alert('No valid numbers found in the first column.');
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleSend = async () => {
        setLoading(true);
        setStatus('');

        const numberList = numbers.split(/[\r\n,]+/).map(s => s.trim()).filter(s => s);

        try {
            const res = await fetch('/api/campaign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numbers: numberList,
                    content,
                    senderId: 'USER',
                    type, // Send the type
                    mmsTitle: type === 'MMS' ? mmsTitle : undefined
                }),
            });
            const data = await res.json();

            if (data.success) {
                setStatus(`Success! Sent ${data.campaign.numbersCount} messages. Cost: ${data.campaign.cost}. New Balance: ${data.newBalance}`);
                setNumbers('');
                setContent('');
                setMmsTitle('');
                // Reload page or update balance context (window reload is easiest for this demo without context)
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setStatus(`Error: ${data.message}`);
            }
        } catch (e) {
            setStatus('Failed to send request');
        }
        setLoading(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#64748b' }}>
                <span>🏠</span>
                <span>/</span>
                <span>New Campaign</span>
                <span>/</span>
                <span>New Campaign</span>
            </div>

            <div className="card">


                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 2fr) 1fr', gap: '40px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Type Selection */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <label style={{ width: '100px', fontWeight: 500 }}>Type:</label>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="type"
                                        checked={type === 'SMS'}
                                        onChange={() => setType('SMS')}
                                    /> SMS
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="type"
                                        checked={type === 'MMS'}
                                        onChange={() => setType('MMS')}
                                    /> MMS
                                </label>
                            </div>
                        </div>

                        <label style={{ width: '100px', fontWeight: 500 }}>{t('time')}:</label>
                        <input
                            type="text"
                            placeholder={t('time')}
                            className="input-field"
                            disabled
                            value={numbers ? `Estimated: ${Math.max(1, Math.ceil(numbers.split(/[\r\n,]+/).filter(s => s.trim()).length / 150))}s` : ''}
                        />

                        {/* Number Input */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                            <label style={{ width: '100px', fontWeight: 500, paddingTop: '10px' }}>Number:</label>
                            <textarea
                                className="input-field"
                                rows={4}
                                placeholder="Enter or paste phone numbers, comma required"
                                value={numbers}
                                onChange={e => setNumbers(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Number Files */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <label style={{ width: '100px', fontWeight: 500 }}>Number files ❔:</label>
                            <div style={{ flex: 1 }}>
                                <label className="btn btn-primary" style={{ display: 'block', textAlign: 'center', cursor: 'pointer', background: '#93c5fd' }}>
                                    Click to upload
                                    <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept=".txt,.csv" />
                                </label>
                                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                                    Accept file types: .txt, .csv <br />
                                    txt file: one number per line
                                </p>
                            </div>
                        </div>

                        {/* MMS Attachment - Only show if MMS */}
                        {type === 'MMS' && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                                <label style={{ width: '100px', fontWeight: 500, paddingTop: '10px' }}>MMS attachment ❔:</label>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                        {mmsFiles.map((f, i) => (
                                            <div key={i} style={{
                                                width: '100px', height: '100px',
                                                border: '1px solid #cbd5e1',
                                                borderRadius: '8px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                position: 'relative', overflow: 'hidden'
                                            }}>
                                                <span style={{ fontSize: '10px', textAlign: 'center', padding: '4px' }}>{f.name}</span>
                                            </div>
                                        ))}
                                        {[1, 2, 3].slice(mmsFiles.length).map(i => (
                                            <label key={i} style={{
                                                width: '100px', height: '100px',
                                                border: '2px dashed #cbd5e1',
                                                borderRadius: '8px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', color: '#64748b', fontSize: '24px'
                                            }}>
                                                +
                                                <input type="file" style={{ display: 'none' }} onChange={handleMmsUpload} accept="image/*,video/*" />
                                            </label>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#3b82f6' }}>{mmsFiles.reduce((acc, f) => acc + f.size, 0) / 1024 > 100 ? 'Size Exceeded' : `${(mmsFiles.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(2)}KB/100KB Total size of all files`}</p>
                                </div>
                            </div>
                        )}
                        {/* Sender ID */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <label style={{ width: '100px', fontWeight: 500 }}>SenderId ❔:</label>
                            <input type="text" placeholder="Select the consumer user..." className="input-field" />
                        </div>

                        {/* MMS Title - Only show if MMS */}
                        {type === 'MMS' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <label style={{ width: '100px', fontWeight: 500 }}>MMS title:</label>
                                <input
                                    type="text"
                                    placeholder="When the message type is MMS, the value is valid"
                                    className="input-field"
                                    value={mmsTitle}
                                    onChange={(e) => setMmsTitle(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                            <label style={{ width: '100px', fontWeight: 500, paddingTop: '10px' }}>Content:</label>
                            <textarea
                                className="input-field"
                                rows={4}
                                placeholder={type === 'MMS' ? "MMS attachment or content must be filled in." : "SMS content is required."}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Replace Options */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <label style={{ width: '100px', fontWeight: 500 }}>Replace keyword ❔:</label>
                            <input
                                type="text"
                                placeholder="What needs to be replaced"
                                className="input-field"
                                value={replaceKeyword}
                                onChange={(e) => setReplaceKeyword(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                            <label style={{ width: '100px', fontWeight: 500, paddingTop: '10px' }}>Replace content ❔:</label>
                            <textarea
                                className="input-field"
                                rows={2}
                                placeholder="Multiple separated by newlines"
                                value={replaceContent}
                                onChange={e => setReplaceContent(e.target.value)}
                            ></textarea>
                        </div>


                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button className="btn btn-primary" onClick={handleSend} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                                {loading ? 'Sending...' : 'Send 🚀'}
                            </button>
                        </div>

                        {status && (
                            <div style={{ padding: '10px', borderRadius: '6px', background: status.includes('Success') ? '#dcfce7' : '#fee2e2', color: status.includes('Success') ? '#166534' : '#991b1b' }}>
                                {status}
                            </div>
                        )}

                    </div>

                    {/* Right Side Info */}
                    <div style={{ borderLeft: '1px solid #e5e7eb', paddingLeft: '24px' }}>
                        <h4 style={{ marginBottom: '16px' }}>SMS group</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
                            <span>(Selected/Total)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
                            <span>SMS Content</span>
                        </div>
                        <p style={{ marginTop: '20px' }}>Selected Data: {numbers ? numbers.split(',').length : 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
