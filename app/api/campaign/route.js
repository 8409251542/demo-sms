import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Campaign from '@/models/Campaign';
import Message from '@/models/Message'; // [NEW]
import DailyStat from '@/models/DailyStat';

export async function POST(request) {
    try {
        await dbConnect();
        const cookieStore = cookies();
        const username = cookieStore.get('user')?.value;

        if (!username) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { numbers, content, senderId, type, mmsTitle } = body;

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Calculate Cost ($0.045 per SMS)
        const costPerSMS = 0.045;
        const totalCost = Number((numbers.length * costPerSMS).toFixed(4));

        if (user.balance < totalCost) {
            return NextResponse.json({ success: false, message: `Insufficient balance. Need ${totalCost}, have ${user.balance}` }, { status: 400 });
        }

        const campaignId = uuidv4();
        const totalNumbers = numbers.length;
        let failCount = 0;
        const messagesToSave = [];

        // Deduct balance
        user.balance = Number((user.balance - totalCost).toFixed(4));
        await user.save();

        // Process each number
        for (const number of numbers) {
            // 1-2% Failure Rate Logic per message
            const isFailure = Math.random() < 0.015; // ~1.5% chance
            if (isFailure) failCount++;

            messagesToSave.push({
                campaignId,
                userId: user._id,
                phoneNumber: number,
                content,
                status: isFailure ? 'Failed' : 'Delivered',
                cost: costPerSMS,
                type: type || 'SMS',
                mcc: '310',
                mnc: '410',
                createdAt: new Date()
            });
        }

        const successCount = totalNumbers - failCount;

        // Bulk insert messages for performance
        if (messagesToSave.length > 0) {
            await Message.insertMany(messagesToSave);
        }

        // Update Statistics
        const today = new Date().toISOString().split('T')[0];
        await DailyStat.findOneAndUpdate(
            { date: today },
            { $inc: { count: totalNumbers } },
            { upsert: true, new: true }
        );

        // Create campaign (still keeping for high-level grouping if needed later)
        const campaign = await Campaign.create({
            id: campaignId,
            userId: user._id,
            type: type || 'SMS',
            numbersCount: totalNumbers,
            successCount: successCount,
            failCount: failCount,
            cost: totalCost,
            content,
            senderId: senderId || 'DEFAULT',
            mcc: '310',
            mnc: '410',
            mmsTitle: mmsTitle
        });

        return NextResponse.json({
            success: true,
            message: 'Campaign sent',
            newBalance: user.balance,
            campaign: {
                id: campaign.id,
                numbersCount: campaign.numbersCount,
                cost: campaign.cost
            }
        });
    } catch (error) {
        console.error('Campaign error:', error);
        return NextResponse.json({ success: false, message: 'Server error: ' + error.message }, { status: 500 });
    }
}
