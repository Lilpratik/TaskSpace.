import React from 'react';
import { FaCheckCircle, FaRegCircle, FaEdit, FaTrash } from 'react-icons/fa';

const TaskCard = ({ 
  task, 
  isSelected, 
  onSelect, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div 
      className={`task-card glass-panel fade-in ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(task)}
    >
      <div 
        className="task-checkbox-container"
        onClick={(e) => onToggleComplete(task, e)}
      >
        {task.completed ? (
          <FaCheckCircle className="task-checkbox-icon completed" />
        ) : (
          <FaRegCircle className="task-checkbox-icon pending" />
        )}
      </div>

      <div className="task-content">
        <h4 className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title}
        </h4>
        {task.description && (
          <p className={`task-desc ${task.completed ? 'completed' : ''}`}>
            {task.description}
          </p>
        )}
      </div>

      <div className="task-actions">
        <button 
          className="task-action-btn edit" 
          onClick={(e) => onEdit(task, e)}
          title="Edit Task"
        >
          <FaEdit size={14} />
        </button>
        <button 
          className="task-action-btn delete" 
          onClick={(e) => onDelete(task._id, e)}
          title="Delete Task"
        >
          <FaTrash size={14} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
