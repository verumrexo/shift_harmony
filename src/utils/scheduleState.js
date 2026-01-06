/**
 * Schedule State Management
 * Handles locking schedules after deadline and archiving to history
 */

export const getScheduleState = () => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Planning period: 1st to 19th - can edit
    // Locked period: 20th to end of month - cannot edit
    const isLocked = currentDay >= 20;

    // Target month for planning (always next month)
    const targetMonth = currentMonth + 1;
    const targetYear = currentYear + (targetMonth > 11 ? 1 : 0);
    const adjustedMonth = targetMonth % 12;

    return {
        isLocked,
        currentDay,
        currentMonth,
        currentYear,
        targetMonth: adjustedMonth,
        targetYear,
        lockMessage: isLocked
            ? "The schedule has been finalized for this month. Changes will be available again on the 1st of next month."
            : null
    };
};

export const archiveSchedule = (schedule, stats, month, year) => {
    const history = JSON.parse(localStorage.getItem('sh_history') || '[]');

    const archiveEntry = {
        id: `${year}-${String(month + 1).padStart(2, '0')}`,
        month,
        year,
        schedule,
        stats,
        archivedAt: new Date().toISOString()
    };

    // Add to beginning of history array
    history.unshift(archiveEntry);

    // Keep only last 12 months
    const trimmedHistory = history.slice(0, 12);

    localStorage.setItem('sh_history', JSON.stringify(trimmedHistory));

    return trimmedHistory;
};

export const getScheduleHistory = () => {
    return JSON.parse(localStorage.getItem('sh_history') || '[]');
};

export const shouldArchiveCurrentSchedule = () => {
    const now = new Date();
    const currentDay = now.getDate();
    const lastArchiveCheck = localStorage.getItem('sh_last_archive_check');

    // On the 1st of the month, if we haven't archived yet
    if (currentDay === 1) {
        const today = now.toISOString().split('T')[0];
        if (lastArchiveCheck !== today) {
            return true;
        }
    }

    return false;
};

export const markArchiveComplete = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('sh_last_archive_check', today);
};
