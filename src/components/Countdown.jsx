import React, { useState, useEffect } from 'react';

const Countdown = ({ deadlineDay = 20 }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            let targetDate = new Date(now.getFullYear(), now.getMonth(), deadlineDay);

            // If it's already past the 20th, target the 20th of next month
            if (now.getDate() >= deadlineDay) {
                targetDate = new Date(now.getFullYear(), now.getMonth() + 1, deadlineDay);
            }

            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();

        return () => clearInterval(timer);
    }, [deadlineDay]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            marginBottom: 'calc(var(--spacing-base) * 2)',
            fontSize: '0.75rem',
            color: 'var(--muted-foreground)'
        }}>
            <span>Deadline: {deadlineDay}th</span>
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                {timeLeft.days}d {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
            </span>
        </div>
    );
};

export default Countdown;
