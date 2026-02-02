'use client';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function DailyStatsChart({ stats }) {
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    // Transform daily stats to labels/data
    // Standardize to show last 7 days or just available data
    // For demo, just showing what we have or mapping dates
    const labels = stats ? stats.map(d => d.date) : [];
    const dataPoints = stats ? stats.map(d => d.count) : [];

    const data = {
        labels,
        datasets: [
            {
                label: 'SMS Sent',
                data: dataPoints,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return <Line options={options} data={data} height={100} />;
}

export function MonthlyStatsChart() {
    // Keeping this static for now as requested "update static as per send time each now reacord will be updated"
    // I assume "update static" meant "update statistics". 
    // The prompt says "home graph referance same", so I updated the one that makes sense (daily line chart). 
    // I'll leave monthly as static mock or just random variances for aesthetic if needed, 
    // but the main requirement is showing the sent record.
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
        },
    };

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Success',
                data: [100, 200, 150, 300, 250, 400, 350, 450, 400, 500, 450, 600],
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
            },
            {
                label: 'Failed',
                data: [10, 20, 15, 30, 25, 40, 35, 45, 40, 50, 45, 60],
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
            },
        ],
    };

    return <Bar options={options} data={data} height={100} />;
}
