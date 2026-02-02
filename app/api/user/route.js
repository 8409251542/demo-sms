import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import DailyStat from '@/models/DailyStat';

export async function GET() {
    try {
        await dbConnect();
        const cookieStore = cookies();
        const username = cookieStore.get('user')?.value;

        if (!username) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const dailyStats = await DailyStat.find({}).sort({ date: 1 }).limit(30);

        // Format stats for frontend
        const statistics = {
            daily: dailyStats.map(s => ({ date: s.date, count: s.count }))
        };

        return NextResponse.json({ user, statistics });
    } catch (error) {
        console.error('User API Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
