import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';

const TaskModal = ({ isOpen, task, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!task;

  // Sync state if editing an existing task
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setCompleted(task.completed || false);
    } else {
      setTitle('');
      setDescription('');
      setCompleted(false);
    }
    setError(null);
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      if (isEditMode) {
        await api.updateTask(task._id, { title, description, completed });
        // The update api returns a message, so we merge state locally for the UI
        result = { ...task, title, description, completed };
      } else {
        const data = await api.createTask({ title, description, completed });
        result = data.task;
      }
      onSave(result, isEditMode);
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{isEditMode ? 'Edit Task' : 'Create New Task'}</h3>
          <button className="modal-close" onClick={onClose} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '24px' }}>
            &times;
          </button>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            color: '#f87171',
            marginBottom: '20px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label htmlFor="task-title">Title*</label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Design user landing page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              autoFocus
              required
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              rows="4"
              placeholder="Provide a detailed description of what needs to be done..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                background: 'rgba(15, 22, 42, 0.8)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                padding: '12px 16px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {isEditMode && (
            <div className="modal-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input
                id="task-completed"
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                disabled={loading}
                style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
              />
              <label htmlFor="task-completed" style={{ textTransform: 'none', fontSize: '14px', cursor: 'pointer', userSelect: 'none' }}>
                Mark as Completed
              </label>
            </div>
          )}

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
