/**
 * Shift Patterns:
 * Mon-Thu: 10:30-21:00 (10.5h), 16:00-21:00 (5h)
 * Friday: 2 x 10:30-22:00 (11.5h * 2 = 23h)
 * Saturday: 2 x 10:30-22:00 (11.5h), 1 x 14:00-22:00 (8h)
 * Sunday: 2 x 10:30-21:00 (10.5h), 1 x 14:00-21:00 (7h)
 */

const SHIFTS = {
    weekday: [
        { name: 'Day', start: '10:30', end: '21:00', hours: 10.5 },
        { name: 'Evening', start: '16:00', end: '21:00', hours: 5 }
    ],
    friday: [
        { name: 'Double', start: '10:30', end: '22:00', hours: 11.5 },
        { name: 'Double', start: '10:30', end: '22:00', hours: 11.5 }
    ],
    saturday: [
        { name: 'Double', start: '10:30', end: '22:00', hours: 11.5 },
        { name: 'Double', start: '10:30', end: '22:00', hours: 11.5 },
        { name: 'Extra', start: '14:00', end: '22:00', hours: 8 }
    ],
    sunday: [
        { name: 'Double', start: '10:30', end: '21:00', hours: 10.5 },
        { name: 'Double', start: '10:30', end: '21:00', hours: 10.5 },
        { name: 'Extra', start: '14:00', end: '21:00', hours: 7 }
    ]
};

export const generateSchedule = (year, month, staff, availability) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const schedule = [];
    const stats = staff.reduce((acc, s) => {
        acc[s.id] = { hours: 0, shifts: 0, consecutive: 0, lastDay: -1 };
        return acc;
    }, {});

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday

        let dailyShifts = [];
        if (dayOfWeek >= 1 && dayOfWeek <= 4) dailyShifts = [...SHIFTS.weekday];
        else if (dayOfWeek === 5) dailyShifts = [...SHIFTS.friday];
        else if (dayOfWeek === 6) dailyShifts = [...SHIFTS.saturday];
        else if (dayOfWeek === 0) dailyShifts = [...SHIFTS.sunday];

        const dayAssignments = [];

        // For each shift required today
        for (const shift of dailyShifts) {
            // Find candidate staff - try with restrictions first
            let candidates = staff
                .filter(s => {
                    // Not their day off
                    const isOff = availability[s.id]?.includes(day);
                    // Not already assigned today
                    const alreadyAssigned = dayAssignments.some(a => a.staffId === s.id);
                    // Consecutive shifts constraint (soft limit 5, can go higher if needed)
                    const isConsecutiveLimit = stats[s.id].consecutive >= 5;

                    return !isOff && !alreadyAssigned && !isConsecutiveLimit;
                })
                .sort((a, b) => {
                    // Sofija should have slightly lower hours - add virtual 5h penalty for sorting
                    const aHours = stats[a.id].hours + (a.id === 'sofija' ? 5 : 0);
                    const bHours = stats[b.id].hours + (b.id === 'sofija' ? 5 : 0);

                    // Primary: Balance total hours (with Sofija penalty)
                    if (aHours !== bHours) {
                        return aHours - bHours;
                    }
                    // Secondary: Consecutive shifts (prefer fewer)
                    return stats[a.id].consecutive - stats[b.id].consecutive;
                });

            // Fallback: If no candidates with restrictions, try without consecutive limit
            if (candidates.length === 0) {
                candidates = staff
                    .filter(s => {
                        const isOff = availability[s.id]?.includes(day);
                        const alreadyAssigned = dayAssignments.some(a => a.staffId === s.id);
                        return !isOff && !alreadyAssigned;
                    })
                    .sort((a, b) => {
                        // Sofija should have slightly lower hours - add virtual 5h penalty
                        const aHours = stats[a.id].hours + (a.id === 'sofija' ? 5 : 0);
                        const bHours = stats[b.id].hours + (b.id === 'sofija' ? 5 : 0);

                        if (aHours !== bHours) {
                            return aHours - bHours;
                        }
                        return stats[a.id].consecutive - stats[b.id].consecutive;
                    });
            }

            // Last resort: If still no candidates (everyone is off or already assigned), assign anyone not off
            if (candidates.length === 0) {
                candidates = staff
                    .filter(s => {
                        const isOff = availability[s.id]?.includes(day);
                        return !isOff;
                    })
                    .sort((a, b) => {
                        // Sofija should have slightly lower hours - add virtual 5h penalty
                        const aHours = stats[a.id].hours + (a.id === 'sofija' ? 5 : 0);
                        const bHours = stats[b.id].hours + (b.id === 'sofija' ? 5 : 0);

                        return aHours - bHours;
                    });
            }

            if (candidates.length > 0) {
                const assigned = candidates[0];
                dayAssignments.push({
                    staffId: assigned.id,
                    name: assigned.name,
                    shift: shift.name,
                    start: shift.start,
                    end: shift.end,
                    hours: shift.hours
                });

                // Update stats
                stats[assigned.id].hours += shift.hours;
                stats[assigned.id].shifts += 1;
                if (stats[assigned.id].lastDay === day - 1) {
                    stats[assigned.id].consecutive += 1;
                } else {
                    stats[assigned.id].consecutive = 1;
                }
                stats[assigned.id].lastDay = day;
            } else {
                dayAssignments.push({
                    staffId: null,
                    name: 'UNASSIGNED',
                    shift: shift.name,
                    hours: shift.hours
                });
            }
        }

        // Reset consecutive counts for those who didn't work today
        staff.forEach(s => {
            if (!dayAssignments.some(a => a.staffId === s.id)) {
                if (stats[s.id].lastDay !== day) {
                    stats[s.id].consecutive = 0;
                }
            }
        });

        schedule.push({ day, dayOfWeek, assignments: dayAssignments });
    }

    return { schedule, stats };
};
