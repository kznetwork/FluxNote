import React, { useState, useEffect } from 'react';
import './NoteEditor.css';

function NoteEditor({ note, isEditing, onSave, onEdit, onCancel }) {
  const [editedNote, setEditedNote] = useState(note);

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const handleSave = () => {
    if (editedNote.title.trim() === '') {
      alert('제목을 입력해주세요.');
      return;
    }
    onSave(editedNote);
  };

  const handleCancel = () => {
    setEditedNote(note);
    onCancel();
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="note-editor d-flex flex-column h-100">
      <div className="editor-header bg-light border-bottom p-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="editor-meta text-muted small mb-2 mb-md-0">
            <span className="badge bg-secondary me-2">
              <i className="bi bi-calendar-plus me-1"></i>
              작성: {formatDateTime(note.createdAt)}
            </span>
            <span className="badge bg-info">
              <i className="bi bi-pencil-square me-1"></i>
              수정: {formatDateTime(note.updatedAt)}
            </span>
          </div>
          <div className="editor-actions">
            {isEditing ? (
              <div className="btn-group" role="group">
                <button className="btn btn-outline-secondary" onClick={handleCancel}>
                  <i className="bi bi-x-circle me-1"></i>
                  취소
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  <i className="bi bi-check-circle me-1"></i>
                  저장
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={onEdit}>
                <i className="bi bi-pencil me-1"></i>
                수정
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="editor-content flex-grow-1 p-4 overflow-auto">
        {isEditing ? (
          <>
            <input
              type="text"
              className="form-control form-control-lg mb-3 note-title-input border-0 border-bottom rounded-0"
              value={editedNote.title}
              onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
              placeholder="노트 제목"
              autoFocus
            />
            <textarea
              className="form-control note-content-input border-0 h-100"
              value={editedNote.content}
              onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
              placeholder="내용을 입력하세요..."
              style={{ resize: 'none' }}
            />
          </>
        ) : (
          <div className="card border-0">
            <div className="card-body">
              <h2 className="card-title note-title-display mb-4">{note.title}</h2>
              <div className="card-text note-content-display">
                {note.content || <span className="text-muted fst-italic">내용이 없습니다.</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteEditor;

