import React from 'react';

const ScheduleTab = ({ schedule, stats, staff, onGenerate, isLocked = false }) => {
    const dayNames = ['P', 'O', 'T', 'C', 'Pk', 'S', 'Sv']; // Mon-Sun initials as in image

    // Staff color mapping
    const staffColors = {
        evelina: '#EF4444', // Red
        daiga: '#10B981',   // Green
        patriks: '#3B82F6',  // Blue
        sofija: '#FB923C'   // Orange
    };

    if (!schedule || schedule.length === 0) {
        return (
            <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ marginBottom: '1rem', color: 'var(--muted-foreground)' }}>No schedule generated yet.</p>
                <button
                    onClick={onGenerate}
                    style={{ padding: '12px 24px', backgroundColor: 'var(--primary)', color: 'white', fontWeight: '700' }}
                >
                    Generate Schedule
                </button>
            </div>
        );
    }

    // Get month and year from schedule metadata (passed from App or derived)
    // For now, assume current plan is for next month
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthName = targetDate.toLocaleString('default', { month: 'long' });
    const year = targetDate.getFullYear();

    // Calendar logic: find empty slots before the 1st
    const firstDayOfMonth = schedule[0].dayOfWeek; // 0 is Sun, 1 is Mon
    // We want Mon as first day (1..6..0)
    const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-base) * 4)' }}>
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>{monthName}</h2>
                    <span style={{ color: 'var(--muted-foreground)', fontWeight: '700' }}>{year}</span>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    marginBottom: '1rem'
                }}>
                    {dayNames.map((day, i) => (
                        <div key={i} style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: '700', color: 'var(--muted-foreground)', paddingBottom: '8px' }}>
                            {day}
                        </div>
                    ))}

                    {Array.from({ length: emptySlots }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {schedule.map((dayData) => (
                        <div key={dayData.day} style={{
                            aspectRatio: '1',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px',
                            gap: '2px'
                        }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '2px' }}>{dayData.day}</span>
                            <div style={{ display: 'flex', gap: '2px', fontWeight: '700', fontSize: '0.9rem' }}>
                                {dayData.assignments.map((asgn, i) => (
                                    <span key={i} style={{
                                        color: asgn.staffId ? staffColors[asgn.staffId] : 'var(--muted-foreground)'
                                    }}>
                                        {asgn.staffId ? asgn.staffId.charAt(0).toUpperCase() : '?'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border)',
                    fontSize: '0.8rem'
                }}>
                    {staff.map(s => (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: staffColors[s.id], fontWeight: '700' }}>{s.id.charAt(0).toUpperCase()}</span>
                            <span style={{ color: 'var(--muted-foreground)' }}>= {s.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Hours Distribution</h3>
                    <button
                        onClick={onGenerate}
                        disabled={isLocked}
                        style={{ padding: '6px 12px', fontSize: '0.7rem', backgroundColor: 'var(--primary)', color: 'white', opacity: isLocked ? 0.5 : 1 }}
                    >
                        Regenerate
                    </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '8px 0' }}>Name</th>
                            <th style={{ padding: '8px 0', textAlign: 'right' }}>Shifts</th>
                            <th style={{ padding: '8px 0', textAlign: 'right' }}>Total Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '8px 0', fontWeight: '700' }}>{s.name}</td>
                                <td style={{ padding: '8px 0', textAlign: 'right' }}>{stats[s.id]?.shifts || 0}</td>
                                <td style={{ padding: '8px 0', textAlign: 'right' }}>{stats[s.id]?.hours.toFixed(1) || '0.0'}h</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScheduleTab;
