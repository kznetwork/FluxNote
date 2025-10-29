import React from 'react';
import './NoteList.css';

function NoteList({ notes, selectedNote, onSelectNote, onDeleteNote }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '오늘';
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="note-list overflow-auto flex-grow-1">
      {notes.length === 0 ? (
        <div className="empty-list text-center p-4">
          <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
          <p className="text-muted">노트가 없습니다</p>
        </div>
      ) : (
        <div className="list-group list-group-flush">
          {notes.map(note => (
            <div
              key={note.id}
              className={`list-group-item list-group-item-action note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
              onClick={() => onSelectNote(note)}
            >
              <div className="d-flex w-100 justify-content-between align-items-start note-item-header">
                <h3 className="mb-2 fw-bold text-truncate flex-grow-1">{note.title}</h3>
                <button
                  className="btn btn-sm btn-delete-small ms-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  title="삭제"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <p className="mb-2 note-preview text-muted">{truncateText(note.content)}</p>
              <small className="note-date d-flex align-items-center text-secondary">
                <i className="bi bi-clock me-1"></i>
                {formatDate(note.updatedAt)}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteList;

