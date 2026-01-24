'use client';

import { useState, useRef, useEffect } from 'react';
import { STEP_DATA, FRAMEWORK_DATA } from '../lib/stepData';
import { createSystemPrompt, createDailyPracticePrompt } from '../lib/prompts';
import { InventorySection, AmendsSection } from './components/Inventory';

// ============================================
// COMPONENTS
// ============================================

function Message({ role, content, isLatest }) {
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${isLatest ? 'animate-fade-in' : ''}`}>
      <div className="max-w-[85%]">
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5 ml-1">
            <div className="w-6 h-6 rounded-full bg-amber-900/30 flex items-center justify-center">
              <span className="text-amber-200 text-xs">✧</span>
            </div>
            <span className="text-amber-200/60 text-xs font-medium tracking-wide uppercase">Guide</span>
          </div>
        )}
        <div 
          className={`px-4 py-3 rounded-2xl whitespace-pre-wrap ${
            isUser 
              ? 'bg-stone-700/50 text-stone-100 rounded-tr-sm' 
              : 'bg-stone-800/30 text-stone-200 rounded-tl-sm border border-stone-700/30'
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[85%]">
        <div className="flex items-center gap-2 mb-1.5 ml-1">
          <div className="w-6 h-6 rounded-full bg-amber-900/30 flex items-center justify-center">
            <span className="text-amber-200 text-xs">✧</span>
          </div>
          <span className="text-amber-200/60 text-xs font-medium tracking-wide uppercase">Guide</span>
        </div>
        <div className="px-4 py-3 rounded-2xl bg-stone-800/30 border border-stone-700/30 rounded-tl-sm">
          <div className="flex gap-1.5">
            {[0, 150, 300].map((delay) => (
              <div 
                key={delay} 
                className="w-2 h-2 rounded-full bg-amber-200/40 animate-pulse" 
                style={{ animationDelay: `${delay}ms` }} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// New 12-Step Selector with grouping
function StepSelector({ currentStep, onSelectStep }) {
  const stepGroups = [
    { label: "Surrender", steps: [1, 2, 3], color: "amber" },
    { label: "Housecleaning", steps: [4, 5, 6, 7], color: "emerald" },
    { label: "Amends", steps: [8, 9], color: "sky" },
    { label: "Maintenance", steps: [10, 11, 12], color: "violet" }
  ];

  const getGroupForStep = (step) => {
    for (const group of stepGroups) {
      if (group.steps.includes(step)) return group;
    }
    return stepGroups[0];
  };

  const currentGroup = getGroupForStep(currentStep);

  return (
    <div className="space-y-2">
      {/* Step numbers */}
      <div className="flex gap-1 justify-center flex-wrap">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((step) => {
          const group = getGroupForStep(step);
          const isActive = currentStep === step;
          const inCurrentGroup = group === currentGroup;
          
          return (
            <button
              key={step}
              onClick={() => onSelectStep(step)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                isActive
                  ? `bg-${group.color}-900/60 text-${group.color}-100 border border-${group.color}-700/50 ring-1 ring-${group.color}-500/30`
                  : inCurrentGroup
                    ? `bg-stone-800/50 text-stone-300 border border-stone-700/30 hover:border-${group.color}-700/30`
                    : 'bg-stone-800/30 text-stone-500 border border-stone-700/30 hover:border-stone-600'
              }`}
              style={{
                backgroundColor: isActive ? `rgb(var(--${group.color}-900) / 0.6)` : undefined,
              }}
            >
              {step}
            </button>
          );
        })}
      </div>
      
      {/* Group label */}
      <div className="text-center">
        <span className="text-xs text-stone-500 uppercase tracking-wider">
          {currentGroup.label} Steps
        </span>
      </div>
    </div>
  );
}

function ThemeProgress({ messages, currentStep }) {
  const themes = STEP_DATA[currentStep]?.themes?.slice(0, 6) || [];
  const icons = ['◈', '◇', '○', '△', '□', '☆'];
  const messageText = messages.map(m => typeof m.content === 'string' ? m.content.toLowerCase() : '').join(' ');
  
  if (themes.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {themes.map((theme, i) => {
        const themeKey = theme.toLowerCase().split(' ')[0];
        const touched = messageText.includes(themeKey);
        return (
          <div 
            key={theme}
            className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 transition-all duration-500 ${
              touched 
                ? 'bg-amber-900/40 text-amber-200 border border-amber-700/50' 
                : 'bg-stone-800/30 text-stone-500 border border-stone-700/30'
            }`}
          >
            <span className="text-[10px]">{icons[i] || '○'}</span>
            <span className="capitalize">{theme}</span>
          </div>
        );
      })}
    </div>
  );
}

function OnboardingStep({ step, totalSteps, children, onNext, onBack, canProgress = true }) {
  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < step ? 'bg-amber-500' : i === step ? 'bg-amber-400 scale-125' : 'bg-stone-700'
              }`}
            />
          ))}
        </div>
        
        {children}
        
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-xl border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-600 transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!canProgress}
            className={`flex-1 py-3 rounded-xl transition-all ${
              canProgress
                ? 'bg-amber-900/60 text-amber-100 border border-amber-700/30 hover:bg-amber-900/80'
                : 'bg-stone-800/30 text-stone-600 border border-stone-700/30 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function ModeSelection({ onSelectMode, userProfile, onExportData, onImportData, inventoryCount, amendsCount }) {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  
  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-amber-200 text-2xl">✧</span>
          </div>
          <h1 className="text-2xl text-stone-100 mb-2">Good {timeOfDay}, {userProfile.name}</h1>
          <p className="text-stone-400">What would you like to work on?</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelectMode('stepwork')}
            className="w-full p-6 rounded-2xl bg-stone-800/30 border border-stone-700/30 text-left hover:border-amber-700/30 hover:bg-stone-800/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-900/30 flex items-center justify-center">
                <span className="text-xl">📖</span>
              </div>
              <div>
                <h3 className="text-stone-100 font-medium group-hover:text-amber-100 transition-colors">Step Work</h3>
                <p className="text-stone-500 text-sm">Deep exploration with your guide</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => onSelectMode('daily')}
            className="w-full p-6 rounded-2xl bg-stone-800/30 border border-stone-700/30 text-left hover:border-amber-700/30 hover:bg-stone-800/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-900/30 flex items-center justify-center">
                <span className="text-xl">☀️</span>
              </div>
              <div>
                <h3 className="text-stone-100 font-medium group-hover:text-amber-100 transition-colors">Daily Practice</h3>
                <p className="text-stone-500 text-sm">Quick check-in (Step 10)</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => onSelectMode('inventory')}
            className="w-full p-6 rounded-2xl bg-stone-800/30 border border-stone-700/30 text-left hover:border-sky-700/30 hover:bg-stone-800/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-900/30 flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <div className="flex-1">
                <h3 className="text-stone-100 font-medium group-hover:text-sky-100 transition-colors">Step 4: Inventory</h3>
                <p className="text-stone-500 text-sm">Track resentments & core beliefs</p>
              </div>
              {inventoryCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-sky-900/30 text-sky-200 text-xs">
                  {inventoryCount}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => onSelectMode('amends')}
            className="w-full p-6 rounded-2xl bg-stone-800/30 border border-stone-700/30 text-left hover:border-violet-700/30 hover:bg-stone-800/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-900/30 flex items-center justify-center">
                <span className="text-xl">🤝</span>
              </div>
              <div className="flex-1">
                <h3 className="text-stone-100 font-medium group-hover:text-violet-100 transition-colors">Step 8: Amends</h3>
                <p className="text-stone-500 text-sm">List those we've harmed</p>
              </div>
              {amendsCount > 0 && (
                <span className="px-2 py-1 rounded-full bg-violet-900/30 text-violet-200 text-xs">
                  {amendsCount}
                </span>
              )}
            </div>
          </button>

          <div className="border-t border-stone-700/30 pt-4 mt-4">
            <p className="text-xs text-stone-500 mb-3 text-center">Your data stays on your device. Manage your backups:</p>
            <div className="flex gap-2">
              <button
                onClick={onExportData}
                className="flex-1 px-3 py-2 rounded-lg bg-stone-800/30 border border-stone-700/30 text-stone-300 hover:text-stone-100 text-sm transition-all hover:border-stone-600"
              >
                ↓ Export
              </button>
              <label className="flex-1 px-3 py-2 rounded-lg bg-stone-800/30 border border-stone-700/30 text-stone-300 hover:text-stone-100 text-sm transition-all hover:border-stone-600 cursor-pointer text-center">
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={onImportData}
                  className="hidden"
                />
                ↑ Import
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================

export default function NAStepGuide() {
  // State
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: '',
    whatBroughtThem: '',
    goals: '',
    experienceLevel: '',
    approachPreference: ''
  });
  const [currentMode, setCurrentMode] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [amends, setAmends] = useState([]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Effects
  useEffect(() => {
    const saved = localStorage.getItem('naStepGuide_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserProfile(parsed);
      setIsOnboarded(true);
    }
    
    // Load inventory
    const savedInventory = localStorage.getItem('naStepGuide_inventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
    
    // Load amends
    const savedAmends = localStorage.getItem('naStepGuide_amends');
    if (savedAmends) {
      setAmends(JSON.parse(savedAmends));
    }
  }, []);
  
  // Save inventory when it changes
  useEffect(() => {
    if (inventory.length > 0) {
      localStorage.setItem('naStepGuide_inventory', JSON.stringify(inventory));
    }
  }, [inventory]);
  
  // Save amends when it changes
  useEffect(() => {
    if (amends.length > 0) {
      localStorage.setItem('naStepGuide_amends', JSON.stringify(amends));
    }
  }, [amends]);

  // Data export function
  const exportData = () => {
    const allData = {
      exportDate: new Date().toISOString(),
      profile: userProfile,
      currentStep,
      messageHistory: messages,
      inventory,
      amends,
      appVersion: '12-steps-v2'
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `na-step-guide-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Data import function
  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result);
        if (imported.profile) {
          setUserProfile(imported.profile);
          localStorage.setItem('naStepGuide_profile', JSON.stringify(imported.profile));
          setIsOnboarded(true);
        }
        if (imported.currentStep) {
          setCurrentStep(imported.currentStep);
        }
        if (imported.messageHistory) {
          setMessages(imported.messageHistory);
        }
        if (imported.inventory) {
          setInventory(imported.inventory);
          localStorage.setItem('naStepGuide_inventory', JSON.stringify(imported.inventory));
        }
        if (imported.amends) {
          setAmends(imported.amends);
          localStorage.setItem('naStepGuide_amends', JSON.stringify(imported.amends));
        }
        alert('Data imported successfully!');
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (currentMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentMode]);

  // Handlers
  const handleOnboardingNext = () => {
    if (onboardingStep < 5) {
      setOnboardingStep(prev => prev + 1);
    } else {
      localStorage.setItem('naStepGuide_profile', JSON.stringify(userProfile));
      setIsOnboarded(true);
    }
  };

  const handleSelectMode = async (mode) => {
    setCurrentMode(mode);
    setMessages([]);
    
    // Generate opening message
    setIsLoading(true);
    try {
      const systemPrompt = mode === 'daily' 
        ? createDailyPracticePrompt(userProfile, currentStep)
        : createSystemPrompt(userProfile, currentStep);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Begin our session.' }],
          systemPrompt
        })
      });
      
      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      const text = data.content;
      setMessages([{ role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([{ 
        role: 'assistant', 
        content: `Welcome${userProfile.name ? `, ${userProfile.name}` : ''}. I'm here to walk alongside you through the steps. What's on your mind today?` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepChange = async (newStep) => {
    if (newStep === currentStep) return;
    setCurrentStep(newStep);
    setMessages([]);
    
    // Generate new opening for the new step
    setIsLoading(true);
    try {
      const systemPrompt = createSystemPrompt(userProfile, newStep);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Begin our session.' }],
          systemPrompt
        })
      });
      
      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      const text = data.content;
      setMessages([{ role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error:', error);
      const stepText = STEP_DATA[newStep]?.text || '';
      setMessages([{ 
        role: 'assistant', 
        content: `Let's explore Step ${newStep} together.\n\n"${stepText}"\n\nWhat draws you to this step right now?` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const systemPrompt = currentMode === 'daily'
        ? createDailyPracticePrompt(userProfile, currentStep)
        : createSystemPrompt(userProfile, currentStep);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          systemPrompt
        })
      });
      
      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      const text = data.content;
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I seem to be having trouble connecting. Please try again in a moment.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // RENDER: ONBOARDING
  // ============================================
  
  const totalSteps = 6;

  if (!isOnboarded) {
    // Step 0: Welcome
    if (onboardingStep === 0) {
      return (
        <OnboardingStep step={0} totalSteps={totalSteps} onNext={() => setOnboardingStep(1)}>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-amber-200 text-3xl">✧</span>
            </div>
            <h1 className="text-2xl text-stone-100 mb-4">NA Step Guide</h1>
            <p className="text-stone-400 leading-relaxed">
              A compassionate companion for working the Twelve Steps. This guide will walk alongside you - 
              asking questions, offering perspective, and helping you find your own insights.
            </p>
          </div>
        </OnboardingStep>
      );
    }

    // Step 1: Name
    if (onboardingStep === 1) {
      return (
        <OnboardingStep 
          step={1} 
          totalSteps={totalSteps} 
          onNext={handleOnboardingNext}
          onBack={() => setOnboardingStep(0)}
          canProgress={userProfile.name.trim().length >= 1}
        >
          <div className="mb-6">
            <h2 className="text-xl text-stone-100 mb-2">What should I call you?</h2>
            <p className="text-stone-400 text-sm">Just a first name or whatever you're comfortable with.</p>
          </div>
          <input
            type="text"
            value={userProfile.name}
            onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl bg-stone-800/50 border border-stone-700/30 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-700/50 focus:ring-1 focus:ring-amber-700/30"
            autoFocus
          />
        </OnboardingStep>
      );
    }

    // Step 2: What brought them
    if (onboardingStep === 2) {
      return (
        <OnboardingStep 
          step={2} 
          totalSteps={totalSteps} 
          onNext={handleOnboardingNext}
          onBack={() => setOnboardingStep(1)}
          canProgress={userProfile.whatBroughtThem.trim().length > 10}
        >
          <div className="mb-6">
            <h2 className="text-xl text-stone-100 mb-2">What brought you here?</h2>
            <p className="text-stone-400 text-sm">Share as much or as little as you'd like.</p>
          </div>
          <textarea
            value={userProfile.whatBroughtThem}
            onChange={(e) => setUserProfile(prev => ({ ...prev, whatBroughtThem: e.target.value }))}
            placeholder="What's happening in your life..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-stone-800/50 border border-stone-700/30 text-stone-100 placeholder-stone-500 resize-none focus:outline-none focus:border-amber-700/50 focus:ring-1 focus:ring-amber-700/30"
            autoFocus
          />
        </OnboardingStep>
      );
    }

    // Step 3: Goals
    if (onboardingStep === 3) {
      return (
        <OnboardingStep 
          step={3} 
          totalSteps={totalSteps} 
          onNext={handleOnboardingNext}
          onBack={() => setOnboardingStep(2)}
          canProgress={userProfile.goals.trim().length > 10}
        >
          <div className="mb-6">
            <h2 className="text-xl text-stone-100 mb-2">What are you hoping to get from this?</h2>
            <p className="text-stone-400 text-sm">What would feel like progress?</p>
          </div>
          <textarea
            value={userProfile.goals}
            onChange={(e) => setUserProfile(prev => ({ ...prev, goals: e.target.value }))}
            placeholder="I'm hoping to..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-stone-800/50 border border-stone-700/30 text-stone-100 placeholder-stone-500 resize-none focus:outline-none focus:border-amber-700/50 focus:ring-1 focus:ring-amber-700/30"
            autoFocus
          />
        </OnboardingStep>
      );
    }

    // Step 4: Experience
    if (onboardingStep === 4) {
      const levels = [
        { id: 'first', label: 'First time', desc: 'New to formal step work' },
        { id: 'some', label: 'Some experience', desc: 'Started before, maybe didn\'t finish' },
        { id: 'cycling', label: 'Working them again', desc: 'Cycling through in recovery' }
      ];

      return (
        <OnboardingStep 
          step={4} 
          totalSteps={totalSteps} 
          onNext={handleOnboardingNext}
          onBack={() => setOnboardingStep(3)}
          canProgress={userProfile.experienceLevel !== ''}
        >
          <div className="mb-6">
            <h2 className="text-xl text-stone-100 mb-2">Have you worked the steps before?</h2>
          </div>
          <div className="space-y-3">
            {levels.map(level => (
              <button
                key={level.id}
                onClick={() => setUserProfile(prev => ({ ...prev, experienceLevel: level.id }))}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  userProfile.experienceLevel === level.id
                    ? 'bg-amber-900/30 border-amber-700/50 text-amber-100'
                    : 'bg-stone-800/30 border-stone-700/30 text-stone-300 hover:border-stone-600'
                }`}
              >
                <div className="font-medium">{level.label}</div>
                <div className="text-sm text-stone-400 mt-1">{level.desc}</div>
              </button>
            ))}
          </div>
        </OnboardingStep>
      );
    }

    // Step 5: Approach
    if (onboardingStep === 5) {
      const approaches = [
        { id: 'traditional', label: 'Traditional NA', desc: 'Focus on NA literature and principles' },
        { id: 'integrated', label: 'Integrated', desc: 'NA + IFS, EFT, Stoicism, Buddhism, Schema Therapy' },
        { id: 'adaptive', label: 'Adaptive', desc: 'Start traditional, introduce frameworks when helpful' }
      ];

      return (
        <OnboardingStep 
          step={5} 
          totalSteps={totalSteps} 
          onNext={handleOnboardingNext}
          onBack={() => setOnboardingStep(4)}
          canProgress={userProfile.approachPreference !== ''}
        >
          <div className="mb-6">
            <h2 className="text-xl text-stone-100 mb-2">How would you like to approach this?</h2>
          </div>
          <div className="space-y-3">
            {approaches.map(approach => (
              <button
                key={approach.id}
                onClick={() => setUserProfile(prev => ({ ...prev, approachPreference: approach.id }))}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  userProfile.approachPreference === approach.id
                    ? 'bg-amber-900/30 border-amber-700/50 text-amber-100'
                    : 'bg-stone-800/30 border-stone-700/30 text-stone-300 hover:border-stone-600'
                }`}
              >
                <div className="font-medium">{approach.label}</div>
                <div className="text-sm text-stone-400 mt-1">{approach.desc}</div>
              </button>
            ))}
          </div>
        </OnboardingStep>
      );
    }
  }

  // ============================================
  // RENDER: MODE SELECTION
  // ============================================
  
  if (isOnboarded && !currentMode) {
    return <ModeSelection onSelectMode={handleSelectMode} userProfile={userProfile} onExportData={exportData} onImportData={importData} inventoryCount={inventory.length} amendsCount={amends.length} />;
  }

  // ============================================
  // RENDER: INVENTORY
  // ============================================
  
  if (currentMode === 'inventory') {
    return (
      <div className="min-h-screen bg-stone-900">
        <header className="border-b border-stone-800/50 bg-stone-900/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <button 
              onClick={() => setCurrentMode(null)}
              className="flex items-center gap-2 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <span>←</span>
              <span className="text-sm">Menu</span>
            </button>
          </div>
        </header>
        <InventorySection inventory={inventory} setInventory={setInventory} />
      </div>
    );
  }

  // ============================================
  // RENDER: AMENDS
  // ============================================
  
  if (currentMode === 'amends') {
    return (
      <div className="min-h-screen bg-stone-900">
        <header className="border-b border-stone-800/50 bg-stone-900/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <button 
              onClick={() => setCurrentMode(null)}
              className="flex items-center gap-2 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <span>←</span>
              <span className="text-sm">Menu</span>
            </button>
          </div>
        </header>
        <AmendsSection amends={amends} setAmends={setAmends} inventory={inventory} />
      </div>
    );
  }

  // ============================================
  // RENDER: CHAT
  // ============================================
  
  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-800/50 bg-stone-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => { setCurrentMode(null); setMessages([]); }}
              className="flex items-center gap-2 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <span>←</span>
              <span className="text-sm">Menu</span>
            </button>
            <div className="text-center">
              <h1 className="text-stone-100 text-sm font-medium">
                {currentMode === 'daily' ? 'Daily Practice' : `Step ${currentStep}`}
              </h1>
              {currentMode === 'stepwork' && STEP_DATA[currentStep] && (
                <p className="text-stone-500 text-xs truncate max-w-[200px]">
                  {STEP_DATA[currentStep].text.split(',')[0]}...
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportData}
                title="Download your data"
                className="p-2 text-stone-400 hover:text-stone-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <label className="p-2 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={importData}
                  className="hidden"
                  title="Upload your backup"
                />
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8v12a2 2 0 002 2h12a2 2 0 002-2V8m-4-4l-4-4m0 0L8 4m4-4v12" />
                </svg>
              </label>
            </div>
          </div>
          
          {currentMode === 'stepwork' && (
            <div className="space-y-3">
              <StepSelector currentStep={currentStep} onSelectStep={handleStepChange} />
              <ThemeProgress messages={messages} currentStep={currentStep} />
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {messages.map((msg, idx) => (
            <Message 
              key={idx} 
              role={msg.role} 
              content={msg.content} 
              isLatest={idx === messages.length - 1} 
            />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="border-t border-stone-800/50 bg-stone-900/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  sendMessage(); 
                }
              }}
              placeholder="Share what's on your mind..."
              rows={1}
              className="flex-1 px-4 py-3 rounded-xl bg-stone-800/50 border border-stone-700/30 text-stone-100 placeholder-stone-500 resize-none focus:outline-none focus:border-amber-700/50 focus:ring-1 focus:ring-amber-700/30"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 rounded-xl bg-amber-900/60 text-amber-100 border border-amber-700/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-900/80 transition-all focus:outline-none focus:ring-2 focus:ring-amber-600/50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="text-center text-stone-600 text-xs mt-3">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </footer>
    </div>
  );
}
