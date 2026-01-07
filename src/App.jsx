import React, { useState, useEffect } from 'react';
import './index.css';
import Countdown from './components/Countdown';
import { Tabs, Tab } from './components/Tabs';
import AvailabilityTab from './components/AvailabilityTab';
import ScheduleTab from './components/ScheduleTab';
import HistoryTab from './components/HistoryTab';
import { generateSchedule } from './utils/scheduler';
import { getScheduleState, archiveSchedule, shouldArchiveCurrentSchedule, getTodayDateString } from './utils/scheduleState';
import { storage } from './services/storage';

// Staff constants
const STAFF = [
  { id: 'evelina', name: 'Evelīna', role: 'waiter' },
  { id: 'daiga', name: 'Daiga', role: 'waiter' },
  { id: 'patriks', name: 'Patriks', role: 'waiter' },
  { id: 'sofija', name: 'Sofija', role: 'waiter' }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('availability');
  const [scheduleState, setScheduleState] = useState(getScheduleState());

  // Data State
  const [isLoading, setIsLoading] = useState(true);
  const [availability, setAvailability] = useState({});
  const [scheduleData, setScheduleData] = useState({ schedule: [], stats: {} });
  const [history, setHistory] = useState([]);
  const [lastArchiveCheck, setLastArchiveCheck] = useState('');

  // Initialize data from storage
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [loadedAvailability, loadedSchedule, loadedHistory, loadedArchiveCheck] = await Promise.all([
          storage.get('sh_availability', {}),
          storage.get('sh_schedule', { schedule: [], stats: {} }),
          storage.get('sh_history', []),
          storage.get('sh_last_archive_check', '')
        ]);

        setAvailability(loadedAvailability);
        setScheduleData(loadedSchedule);
        setHistory(loadedHistory);
        setLastArchiveCheck(loadedArchiveCheck);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Check for archiving and update schedule state periodically
  useEffect(() => {
    // If we're still loading, don't run this logic yet
    if (isLoading) return;

    const checkScheduleState = () => {
      const newState = getScheduleState();
      setScheduleState(newState);

      // Auto-archive on the 1st of the month
      if (shouldArchiveCurrentSchedule(lastArchiveCheck) && scheduleData.schedule.length > 0) {
        const prevMonth = newState.currentMonth === 0 ? 11 : newState.currentMonth - 1;
        const prevYear = newState.currentMonth === 0 ? newState.currentYear - 1 : newState.currentYear;

        // Perform archive logic
        const newHistory = archiveSchedule(history, scheduleData.schedule, scheduleData.stats, prevMonth, prevYear);

        // Update state
        setHistory(newHistory);
        setScheduleData({ schedule: [], stats: {} });
        setAvailability({});

        const today = getTodayDateString();
        setLastArchiveCheck(today);

        // Save everything to storage
        Promise.all([
            storage.set('sh_history', newHistory),
            storage.set('sh_schedule', { schedule: [], stats: {} }),
            storage.set('sh_availability', {}),
            storage.set('sh_last_archive_check', today)
        ]);
      }
    };

    checkScheduleState();
    const interval = setInterval(checkScheduleState, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isLoading, scheduleData, history, lastArchiveCheck]);

  const handlePinSubmit = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '2519') {
          setIsAuthenticated(true);
        } else {
          setError('Invalid PIN');
          setTimeout(() => {
            setPin('');
            setError('');
          }, 1000);
        }
      }
    }
  };

  const handleSaveAvailability = async (newAvailability) => {
    if (scheduleState.isLocked) {
      return; // Prevent changes when locked
    }

    setAvailability(newAvailability);
    await storage.set('sh_availability', newAvailability);

    // Regenerate schedule automatically when preferences change
    handleGenerateSchedule(newAvailability);
  };

  const handleGenerateSchedule = async (currentAvailability = availability) => {
    if (scheduleState.isLocked) {
      return; // Prevent regeneration when locked
    }

    const now = new Date();
    const targetMonth = now.getMonth() + 1; // Always planning for next month
    const targetYear = now.getFullYear() + (targetMonth > 11 ? 1 : 0);
    const adjustedMonth = targetMonth % 12;

    const result = generateSchedule(targetYear, adjustedMonth, STAFF, currentAvailability);
    setScheduleData(result);
    await storage.set('sh_schedule', result);
  };

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <div className="glass-card" style={{ textAlign: 'center', marginTop: '10vh' }}>
          <h1 style={{ marginBottom: '2rem' }}>Shift Harmony</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: pin.length > i ? 'var(--primary)' : 'var(--muted)',
                  border: '1px solid var(--border)'
                }}
              />
            ))}
          </div>
          {error && <p style={{ color: 'var(--destructive)', marginBottom: '1rem' }}>{error}</p>}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            maxWidth: '240px',
            margin: '0 auto'
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'C'].map((btn, i) => (
              <button
                key={i}
                onClick={() => {
                  if (btn === 'C') setPin('');
                  else if (btn !== '') handlePinSubmit(btn.toString());
                }}
                style={{
                  height: '60px',
                  fontSize: '1.2rem',
                  backgroundColor: btn === '' ? 'transparent' : 'var(--card)',
                  color: 'var(--foreground)',
                  boxShadow: btn === '' ? 'none' : 'var(--shadow-soft)',
                  visibility: btn === '' ? 'hidden' : 'visible'
                }}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
      return (
          <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <div style={{ color: 'var(--foreground)' }}>Loading...</div>
          </div>
      );
  }

  return (
    <div className="app-container">
      <div style={{ textAlign: 'center', marginBottom: 'calc(var(--spacing-base) * 2)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>VKS Shift Planner</h1>
        <Countdown deadlineDay={20} />
      </div>

      {scheduleState.isLocked && (
        <div className="glass-card" style={{
          padding: '12px',
          marginBottom: 'calc(var(--spacing-base) * 4)',
          backgroundColor: 'rgba(251, 146, 60, 0.1)',
          border: '1px solid var(--primary)'
        }}>
          <p style={{ margin: 0, textAlign: 'center', fontSize: '0.85rem', color: 'var(--foreground)' }}>
            📋 {scheduleState.lockMessage}
          </p>
        </div>
      )}

      <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
        <Tab id="availability" label="Availability">
          <AvailabilityTab
            staff={STAFF}
            availability={availability}
            onSave={handleSaveAvailability}
            isLocked={scheduleState.isLocked}
          />
        </Tab>
        <Tab id="schedule" label="Schedule">
          <ScheduleTab
            schedule={scheduleData.schedule}
            stats={scheduleData.stats}
            staff={STAFF}
            onGenerate={() => handleGenerateSchedule()}
            isLocked={scheduleState.isLocked}
          />
        </Tab>
        <Tab id="history" label="History">
          <HistoryTab
            history={history}
            staff={STAFF}
          />
        </Tab>
      </Tabs>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          onClick={() => setIsAuthenticated(false)}
          style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', background: 'none', border: 'none', textDecoration: 'underline' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
