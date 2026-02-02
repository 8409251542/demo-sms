import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { username, password } = body;

        let user = await User.findOne({ username });

        // Seed if missing (for demo convenience)
        if (!user && username === '0022C0013' && password === '079eUI&H') {
            user = await User.create({
                username,
                password,
                name: 'Test User',
                balance: 10.00
            });
        }

        if (user && user.password === password) {
            const response = NextResponse.json({ success: true, user: { username: user.username, name: user.name } });
            response.cookies.set('user', user.username, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day
            });
            return response;
        }

        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
