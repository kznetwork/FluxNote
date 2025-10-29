import React from 'react';
import './SearchBar.css';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-bar p-3 border-bottom">
      <div className="input-group">
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search text-muted"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0 ps-0"
          placeholder="노트 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button 
            className="btn btn-outline-secondary border-start-0"
            onClick={() => onSearchChange('')}
            title="검색어 지우기"
            type="button"
          >
            <i className="bi bi-x-circle"></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;

