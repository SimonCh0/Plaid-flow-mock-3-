import React, { useState, useEffect } from 'react';

// Mock data for subscriptions - some with incomplete/unclear merchant names
const mockSubscriptions = [
  { id: 1, name: 'ChatGPT', icon: '🤖', amount: 15.99, cycle: 'Monthly', nextRenewal: '26 Dec 2025', complete: true, category: 'AI Tools', paymentMethod: 'Credit Card', source: 'bank1' },
  { id: 2, name: 'Google Gemini', icon: '✨', amount: 24.99, cycle: 'Monthly', nextRenewal: '26 Dec 2025', complete: true, category: 'AI Tools', paymentMethod: 'Credit Card', source: 'bank1' },
  { id: 3, name: 'Apple Subscription', icon: '🍎', amount: 75.99, cycle: null, nextRenewal: '11 Mar 2027', complete: false, category: null, paymentMethod: null, needsName: true, source: 'bank1' },
  { id: 4, name: 'PlayStation Plus', icon: '🎮', amount: 9.99, cycle: 'Monthly', nextRenewal: '5 Jan 2026', complete: false, category: null, paymentMethod: null, source: 'bank1' },
  { id: 5, name: 'Apple Music', icon: '🎧', amount: 7.99, cycle: 'Monthly', nextRenewal: '26 Dec 2025', complete: true, category: 'Entertainment', paymentMethod: 'Apple Pay', source: 'bank1' },
  { id: 6, name: 'UNKNOWN MERCHANT', icon: '❓', amount: 7.99, cycle: 'Monthly', nextRenewal: '26 Dec 2025', complete: false, category: null, paymentMethod: null, needsName: true, source: 'bank1' },
];

// Subscriptions found from second bank - includes duplicates and new ones
const mockBank2Subscriptions = [
  { id: 101, name: 'Netflix', icon: '🎬', amount: 15.99, cycle: 'Monthly', nextRenewal: '1 Feb 2026', complete: true, category: 'Entertainment', paymentMethod: null, source: 'bank2', isNew: true },
  { id: 102, name: 'Hulu', icon: '📺', amount: 17.99, cycle: 'Monthly', nextRenewal: '15 Jan 2026', complete: true, category: 'Entertainment', paymentMethod: null, source: 'bank2', isNew: true },
  { id: 103, name: 'ChatGPT', icon: '🤖', amount: 15.99, cycle: 'Monthly', nextRenewal: '26 Dec 2025', complete: true, category: 'AI Tools', paymentMethod: null, source: 'bank2', isDuplicate: true, duplicateOf: 1 },
  { id: 104, name: 'Spotify', icon: '🎵', amount: 10.99, cycle: 'Monthly', nextRenewal: '20 Jan 2026', complete: true, category: 'Entertainment', paymentMethod: null, source: 'bank2', isNew: true },
  { id: 105, name: 'Apple Music', icon: '🎧', amount: 10.99, cycle: 'Monthly', nextRenewal: '26 Dec 2025', complete: true, category: 'Entertainment', paymentMethod: null, source: 'bank2', isPossibleDuplicate: true, duplicateOf: 5, priceDiff: true },
];

const banks = [
  { name: 'Wells Fargo', url: 'wellsfargo.com', color: '#D71E28' },
  { name: 'Huntington Bank', url: 'huntington.com', color: '#00693E' },
  { name: 'Ally', url: 'ally.com', color: '#650360' },
  { name: 'American Express', url: 'amex.com', color: '#006FCF' },
  { name: 'USAA', url: 'usaa.com', color: '#1B3A6D' },
  { name: 'Fidelity', url: 'fidelity.com', color: '#4A8F47' },
  { name: 'Discover', url: 'discover.com', color: '#FF6600' },
];

const categories = ['Entertainment', 'AI Tools', 'Games', 'Productivity', 'Health', 'News', 'Cloud Storage', 'Other'];
const paymentMethods = ['Credit Card', 'PayPal', 'Apple Pay', 'iCloud', 'Revolut', 'Bank Transfer'];

// Known subscriptions database for autocomplete
const knownSubscriptions = [
  { name: 'Netflix', icon: '🎬', category: 'Entertainment', defaultAmount: 15.99, cycle: 'Monthly' },
  { name: 'Spotify', icon: '🎵', category: 'Entertainment', defaultAmount: 10.99, cycle: 'Monthly' },
  { name: 'Apple Music', icon: '🎧', category: 'Entertainment', defaultAmount: 10.99, cycle: 'Monthly' },
  { name: 'YouTube Premium', icon: '▶️', category: 'Entertainment', defaultAmount: 13.99, cycle: 'Monthly' },
  { name: 'Disney+', icon: '🏰', category: 'Entertainment', defaultAmount: 13.99, cycle: 'Monthly' },
  { name: 'HBO Max', icon: '📺', category: 'Entertainment', defaultAmount: 15.99, cycle: 'Monthly' },
  { name: 'Hulu', icon: '📺', category: 'Entertainment', defaultAmount: 17.99, cycle: 'Monthly' },
  { name: 'Amazon Prime', icon: '📦', category: 'Entertainment', defaultAmount: 14.99, cycle: 'Monthly' },
  { name: 'ChatGPT Plus', icon: '🤖', category: 'AI Tools', defaultAmount: 20.00, cycle: 'Monthly' },
  { name: 'Claude Pro', icon: '🧠', category: 'AI Tools', defaultAmount: 20.00, cycle: 'Monthly' },
  { name: 'Midjourney', icon: '🎨', category: 'AI Tools', defaultAmount: 10.00, cycle: 'Monthly' },
  { name: 'Adobe Creative Cloud', icon: '🎨', category: 'Productivity', defaultAmount: 54.99, cycle: 'Monthly' },
  { name: 'Microsoft 365', icon: '📊', category: 'Productivity', defaultAmount: 9.99, cycle: 'Monthly' },
  { name: 'Notion', icon: '📝', category: 'Productivity', defaultAmount: 10.00, cycle: 'Monthly' },
  { name: 'Dropbox', icon: '📁', category: 'Cloud Storage', defaultAmount: 11.99, cycle: 'Monthly' },
  { name: 'iCloud+', icon: '☁️', category: 'Cloud Storage', defaultAmount: 2.99, cycle: 'Monthly' },
  { name: 'Google One', icon: '☁️', category: 'Cloud Storage', defaultAmount: 2.99, cycle: 'Monthly' },
  { name: 'PlayStation Plus', icon: '🎮', category: 'Games', defaultAmount: 9.99, cycle: 'Monthly' },
  { name: 'Xbox Game Pass', icon: '🎮', category: 'Games', defaultAmount: 14.99, cycle: 'Monthly' },
  { name: 'Nintendo Switch Online', icon: '🎮', category: 'Games', defaultAmount: 3.99, cycle: 'Monthly' },
  { name: 'Headspace', icon: '🧘', category: 'Health', defaultAmount: 12.99, cycle: 'Monthly' },
  { name: 'Calm', icon: '🧘', category: 'Health', defaultAmount: 14.99, cycle: 'Monthly' },
  { name: 'Peloton', icon: '🚴', category: 'Health', defaultAmount: 44.00, cycle: 'Monthly' },
  { name: 'NYT Digital', icon: '📰', category: 'News', defaultAmount: 17.00, cycle: 'Monthly' },
  { name: 'WSJ', icon: '📰', category: 'News', defaultAmount: 38.99, cycle: 'Monthly' },
];

export default function OrbitPrototype() {
  const [currentScreen, setCurrentScreen] = useState('sources');
  const [selectedSubs, setSelectedSubs] = useState(mockSubscriptions.map(s => s.id)); // Auto-select all
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [editingSub, setEditingSub] = useState(null);
  const [manualEditSub, setManualEditSub] = useState(null); // For quick manual edits
  const [plaidStep, setPlaidStep] = useState(0);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showExpanded, setShowExpanded] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationSubId, setNotificationSubId] = useState(null);
  const [quickEditField, setQuickEditField] = useState(null); // { subId, field }
  const [showCategoryPopup, setShowCategoryPopup] = useState(null); // subId for which to show popup
  
  // Track connected sources and existing subscriptions
  const [connectedSources, setConnectedSources] = useState({ bank: false, email: false });
  const [connectedBanks, setConnectedBanks] = useState([]); // Array of connected bank names
  const [existingSubscriptions, setExistingSubscriptions] = useState([]); // Already saved subs
  const [isAddingMore, setIsAddingMore] = useState(false); // Are we in "add more" flow?
  const [bank2Subs, setBank2Subs] = useState(mockBank2Subscriptions); // Subs from second bank
  const [selectedBank2Subs, setSelectedBank2Subs] = useState([]); // Selected new subs from bank 2
  const [resolvedDuplicates, setResolvedDuplicates] = useState({}); // { subId: 'keep' | 'skip' | 'merge' }
  
  // Mock free trials data
  const [freeTrials, setFreeTrials] = useState([
    { id: 101, name: 'Netflix', icon: '🎬', expiresIn: 5, expiryDate: '15 Jan 2026', amount: 15.99, cycle: 'Monthly' },
    { id: 102, name: 'YouTube Premium', icon: '▶️', expiresIn: 12, expiryDate: '22 Jan 2026', amount: 13.99, cycle: 'Monthly' },
  ]);

  const totalMonthly = subscriptions
    .filter(s => selectedSubs.includes(s.id))
    .reduce((sum, s) => sum + (s.cycle === 'Monthly' ? s.amount : (s.cycle === 'Annually' ? s.amount / 12 : s.amount)), 0);
  
  const totalYearly = subscriptions
    .filter(s => selectedSubs.includes(s.id))
    .reduce((sum, s) => sum + (s.cycle === 'Annually' ? s.amount : (s.cycle === 'Monthly' ? s.amount * 12 : s.amount)), 0);

  const completeSubs = subscriptions.filter(s => s.complete && selectedSubs.includes(s.id));
  const incompleteSubs = subscriptions.filter(s => !s.complete && selectedSubs.includes(s.id));
  const removedSubs = subscriptions.filter(s => !selectedSubs.includes(s.id));

  // Phone frame wrapper
  const PhoneFrame = ({ children }) => (
    <div style={{
      width: '100%',
      maxWidth: '420px',
      margin: '0 auto',
      background: 'linear-gradient(145deg, #f0f4f8 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Status bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px 8px',
        background: currentScreen === 'sources' || currentScreen === 'confirmation' || currentScreen === 'privacy' 
          ? 'linear-gradient(180deg, #0095FF 0%, #0080E6 100%)' 
          : '#fff',
        color: currentScreen === 'sources' || currentScreen === 'confirmation' || currentScreen === 'privacy' ? '#fff' : '#000',
      }}>
        <span style={{ fontWeight: 600, fontSize: '15px' }}>9:41</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
            <rect x="0" y="3" width="3" height="9" rx="1"/>
            <rect x="5" y="2" width="3" height="10" rx="1"/>
            <rect x="10" y="0" width="3" height="12" rx="1"/>
            <rect x="15" y="0" width="3" height="12" rx="1"/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
            <path d="M8 2.4C5.6 2.4 3.4 3.2 1.6 4.8L0 3.2C2.2 1.2 5 0 8 0C11 0 13.8 1.2 16 3.2L14.4 4.8C12.6 3.2 10.4 2.4 8 2.4Z"/>
            <path d="M8 6C6.4 6 4.9 6.6 3.7 7.6L2.1 6C3.7 4.6 5.8 3.6 8 3.6C10.2 3.6 12.3 4.6 13.9 6L12.3 7.6C11.1 6.6 9.6 6 8 6Z"/>
            <path d="M8 9.6C7.2 9.6 6.5 9.9 5.9 10.4L8 12L10.1 10.4C9.5 9.9 8.8 9.6 8 9.6Z"/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
            <rect x="0" y="0" width="22" height="12" rx="3" stroke="currentColor" strokeWidth="1" fill="none"/>
            <rect x="2" y="2" width="16" height="8" rx="1"/>
            <rect x="23" y="4" width="2" height="4" rx="0.5"/>
          </svg>
        </div>
      </div>
      {children}
    </div>
  );

  // Navigation header
  const NavHeader = ({ title, onBack, light = false }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '16px 20px',
      background: light ? 'transparent' : '#fff',
      borderBottom: light ? 'none' : '1px solid #E8EDF2',
    }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            marginLeft: '-8px',
            marginRight: '8px',
            color: light ? '#fff' : '#1a1a2e',
          }}
        >
          <svg width="10" height="18" viewBox="0 0 10 18" fill="currentColor">
            <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </button>
      )}
      <h1 style={{
        flex: 1,
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 600,
        color: light ? '#fff' : '#1a1a2e',
        margin: 0,
        marginRight: onBack ? '26px' : 0,
      }}>{title}</h1>
    </div>
  );

  // Primary button
  const PrimaryButton = ({ children, onClick, disabled, style = {} }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '18px 24px',
        background: disabled 
          ? 'linear-gradient(135deg, #94c4f4 0%, #a8d0f8 100%)' 
          : 'linear-gradient(135deg, #0095FF 0%, #0077CC 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '16px',
        fontSize: '17px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 4px 16px rgba(0, 149, 255, 0.3)',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {children}
    </button>
  );

  // Secondary button
  const SecondaryButton = ({ children, onClick, style = {} }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '18px 24px',
        background: '#fff',
        color: '#0095FF',
        border: '2px solid #E8EDF2',
        borderRadius: '16px',
        fontSize: '17px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {children}
    </button>
  );

  // Screen 1: Connect Sources (handles both first-time and add-more)
  const SourcesScreen = () => {
    const hasExistingSubs = existingSubscriptions.length > 0;
    
    return (
      <div style={{
        background: 'linear-gradient(180deg, #0095FF 0%, #0080E6 50%, #E8F4FF 50%, #F5F9FC 100%)',
        minHeight: 'calc(100vh - 44px)',
        padding: '0 20px 40px',
      }}>
        {/* Back button if adding more */}
        {isAddingMore && (
          <button
            onClick={() => { setIsAddingMore(false); setCurrentScreen('confirmation'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#fff',
              padding: '16px 0',
              cursor: 'pointer',
              fontSize: '15px',
            }}
          >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="#fff">
              <path d="M9 1L1 9L9 17" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
            Back
          </button>
        )}
        
        <div style={{ paddingTop: isAddingMore ? '0' : '20px', paddingBottom: '20px' }}>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            {isAddingMore ? 'Add more subscriptions' : 'Connect your sources'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', margin: 0 }}>
            {isAddingMore 
              ? `You have ${existingSubscriptions.length} subscriptions tracked` 
              : "Choose how you'd like to import your subscriptions"}
          </p>
        </div>

        {/* Connected banks indicator */}
        {connectedSources.bank && connectedBanks.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
              <path d="M9 12L11 14L15 10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="none"/>
            </svg>
            <span style={{ color: '#fff', fontSize: '14px' }}>
              {connectedBanks.length} bank{connectedBanks.length !== 1 ? 's' : ''} connected: {connectedBanks.join(', ')}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Bank via Plaid */}
          <button
            onClick={() => setCurrentScreen('privacy')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px',
              background: '#fff',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              textAlign: 'left',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: connectedSources.bank ? '#E6FAF0' : 'linear-gradient(135deg, #E8F4FF 0%, #D6ECFF 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
            }}>
              {connectedSources.bank ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#00B860">
                  <path d="M9 12L11 14L15 10" stroke="#00B860" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="3" y="6" width="18" height="13" rx="2" stroke="#00B860" strokeWidth="2" fill="none"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#0095FF">
                  <rect x="3" y="6" width="18" height="13" rx="2" stroke="#0095FF" strokeWidth="2" fill="none"/>
                  <path d="M3 10H21" stroke="#0095FF" strokeWidth="2"/>
                  <rect x="6" y="14" width="4" height="2" rx="1" fill="#0095FF"/>
                </svg>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '17px', fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>
                {connectedSources.bank ? 'Connect another bank' : 'Bank via (Plaid)'}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7A8F' }}>
                {connectedSources.bank 
                  ? 'Add accounts from a different bank'
                  : 'Automatically detect recurring charges from your bank account'}
              </div>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="#C4CDD5">
              <path d="M1 1L7 7L1 13" stroke="#C4CDD5" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Connect Email - highlight free trials */}
          <button
            onClick={() => setCurrentScreen('emailConnect')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px',
              background: '#fff',
              border: isAddingMore && !connectedSources.email ? '2px solid #0095FF' : 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              textAlign: 'left',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: connectedSources.email ? '#E6FAF0' : 'linear-gradient(135deg, #E8F4FF 0%, #D6ECFF 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={connectedSources.email ? '#00B860' : '#0095FF'}>
                <rect x="2" y="4" width="20" height="16" rx="2" stroke={connectedSources.email ? '#00B860' : '#0095FF'} strokeWidth="2" fill="none"/>
                <path d="M2 6L12 13L22 6" stroke={connectedSources.email ? '#00B860' : '#0095FF'} strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '17px', fontWeight: 600, color: '#1a1a2e' }}>
                  Connect Email
                </span>
                {!connectedSources.email && (
                  <span style={{
                    padding: '2px 8px',
                    background: '#FFF4E5',
                    color: '#F5A623',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '10px',
                  }}>
                    Finds free trials
                  </span>
                )}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7A8F' }}>
                {connectedSources.email 
                  ? 'Email connected' 
                  : 'Scan your inbox for subscription receipts & free trials'}
              </div>
              {connectedSources.email && (
                <div style={{ fontSize: '12px', color: '#00B860', marginTop: '4px' }}>
                  ✓ Connected
                </div>
              )}
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="#C4CDD5">
              <path d="M1 1L7 7L1 13" stroke="#C4CDD5" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Upload CSV/PDF */}
          <button
            onClick={() => {}}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px',
              background: '#fff',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              textAlign: 'left',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #E8F4FF 0%, #D6ECFF 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0095FF">
                <rect x="4" y="2" width="16" height="20" rx="2" stroke="#0095FF" strokeWidth="2" fill="none"/>
                <path d="M12 8V14M9 11L12 8L15 11" stroke="#0095FF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '17px', fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>
                Upload CSV / PDF
              </div>
              <div style={{ fontSize: '14px', color: '#6B7A8F' }}>
                Add bank statements or screenshots
              </div>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="#C4CDD5">
              <path d="M1 1L7 7L1 13" stroke="#C4CDD5" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Add Manually */}
          <button
            onClick={() => setCurrentScreen('addManual')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px',
              background: '#fff',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              textAlign: 'left',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #E8F4FF 0%, #D6ECFF 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0095FF">
                <path d="M12 5V19M5 12H19" stroke="#0095FF" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '17px', fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>
                Add Manually
              </div>
              <div style={{ fontSize: '14px', color: '#6B7A8F' }}>
                Enter subscriptions yourself with full control over details
              </div>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="#C4CDD5">
              <path d="M1 1L7 7L1 13" stroke="#C4CDD5" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {!isAddingMore && (
          <button
            onClick={() => setCurrentScreen('confirmation')}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              padding: '20px',
              background: 'none',
              border: 'none',
              color: '#0095FF',
              fontSize: '17px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '24px',
            }}
          >
            Skip for now
          </button>
        )}
      </div>
    );
  };

  // Screen 2: Privacy & Data Disclaimer (NEW)
  const PrivacyScreen = () => (
    <div style={{
      background: 'linear-gradient(180deg, #0095FF 0%, #0080E6 40%, #F5F9FC 40%)',
      minHeight: 'calc(100vh - 44px)',
    }}>
      <NavHeader title="" onBack={() => setCurrentScreen('sources')} light />
      
      <div style={{ padding: '0 20px 40px' }}>
        <div style={{ textAlign: 'center', paddingBottom: '30px', marginTop: '-10px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            backdropFilter: 'blur(10px)',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke="#fff" strokeWidth="2" fill="none"/>
              <path d="M9 12L11 14L15 10" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
            Your data is protected
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: 0 }}>
            Here's how we keep your information safe
          </p>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Security point 1 */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: '#E6FAF0',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#00B860">
                  <rect x="3" y="11" width="18" height="10" rx="2" stroke="#00B860" strokeWidth="2" fill="none"/>
                  <path d="M7 11V7C7 4.2 9.2 2 12 2C14.8 2 17 4.2 17 7V11" stroke="#00B860" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>
                  End-to-end encryption
                </div>
                <div style={{ fontSize: '14px', color: '#6B7A8F', lineHeight: '1.5' }}>
                  Your bank credentials are encrypted and never stored on our servers
                </div>
              </div>
            </div>

            {/* Security point 2 */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: '#E6FAF0',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#00B860">
                  <circle cx="12" cy="12" r="10" stroke="#00B860" strokeWidth="2" fill="none"/>
                  <path d="M12 8V12L15 15" stroke="#00B860" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>
                  Read-only access
                </div>
                <div style={{ fontSize: '14px', color: '#6B7A8F', lineHeight: '1.5' }}>
                  We can only view transactions — we can never move money or make changes
                </div>
              </div>
            </div>

            {/* Security point 3 */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: '#E6FAF0',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#00B860">
                  <path d="M9 12L11 14L15 10" stroke="#00B860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="#00B860" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>
                  Only subscription data
                </div>
                <div style={{ fontSize: '14px', color: '#6B7A8F', lineHeight: '1.5' }}>
                  We only extract recurring charges — not your balance, spending habits, or other transactions
                </div>
              </div>
            </div>

            {/* Security point 4 */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: '#E6FAF0',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#00B860">
                  <path d="M19 21H5C4.4 21 4 20.6 4 20V4C4 3.4 4.4 3 5 3H14L20 9V20C20 20.6 19.6 21 19 21Z" stroke="#00B860" strokeWidth="2" fill="none"/>
                  <path d="M14 3V9H20" stroke="#00B860" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>
                  Powered by Plaid
                </div>
                <div style={{ fontSize: '14px', color: '#6B7A8F', lineHeight: '1.5' }}>
                  Trusted by thousands of apps including Venmo, Coinbase, and Robinhood
                </div>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#F5F9FC',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#6B7A8F">
              <circle cx="12" cy="12" r="10" stroke="#6B7A8F" strokeWidth="2" fill="none"/>
              <path d="M12 8V12" stroke="#6B7A8F" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#6B7A8F"/>
            </svg>
            <span style={{ fontSize: '13px', color: '#6B7A8F', flex: 1 }}>
              You can disconnect your bank at any time in settings
            </span>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <PrimaryButton onClick={() => { setPlaidStep(0); setCurrentScreen('plaid'); }}>
            Continue to connect bank
          </PrimaryButton>
        </div>

        <button
          onClick={() => setCurrentScreen('sources')}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            padding: '16px',
            background: 'none',
            border: 'none',
            color: '#6B7A8F',
            fontSize: '15px',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          View full privacy policy
        </button>
      </div>
    </div>
  );

  // Screen 3: Plaid Flow
  const PlaidScreen = () => {
    const steps = [
      // Step 0: Intro
      <div key="intro" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{
          width: '120px',
          height: '120px',
          margin: '40px auto 30px',
          background: '#F5F7FA',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="#1a1a2e">
            <rect x="2" y="3" width="20" height="14" rx="2" stroke="#1a1a2e" strokeWidth="1.5" fill="none"/>
            <rect x="5" y="19" width="14" height="2" rx="1" fill="#1a1a2e"/>
            <circle cx="7" cy="10" r="2" fill="#0095FF"/>
            <rect x="11" y="8" width="8" height="1.5" rx="0.5" fill="#E8EDF2"/>
            <rect x="11" y="11" width="5" height="1.5" rx="0.5" fill="#E8EDF2"/>
          </svg>
        </div>
        <p style={{ fontSize: '15px', color: '#1a1a2e', marginBottom: '8px' }}>
          This application uses <strong>Plaid</strong> to link your bank
        </p>
        <div style={{ textAlign: 'left', padding: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#00B860" style={{ marginTop: '2px' }}>
              <path d="M9 12L11 14L15 10" stroke="#00B860" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div>
              <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>Secure</div>
              <div style={{ fontSize: '13px', color: '#6B7A8F' }}>
                Transfer of your bank data is encrypted end-to-end
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#00B860" style={{ marginTop: '2px' }}>
              <path d="M9 12L11 14L15 10" stroke="#00B860" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div>
              <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>Private</div>
              <div style={{ fontSize: '13px', color: '#6B7A8F' }}>
                This application will never be able to access your credentials
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#6B7A8F', marginBottom: '20px' }}>
          By selecting "Continue," you agree to the <span style={{ color: '#0095FF' }}>Plaid Privacy Policy</span>
        </div>
        <PrimaryButton onClick={() => setPlaidStep(1)}>Continue</PrimaryButton>
      </div>,
      
      // Step 1: Bank Selection
      <div key="banks" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '20px' }}>Select your bank</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          background: '#F5F7FA',
          borderRadius: '12px',
          marginBottom: '20px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#6B7A8F" style={{ marginRight: '12px' }}>
            <circle cx="11" cy="11" r="8" stroke="#6B7A8F" strokeWidth="2" fill="none"/>
            <path d="M21 21L16.5 16.5" stroke="#6B7A8F" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ color: '#6B7A8F' }}>Search</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {banks.map((bank, i) => (
            <button
              key={i}
              onClick={() => { setSelectedBank(bank); setPlaidStep(2); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                background: '#fff',
                border: 'none',
                borderBottom: '1px solid #E8EDF2',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                background: bank.color,
                borderRadius: '10px',
                marginRight: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
              }}>
                {bank.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{bank.name}</div>
                <div style={{ fontSize: '13px', color: '#6B7A8F' }}>{bank.url}</div>
              </div>
            </button>
          ))}
        </div>
      </div>,
      
      // Step 2: Credentials
      <div key="credentials" style={{ padding: '24px' }}>
        {selectedBank && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: selectedBank.color,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
              }}>
                {selectedBank.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{selectedBank.name}</div>
                <div style={{ fontSize: '13px', color: '#6B7A8F' }}>{selectedBank.url}</div>
              </div>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '24px' }}>Enter your credentials</h2>
            <input
              type="text"
              placeholder="Username"
              style={{
                width: '100%',
                padding: '16px',
                border: '1px solid #E8EDF2',
                borderRadius: '12px',
                fontSize: '16px',
                marginBottom: '12px',
                boxSizing: 'border-box',
              }}
            />
            <input
              type="password"
              placeholder="Password"
              style={{
                width: '100%',
                padding: '16px',
                border: '1px solid #E8EDF2',
                borderRadius: '12px',
                fontSize: '16px',
                marginBottom: '24px',
                boxSizing: 'border-box',
              }}
            />
            <PrimaryButton onClick={() => setPlaidStep(3)}>Continue</PrimaryButton>
            <button style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              padding: '16px',
              background: 'none',
              border: 'none',
              color: '#0095FF',
              fontSize: '15px',
              cursor: 'pointer',
              marginTop: '8px',
            }}>
              Reset password
            </button>
          </>
        )}
      </div>,
      
      // Step 3: Success
      <div key="success" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{
          width: '100px',
          height: '100px',
          margin: '60px auto 30px',
          background: '#E6FAF0',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="#00B860">
            <path d="M9 12L11 14L15 10" stroke="#00B860" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: '#1a1a2e' }}>Success!</h2>
        <p style={{ fontSize: '15px', color: '#6B7A8F', marginBottom: '40px' }}>
          Your account has successfully been linked to this application.
        </p>
        <PrimaryButton onClick={() => {
          // If adding more, merge new subs with existing and go to Found
          if (isAddingMore) {
            // Add bank2 subs (simulating new source) to existing subscriptions
            const newSubs = mockBank2Subscriptions.filter(s => s.isNew || s.isPossibleDuplicate);
            setSubscriptions(prev => [...prev, ...newSubs]);
            setSelectedSubs(prev => [...prev, ...newSubs.map(s => s.id)]);
            setConnectedBanks(prev => [...prev, selectedBank?.name || 'New Bank']);
            setConnectedSources(prev => ({ ...prev, bank: true }));
            setIsAddingMore(false);
          } else {
            setConnectedSources(prev => ({ ...prev, bank: true }));
            setConnectedBanks([selectedBank?.name || 'Bank']);
          }
          setCurrentScreen('found');
        }}>Continue</PrimaryButton>
      </div>,
    ];

    return (
      <div style={{
        background: '#fff',
        minHeight: 'calc(100vh - 44px)',
      }}>
        {/* Plaid header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #E8EDF2',
        }}>
          {plaidStep > 0 && plaidStep < 3 ? (
            <button
              onClick={() => setPlaidStep(plaidStep - 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
            >
              <svg width="10" height="18" viewBox="0 0 10 18" fill="#1a1a2e">
                <path d="M9 1L1 9L9 17" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </button>
          ) : (
            <div style={{ width: '26px' }} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a1a2e">
              <rect x="4" y="4" width="7" height="7" fill="#1a1a2e"/>
              <rect x="13" y="4" width="7" height="7" fill="#1a1a2e"/>
              <rect x="4" y="13" width="7" height="7" fill="#1a1a2e"/>
              <rect x="13" y="13" width="7" height="7" fill="#1a1a2e"/>
            </svg>
            <span style={{ fontWeight: 600, letterSpacing: '1px' }}>PLAID</span>
          </div>
          <button
            onClick={() => setCurrentScreen('sources')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1a2e">
              <path d="M18 6L6 18M6 6L18 18" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {steps[plaidStep]}
      </div>
    );
  };

  // Screen 4: Found Subscriptions (Redesigned)
  const FoundScreen = () => {
    const [showAllComplete, setShowAllComplete] = useState(false);
    
    // Separate newly added subs from existing
    const newlyAddedSubs = subscriptions.filter(s => s.isNew && selectedSubs.includes(s.id));
    const existingSubs = subscriptions.filter(s => !s.isNew && selectedSubs.includes(s.id));
    
    // Split by complete/incomplete status
    const completeNewSubs = newlyAddedSubs.filter(s => s.complete && s.cycle);
    const incompleteNewSubs = newlyAddedSubs.filter(s => !s.complete || !s.cycle);
    const completeExistingSubs = existingSubs.filter(s => s.complete && s.cycle);
    const incompleteExistingSubs = existingSubs.filter(s => !s.complete || !s.cycle);
    
    const completeSubs = [...completeNewSubs, ...completeExistingSubs];
    const incompleteSubs = [...incompleteNewSubs, ...incompleteExistingSubs];
    
    const visibleCompleteSubs = showAllComplete ? completeSubs : completeSubs.slice(0, 3);
    const hasMoreComplete = completeSubs.length > 3;
    
    return (
      <div style={{
        background: '#F5F9FC',
        minHeight: 'calc(100vh - 44px)',
        paddingBottom: '140px',
      }}>
        <NavHeader title="" onBack={() => setCurrentScreen('plaid')} />
        
        <div style={{ padding: '0 20px' }}>
          {/* Header with larger totals */}
          <div style={{ marginBottom: '24px' }}>
            {newlyAddedSubs.length > 0 ? (
              <>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
                  Added <span style={{ color: '#0095FF' }}>{newlyAddedSubs.length}</span> new subscription{newlyAddedSubs.length !== 1 ? 's' : ''}
                </h1>
                <p style={{ fontSize: '14px', color: '#6B7A8F', marginBottom: '12px' }}>
                  Now tracking {subscriptions.length} total subscriptions
                </p>
              </>
            ) : (
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a2e', marginBottom: '12px' }}>
                Found <span style={{ color: '#0095FF' }}>{subscriptions.length}</span> subscriptions
              </h1>
            )}
            <p style={{ 
              fontSize: '17px', 
              color: '#4A5568',
              margin: 0,
              lineHeight: 1.5,
            }}>
              You're paying <span style={{ fontWeight: 700, color: '#1a1a2e' }}>${totalYearly.toFixed(2)}</span> per year and <span style={{ fontWeight: 700, color: '#1a1a2e' }}>${totalMonthly.toFixed(2)}</span> per month
            </p>
          </div>

          {/* Newly added subscriptions section */}
          {newlyAddedSubs.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '12px',
                padding: '0 4px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0095FF">
                  <path d="M12 5V19M5 12H19" stroke="#0095FF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0095FF' }}>
                  Just added ({newlyAddedSubs.length})
                </span>
              </div>
              {newlyAddedSubs.map(sub => (
                <SubscriptionCardWithRemove key={sub.id} sub={sub} isNew />
              ))}
            </div>
          )}

          {/* Complete subscriptions */}
          {completeExistingSubs.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '12px',
                padding: '0 4px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#00B860">
                  <path d="M9 12L11 14L15 10" stroke="#00B860" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="10" stroke="#00B860" strokeWidth="2" fill="none"/>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#00B860' }}>
                  Ready to go ({completeExistingSubs.length})
                </span>
              </div>
              {(showAllComplete ? completeExistingSubs : completeExistingSubs.slice(0, 3)).map(sub => (
                <SubscriptionCardWithRemove key={sub.id} sub={sub} />
              ))}
              {completeExistingSubs.length > 3 && (
                <button
                  onClick={() => setShowAllComplete(!showAllComplete)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '12px',
                    background: '#fff',
                    border: '1px dashed #D1D9E0',
                    borderRadius: '12px',
                    color: '#0095FF',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginTop: '4px',
                  }}
                >
                  {showAllComplete ? (
                    <>
                      Show less
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#0095FF">
                        <path d="M18 15L12 9L6 15" stroke="#0095FF" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </>
                  ) : (
                    <>
                      Show {completeExistingSubs.length - 3} more
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#0095FF">
                        <path d="M6 9L12 15L18 9" stroke="#0095FF" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Incomplete subscriptions */}
          {incompleteSubs.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '12px',
                padding: '0 4px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F5A623">
                    <circle cx="12" cy="12" r="10" stroke="#F5A623" strokeWidth="2" fill="none"/>
                    <path d="M12 8V12" stroke="#F5A623" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="16" r="1" fill="#F5A623"/>
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#F5A623' }}>
                    Needs attention ({incompleteSubs.length})
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#6B7A8F' }}>
                  Optional
                </span>
              </div>
              
              {/* Enrichment prompt */}
              <div style={{
                background: '#FFF9E6',
                border: '1px solid #F5D98A',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
              }}>
                <div style={{ fontSize: '14px', color: '#8B6914', marginBottom: '4px' }}>
                  Some subscriptions are missing details. You can fix now or complete later.
                </div>
                <div style={{ fontSize: '13px', color: '#A68B2D', marginBottom: '12px' }}>
                  Auto-fill with:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    flex: 1,
                    padding: '10px',
                    background: '#fff',
                    border: '1px solid #E8EDF2',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#6B7A8F">
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#6B7A8F" strokeWidth="2" fill="none"/>
                      <path d="M2 6L12 13L22 6" stroke="#6B7A8F" strokeWidth="2" fill="none"/>
                    </svg>
                    Email
                  </button>
                  <button style={{
                    flex: 1,
                    padding: '10px',
                    background: '#fff',
                    border: '1px solid #E8EDF2',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#6B7A8F">
                      <rect x="4" y="2" width="16" height="20" rx="2" stroke="#6B7A8F" strokeWidth="2" fill="none"/>
                      <path d="M12 8V14M9 11L12 8L15 11" stroke="#6B7A8F" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Upload
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('manual')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#fff',
                      border: '1px solid #E8EDF2',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#6B7A8F">
                      <path d="M15.5 4.5L19.5 8.5M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#6B7A8F" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    </svg>
                    Manual
                  </button>
                </div>
              </div>
              
              {incompleteSubs.map(sub => (
                <SubscriptionCardWithRemove key={sub.id} sub={sub} showMissingInfo />
              ))}
            </div>
          )}

          {/* Removed subscriptions (collapsed) */}
          {removedSubs.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <button
                onClick={() => setShowExpanded(!showExpanded)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <span style={{ fontSize: '14px', color: '#6B7A8F' }}>
                  Removed ({removedSubs.length})
                </span>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="#6B7A8F"
                  style={{ transform: showExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                  <path d="M6 9L12 15L18 9" stroke="#6B7A8F" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              {showExpanded && removedSubs.map(sub => (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#fff',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    opacity: 0.6,
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#F5F7FA',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    marginRight: '12px',
                  }}>
                    {sub.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: '#6B7A8F', fontSize: '15px' }}>{sub.name}</div>
                    <div style={{ fontSize: '13px', color: '#9CA8B8' }}>${sub.amount}/{sub.cycle === 'Monthly' ? 'mo' : 'yr'}</div>
                  </div>
                  <button
                    onClick={() => setSelectedSubs(prev => [...prev, sub.id])}
                    style={{
                      padding: '8px 12px',
                      background: '#E8F4FF',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#0095FF',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Add back
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating CTA area */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 32px',
          background: 'linear-gradient(180deg, transparent 0%, #F5F9FC 30%)',
        }}>
          <button
            onClick={() => { setIsAddingMore(true); setCurrentScreen('sources'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              padding: '12px',
              background: 'none',
              border: 'none',
              color: '#0095FF',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#0095FF">
              <path d="M12 5V19M5 12H19" stroke="#0095FF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add more subscriptions
          </button>
          <PrimaryButton 
            onClick={() => setCurrentScreen('check')}
            disabled={selectedSubs.length === 0}
          >
            Continue with {selectedSubs.length} subscription{selectedSubs.length !== 1 ? 's' : ''}
          </PrimaryButton>
        </div>
      </div>
    );
  };

  // Subscription card with remove button (dash icon)
  const SubscriptionCardWithRemove = ({ sub, showMissingInfo, isNew }) => {
    const getMissingFields = () => {
      const missing = [];
      if (sub.needsName) missing.push('Name unclear');
      if (!sub.cycle) missing.push('Billing cycle');
      if (!sub.category) missing.push('Category');
      if (!sub.paymentMethod) missing.push('Payment method');
      return missing;
    };
    
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '16px',
          background: '#fff',
          borderRadius: '16px',
          marginBottom: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: isNew ? '2px solid #0095FF' : 'none',
        }}
      >
        <div style={{
          width: '48px',
          height: '48px',
          background: sub.needsName ? '#FFF4E5' : (isNew ? '#E8F4FF' : '#F5F7FA'),
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          marginRight: '14px',
        }}>
          {sub.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontWeight: 600, 
            color: sub.needsName ? '#F5A623' : '#1a1a2e', 
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            {sub.name}
            {isNew && (
              <span style={{
                padding: '2px 6px',
                background: '#E8F4FF',
                color: '#0095FF',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: '6px',
              }}>NEW</span>
            )}
            {sub.needsName && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623">
                <circle cx="12" cy="12" r="10" stroke="#F5A623" strokeWidth="2" fill="none"/>
                <path d="M12 8V12" stroke="#F5A623" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="#F5A623"/>
              </svg>
            )}
          </div>
          <div style={{ fontSize: '13px', color: '#6B7A8F' }}>
            ${sub.amount} • {sub.cycle || '? cycle'} • Next: {sub.nextRenewal}
          </div>
          {showMissingInfo && getMissingFields().length > 0 && (
            <div style={{ 
              fontSize: '12px', 
              color: '#F5A623', 
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              Missing: {getMissingFields().join(', ')}
            </div>
          )}
        </div>
        <button
          onClick={() => setSelectedSubs(prev => prev.filter(id => id !== sub.id))}
          style={{
            width: '32px',
            height: '32px',
            background: '#F5F7FA',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '8px',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="3" viewBox="0 0 16 3" fill="#6B7A8F">
            <rect width="16" height="3" rx="1.5" fill="#6B7A8F"/>
          </svg>
        </button>
      </div>
    );
  };

  // Screen 5: Check Data with quick edit and notification popup
  const CheckScreen = () => {
    const selectedSubscriptions = subscriptions.filter(s => selectedSubs.includes(s.id));
    
    return (
      <div style={{
        background: '#F5F9FC',
        minHeight: 'calc(100vh - 44px)',
        paddingBottom: '100px',
      }}>
        <NavHeader title="Check all data" onBack={() => setCurrentScreen('found')} />
        
        <div style={{ padding: '0 20px' }}>
          <p style={{ color: '#6B7A8F', fontSize: '15px', marginBottom: '20px' }}>
            Make sure all the info is right
          </p>

          {selectedSubscriptions.map(sub => {
            const needsAttention = !sub.complete || !sub.category;
            
            return (
              <div
                key={sub.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  border: needsAttention ? '2px solid #F5D98A' : '2px solid transparent',
                }}
              >
                {/* Header with name and actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      background: needsAttention ? '#FFF4E5' : '#F5F7FA',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                    }}>
                      {sub.icon}
                    </div>
                    {quickEditField?.subId === sub.id && quickEditField?.field === 'name' ? (
                      <input
                        autoFocus
                        defaultValue={sub.name}
                        onBlur={(e) => {
                          setSubscriptions(prev => prev.map(s => 
                            s.id === sub.id ? { ...s, name: e.target.value, needsName: false } : s
                          ));
                          setQuickEditField(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setSubscriptions(prev => prev.map(s => 
                              s.id === sub.id ? { ...s, name: e.target.value, needsName: false } : s
                            ));
                            setQuickEditField(null);
                          }
                        }}
                        style={{
                          fontWeight: 600,
                          fontSize: '17px',
                          color: '#1a1a2e',
                          border: '1px solid #0095FF',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          outline: 'none',
                          width: '150px',
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => setQuickEditField({ subId: sub.id, field: 'name' })}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ 
                          fontWeight: 600, 
                          fontSize: '17px', 
                          color: sub.needsName ? '#F5A623' : '#1a1a2e' 
                        }}>
                          {sub.name}
                        </span>
                        {sub.needsName && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#0095FF">
                            <path d="M15.5 4.5L19.5 8.5M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#0095FF" strokeWidth="2" fill="none"/>
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedSubs(prev => prev.filter(id => id !== sub.id))}
                      style={{
                        width: '36px',
                        height: '36px',
                        background: '#FEE8E8',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#E53935">
                        <path d="M6 6L18 18M6 18L18 6" stroke="#E53935" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => { setEditingSub(sub); setCurrentScreen('edit'); }}
                      style={{
                        width: '36px',
                        height: '36px',
                        background: '#E8F4FF',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#0095FF">
                        <path d="M15.5 4.5L19.5 8.5M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#0095FF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Amount - quick edit */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6B7A8F', fontSize: '14px' }}>Amount</span>
                    {quickEditField?.subId === sub.id && quickEditField?.field === 'amount' ? (
                      <input
                        autoFocus
                        type="number"
                        defaultValue={sub.amount}
                        onBlur={(e) => {
                          setSubscriptions(prev => prev.map(s => 
                            s.id === sub.id ? { ...s, amount: parseFloat(e.target.value) || sub.amount } : s
                          ));
                          setQuickEditField(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setSubscriptions(prev => prev.map(s => 
                              s.id === sub.id ? { ...s, amount: parseFloat(e.target.value) || sub.amount } : s
                            ));
                            setQuickEditField(null);
                          }
                        }}
                        style={{
                          width: '80px',
                          padding: '4px 8px',
                          border: '1px solid #0095FF',
                          borderRadius: '6px',
                          textAlign: 'right',
                          fontSize: '14px',
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => setQuickEditField({ subId: sub.id, field: 'amount' })}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#1a1a2e',
                          fontSize: '14px',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        ${sub.amount} USD
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#C4CDD5">
                          <path d="M15.5 4.5L19.5 8.5M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#C4CDD5" strokeWidth="2" fill="none"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Next renewal date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7A8F', fontSize: '14px' }}>Next renewal</span>
                    <span style={{ color: '#1a1a2e', fontSize: '14px', fontWeight: 500 }}>{sub.nextRenewal}</span>
                  </div>
                  
                  {/* Billing Cycle - quick select */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: !sub.cycle ? '#F5A623' : '#6B7A8F', fontSize: '14px' }}>Billing Cycle</span>
                    {quickEditField?.subId === sub.id && quickEditField?.field === 'cycle' ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {['Monthly', 'Annually'].map(cycle => (
                          <button
                            key={cycle}
                            onClick={() => {
                              setSubscriptions(prev => prev.map(s => 
                                s.id === sub.id ? { ...s, cycle } : s
                              ));
                              setQuickEditField(null);
                            }}
                            style={{
                              padding: '4px 12px',
                              background: sub.cycle === cycle ? '#0095FF' : '#F5F7FA',
                              color: sub.cycle === cycle ? '#fff' : '#1a1a2e',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '13px',
                              cursor: 'pointer',
                            }}
                          >
                            {cycle}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => setQuickEditField({ subId: sub.id, field: 'cycle' })}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: sub.cycle ? '#1a1a2e' : '#F5A623',
                          fontSize: '14px',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {sub.cycle || 'Select'}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#C4CDD5">
                          <path d="M6 9L12 15L18 9" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Category - quick select */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: !sub.category ? '#F5A623' : '#6B7A8F', fontSize: '14px' }}>Category</span>
                    {quickEditField?.subId === sub.id && quickEditField?.field === 'category' ? (
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '4px', 
                        justifyContent: 'flex-end',
                        maxWidth: '200px',
                      }}>
                        {categories.slice(0, 4).map(cat => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSubscriptions(prev => prev.map(s => 
                                s.id === sub.id ? { ...s, category: cat, complete: s.paymentMethod ? true : s.complete } : s
                              ));
                              setQuickEditField(null);
                            }}
                            style={{
                              padding: '4px 10px',
                              background: sub.category === cat ? '#0095FF' : '#F5F7FA',
                              color: sub.category === cat ? '#fff' : '#1a1a2e',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => setQuickEditField({ subId: sub.id, field: 'category' })}
                        style={{
                          background: !sub.category ? '#FFF4E5' : 'none',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          color: sub.category ? '#1a1a2e' : '#F5A623',
                          fontSize: '14px',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {sub.category || 'Select'}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill={sub.category ? '#C4CDD5' : '#F5A623'}>
                          <path d="M6 9L12 15L18 9" stroke={sub.category ? '#C4CDD5' : '#F5A623'} strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Payment Method */}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7A8F', fontSize: '14px' }}>Payment Method</span>
                    <span style={{ color: sub.paymentMethod ? '#1a1a2e' : '#C4CDD5', fontSize: '14px', fontWeight: 500 }}>
                      {sub.paymentMethod || '—'}
                    </span>
                  </div>
                  
                  {/* Reminder toggle with popup */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '10px',
                    borderTop: '1px solid #E8EDF2',
                    marginTop: '6px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#6B7A8F">
                        <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#6B7A8F"/>
                      </svg>
                      <span style={{ color: '#6B7A8F', fontSize: '14px' }}>Renewal reminder</span>
                    </div>
                    <button
                      onClick={() => {
                        setNotificationSubId(sub.id);
                        setShowNotificationPopup(true);
                      }}
                      style={{
                        width: '44px',
                        height: '26px',
                        background: sub.reminderEnabled ? '#0095FF' : '#E8EDF2',
                        borderRadius: '13px',
                        position: 'relative',
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        width: '22px',
                        height: '22px',
                        background: '#fff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: sub.reminderEnabled ? '20px' : '2px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        transition: 'left 0.2s',
                      }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating CTA */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 32px',
          background: 'linear-gradient(180deg, transparent 0%, #F5F9FC 20%)',
        }}>
          <PrimaryButton onClick={() => setCurrentScreen('confirmation')}>
            Add {selectedSubs.length} subscription{selectedSubs.length !== 1 ? 's' : ''}
          </PrimaryButton>
        </div>

        {/* Notification Popup */}
        {showNotificationPopup && (
          <NotificationPopup 
            sub={subscriptions.find(s => s.id === notificationSubId)}
            onClose={() => setShowNotificationPopup(false)}
            onSave={(settings) => {
              setSubscriptions(prev => prev.map(s => 
                s.id === notificationSubId 
                  ? { ...s, reminderEnabled: true, reminderDays: settings.days }
                  : s
              ));
              setShowNotificationPopup(false);
            }}
          />
        )}
      </div>
    );
  };

  // Notification settings popup
  const NotificationPopup = ({ sub, onClose, onSave }) => {
    const [selectedDays, setSelectedDays] = useState(3);
    const [notifyPush, setNotifyPush] = useState(true);
    const [notifyEmail, setNotifyEmail] = useState(false);
    
    if (!sub) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px 40px',
          width: '100%',
          maxWidth: '420px',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Renewal reminder</h3>
            <button
              onClick={onClose}
              style={{
                background: '#F5F7FA',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#6B7A8F">
                <path d="M18 6L6 18M6 6L18 18" stroke="#6B7A8F" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          
          <p style={{ color: '#6B7A8F', fontSize: '15px', marginBottom: '20px' }}>
            Get notified before <strong>{sub.name}</strong> renews on {sub.nextRenewal}
          </p>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: '#6B7A8F', marginBottom: '12px' }}>Remind me</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[1, 3, 7, 14].map(days => (
                <button
                  key={days}
                  onClick={() => setSelectedDays(days)}
                  style={{
                    padding: '12px 20px',
                    background: selectedDays === days ? '#0095FF' : '#F5F7FA',
                    color: selectedDays === days ? '#fff' : '#1a1a2e',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {days} day{days > 1 ? 's' : ''} before
                </button>
              ))}
            </div>
          </div>
          
          {/* Notification methods */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', color: '#6B7A8F', marginBottom: '12px' }}>Notify me via</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setNotifyPush(!notifyPush)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 16px',
                  background: '#F5F7FA',
                  border: notifyPush ? '2px solid #0095FF' : '2px solid transparent',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: notifyPush ? '#E8F4FF' : '#E8EDF2',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={notifyPush ? '#0095FF' : '#6B7A8F'}>
                    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill={notifyPush ? '#0095FF' : '#6B7A8F'}/>
                  </svg>
                </div>
                <span style={{ flex: 1, fontWeight: 500, color: '#1a1a2e' }}>Push notification</span>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  border: notifyPush ? 'none' : '2px solid #D1D9E0',
                  background: notifyPush ? '#0095FF' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {notifyPush && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                      <path d="M9 12L11 14L15 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none"/>
                    </svg>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setNotifyEmail(!notifyEmail)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 16px',
                  background: '#F5F7FA',
                  border: notifyEmail ? '2px solid #0095FF' : '2px solid transparent',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: notifyEmail ? '#E8F4FF' : '#E8EDF2',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={notifyEmail ? '#0095FF' : '#6B7A8F'}>
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke={notifyEmail ? '#0095FF' : '#6B7A8F'} strokeWidth="2" fill="none"/>
                    <path d="M2 6L12 13L22 6" stroke={notifyEmail ? '#0095FF' : '#6B7A8F'} strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span style={{ flex: 1, fontWeight: 500, color: '#1a1a2e' }}>Email</span>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  border: notifyEmail ? 'none' : '2px solid #D1D9E0',
                  background: notifyEmail ? '#0095FF' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {notifyEmail && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                      <path d="M9 12L11 14L15 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none"/>
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
          
          <PrimaryButton 
            onClick={() => onSave({ days: selectedDays, push: notifyPush, email: notifyEmail })}
            disabled={!notifyPush && !notifyEmail}
          >
            Set reminder
          </PrimaryButton>
            </div>
          </div>
          
          <PrimaryButton onClick={() => onSave({ days: selectedDays })}>
            Set reminder
          </PrimaryButton>
          
          <button
            onClick={() => {
              setSubscriptions(prev => prev.map(s => 
                s.id === sub.id ? { ...s, reminderEnabled: false } : s
              ));
              onClose();
            }}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              padding: '16px',
              background: 'none',
              border: 'none',
              color: '#6B7A8F',
              fontSize: '15px',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            Turn off reminder
          </button>
        </div>
      </div>
    );
  };

  // Screen 6: Edit Subscription
  const EditScreen = () => {
    if (!editingSub) return null;
    
    return (
      <div style={{
        background: '#F5F9FC',
        minHeight: 'calc(100vh - 44px)',
      }}>
        <NavHeader title="Edit subscription" onBack={() => setCurrentScreen('check')} />
        
        <div style={{ padding: '0 20px 40px' }}>
          {/* Subscription header */}
          <div style={{
            background: 'linear-gradient(135deg, #0077CC 0%, #005599 100%)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
              }}>
                {editingSub.icon}
              </div>
              <span style={{ fontWeight: 600, fontSize: '20px', color: '#fff' }}>{editingSub.name}</span>
            </div>
            <button style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                <path d="M15.5 4.5L19.5 8.5M4 20H8L18.5 9.5C19.3 8.7 19.3 7.3 18.5 6.5L17.5 5.5C16.7 4.7 15.3 4.7 14.5 5.5L4 16V20Z" stroke="#fff" strokeWidth="2" fill="none"/>
              </svg>
            </button>
          </div>

          {/* Paid / Free Trial toggle */}
          <div style={{
            display: 'flex',
            background: '#E8EDF2',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '20px',
          }}>
            <button style={{
              flex: 1,
              padding: '12px',
              background: '#0095FF',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              Paid
            </button>
            <button style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              color: '#6B7A8F',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              Free Trial
            </button>
          </div>

          {/* Form fields */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #E8EDF2' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0095FF" style={{ marginRight: '14px' }}>
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="#0095FF" strokeWidth="2" fill="none"/>
                <path d="M6 10H10" stroke="#0095FF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ flex: 1, color: '#1a1a2e' }}>Amount</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  defaultValue={editingSub.amount}
                  style={{
                    width: '60px',
                    padding: '8px 12px',
                    border: '1px solid #E8EDF2',
                    borderRadius: '8px',
                    textAlign: 'right',
                    fontSize: '15px',
                  }}
                />
                <span style={{
                  padding: '8px 12px',
                  background: '#F5F7FA',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#6B7A8F',
                }}>USD</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #E8EDF2' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0095FF" style={{ marginRight: '14px' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#0095FF" strokeWidth="2" fill="none"/>
                <path d="M3 10H21" stroke="#0095FF" strokeWidth="2"/>
                <path d="M8 2V6M16 2V6" stroke="#0095FF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ flex: 1, color: '#1a1a2e' }}>Next renewal</span>
              <span style={{
                padding: '8px 12px',
                background: '#F5F7FA',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1a1a2e',
              }}>{editingSub.nextRenewal || '5 January 2026'}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0095FF" style={{ marginRight: '14px' }}>
                <circle cx="12" cy="12" r="10" stroke="#0095FF" strokeWidth="2" fill="none"/>
                <path d="M12 6V12L16 14" stroke="#0095FF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ flex: 1, color: '#1a1a2e' }}>Billing Cycle</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', color: '#1a1a2e' }}>{editingSub.cycle}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#C4CDD5">
                  <path d="M6 9L12 15L18 9" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Reminder */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#6B7A8F">
                <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#6B7A8F"/>
              </svg>
              <span style={{ color: '#1a1a2e' }}>Renewal reminder</span>
            </div>
            <div style={{
              width: '44px',
              height: '26px',
              background: '#E8EDF2',
              borderRadius: '13px',
              position: 'relative',
              cursor: 'pointer',
            }}>
              <div style={{
                width: '22px',
                height: '22px',
                background: '#fff',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: '2px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </div>
          </div>

          {/* Category & Payment */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #E8EDF2' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0095FF" style={{ marginRight: '14px' }}>
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="#0095FF" strokeWidth="2" fill="none"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="#0095FF" strokeWidth="2" fill="none"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="#0095FF" strokeWidth="2" fill="none"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="#0095FF" strokeWidth="2" fill="none"/>
              </svg>
              <span style={{ flex: 1, color: '#1a1a2e' }}>Category</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', color: editingSub.category ? '#1a1a2e' : '#0095FF' }}>
                  {editingSub.category || 'Select'}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#C4CDD5">
                  <path d="M6 9L12 15L18 9" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0095FF" style={{ marginRight: '14px' }}>
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="#0095FF" strokeWidth="2" fill="none"/>
                <path d="M2 10H22" stroke="#0095FF" strokeWidth="2"/>
              </svg>
              <span style={{ flex: 1, color: '#1a1a2e' }}>Payment Method</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', color: editingSub.paymentMethod ? '#1a1a2e' : '#0095FF' }}>
                  {editingSub.paymentMethod || 'Select'}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#C4CDD5">
                  <path d="M6 9L12 15L18 9" stroke="#C4CDD5" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          <PrimaryButton onClick={() => setCurrentScreen('check')}>
            Save changes
          </PrimaryButton>
        </div>
      </div>
    );
  };

  // Screen 7: Confirmation
  const ConfirmationScreen = () => {
    const [selectedTrials, setSelectedTrials] = useState(freeTrials.map(t => t.id));
    const hasTrials = connectedSources.email && freeTrials.length > 0;
    
    return (
      <div style={{
        background: 'linear-gradient(180deg, #0095FF 0%, #0080E6 60%, #E8F4FF 60%, #F5F9FC 100%)',
        minHeight: 'calc(100vh - 44px)',
      }}>
        <div style={{ padding: '30px 20px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            You're all set!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', margin: 0 }}>
            You've added {selectedSubs.length} subscription{selectedSubs.length !== 1 ? 's' : ''}{hasTrials ? ` and ${selectedTrials.length} free trial${selectedTrials.length !== 1 ? 's' : ''}` : ''}
          </p>
        </div>

        {/* Orbit animation area */}
        <div style={{
          height: '200px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Orbit rings */}
          <div style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }} />
          
          {/* Center logo */}
          <div style={{
            width: '70px',
            height: '70px',
            background: 'linear-gradient(135deg, #0095FF 0%, #0077CC 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 149, 255, 0.4)',
            zIndex: 1,
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>Orbit</span>
          </div>

          {/* Floating icons */}
          <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{ width: '36px', height: '36px', background: '#1a1a2e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🤖</div>
          </div>
          <div style={{ position: 'absolute', left: '60px', top: '50%', transform: 'translateY(-50%)' }}>
            <div style={{ width: '36px', height: '36px', background: '#1DB954', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎵</div>
          </div>
          <div style={{ position: 'absolute', right: '60px', top: '50%', transform: 'translateY(-50%)' }}>
            <div style={{ width: '36px', height: '36px', background: '#FC3C44', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎧</div>
          </div>
        </div>

        {/* Summary and actions */}
        <div style={{ padding: '0 20px 20px' }}>
          {/* Totals card */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#6B7A8F', marginBottom: '4px' }}>Total per year</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e' }}>${totalYearly.toFixed(2)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', color: '#6B7A8F', marginBottom: '4px' }}>Total per month</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e' }}>${totalMonthly.toFixed(2)}</div>
              </div>
            </div>
            {connectedSources.bank && (
              <div style={{ 
                paddingTop: '12px', 
                borderTop: '1px solid #E8EDF2',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#00B860">
                  <path d="M9 12L11 14L15 10" stroke="#00B860" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: '13px', color: '#00B860' }}>Bank connected — we'll alert you to new subscriptions</span>
              </div>
            )}
          </div>

          {/* Free trials found (if email connected) */}
          {hasTrials && (
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: '2px solid #F5D98A',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: '#FFF4E5',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#F5A623">
                    <circle cx="12" cy="12" r="10" stroke="#F5A623" strokeWidth="2" fill="none"/>
                    <path d="M12 6V12L16 14" stroke="#F5A623" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1a1a2e' }}>Free trials expiring soon</div>
                  <div style={{ fontSize: '13px', color: '#6B7A8F' }}>We'll remind you before they convert</div>
                </div>
              </div>
              
              {freeTrials.map(trial => (
                <div
                  key={trial.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    background: '#FFFBF0',
                    borderRadius: '10px',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#fff',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    marginRight: '12px',
                  }}>
                    {trial.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '15px' }}>{trial.name}</div>
                    <div style={{ fontSize: '13px', color: '#F5A623', fontWeight: 500 }}>
                      Expires in {trial.expiresIn} days → ${trial.amount}/{trial.cycle === 'Monthly' ? 'mo' : 'yr'}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTrials(prev => 
                      prev.includes(trial.id) ? prev.filter(id => id !== trial.id) : [...prev, trial.id]
                    )}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: selectedTrials.includes(trial.id) ? 'none' : '2px solid #D1D9E0',
                      background: selectedTrials.includes(trial.id) ? '#0095FF' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selectedTrials.includes(trial.id) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                        <path d="M9 12L11 14L15 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none"/>
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add free trials prompt (if email NOT connected) */}
          {!connectedSources.email && (
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: '#FFF4E5',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#F5A623">
                    <circle cx="12" cy="12" r="10" stroke="#F5A623" strokeWidth="2" fill="none"/>
                    <path d="M12 8V12L15 15" stroke="#F5A623" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>Track free trials?</div>
                  <div style={{ fontSize: '13px', color: '#6B7A8F' }}>Never miss a trial ending date</div>
                </div>
              </div>
              <button
                onClick={() => { setIsAddingMore(true); setCurrentScreen('sources'); }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#F5F9FC',
                  border: '1px solid #E8EDF2',
                  borderRadius: '10px',
                  color: '#0095FF',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0095FF">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="#0095FF" strokeWidth="2" fill="none"/>
                  <path d="M2 6L12 13L22 6" stroke="#0095FF" strokeWidth="2" fill="none"/>
                </svg>
                Connect email to find trials
              </button>
            </div>
          )}

          <SecondaryButton 
            onClick={() => { 
              setIsAddingMore(true); 
              setExistingSubscriptions(subscriptions.filter(s => selectedSubs.includes(s.id)));
              setConnectedSources(prev => ({ ...prev, bank: true }));
              setCurrentScreen('sources'); 
            }} 
            style={{ marginBottom: '12px' }}
          >
            Add more subscriptions
          </SecondaryButton>
          
          <PrimaryButton onClick={() => alert('Navigate to dashboard')}>
            Continue to dashboard
          </PrimaryButton>
        </div>
      </div>
    );
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'sources': return <SourcesScreen />;
      case 'privacy': return <PrivacyScreen />;
      case 'plaid': return <PlaidScreen />;
      case 'found': return <FoundScreen />;
      case 'foundBank2': return <FoundBank2Screen />;
      case 'foundWithTrials': return <FoundWithTrialsScreen />;
      case 'manual': return <ManualEditScreen />;
      case 'addManual': return <AddManualScreen />;
      case 'emailConnect': return <EmailConnectScreen />;
      case 'check': return <CheckScreen />;
      case 'edit': return <EditScreen />;
      case 'confirmation': return <ConfirmationScreen />;
      case 'allCaughtUp': return <AllCaughtUpScreen />;
      default: return <SourcesScreen />;
    }
  };

  // Screen for Bank 2 results - streamlined for adding more
  const FoundBank2Screen = () => {
    const newSubs = bank2Subs.filter(s => s.isNew);
    const possibleDuplicates = bank2Subs.filter(s => s.isPossibleDuplicate);
    
    // Calculate totals INCLUDING existing subscriptions
    const existingMonthly = existingSubscriptions.reduce((sum, s) => 
      sum + (s.cycle === 'Monthly' ? s.amount : (s.cycle === 'Annually' ? s.amount / 12 : s.amount)), 0);
    const existingYearly = existingSubscriptions.reduce((sum, s) => 
      sum + (s.cycle === 'Annually' ? s.amount : (s.cycle === 'Monthly' ? s.amount * 12 : s.amount)), 0);
    
    const newSelectedSubs = bank2Subs.filter(s => selectedBank2Subs.includes(s.id));
    const newMonthly = newSelectedSubs.reduce((sum, s) => 
      sum + (s.cycle === 'Monthly' ? s.amount : (s.cycle === 'Annually' ? s.amount / 12 : s.amount)), 0);
    const newYearly = newSelectedSubs.reduce((sum, s) => 
      sum + (s.cycle === 'Annually' ? s.amount : (s.cycle === 'Monthly' ? s.amount * 12 : s.amount)), 0);
    
    const combinedMonthly = existingMonthly + newMonthly;
    const combinedYearly = existingYearly + newYearly;
    
    // Auto-select all new subs on mount
    useEffect(() => {
      setSelectedBank2Subs(newSubs.map(s => s.id));
    }, []);
    
    const handleAddSelected = () => {
      const subsToAdd = bank2Subs.filter(s => selectedBank2Subs.includes(s.id));
      setSubscriptions(prev => [...prev, ...subsToAdd]);
      setSelectedSubs(prev => [...prev, ...subsToAdd.map(s => s.id)]);
      setConnectedBanks(prev => [...prev, selectedBank?.name || 'Bank']);
      setCurrentScreen('confirmation');
    };
    
    // If no new subs found at all
    if (newSubs.length === 0 && possibleDuplicates.length === 0) {
      return <AllCaughtUpScreen />;
    }
    
    return (
      <div style={{
        background: '#F5F9FC',
        minHeight: 'calc(100vh - 44px)',
        paddingBottom: '120px',
      }}>
        <NavHeader title="" onBack={() => setCurrentScreen('sources')} />
        
        <div style={{ padding: '0 20px' }}>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a2e', marginBottom: '12px' }}>
              Found <span style={{ color: '#0095FF' }}>{newSubs.length + possibleDuplicates.length}</span> new subscription{newSubs.length + possibleDuplicates.length !== 1 ? 's' : ''}
            </h1>
            
            {/* Combined totals - existing + new */}
            <p style={{ 
              fontSize: '17px', 
              color: '#4A5568',
              margin: 0,
              marginBottom: '12px',
              lineHeight: 1.5,
            }}>
              You're paying <span style={{ fontWeight: 700, color: '#1a1a2e' }}>${combinedYearly.toFixed(2)}</span> per year and <span style={{ fontWeight: 700, color: '#1a1a2e' }}>${combinedMonthly.toFixed(2)}</span> per month
            </p>
            
            {/* Breakdown hint */}
            {existingSubscriptions.length > 0 && newSelectedSubs.length > 0 && (
              <div style={{
                fontSize: '13px',
                color: '#6B7A8F',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{ color: '#00B860' }}>+${newMonthly.toFixed(2)}/mo</span>
                <span>from {newSelectedSubs.length} new</span>
              </div>
            )}
          </div>

          {/* New subscriptions - auto selected */}
          {newSubs.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '12px',
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#00B860' }}>
                  ✓ New subscriptions ({newSubs.length})
                </span>
              </div>
              
              {newSubs.map(sub => (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    background: '#fff',
                    borderRadius: '14px',
                    marginBottom: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    background: '#F5F7FA',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    marginRight: '14px',
                  }}>
                    {sub.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>{sub.name}</div>
                    <div style={{ fontSize: '13px', color: '#6B7A8F' }}>
                      ${sub.amount}/{sub.cycle === 'Monthly' ? 'mo' : 'yr'} • Next: {sub.nextRenewal}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBank2Subs(prev => prev.filter(id => id !== sub.id))}
                    style={{
                      width: '32px',
                      height: '32px',
                      background: '#F5F7FA',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="16" height="3" viewBox="0 0 16 3" fill="#6B7A8F">
                      <rect width="16" height="3" rx="1.5" fill="#6B7A8F"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Possible duplicates - only shown when system is uncertain */}
          {possibleDuplicates.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '12px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#F5A623">
                  <circle cx="12" cy="12" r="10" stroke="#F5A623" strokeWidth="2" fill="none"/>
                  <path d="M12 8V12" stroke="#F5A623" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="16" r="1" fill="#F5A623"/>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#F5A623' }}>
                  Needs review ({possibleDuplicates.length})
                </span>
              </div>
              
              {possibleDuplicates.map(sub => {
                const existingSub = existingSubscriptions.find(e => e.id === sub.duplicateOf) || 
                                   subscriptions.find(s => s.id === sub.duplicateOf);
                return (
                  <div
                    key={sub.id}
                    style={{
                      background: '#fff',
                      borderRadius: '14px',
                      padding: '16px',
                      marginBottom: '8px',
                      border: '2px solid #F5D98A',
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '12px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid #E8EDF2',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#FFF4E5',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        marginRight: '12px',
                      }}>
                        {sub.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '2px' }}>
                          {sub.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#F5A623', fontWeight: 500 }}>
                          Is this the same subscription?
                        </div>
                      </div>
                    </div>
                    
                    {/* Comparison */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px',
                      marginBottom: '16px',
                    }}>
                      <div style={{ 
                        flex: 1, 
                        background: '#F5F9FC', 
                        borderRadius: '10px', 
                        padding: '12px',
                      }}>
                        <div style={{ fontSize: '11px', color: '#6B7A8F', marginBottom: '6px', fontWeight: 500 }}>
                          ALREADY TRACKING
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a2e' }}>
                          ${existingSub?.amount || '7.99'}/mo
                        </div>
                      </div>
                      <div style={{ 
                        flex: 1, 
                        background: '#FFF9E6', 
                        borderRadius: '10px', 
                        padding: '12px',
                      }}>
                        <div style={{ fontSize: '11px', color: '#8B6914', marginBottom: '6px', fontWeight: 500 }}>
                          NEW CHARGE FOUND
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a2e' }}>
                          ${sub.amount}/mo
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setResolvedDuplicates(prev => ({ ...prev, [sub.id]: 'same' }));
                          setSelectedBank2Subs(prev => prev.filter(id => id !== sub.id));
                        }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: resolvedDuplicates[sub.id] === 'same' ? '#E8EDF2' : '#F5F7FA',
                          border: resolvedDuplicates[sub.id] === 'same' ? '2px solid #6B7A8F' : '1px solid #E8EDF2',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          color: '#1a1a2e',
                        }}
                      >
                        Same subscription
                      </button>
                      <button
                        onClick={() => {
                          setResolvedDuplicates(prev => ({ ...prev, [sub.id]: 'different' }));
                          setSelectedBank2Subs(prev => [...prev.filter(id => id !== sub.id), sub.id]);
                        }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          background: resolvedDuplicates[sub.id] === 'different' ? '#0095FF' : '#F5F7FA',
                          border: resolvedDuplicates[sub.id] === 'different' ? 'none' : '1px solid #E8EDF2',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          color: resolvedDuplicates[sub.id] === 'different' ? '#fff' : '#1a1a2e',
                        }}
                      >
                        Different, add it
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Floating CTA */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 32px',
          background: 'linear-gradient(180deg, transparent 0%, #F5F9FC 30%)',
        }}>
          <PrimaryButton 
            onClick={handleAddSelected}
            disabled={selectedBank2Subs.length === 0}
          >
            Add {selectedBank2Subs.length} subscription{selectedBank2Subs.length !== 1 ? 's' : ''}
          </PrimaryButton>
        </div>
      </div>
    );
  };

  // All Caught Up Screen - when no new subs found
  const AllCaughtUpScreen = () => (
    <div style={{
      background: '#F5F9FC',
      minHeight: 'calc(100vh - 44px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <NavHeader title="" onBack={() => setCurrentScreen('sources')} />
      
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: '#E6FAF0',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="#00B860">
            <path d="M9 12L11 14L15 10" stroke="#00B860" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <circle cx="12" cy="12" r="10" stroke="#00B860" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
          You're all caught up!
        </h2>
        <p style={{ color: '#6B7A8F', fontSize: '16px', marginBottom: '32px', maxWidth: '280px' }}>
          No new subscriptions found. All subscriptions from this bank are already being tracked.
        </p>
        
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0095FF">
            <path d="M9 12L11 14L15 10" stroke="#0095FF" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="10" stroke="#0095FF" strokeWidth="2" fill="none"/>
          </svg>
          <span style={{ fontSize: '15px', color: '#1a1a2e' }}>
            Tracking <strong>{existingSubscriptions.length}</strong> subscriptions
          </span>
        </div>
      </div>
      
      <div style={{ padding: '20px' }}>
        <PrimaryButton onClick={() => setCurrentScreen('confirmation')}>
          Back to dashboard
        </PrimaryButton>
      </div>
    </div>
  );

  // Email Connect Screen (simulated)
  const EmailConnectScreen = () => (
    <div style={{
      background: '#F5F9FC',
      minHeight: 'calc(100vh - 44px)',
    }}>
      <NavHeader title="Connect Email" onBack={() => setCurrentScreen('sources')} />
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: '#E8F4FF',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#0095FF">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="#0095FF" strokeWidth="2" fill="none"/>
            <path d="M2 6L12 13L22 6" stroke="#0095FF" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '12px' }}>Connect your email</h2>
        <p style={{ color: '#6B7A8F', marginBottom: '32px' }}>
          We'll scan for subscription receipts and free trial confirmations
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => {
              setConnectedSources(prev => ({ ...prev, email: true }));
              setCurrentScreen('foundWithTrials');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 20px',
              background: '#fff',
              border: '1px solid #E8EDF2',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              background: '#EA4335',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '14px',
              color: '#fff',
              fontWeight: 700,
            }}>G</div>
            <span style={{ flex: 1, fontWeight: 500 }}>Continue with Gmail</span>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="#C4CDD5">
              <path d="M1 1L7 7L1 13" stroke="#C4CDD5" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </button>
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            background: '#fff',
            border: '1px solid #E8EDF2',
            borderRadius: '12px',
            cursor: 'pointer',
            textAlign: 'left',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#0078D4',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '14px',
              color: '#fff',
              fontWeight: 700,
            }}>O</div>
            <span style={{ flex: 1, fontWeight: 500 }}>Continue with Outlook</span>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="#C4CDD5">
              <path d="M1 1L7 7L1 13" stroke="#C4CDD5" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // Found with Trials Screen (after email connect)
  const FoundWithTrialsScreen = () => (
    <div style={{
      background: '#F5F9FC',
      minHeight: 'calc(100vh - 44px)',
      paddingBottom: '100px',
    }}>
      <NavHeader title="" onBack={() => setCurrentScreen('sources')} />
      
      <div style={{ padding: '0 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
            Found <span style={{ color: '#F5A623' }}>{freeTrials.length}</span> free trials
          </h1>
          <p style={{ color: '#6B7A8F', fontSize: '15px', margin: 0 }}>
            We'll remind you before they convert to paid
          </p>
        </div>

        {freeTrials.map(trial => (
          <div
            key={trial.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              background: '#fff',
              borderRadius: '16px',
              marginBottom: '12px',
              border: '2px solid #F5D98A',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: '#FFF4E5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginRight: '14px',
            }}>
              {trial.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>{trial.name}</div>
              <div style={{ fontSize: '13px', color: '#F5A623', fontWeight: 500 }}>
                ⏱ Trial ends in {trial.expiresIn} days
              </div>
              <div style={{ fontSize: '13px', color: '#6B7A8F' }}>
                Then ${trial.amount}/{trial.cycle === 'Monthly' ? 'mo' : 'yr'}
              </div>
            </div>
            <div style={{
              width: '28px',
              height: '28px',
              background: '#0095FF',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                <path d="M9 12L11 14L15 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 20px 32px',
        background: 'linear-gradient(180deg, transparent 0%, #F5F9FC 20%)',
      }}>
        <PrimaryButton onClick={() => setCurrentScreen('confirmation')}>
          Add {freeTrials.length} free trial{freeTrials.length !== 1 ? 's' : ''}
        </PrimaryButton>
      </div>
    </div>
  );

  // Add Manual Subscription Screen
  const AddManualScreen = () => {
    const [manualSub, setManualSub] = useState({
      name: '',
      amount: '',
      cycle: 'Monthly',
      nextRenewal: '',
      category: null,
      isTrial: false,
    });
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const handleNameChange = (value) => {
      setManualSub(prev => ({ ...prev, name: value }));
      if (value.length >= 2) {
        const matches = knownSubscriptions.filter(ks => 
          ks.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(matches);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };
    
    const selectKnownSub = (known) => {
      setManualSub(prev => ({
        ...prev,
        name: known.name,
        amount: known.defaultAmount.toString(),
        cycle: known.cycle,
        category: known.category,
      }));
      setShowDropdown(false);
      setSearchResults([]);
    };
    
    // Determine where to go back to
    const handleBack = () => {
      if (isAddingMore) {
        setCurrentScreen('sources');
      } else if (subscriptions.length > 0) {
        setCurrentScreen('found');
      } else {
        setCurrentScreen('sources');
      }
    };
    
    return (
      <div style={{
        background: '#F5F9FC',
        minHeight: 'calc(100vh - 44px)',
      }}>
        <NavHeader title="Add subscription" onBack={handleBack} />
        
        <div style={{ padding: '0 20px 100px' }}>
          {/* Trial toggle */}
          <div style={{
            display: 'flex',
            background: '#E8EDF2',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px',
          }}>
            <button
              onClick={() => setManualSub(prev => ({ ...prev, isTrial: false }))}
              style={{
                flex: 1,
                padding: '12px',
                background: !manualSub.isTrial ? '#fff' : 'transparent',
                color: !manualSub.isTrial ? '#1a1a2e' : '#6B7A8F',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: !manualSub.isTrial ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Paid subscription
            </button>
            <button
              onClick={() => setManualSub(prev => ({ ...prev, isTrial: true }))}
              style={{
                flex: 1,
                padding: '12px',
                background: manualSub.isTrial ? '#fff' : 'transparent',
                color: manualSub.isTrial ? '#1a1a2e' : '#6B7A8F',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: manualSub.isTrial ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Free trial
            </button>
          </div>

          {/* Form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name with autocomplete */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#6B7A8F', marginBottom: '8px' }}>
                Subscription name
              </label>
              <input
                type="text"
                placeholder="Start typing to search..."
                value={manualSub.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #E8EDF2',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
              
              {/* Autocomplete dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  marginTop: '4px',
                  zIndex: 100,
                  maxHeight: '200px',
                  overflow: 'auto',
                }}>
                  {searchResults.map((known, i) => (
                    <button
                      key={i}
                      onClick={() => selectKnownSub(known)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        borderBottom: i < searchResults.length - 1 ? '1px solid #E8EDF2' : 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: '20px', marginRight: '12px' }}>{known.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, color: '#1a1a2e' }}>{known.name}</div>
                        <div style={{ fontSize: '12px', color: '#6B7A8F' }}>{known.category} • ${known.defaultAmount}/mo</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#6B7A8F', marginBottom: '8px' }}>
                {manualSub.isTrial ? 'Price after trial' : 'Amount'}
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="number"
                  placeholder="9.99"
                  value={manualSub.amount}
                  onChange={(e) => setManualSub(prev => ({ ...prev, amount: e.target.value }))}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: '1px solid #E8EDF2',
                    borderRadius: '12px',
                    fontSize: '16px',
                  }}
                />
                <span style={{
                  padding: '16px',
                  background: '#F5F7FA',
                  borderRadius: '12px',
                  color: '#6B7A8F',
                }}>USD</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#6B7A8F', marginBottom: '8px' }}>
                Billing cycle
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Monthly', 'Annually', 'Weekly'].map(cycle => (
                  <button
                    key={cycle}
                    onClick={() => setManualSub(prev => ({ ...prev, cycle }))}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: manualSub.cycle === cycle ? '#0095FF' : '#F5F7FA',
                      color: manualSub.cycle === cycle ? '#fff' : '#1a1a2e',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#6B7A8F', marginBottom: '8px' }}>
                {manualSub.isTrial ? 'Trial ends' : 'Next renewal'}
              </label>
              <input
                type="date"
                value={manualSub.nextRenewal}
                onChange={(e) => setManualSub(prev => ({ ...prev, nextRenewal: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #E8EDF2',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', color: '#6B7A8F', marginBottom: '8px' }}>
                Category (optional)
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {categories.slice(0, 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setManualSub(prev => ({ ...prev, category: prev.category === cat ? null : cat }))}
                    style={{
                      padding: '10px 16px',
                      background: manualSub.category === cat ? '#0095FF' : '#F5F7FA',
                      color: manualSub.category === cat ? '#fff' : '#1a1a2e',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 32px',
          background: 'linear-gradient(180deg, transparent 0%, #F5F9FC 20%)',
        }}>
          <PrimaryButton 
            onClick={() => {
              // Find icon from known subscriptions or use default
              const knownMatch = knownSubscriptions.find(k => 
                k.name.toLowerCase() === manualSub.name.toLowerCase()
              );
              
              const newSub = {
                id: Date.now(),
                name: manualSub.name,
                icon: knownMatch?.icon || '📱',
                amount: parseFloat(manualSub.amount) || 0,
                cycle: manualSub.cycle,
                nextRenewal: manualSub.nextRenewal || '1 Feb 2026',
                complete: true,
                category: manualSub.category || knownMatch?.category,
                paymentMethod: null,
                isNew: isAddingMore, // Mark as new if adding more
              };
              setSubscriptions(prev => [...prev, newSub]);
              setSelectedSubs(prev => [...prev, newSub.id]);
              
              // Always go to Found screen - it will show all subs including new ones
              setCurrentScreen('found');
              if (isAddingMore) setIsAddingMore(false);
            }}
            disabled={!manualSub.name || !manualSub.amount}
          >
            Add {manualSub.isTrial ? 'free trial' : 'subscription'}
          </PrimaryButton>
        </div>
      </div>
    );
  };

  // Manual Edit Screen for incomplete subscriptions
  const ManualEditScreen = () => {
    const incompleteSelected = subscriptions.filter(s => !s.complete && selectedSubs.includes(s.id));
    const [searchResults, setSearchResults] = useState({}); // { subId: [results] }
    const [showDropdown, setShowDropdown] = useState(null); // subId
    
    const handleNameChange = (subId, value) => {
      // Search known subscriptions
      if (value.length >= 2) {
        const matches = knownSubscriptions.filter(ks => 
          ks.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(prev => ({ ...prev, [subId]: matches }));
        setShowDropdown(subId);
      } else {
        setSearchResults(prev => ({ ...prev, [subId]: [] }));
        setShowDropdown(null);
      }
      
      setSubscriptions(prev => prev.map(s => 
        s.id === subId ? { ...s, name: value || s.name } : s
      ));
    };
    
    const selectKnownSubscription = (subId, known) => {
      setSubscriptions(prev => prev.map(s => 
        s.id === subId ? { 
          ...s, 
          name: known.name, 
          icon: known.icon,
          category: known.category,
          cycle: s.cycle || known.cycle,
          needsName: false,
        } : s
      ));
      setShowDropdown(null);
      setSearchResults(prev => ({ ...prev, [subId]: [] }));
    };
    
    return (
      <div style={{
        background: '#F5F9FC',
        minHeight: 'calc(100vh - 44px)',
        paddingBottom: '100px',
      }}>
        <NavHeader title="Fill in missing details" onBack={() => setCurrentScreen('found')} />
        
        <div style={{ padding: '0 20px' }}>
          <p style={{ color: '#6B7A8F', fontSize: '15px', marginBottom: '20px' }}>
            These subscriptions need some info to be complete
          </p>

          {incompleteSelected.map(sub => (
            <div
              key={sub.id}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: sub.needsName ? '#FFF4E5' : '#F5F7FA',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  {sub.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: '17px', 
                    color: sub.needsName ? '#F5A623' : '#1a1a2e',
                    marginBottom: '2px',
                  }}>
                    {sub.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6B7A8F' }}>
                    ${sub.amount} • {sub.nextRenewal}
                  </div>
                </div>
              </div>

              {/* Editable fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Name field if unclear - with autocomplete */}
                {sub.needsName && (
                  <div style={{ position: 'relative' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#F5A623', 
                      marginBottom: '8px',
                      fontWeight: 500,
                    }}>
                      Subscription name *
                    </label>
                    <input
                      type="text"
                      placeholder="Start typing to search..."
                      defaultValue={sub.name === 'UNKNOWN MERCHANT' || sub.name.includes('Subscription') ? '' : sub.name}
                      onChange={(e) => handleNameChange(sub.id, e.target.value)}
                      onFocus={() => {
                        if (searchResults[sub.id]?.length > 0) setShowDropdown(sub.id);
                      }}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #F5D98A',
                        borderRadius: '12px',
                        fontSize: '15px',
                        background: '#FFFBF0',
                        boxSizing: 'border-box',
                      }}
                    />
                    
                    {/* Autocomplete dropdown */}
                    {showDropdown === sub.id && searchResults[sub.id]?.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        marginTop: '4px',
                        zIndex: 100,
                        maxHeight: '200px',
                        overflow: 'auto',
                      }}>
                        {searchResults[sub.id].map((known, i) => (
                          <button
                            key={i}
                            onClick={() => selectKnownSubscription(sub.id, known)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              padding: '12px 16px',
                              background: 'none',
                              border: 'none',
                              borderBottom: i < searchResults[sub.id].length - 1 ? '1px solid #E8EDF2' : 'none',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <span style={{ fontSize: '20px', marginRight: '12px' }}>{known.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 500, color: '#1a1a2e' }}>{known.name}</div>
                              <div style={{ fontSize: '12px', color: '#6B7A8F' }}>{known.category} • ${known.defaultAmount}/mo</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Billing cycle if missing */}
                {!sub.cycle && (
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#F5A623', 
                      marginBottom: '8px',
                      fontWeight: 500,
                    }}>
                      Billing cycle *
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['Monthly', 'Annually', 'Weekly', 'Quarterly'].map(cycle => (
                        <button
                          key={cycle}
                          onClick={() => {
                            setSubscriptions(prev => prev.map(s => 
                              s.id === sub.id ? { ...s, cycle } : s
                            ));
                          }}
                          style={{
                            flex: 1,
                            padding: '12px',
                            background: sub.cycle === cycle ? '#0095FF' : '#F5F7FA',
                            color: sub.cycle === cycle ? '#fff' : '#1a1a2e',
                            border: sub.cycle === cycle ? 'none' : '1px solid #E8EDF2',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          {cycle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category */}
                {!sub.category && (
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#6B7A8F', 
                      marginBottom: '8px',
                      fontWeight: 500,
                    }}>
                      Category (optional)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSubscriptions(prev => prev.map(s => 
                              s.id === sub.id ? { ...s, category: sub.category === cat ? null : cat } : s
                            ));
                          }}
                          style={{
                            padding: '10px 16px',
                            background: sub.category === cat ? '#0095FF' : '#F5F7FA',
                            color: sub.category === cat ? '#fff' : '#1a1a2e',
                            border: 'none',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Completion indicator */}
              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #E8EDF2',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                {(!sub.needsName || sub.name !== 'UNKNOWN MERCHANT') && sub.cycle ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#00B860">
                      <path d="M9 12L11 14L15 10" stroke="#00B860" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="12" r="10" stroke="#00B860" strokeWidth="2" fill="none"/>
                    </svg>
                    <span style={{ fontSize: '13px', color: '#00B860', fontWeight: 500 }}>Ready to go</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F5A623">
                      <circle cx="12" cy="12" r="10" stroke="#F5A623" strokeWidth="2" fill="none"/>
                      <path d="M12 8V12" stroke="#F5A623" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="16" r="1" fill="#F5A623"/>
                    </svg>
                    <span style={{ fontSize: '13px', color: '#F5A623', fontWeight: 500 }}>
                      {sub.needsName && (sub.name === 'UNKNOWN MERCHANT' || sub.name.includes('Subscription')) ? 'Name required' : ''}
                      {!sub.cycle ? (sub.needsName ? ' • ' : '') + 'Billing cycle required' : ''}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating CTA */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 32px',
          background: 'linear-gradient(180deg, transparent 0%, #F5F9FC 20%)',
        }}>
          <PrimaryButton onClick={() => setCurrentScreen('found')}>
            Continue
          </PrimaryButton>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <PhoneFrame>
        {renderScreen()}
      </PhoneFrame>
    </div>
  );
}
