import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import SearchBar from './components/SearchBar';
import Auth from './components/Auth';

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // localStorage에서 노트 불러오기
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // 노트 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // 새 노트 생성
  const handleCreateNote = () => {
    const newNote = {
      id: Date.now(),
      title: '새 노트',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  // 노트 저장
  const handleSaveNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date().toISOString() }
        : note
    ));
    setSelectedNote({ ...updatedNote, updatedAt: new Date().toISOString() });
    setIsEditing(false);
  };

  // 노트 삭제
  const handleDeleteNote = (noteId) => {
    if (window.confirm('이 노트를 삭제하시겠습니까?')) {
      setNotes(notes.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setIsEditing(false);
      }
    }
  };

  // 노트 선택
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setIsEditing(false);
  };

  // 노트 편집 시작
  const handleEditNote = () => {
    setIsEditing(true);
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // 로그인 성공 핸들러
  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setNotes([]);
      setSelectedNote(null);
    }
  };

  // 검색어로 노트 필터링
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 로그인되지 않았으면 Auth 컴포넌트 표시
  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="App">
      <header className="app-header bg-dark text-white shadow-sm">
        <div className="d-flex justify-content-between align-items-center w-100 px-3 py-2">
          <h1 className="mb-0 fw-bold">
            <i className="bi bi-journal-text me-2"></i>FluxNote
          </h1>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white">
              <i className="bi bi-person-circle me-2"></i>
              {user.username}
            </span>
            <button className="btn btn-success d-flex align-items-center" onClick={handleCreateNote}>
              <i className="bi bi-plus-circle me-2"></i>
              새 노트
            </button>
            <button className="btn btn-outline-light d-flex align-items-center" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              로그아웃
            </button>
          </div>
        </div>
      </header>
      
      <div className="app-container">
        <aside className="sidebar border-end bg-light">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <NoteList
            notes={filteredNotes}
            selectedNote={selectedNote}
            onSelectNote={handleSelectNote}
            onDeleteNote={handleDeleteNote}
          />
        </aside>
        
        <main className="main-content bg-white">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              isEditing={isEditing}
              onSave={handleSaveNote}
              onEdit={handleEditNote}
              onCancel={handleCancelEdit}
            />
          ) : (
            <div className="empty-state text-center">
              <i className="bi bi-journal-plus display-1 text-muted mb-4"></i>
              <h2 className="text-muted mb-4">노트를 선택하거나 새 노트를 만들어보세요</h2>
              <button className="btn btn-primary btn-lg d-flex align-items-center mx-auto" onClick={handleCreateNote}>
                <i className="bi bi-plus-circle me-2"></i>
                새 노트 만들기
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
