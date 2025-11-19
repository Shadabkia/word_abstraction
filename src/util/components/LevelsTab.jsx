import React, { useState, useEffect } from 'react';

const API_BASE = '/api';

export default function LevelsTab() {
  const [levels, setLevels] = useState([]);
  const [groups, setGroups] = useState([]); // Approved groups for selection
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [viewingLevel, setViewingLevel] = useState(null);
  
  // Level Form State (for both create and edit)
  const [levelId, setLevelId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newDiff, setNewDiff] = useState('medium');
  const [levelStatus, setLevelStatus] = useState('draft');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [iconConversions, setIconConversions] = useState({});

  const fetchLevels = async () => {
    const res = await fetch(`${API_BASE}/levels`);
    const data = await res.json();
    setLevels(data);
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const startCreating = async () => {
    setCreating(true);
    setEditing(false);
    // Fetch approved groups to pick from
    const res = await fetch(`${API_BASE}/groups?status=approved&limit=200`);
    const data = await res.json();
    setGroups(data.groups);
    
    // Reset form
    setLevelId(null);
    setNewName('');
    setNewNameEn('');
    setNewDiff('medium');
    setLevelStatus('draft');
    setSelectedGroups([]);
    setIconConversions({});
  };

  const startEditing = async (level) => {
    setEditing(true);
    setCreating(true);
    
    // Fetch approved groups
    const res = await fetch(`${API_BASE}/groups?status=approved&limit=200`);
    const data = await res.json();
    setGroups(data.groups);
    
    // Load level data into form
    const levelData = await fetch(`${API_BASE}/levels/${level.id}`).then(r => r.json());
    
    setLevelId(level.id);
    setNewName(levelData.name);
    setNewNameEn(levelData.name_en || '');
    setNewDiff(levelData.difficulty);
    setLevelStatus(levelData.status);
    setSelectedGroups(levelData.groups || []);
    setIconConversions(levelData.icon_conversions || {});
  };

  const toggleGroupSelection = (group) => {
    if (selectedGroups.find(g => g.id === group.id)) {
      const newSelected = selectedGroups.filter(g => g.id !== group.id);
      setSelectedGroups(newSelected);
      // Remove from icon conversions
      const newIconConversions = { ...iconConversions };
      delete newIconConversions[group.id];
      setIconConversions(newIconConversions);
    } else {
      // No limit on number of groups
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  const toggleIconConversion = (groupId) => {
    setIconConversions({
      ...iconConversions,
      [groupId]: !iconConversions[groupId]
    });
  };

  const saveLevel = async () => {
    if (selectedGroups.length < 4) {
      alert("Please select at least 4 groups.");
      return;
    }
    
    if (selectedGroups.length > 20) {
      alert("Maximum 20 groups per level.");
      return;
    }
    
    try {
      if (editing && levelId) {
        // Update existing level
        await fetch(`${API_BASE}/levels/${levelId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newName,
            name_en: newNameEn,
            difficulty: newDiff,
            status: levelStatus,
            group_ids: selectedGroups.map(g => g.id),
            icon_conversions: iconConversions,
            tags: []
          })
        });
      } else {
        // Create new level
        await fetch(`${API_BASE}/levels`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newName,
            name_en: newNameEn,
            difficulty: newDiff,
            status: levelStatus,
            group_ids: selectedGroups.map(g => g.id),
            icon_conversions: iconConversions,
            tags: []
          })
        });
      }
      
      // Reset form
      setCreating(false);
      setEditing(false);
      setLevelId(null);
      setNewName('');
      setNewNameEn('');
      setSelectedGroups([]);
      setIconConversions({});
      fetchLevels();
    } catch (e) {
      alert(`Error ${editing ? 'updating' : 'creating'} level: ${e.message}`);
    }
  };

  const viewLevel = async (levelId) => {
    try {
      const res = await fetch(`${API_BASE}/levels/${levelId}`);
      const data = await res.json();
      setViewingLevel(data);
    } catch (e) {
      alert("Error loading level");
    }
  };

  const publishLevel = async (levelId) => {
    try {
      await fetch(`${API_BASE}/levels/${levelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' })
      });
      fetchLevels();
    } catch (e) {
      alert("Error publishing level");
    }
  };

  const deleteLevel = async (levelId) => {
    if (!confirm('Are you sure you want to delete this level?')) {
      return;
    }
    
    try {
      // For now, we'll archive it instead of deleting
      await fetch(`${API_BASE}/levels/${levelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' })
      });
      fetchLevels();
    } catch (e) {
      alert("Error deleting level");
    }
  };

  return (
    <div className="p-6">
      {/* Viewing Level Detail */}
      {viewingLevel && !creating && (
        <div className="mb-6 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold" dir="rtl">{viewingLevel.name}</h2>
              {viewingLevel.name_en && <p className="text-gray-400 text-sm">{viewingLevel.name_en}</p>}
            </div>
            <div className="flex gap-2">
              {viewingLevel.status === 'draft' && (
                <button
                  onClick={() => publishLevel(viewingLevel.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                >
                  Publish
                </button>
              )}
              <button
                onClick={() => {
                  setViewingLevel(null);
                  startEditing(viewingLevel);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  deleteLevel(viewingLevel.id);
                  setViewingLevel(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              >
                Delete
              </button>
              <button
                onClick={() => setViewingLevel(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
              >
                Close
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 text-sm">
              <span className="px-3 py-1 bg-gray-700 rounded">Difficulty: {viewingLevel.difficulty}</span>
              <span className="px-3 py-1 bg-gray-700 rounded">Status: {viewingLevel.status}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {viewingLevel.groups?.map(group => {
                const shouldConvertToIcon = viewingLevel.icon_conversions?.[group.id];
                return (
                  <div key={group.id} className="bg-gray-900 p-4 rounded border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg" dir="rtl">{group.relation_clean}</h4>
                        {group.relation_clean_en && (
                          <p className="text-xs text-gray-400">{group.relation_clean_en}</p>
                        )}
                      </div>
                      {group.icon_enabled && shouldConvertToIcon && (
                        <div className="flex items-center gap-1 text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded">
                          <span>→ {group.icon_emoji}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-300 space-y-1" dir="rtl">
                      <div>• {group.word1_fa} ({group.word1_finglish})</div>
                      <div>• {group.word2_fa} ({group.word2_finglish})</div>
                      <div>• {group.word3_fa} ({group.word3_finglish})</div>
                      <div>• {group.word4_fa} ({group.word4_finglish})</div>
                    </div>
                    {group.icon_enabled && (
                      <div className="mt-2 text-xs text-gray-500">
                        Icon available: {group.icon_emoji} {group.icon_label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Level Creation */}
      {!creating && !viewingLevel && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Levels (مراحل بازی)</h2>
            <button 
              onClick={startCreating}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Create New Level
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {levels.map(level => {
              const groupIds = JSON.parse(level.group_ids || '[]');
              const iconConvs = JSON.parse(level.icon_conversions || '{}');
              const hasIcons = Object.values(iconConvs).some(v => v);
              
              return (
                <div key={level.id} className="bg-gray-800 p-4 rounded border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg" dir="rtl">{level.name}</h3>
                      {level.name_en && <p className="text-sm text-gray-400">{level.name_en}</p>}
                    </div>
                    <div className="flex gap-2 items-center">
                      {hasIcons && (
                        <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded">
                          Has Icons
                        </span>
                      )}
                      <span className={`text-sm px-2 py-1 rounded ${
                        level.status === 'published' ? 'bg-green-900 text-green-300' : 'bg-gray-700'
                      }`}>
                        {level.status}
                      </span>
                      <span className="text-sm bg-gray-700 px-2 py-1 rounded">{level.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-sm">Groups: {groupIds.length}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewLevel(level.id)}
                        className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm text-white"
                      >
                        View
                      </button>
                      <button
                        onClick={() => startEditing(level)}
                        className="px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-sm text-white"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Creating/Editing Level */}
      {creating && (
        <div className="bg-gray-800 p-6 rounded border border-gray-700">
          <h2 className="text-xl font-bold mb-6">
            {editing ? `Edit Level #${levelId} (ویرایش مرحله)` : 'New Level (مرحله جدید)'}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Level Name (Persian)</label>
              <input 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                dir="rtl"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                placeholder="نام مرحله"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Level Name (English)</label>
              <input 
                value={newNameEn} 
                onChange={e => setNewNameEn(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                placeholder="Level Name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
              <select 
                value={newDiff} 
                onChange={e => setNewDiff(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="easy">Easy (آسان)</option>
                <option value="medium">Medium (متوسط)</option>
                <option value="hard">Hard (سخت)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Status</label>
              <select 
                value={levelStatus} 
                onChange={e => setLevelStatus(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="draft">Draft (پیش‌نویس)</option>
                <option value="published">Published (منتشر شده)</option>
                <option value="archived">Archived (بایگانی شده)</option>
              </select>
            </div>
          </div>

          {/* Selected Groups with Icon Conversion */}
          {selectedGroups.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-green-400">
                Selected Groups ({selectedGroups.length}) {selectedGroups.length < 4 && <span className="text-red-400">- Need at least 4</span>}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedGroups.map(g => (
                  <div key={g.id} className="bg-gray-900 p-4 rounded border-2 border-green-700">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-bold text-lg" dir="rtl">{g.relation_clean}</div>
                        <div className="text-xs text-gray-400">{g.relation_clean_en}</div>
                      </div>
                      <button
                        onClick={() => toggleGroupSelection(g)}
                        className="text-red-400 hover:text-red-300 text-xl px-2"
                        title="Remove from level"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="text-xs text-gray-300 mb-3 space-y-1" dir="rtl">
                      <div>• {g.word1_fa} ({g.word1_finglish})</div>
                      <div>• {g.word2_fa} ({g.word2_finglish})</div>
                      <div>• {g.word3_fa} ({g.word3_finglish})</div>
                      <div>• {g.word4_fa} ({g.word4_finglish})</div>
                    </div>
                    
                    {/* Icon Conversion Toggle */}
                    <div className="pt-3 border-t border-gray-700">
                      {g.icon_enabled === 1 ? (
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={iconConversions[g.id] || false}
                            onChange={() => toggleIconConversion(g.id)}
                            className="w-5 h-5 cursor-pointer"
                          />
                          <span className={`text-sm font-medium ${
                            iconConversions[g.id] ? 'text-purple-300' : 'text-gray-400'
                          }`}>
                            {iconConversions[g.id] ? '✓ Will convert to icon' : 'Enable icon conversion'}
                          </span>
                          <span className="text-2xl">{g.icon_emoji}</span>
                        </label>
                      ) : (
                        <span className="text-xs text-gray-500 italic">
                          No icon available for this group
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Groups */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-gray-400">
                {editing ? 'Change Groups' : 'Select Groups'} ({selectedGroups.length} selected, min: 4, max: 20)
              </label>
              {selectedGroups.length >= 4 && (
                <span className="text-xs text-green-400">✓ Minimum requirement met</span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2 bg-gray-900 rounded">
              {groups.map(g => {
                const isSelected = selectedGroups.find(sg => sg.id === g.id);
                const isDisabled = !isSelected && selectedGroups.length >= 20;
                
                return (
                  <div 
                    key={g.id}
                    onClick={() => !isDisabled && toggleGroupSelection(g)}
                    className={`p-3 rounded cursor-pointer border transition-colors ${
                      isSelected 
                        ? 'bg-blue-900 border-blue-500' 
                        : isDisabled
                        ? 'bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-bold" dir="rtl">{g.relation_clean}</div>
                      <div className="flex items-center gap-1">
                        {isSelected && <span className="text-green-400 text-xs">✓</span>}
                        {g.icon_enabled === 1 && <span className="text-lg">{g.icon_emoji}</span>}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400" dir="rtl">
                      {g.word1_fa} · {g.word2_fa} · {g.word3_fa} · {g.word4_fa}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={saveLevel}
              disabled={selectedGroups.length < 4 || selectedGroups.length > 20 || !newName}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white disabled:opacity-50"
            >
              {editing ? 'Update Level' : 'Save Level'}
              {selectedGroups.length < 4 && <span className="ml-2 text-xs">(need {4 - selectedGroups.length} more)</span>}
            </button>
            <button 
              onClick={() => {
                setCreating(false);
                setEditing(false);
              }}
              className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
