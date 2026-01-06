import React, { useState } from 'react';

const AvailabilityTab = ({ staff, availability, onSave, isLocked = false }) => {
    const [selectedStaffId, setSelectedStaffId] = useState(staff[0].id);
    const [tempAvailability, setTempAvailability] = useState(availability);

    const selectedStaff = staff.find(s => s.id === selectedStaffId);

    // Get days in current month
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const daysInMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
    const monthName = nextMonth.toLocaleString('default', { month: 'long' });
    const year = nextMonth.getFullYear();

    const toggleDayOff = (day) => {
        const staffId = selectedStaffId;
        const currentOff = tempAvailability[staffId] || [];
        const newOff = currentOff.includes(day)
            ? currentOff.filter(d => d !== day)
            : [...currentOff, day].sort((a, b) => a - b);

        setTempAvailability({
            ...tempAvailability,
            [staffId]: newOff
        });
    };

    const handleSave = () => {
        onSave(tempAvailability);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-base) * 4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {staff.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setSelectedStaffId(s.id)}
                        className="glass-card"
                        style={{
                            padding: '12px',
                            border: selectedStaffId === s.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--foreground)'
                        }}
                    >
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--role-waiter)'
                        }} />
                        <span style={{ fontWeight: '700' }}>{s.name}</span>
                        <span style={{ fontSize: '0.7rem', color: selectedStaffId === s.id ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                            {tempAvailability[s.id]?.length || 0} days off
                        </span>
                    </button>
                ))}
            </div>


            <div className="glass-card">
                <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>
                    {monthName} {year} Availability
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px'
                }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div key={i} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: '700', color: 'var(--muted-foreground)' }}>
                            {day}
                        </div>
                    ))}
                    {/* Add empty slots to align the first day correctly */}
                    {(() => {
                        const firstDayOfMonth = nextMonth.getDay(); // 0 is Sunday, 1 is Monday, etc.
                        const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Mon-Sun grid
                        return Array.from({ length: emptySlots }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ));
                    })()}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const isOff = tempAvailability[selectedStaffId]?.includes(day);
                        return (
                            <button
                                key={day}
                                onClick={() => toggleDayOff(day)}
                                disabled={isLocked}
                                style={{
                                    aspectRatio: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: isOff ? 'var(--destructive)' : 'var(--muted)',
                                    color: isOff ? 'white' : 'var(--foreground)',
                                    fontSize: '0.8rem',
                                    borderRadius: '8px',
                                    opacity: isLocked ? 0.5 : 1,
                                    cursor: isLocked ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => setTempAvailability({ ...tempAvailability, [selectedStaffId]: [] })}
                        disabled={isLocked}
                        style={{ flex: 1, padding: '10px', backgroundColor: 'var(--muted)', color: 'var(--foreground)', opacity: isLocked ? 0.5 : 1 }}
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLocked}
                        style={{ flex: 2, padding: '10px', backgroundColor: 'var(--primary)', color: 'white', opacity: isLocked ? 0.5 : 1 }}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityTab;
