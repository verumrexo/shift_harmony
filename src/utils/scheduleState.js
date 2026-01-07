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

/**
 * Creates a new history entry and returns the updated history array.
 * Pure function - does not save to storage.
 *
 * @param {Array} currentHistory - The current history array
 * @param {Array} schedule - The schedule to archive
 * @param {Object} stats - Stats to archive
 * @param {number} month - Month of the schedule
 * @param {number} year - Year of the schedule
 * @returns {Array} Updated history array
 */
export const archiveSchedule = (currentHistory, schedule, stats, month, year) => {
    const history = [...(currentHistory || [])];

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

    return trimmedHistory;
};

/**
 * Checks if archiving should happen based on date and last check.
 *
 * @param {string} lastArchiveCheckDate - Date string YYYY-MM-DD
 * @returns {boolean}
 */
export const shouldArchiveCurrentSchedule = (lastArchiveCheckDate) => {
    const now = new Date();
    const currentDay = now.getDate();

    // On the 1st of the month, if we haven't archived yet
    if (currentDay === 1) {
        const today = now.toISOString().split('T')[0];
        if (lastArchiveCheckDate !== today) {
            return true;
        }
    }

    return false;
};

export const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};
