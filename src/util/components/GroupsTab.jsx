import React, { useState, useEffect } from 'react';
import { iconOptions, getIconCategories, getIconsByCategory } from '../../utils/iconMapper';

const API_BASE = '/api';

export default function GroupsTab() {
  const [groups, setGroups] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/groups?status=${statusFilter}&page=${page}`);
      const data = await res.json();
      setGroups(data.groups);
      setTotal(data.total);
    } catch (e) {
      console.error("Failed to fetch groups", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [statusFilter, page]);

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE}/groups/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setGroups(groups.map(g => g.id === id ? { ...g, status: newStatus } : g));
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const updateGroup = async (id, updates) => {
    try {
      await fetch(`${API_BASE}/groups/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      setGroups(groups.map(g => g.id === id ? { ...g, ...updates } : g));
      setEditingGroup(null);
    } catch (e) {
      alert("Failed to update group");
    }
  };

  const startEditing = (group) => {
    setEditingGroup({
      id: group.id,
      word1_fa: group.word1_fa || '',
      word2_fa: group.word2_fa || '',
      word3_fa: group.word3_fa || '',
      word4_fa: group.word4_fa || '',
      word1_en: group.word1_en || '',
      word2_en: group.word2_en || '',
      word3_en: group.word3_en || '',
      word4_en: group.word4_en || '',
      word1_finglish: group.word1_finglish || '',
      word2_finglish: group.word2_finglish || '',
      word3_finglish: group.word3_finglish || '',
      word4_finglish: group.word4_finglish || '',
      relation_clean: group.relation_clean || '',
      relation_clean_en: group.relation_clean_en || '',
      difficulty: group.difficulty || 'medium',
      icon_enabled: group.icon_enabled || 0,
      icon_label: group.icon_label || '',
      icon_emoji: group.icon_emoji || '',
      icon_name: group.icon_name || ''
    });
  };

  const saveEditing = () => {
    if (!editingGroup) return;
    const { id, ...updates } = editingGroup;
    updateGroup(id, updates);
  };

  const cancelEditing = () => {
    setEditingGroup(null);
  };

  const updateEditField = (field, value) => {
    setEditingGroup({ ...editingGroup, [field]: value });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {['all', 'generated', 'validated', 'approved', 'rejected', 'used_in_level'].map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1 rounded text-sm capitalize ${
                statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <div className="text-gray-400">Total: {total}</div>
      </div>

      {/* Edit Modal */}
      {editingGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Group #{editingGroup.id}</h3>
              <button onClick={cancelEditing} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Words Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-400">Words (کلمات)</h4>
                
                {[1, 2, 3, 4].map(num => (
                  <div key={num} className="grid grid-cols-3 gap-4 p-4 bg-gray-900 rounded-lg">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Word {num} (Persian)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={editingGroup[`word${num}_fa`]}
                        onChange={(e) => updateEditField(`word${num}_fa`, e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        placeholder="کلمه فارسی"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">English Translation</label>
                      <input
                        type="text"
                        value={editingGroup[`word${num}_en`]}
                        onChange={(e) => updateEditField(`word${num}_en`, e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        placeholder="English"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Finglish</label>
                      <input
                        type="text"
                        value={editingGroup[`word${num}_finglish`]}
                        onChange={(e) => updateEditField(`word${num}_finglish`, e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        placeholder="finglish"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Relation Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-400">Category/Relation (دسته‌بندی)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Relation (Persian)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={editingGroup.relation_clean}
                      onChange={(e) => updateEditField('relation_clean', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="دسته‌بندی"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Relation (English)</label>
                    <input
                      type="text"
                      value={editingGroup.relation_clean_en}
                      onChange={(e) => updateEditField('relation_clean_en', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Category"
                    />
                  </div>
                </div>
              </div>

              {/* Icon Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-400">Icon Settings (تنظیمات آیکون)</h4>
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingGroup.icon_enabled === 1}
                      onChange={(e) => updateEditField('icon_enabled', e.target.checked ? 1 : 0)}
                      className="w-5 h-5"
                    />
                    <span className="text-white">Enable Icon Conversion (فعال‌سازی تبدیل به آیکون)</span>
                  </label>
                </div>
                
                {editingGroup.icon_enabled === 1 && (
                  <div className="space-y-4 p-4 bg-gray-900 rounded-lg">
                    {/* Icon Picker */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Icon (from Lucide library)</label>
                      <select
                        value={editingGroup.icon_name}
                        onChange={(e) => updateEditField('icon_name', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      >
                        <option value="">-- Select an icon --</option>
                        {getIconCategories().map(category => (
                          <optgroup key={category} label={category}>
                            {getIconsByCategory(category).map(icon => (
                              <option key={icon.name} value={icon.name}>
                                {icon.label} ({icon.labelFa})
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      {editingGroup.icon_name && (
                        <div className="mt-2 p-2 bg-gray-800 rounded flex items-center gap-2">
                          <span className="text-xs text-gray-400">Preview:</span>
                          {(() => {
                            const iconOption = iconOptions.find(i => i.name === editingGroup.icon_name);
                            if (iconOption) {
                              const IconComp = iconOption.component;
                              return <IconComp className="w-6 h-6 text-blue-400" />;
                            }
                            return null;
                          })()}
                          <span className="text-white text-sm">{editingGroup.icon_name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Icon Label (optional)</label>
                        <input
                          type="text"
                          dir="rtl"
                          value={editingGroup.icon_label}
                          onChange={(e) => updateEditField('icon_label', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                          placeholder="نام آیکون (پیش‌فرض: نام دسته)"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to use category name</p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Emoji Fallback (optional)</label>
                        <input
                          type="text"
                          value={editingGroup.icon_emoji}
                          onChange={(e) => updateEditField('icon_emoji', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-2xl text-center"
                          placeholder="🎨"
                        />
                        <p className="text-xs text-gray-500 mt-1">Shown if icon fails to load</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Difficulty Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-blue-400">Difficulty (سختی)</h4>
                <select
                  value={editingGroup.difficulty}
                  onChange={(e) => updateEditField('difficulty', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value="easy">Easy (آسان)</option>
                  <option value="medium">Medium (متوسط)</option>
                  <option value="hard">Hard (سخت)</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 flex justify-end gap-4">
              <button
                onClick={cancelEditing}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveEditing}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Groups Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-900 text-gray-400 text-sm uppercase">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Words (Persian)</th>
              <th className="p-4">Relation</th>
              <th className="p-4">Difficulty</th>
              <th className="p-4">Icon</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
            ) : groups.map(group => (
              <tr key={group.id} className="hover:bg-gray-750">
                <td className="p-4 text-gray-500">#{group.id}</td>
                <td className="p-4 font-medium text-white" dir="rtl">
                  {group.word1_fa || group.word1} · {group.word2_fa || group.word2} · {group.word3_fa || group.word3} · {group.word4_fa || group.word4}
                </td>
                <td className="p-4 text-blue-300" dir="rtl">{group.relation_clean || group.relation_raw}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    group.difficulty === 'easy' ? 'bg-green-900 text-green-300' :
                    group.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {group.difficulty}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {group.icon_enabled ? (
                    <div className="flex items-center justify-center gap-1">
                      {group.icon_name && (() => {
                        const iconOption = iconOptions.find(i => i.name === group.icon_name);
                        if (iconOption) {
                          const IconComp = iconOption.component;
                          return <IconComp className="w-5 h-5 text-blue-400" />;
                        }
                        return null;
                      })()}
                      {group.icon_emoji && <span className="text-xl">{group.icon_emoji}</span>}
                      {!group.icon_name && !group.icon_emoji && '✓'}
                    </div>
                  ) : '-'}
                </td>
                <td className="p-4 text-sm text-gray-400">{group.status}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => startEditing(group)}
                    className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-xs text-white"
                  >
                    Edit
                  </button>
                  {group.status !== 'approved' && group.status !== 'used_in_level' && (
                    <button 
                      onClick={() => updateStatus(group.id, 'approved')}
                      className="px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-xs text-white"
                    >
                      Approve
                    </button>
                  )}
                  {group.status !== 'rejected' && (
                    <button 
                      onClick={() => updateStatus(group.id, 'rejected')}
                      className="px-3 py-1 bg-red-900 hover:bg-red-800 rounded text-xs text-white"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-center mt-6 gap-2">
        <button 
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2 text-gray-400">Page {page}</span>
        <button 
          disabled={groups.length < 50}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
