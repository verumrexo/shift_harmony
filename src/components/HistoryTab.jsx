import React from 'react';

const HistoryTab = ({ history, staff }) => {
    const dayNames = ['P', 'O', 'T', 'C', 'Pk', 'S', 'Sv'];

    const staffColors = {
        evelina: '#EF4444', // Red
        daiga: '#10B981',   // Green
        patriks: '#3B82F6',  // Blue
        sofija: '#FB923C'   // Orange
    };

    if (!history || history.length === 0) {
        return (
            <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--muted-foreground)' }}>No schedule history yet.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-base) * 4)' }}>
            {history.map((entry) => {
                const monthName = new Date(entry.year, entry.month, 1).toLocaleString('default', { month: 'long' });
                const firstDayOfMonth = entry.schedule[0]?.dayOfWeek || 0;
                const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

                return (
                    <div key={entry.id} className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>{monthName} {entry.year}</h3>
                            <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                                Archived
                            </span>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: '4px',
                            marginBottom: '1rem'
                        }}>
                            {dayNames.map((day, i) => (
                                <div key={i} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: '700', color: 'var(--muted-foreground)', paddingBottom: '8px' }}>
                                    {day}
                                </div>
                            ))}

                            {Array.from({ length: emptySlots }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {entry.schedule.map((dayData) => (
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
                                    <span style={{ fontSize: '0.7rem', fontWeight: '700', marginBottom: '2px' }}>{dayData.day}</span>
                                    <div style={{ display: 'flex', gap: '2px', fontWeight: '700', fontSize: '0.8rem' }}>
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

                        {/* Stats summary */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            paddingTop: '1rem',
                            borderTop: '1px solid var(--border)',
                            fontSize: '0.8rem'
                        }}>
                            {staff.map(s => (
                                <div key={s.id} style={{ textAlign: 'center' }}>
                                    <div style={{ color: staffColors[s.id], fontWeight: '700' }}>
                                        {s.id.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ color: 'var(--muted-foreground)', fontSize: '0.7rem' }}>
                                        {entry.stats[s.id]?.hours.toFixed(0) || 0}h
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default HistoryTab;
