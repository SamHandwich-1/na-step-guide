'use client';

import { useState, useEffect } from 'react';

// Core belief options for dropdown
const CORE_BELIEFS = [
  "I'm not good enough",
  "I'm unlovable",
  "I'll be abandoned",
  "I can't trust anyone",
  "I'm defective/flawed",
  "I don't matter",
  "I'm worthless",
  "I'm invisible",
  "I'm unsafe",
  "I have to be perfect",
  "I'm a burden",
  "I don't deserve good things",
  "I'm powerless",
  "I'm alone",
  "Other (specify)"
];

const FEELINGS = [
  "Angry", "Resentful", "Hurt", "Scared", "Sad", "Ashamed", 
  "Guilty", "Jealous", "Anxious", "Bitter", "Betrayed", "Abandoned"
];

// ============================================
// STEP 4: RESENTMENT INVENTORY
// ============================================

export function InventorySection({ inventory, setInventory }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    person: '',
    whatHappened: '',
    coreBelief: '',
    customBelief: '',
    feelings: [],
    myPart: ''
  });

  const resetForm = () => {
    setFormData({
      person: '',
      whatHappened: '',
      coreBelief: '',
      customBelief: '',
      feelings: [],
      myPart: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    const belief = formData.coreBelief === 'Other (specify)' 
      ? formData.customBelief 
      : formData.coreBelief;

    if (editingId) {
      setInventory(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, ...formData, coreBelief: belief, updatedAt: new Date().toISOString() }
          : item
      ));
    } else {
      const newEntry = {
        id: Date.now().toString(),
        ...formData,
        coreBelief: belief,
        createdAt: new Date().toISOString()
      };
      setInventory(prev => [...prev, newEntry]);
    }
    resetForm();
  };

  const handleEdit = (item) => {
    const isCustomBelief = !CORE_BELIEFS.slice(0, -1).includes(item.coreBelief);
    setFormData({
      person: item.person,
      whatHappened: item.whatHappened,
      coreBelief: isCustomBelief ? 'Other (specify)' : item.coreBelief,
      customBelief: isCustomBelief ? item.coreBelief : '',
      feelings: item.feelings || [],
      myPart: item.myPart || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this entry?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const toggleFeeling = (feeling) => {
    setFormData(prev => ({
      ...prev,
      feelings: prev.feelings.includes(feeling)
        ? prev.feelings.filter(f => f !== feeling)
        : [...prev.feelings, feeling]
    }));
  };

  return (
    <div className="min-h-screen bg-stone-900 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl text-stone-100 mb-2">Step 4: Inventory</h1>
          <p className="text-stone-400 text-sm">
            A searching and fearless moral inventory. Map your resentments to the core beliefs they trigger.
          </p>
        </div>

        {/* Explanation Card */}
        <div className="bg-stone-800/30 border border-stone-700/30 rounded-xl p-4 mb-6">
          <p className="text-stone-300 text-sm leading-relaxed">
            Every resentment is a window into a wounded part of us. When someone triggers our anger, 
            they've usually touched an old belief formed long ago — often in childhood. 
            This inventory isn't about blame; it's about understanding what's underneath.
          </p>
        </div>

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full p-4 rounded-xl border-2 border-dashed border-stone-700 text-stone-400 hover:border-amber-700/50 hover:text-amber-200 transition-all mb-6"
          >
            + Add Resentment
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5 mb-6">
            <h3 className="text-stone-100 font-medium mb-4">
              {editingId ? 'Edit Entry' : 'New Resentment'}
            </h3>
            
            <div className="space-y-4">
              {/* Person/Institution */}
              <div>
                <label className="block text-stone-400 text-sm mb-1">Who or what?</label>
                <input
                  type="text"
                  value={formData.person}
                  onChange={(e) => setFormData(prev => ({ ...prev, person: e.target.value }))}
                  placeholder="Person, institution, or situation"
                  className="w-full px-4 py-3 rounded-xl bg-stone-900/50 border border-stone-700/50 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-700/50"
                />
              </div>

              {/* What Happened */}
              <div>
                <label className="block text-stone-400 text-sm mb-1">What happened?</label>
                <textarea
                  value={formData.whatHappened}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatHappened: e.target.value }))}
                  placeholder="Describe the situation or behavior"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-stone-900/50 border border-stone-700/50 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-700/50 resize-none"
                />
              </div>

              {/* Core Belief */}
              <div>
                <label className="block text-stone-400 text-sm mb-1">
                  What core belief does this trigger?
                </label>
                <select
                  value={formData.coreBelief}
                  onChange={(e) => setFormData(prev => ({ ...prev, coreBelief: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-stone-900/50 border border-stone-700/50 text-stone-100 focus:outline-none focus:border-amber-700/50"
                >
                  <option value="">Select a core belief...</option>
                  {CORE_BELIEFS.map(belief => (
                    <option key={belief} value={belief}>{belief}</option>
                  ))}
                </select>
                {formData.coreBelief === 'Other (specify)' && (
                  <input
                    type="text"
                    value={formData.customBelief}
                    onChange={(e) => setFormData(prev => ({ ...prev, customBelief: e.target.value }))}
                    placeholder="Enter your core belief"
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-stone-900/50 border border-stone-700/50 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-700/50"
                  />
                )}
              </div>

              {/* Feelings */}
              <div>
                <label className="block text-stone-400 text-sm mb-2">How does it make you feel?</label>
                <div className="flex flex-wrap gap-2">
                  {FEELINGS.map(feeling => (
                    <button
                      key={feeling}
                      type="button"
                      onClick={() => toggleFeeling(feeling)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        formData.feelings.includes(feeling)
                          ? 'bg-amber-900/50 text-amber-200 border border-amber-700/50'
                          : 'bg-stone-800/50 text-stone-400 border border-stone-700/50 hover:border-stone-600'
                      }`}
                    >
                      {feeling}
                    </button>
                  ))}
                </div>
              </div>

              {/* My Part (Optional) */}
              <div>
                <label className="block text-stone-400 text-sm mb-1">
                  My part (optional)
                </label>
                <textarea
                  value={formData.myPart}
                  onChange={(e) => setFormData(prev => ({ ...prev, myPart: e.target.value }))}
                  placeholder="What was my role in this? (Be gentle with yourself)"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-stone-900/50 border border-stone-700/50 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-700/50 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={resetForm}
                  className="flex-1 py-3 rounded-xl border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.person || !formData.whatHappened || !formData.coreBelief}
                  className="flex-1 py-3 rounded-xl bg-amber-900/60 text-amber-100 border border-amber-700/30 hover:bg-amber-900/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingId ? 'Save Changes' : 'Add Entry'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Inventory List */}
        {inventory.length > 0 ? (
          <div className="space-y-3">
            {inventory.map((item) => (
              <div 
                key={item.id}
                className="bg-stone-800/30 border border-stone-700/30 rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-stone-100 font-medium">{item.person}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-stone-500 hover:text-stone-300 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-stone-500 hover:text-red-400 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-stone-400 text-sm mb-3">{item.whatHappened}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2 py-1 rounded-lg bg-amber-900/30 text-amber-200 text-xs border border-amber-700/30">
                    "{item.coreBelief}"
                  </span>
                  {item.feelings?.map(feeling => (
                    <span key={feeling} className="px-2 py-1 rounded-lg bg-stone-700/30 text-stone-400 text-xs">
                      {feeling}
                    </span>
                  ))}
                </div>
                {item.myPart && (
                  <p className="text-stone-500 text-xs italic mt-2">My part: {item.myPart}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          !showForm && (
            <div className="text-center py-12 text-stone-500">
              <p>No entries yet.</p>
              <p className="text-sm mt-1">Your inventory is stored locally on your device.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}


// ============================================
// STEP 8: AMENDS LIST
// ============================================

const AMEND_STATUS = [
  { id: 'not_ready', label: 'Not ready', color: 'stone' },
  { id: 'willing', label: 'Willing', color: 'amber' },
  { id: 'in_progress', label: 'In progress', color: 'sky' },
  { id: 'complete', label: 'Complete', color: 'emerald' },
  { id: 'living', label: 'Living amend', color: 'violet' }
];

export function AmendsSection({ amends, setAmends, inventory }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    person: '',
    theHarm: '',
    amendNeeded: '',
    status: 'not_ready',
    notes: '',
    linkedResentment: ''
  });

  const resetForm = () => {
    setFormData({
      person: '',
      theHarm: '',
      amendNeeded: '',
      status: 'not_ready',
      notes: '',
      linkedResentment: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (editingId) {
      setAmends(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, ...formData, updatedAt: new Date().toISOString() }
          : item
      ));
    } else {
      const newEntry = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setAmends(prev => [...prev, newEntry]);
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setFormData({
      person: item.person,
      theHarm: item.theHarm,
      amendNeeded: item.amendNeeded,
      status: item.status,
      notes: item.notes || '',
      linkedResentment: item.linkedResentment || ''
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this entry?')) {
      setAmends(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateStatus = (id, newStatus) => {
    setAmends(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: newStatus, updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const getStatusStyle = (statusId) => {
    const status = AMEND_STATUS.find(s => s.id === statusId);
    if (!status) return 'bg-stone-700/30 text-stone-400';
    
    const styles = {
      stone: 'bg-stone-700/30 text-stone-400 border-stone-600/30',
      amber: 'bg-amber-900/30 text-amber-200 border-amber-700/30',
      sky: 'bg-sky-900/30 text-sky-200 border-sky-700/30',
      emerald: 'bg-emerald-900/30 text-emerald-200 border-emerald-700/30',
      violet: 'bg-violet-900/30 text-violet-200 border-violet-700/30'
    };
    return styles[status.color] || styles.stone;
  };

  // Group by status for display
  const groupedAmends = AMEND_STATUS.reduce((acc, status) => {
    acc[status.id] = amends.filter(a => a.status === status.id);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-stone-900 p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl text-stone-100 mb-2">Step 8: Amends List</h1>
          <p className="text-stone-400 text-sm">
            Made a list of all persons we had harmed, and became willing to make amends to them all.
          </p>
        </div>

        {/* Explanation Card */}
        <div className="bg-stone-800/30 border border-stone-700/30 rounded-xl p-4 mb-6">
          <p className="text-stone-300 text-sm leading-relaxed">
            This is about willingness, not action (that's Step 9). The goal is clarity: 
            who was harmed, how, and what might repair it. Willingness often comes slowly — 
            it's okay to mark someone as "not ready" and return later.
          </p>
        </div>

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full p-4 rounded-xl border-2 border-dashed border-stone-700 text-stone-400 hover:border-amber-700/50 hover:text-amber-200 transition-all mb-6"
          >
            + Add Person
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5 mb-6">
            <h3 className="text-stone-100 font-medium mb-4">
              {editingId ? 'Edit Entry' : 'New Amend'}
            </h3>
            
            <div className="space-y-4">
              {/* Person */}
              <div>
                <label className="block text-stone-400 text-sm mb-1">Who was harmed?</label>
                <input
                  type="text"
                  value={formData.person}
                  onChange={(e) => setFormData(prev => ({ ...prev, person: e.target.value }))}
                  placeholder="Person's name"
                  className="w-full px-4 py-3 rounded-xl bg-stone-900/50 border border-stone-700/50 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-700/50"
                />
              </div>

              {/* Link to Resentment (Optional) */}
              {inventory.length > 0 && (
                <div>
                  <label className="block text-stone-400 text-sm mb-1">
                    Link to inventory entry (optional)
                  </label>
                  <select
                    value={formData.linkedResentment}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedResentment: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-stone-900/50 border border-stone-700/50 text-stone-100 focus:outline-none focus:border-amber-700/50"
                  >
                    <option value="">None</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>{item.person}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* The Harm */}
              <div>
                <label className="block text-stone-400 text-sm mb-1">What was the harm?</label>
                <textarea
                  value={formData.theHarm}
                  onChange={(e) => setFormData(prev => ({ ...prev, theHarm: e.target.value }))}
                  placeholder="How did my actions affect this person?"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-stone-900/50 border border-stone-700/50 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-700/50 resize-none"
                />
              </div>

              {/* Amend Needed */}
              <div>
                <label className="block text-stone-400 text-sm mb-1">What amend might be needed?</label>
                <textarea
                  value={formData.amendNeeded}
                  onChange={(e) => setFormData(prev => ({ ...prev, amendNeeded: e.target.value }))}
                  placeholder="Direct amend, living amend, or financial restitution?"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-stone-900/50 border border-stone-700/50 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-700/50 resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-stone-400 text-sm mb-2">Current status</label>
                <div className="flex flex-wrap gap-2">
                  {AMEND_STATUS.map(status => (
                    <button
                      key={status.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: status.id }))}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        formData.status === status.id
                          ? getStatusStyle(status.id)
                          : 'bg-stone-800/50 text-stone-500 border-stone-700/50 hover:border-stone-600'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-stone-400 text-sm mb-1">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional thoughts, sponsor guidance, etc."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-stone-900/50 border border-stone-700/50 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-700/50 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={resetForm}
                  className="flex-1 py-3 rounded-xl border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.person || !formData.theHarm}
                  className="flex-1 py-3 rounded-xl bg-amber-900/60 text-amber-100 border border-amber-700/30 hover:bg-amber-900/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingId ? 'Save Changes' : 'Add Entry'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Amends List - Grouped by Status */}
        {amends.length > 0 ? (
          <div className="space-y-6">
            {AMEND_STATUS.map(status => {
              const items = groupedAmends[status.id];
              if (items.length === 0) return null;
              
              return (
                <div key={status.id}>
                  <h3 className={`text-sm font-medium mb-3 ${
                    status.color === 'stone' ? 'text-stone-400' :
                    status.color === 'amber' ? 'text-amber-200' :
                    status.color === 'sky' ? 'text-sky-200' :
                    status.color === 'emerald' ? 'text-emerald-200' :
                    'text-violet-200'
                  }`}>
                    {status.label} ({items.length})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-stone-800/30 border border-stone-700/30 rounded-xl p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-stone-100 font-medium">{item.person}</h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-stone-500 hover:text-stone-300 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-stone-500 hover:text-red-400 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="text-stone-400 text-sm mb-2">{item.theHarm}</p>
                        {item.amendNeeded && (
                          <p className="text-stone-500 text-sm mb-3">
                            <span className="text-stone-400">Amend:</span> {item.amendNeeded}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {AMEND_STATUS.map(s => (
                            <button
                              key={s.id}
                              onClick={() => updateStatus(item.id, s.id)}
                              className={`px-2 py-1 rounded-lg text-xs border transition-all ${
                                item.status === s.id
                                  ? getStatusStyle(s.id)
                                  : 'bg-stone-800/30 text-stone-600 border-stone-700/30 hover:border-stone-600'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                        {item.notes && (
                          <p className="text-stone-500 text-xs italic mt-3">{item.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !showForm && (
            <div className="text-center py-12 text-stone-500">
              <p>No entries yet.</p>
              <p className="text-sm mt-1">Your amends list is stored locally on your device.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
