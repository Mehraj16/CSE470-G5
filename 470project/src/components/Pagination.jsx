import React, { useState, useEffect } from 'react';
import viewall from '../css/viewall.module.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    
    const handlePageChange = (page) => {
      onPageChange(page);
    };
  
    const renderPageNumbers = () => {
      const maxPageNumbers = 3; // Maximum number of page numbers to display
      const pageNumbers = [];
  
      if (totalPages <= maxPageNumbers) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(
            <li key={i} className={currentPage === i ? 'active' : ''}>
              <button onClick={() => handlePageChange(i)}>{i}</button>
            </li>
          );
        }
      } else {
        const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
        const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
  
        if (startPage > 1) {
          pageNumbers.push(
            <li key={1}>
              <button onClick={() => handlePageChange(1)}>1</button>
            </li>
          );
          if (startPage > 2) {
            pageNumbers.push(<li key="startEllipsis">...</li>);
          }
        }
  
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(
            <li key={i} className={currentPage === i ? 'active' : ''}>
              <button onClick={() => handlePageChange(i)}>{i}</button>
            </li>
          );
        }
  
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            pageNumbers.push(<li key="endEllipsis">...</li>);
          }
          pageNumbers.push(
            <li key={totalPages}>
              <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
            </li>
          );
        }
      }
  
      return pageNumbers;
    };
  
    return (
      <div className={viewall.pagination}>
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First</button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <ul className="page-numbers">
          {renderPageNumbers()}
        </ul>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last</button>
      </div>
    );
}