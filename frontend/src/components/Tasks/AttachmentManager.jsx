import React, { useState, useRef } from 'react';
import { api } from '../../api/api';
import {
  FaPaperclip,
  FaSpinner,
  FaFileAlt,
  FaFileImage,
  FaFilePdf,
  FaCloudUploadAlt,
  FaExternalLinkAlt
} from 'react-icons/fa';

const AttachmentManager = ({ taskId, files = [], loading = false, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Helper to match file icon based on MIME type
  const getFileIcon = (fileType = '') => {
    const type = fileType.toLowerCase();
    if (type.includes('image')) return <FaFileImage style={{ color: '#38bdf8' }} />;
    if (type.includes('pdf')) return <FaFilePdf style={{ color: '#f87171' }} />;
    return <FaFileAlt style={{ color: '#94a3b8' }} />;
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Optional: add a size limit validation (e.g. 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await api.uploadAttachment(taskId, selectedFile);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      setError(err.message || 'Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <h4 style={{
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <FaPaperclip size={12} /> Attachments ({files.length})
      </h4>

      {/* Error Alert */}
      {error && (
        <div style={{
          padding: '10px 12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          borderRadius: '6px',
          color: '#f87171',
          marginBottom: '16px',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      {/* Attachments List */}
      {loading ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '10px 0' }}>
          <FaSpinner className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading files...</span>
        </div>
      ) : files.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', fontStyle: 'italic' }}>
          No files attached to this task.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {files.map(file => (
            <a
              key={file._id}
              href={file.file_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                transition: 'var(--transition-fast)',
              }}
              className="attachment-item"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-muted)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', marginRight: '10px' }}>
                {getFileIcon(file.file_type)}
                <span style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {file.file_name}
                </span>
              </div>
              <FaExternalLinkAlt size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </a>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      <button
        type="button"
        className="btn btn-secondary"
        onClick={triggerFileSelect}
        disabled={uploading}
        style={{
          width: '100%',
          borderStyle: 'dashed',
          borderColor: 'var(--border-light)',
          background: 'rgba(255,255,255,0.01)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        {uploading ? (
          <>
            <FaSpinner className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
            Uploading file...
          </>
        ) : (
          <>
            <FaCloudUploadAlt size={16} />
            Attach a file
          </>
        )}
      </button>
    </div>
  );
};

export default AttachmentManager;
