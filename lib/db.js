import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database.json');

// Initialize DB if not exists
export function initDB() {
    if (!fs.existsSync(DB_PATH)) {
        const initialData = {
            users: [
                {
                    id: 'user_1',
                    username: '0022C0013',
                    password: '079eUI&H', // In real app, hash this
                    balance: 37.43,
                    name: '0022C0013',
                    apiKey: 'Regenerate'
                }
            ],
            campaigns: [],
            statistics: {
                daily: [
                    // Mock data for graphs
                    { date: '2024-02-01', count: 120 },
                    { date: '2024-02-05', count: 560 }, // Kept simple
                ]
            }
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    }
}

export function readDB() {
    initDB();
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
}

export function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
