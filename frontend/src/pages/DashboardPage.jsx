import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';
import TaskCard from '../components/Tasks/TaskCard';
import TaskModal from '../components/Tasks/TaskModal';
import AttachmentManager from '../components/Tasks/AttachmentManager';
import { 
  FaTasks, 
  FaCheckCircle, 
  FaRegCircle, 
  FaSearch, 
  FaPlus, 
  FaSignOutAlt, 
  FaSpinner,
  FaCalendarAlt
} from 'react-icons/fa';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Navigation & Search State
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Task details for Drawer
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskFiles, setSelectedTaskFiles] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); // null means "Create mode"

  // Fetch tasks on mount
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      if (err.message === 'No tasks') {
        setTasks([]);
      } else {
        setError(err.message || 'Failed to fetch tasks.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch single task details (including attachments) for drawer
  const fetchTaskDetails = async (taskId) => {
    setLoadingDetails(true);
    try {
      const data = await api.getTaskDetails(taskId);
      setSelectedTask(data.task);
      setSelectedTaskFiles(data.files || []);
    } catch (err) {
      console.error('Failed to load task details', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Select task callback
  const handleSelectTask = (task) => {
    fetchTaskDetails(task._id);
  };

  // Toggle completion status
  const handleToggleComplete = async (task, e) => {
    e.stopPropagation(); // Avoid opening details drawer
    try {
      const updatedStatus = !task.completed;
      await api.updateTask(task._id, { completed: updatedStatus });
      
      // Update state locally
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, completed: updatedStatus } : t));
      
      // If the toggled task is currently opened in drawer, update drawer state
      if (selectedTask && selectedTask._id === task._id) {
        setSelectedTask(prev => ({ ...prev, completed: updatedStatus }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  // Delete task callback
  const handleDeleteTask = async (taskId, e) => {
    e?.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await api.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(null);
        setSelectedTaskFiles([]);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete task.');
    }
  };

  // Open modal for task creation
  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  // Open modal for task editing
  const handleOpenEditModal = (task, e) => {
    e.stopPropagation();
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Handle task created/updated in modal
  const handleSaveTask = (savedTask, isEdit) => {
    if (isEdit) {
      setTasks(prev => prev.map(t => t._id === savedTask._id ? savedTask : t));
      if (selectedTask && selectedTask._id === savedTask._id) {
        setSelectedTask(savedTask);
      }
    } else {
      setTasks(prev => [savedTask, ...prev]);
    }
  };

  // Filter tasks based on activeTab and searchQuery
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Filter by status tab
      if (activeTab === 'active' && task.completed) return false;
      if (activeTab === 'completed' && !task.completed) return false;

      // 2. Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }

      return true;
    });
  }, [tasks, activeTab, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, active, rate };
  }, [tasks]);

  return (
    <div className="dashboard-container">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">
            <div className="sidebar-logo-circle"></div>
            <h2>TaskSpace.</h2>
          </div>
          
          <ul className="sidebar-menu">
            <li 
              className={`sidebar-item ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <FaTasks /> All Tasks
            </li>
            <li 
              className={`sidebar-item ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              <FaRegCircle /> Active Tasks
            </li>
            <li 
              className={`sidebar-item ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              <FaCheckCircle /> Completed
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="logout-btn" onClick={logout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main dashboard content */}
      <main className="main-content">
        <div className="welcome-header">
          <h1>My Workspace</h1>
          <p>Organize, schedule, and complete your tasks seamlessly.</p>
        </div>

        {/* Stats Row */}
        <section className="stats-grid">
          <div className="stat-card glass-panel">
            <span className="stat-card-title">Total Tasks</span>
            <span className="stat-card-value">{stats.total}</span>
          </div>
          <div className="stat-card glass-panel">
            <span className="stat-card-title">Active</span>
            <span className="stat-card-value" style={{ color: 'var(--warning)' }}>{stats.active}</span>
          </div>
          <div className="stat-card glass-panel">
            <span className="stat-card-title">Completed</span>
            <span className="stat-card-value" style={{ color: 'var(--success)' }}>{stats.completed}</span>
          </div>
          <div className="stat-card glass-panel">
            <span className="stat-card-title">Completion Rate</span>
            <span className="stat-card-value">{stats.rate}%</span>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${stats.rate}%` }}></div>
            </div>
          </div>
        </section>

        {/* Toolbar Controls */}
        <div className="toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={handleOpenCreateModal}>
            <FaPlus /> New Task
          </button>
        </div>

        {/* Workspace Body: List + Drawer details */}
        <div className="task-workspace">
          <div className="task-board-panel">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                <FaSpinner className="spinner" style={{ animation: 'spin 1s linear infinite', fontSize: '32px', color: 'var(--accent-primary)' }} />
              </div>
            ) : error ? (
              <div className="glass-panel" style={{ padding: '24px', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}>
                {error}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaTasks />
                </div>
                <h3>No tasks found</h3>
                <p>
                  {searchQuery 
                    ? "Try adjusting your search terms or filter constraints." 
                    : activeTab === 'completed' 
                      ? "You haven't completed any tasks yet."
                      : activeTab === 'active' 
                        ? "Hooray! No pending tasks left."
                        : "Let's kick things off by creating your very first task!"}
                </p>
                {!searchQuery && activeTab === 'all' && (
                  <button className="btn btn-primary" onClick={handleOpenCreateModal}>
                    <FaPlus /> Create Task
                  </button>
                )}
              </div>
            ) : (
              <div className="task-list-grid">
                {filteredTasks.map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    isSelected={selectedTask && selectedTask._id === task._id}
                    onSelect={handleSelectTask}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sticky Details Drawer */}
          {selectedTask && (
            <aside className="detail-drawer glass-panel fade-in">
              <div className="detail-header">
                <div>
                  <h3 className="detail-title">{selectedTask.title}</h3>
                  <div className="detail-meta-row">
                    <span className={`badge ${selectedTask.completed ? 'badge-success' : 'badge-pending'}`}>
                      {selectedTask.completed ? 'Completed' : 'Active'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaCalendarAlt size={12} />
                      {new Date(selectedTask.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className="detail-close" onClick={() => { setSelectedTask(null); setSelectedTaskFiles([]); }}>
                  &times;
                </button>
              </div>

              {selectedTask.description && (
                <div className="detail-description">
                  {selectedTask.description}
                </div>
              )}

              {/* Attachments Section */}
              <div className="detail-files-section">
                <AttachmentManager 
                  taskId={selectedTask._id} 
                  files={selectedTaskFiles} 
                  loading={loadingDetails}
                  onUploadComplete={() => fetchTaskDetails(selectedTask._id)}
                />
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Task Creation / Editing Modal */}
      {isModalOpen && (
        <TaskModal 
          isOpen={isModalOpen}
          task={taskToEdit}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default DashboardPage;
