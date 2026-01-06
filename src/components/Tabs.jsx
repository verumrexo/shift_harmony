import React from 'react';

const Tabs = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="tabs-container">
            <div className="tabs-header glass-card" style={{
                display: 'flex',
                padding: '4px',
                gap: '4px',
                marginBottom: 'calc(var(--spacing-base) * 4)'
            }}>
                {React.Children.map(children, (child) => (
                    <button
                        onClick={() => onTabChange(child.props.id)}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: activeTab === child.props.id ? 'var(--primary)' : 'transparent',
                            color: activeTab === child.props.id ? 'white' : 'var(--muted-foreground)',
                            fontSize: '0.9rem',
                            fontWeight: activeTab === child.props.id ? '700' : '400'
                        }}
                    >
                        {child.props.label}
                    </button>
                ))}
            </div>
            <div className="tabs-content">
                {React.Children.toArray(children).find(child => child.props.id === activeTab)}
            </div>
        </div>
    );
};

const Tab = ({ children }) => {
    return <>{children}</>;
};

export { Tabs, Tab };
