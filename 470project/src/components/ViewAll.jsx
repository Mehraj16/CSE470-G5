import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useLocation, useNavigate } from 'react-router-dom';
import viewall from '../css/viewall.module.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
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
};

const ViewAll = () => {
  const location = useLocation();
  const props = location.state;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 7; // Change this according to your requirements

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Function to fetch data for the current page
  const fetchData = async () => {
    // For the sake of this example, fetching mock JSON data
    const response = await fetch('/article.json');
    const jsonData = await response.json();
    setData(jsonData);
    setTotalItems(jsonData.length); // Set total items based on the fetched data
  };

  // Get the index range of items to be displayed on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get the subset of data to be displayed on the current page
  const currentPageData = data.slice(startIndex, endIndex);

  // Callback function to handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const navigate = useNavigate();

  const showArticle = (e, item) =>{
    e.preventDefault();
    navigate('../article', {state: {
      props: props,
      id: item,
    }
    });
  }

  return (
    <div className='App'>
      <Sidebar />
      <Header profilepic={`/src/assets/${props}`}/>
      <div className='Content'>
        <h3>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</h3>
          <table className={viewall.viewtable}>
            <thead>
              <tr>
                <th>Author</th>
                <th>Title</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((item) => (
                <tr key={item.id}>
                  <td>{item.author}</td>
                  <td><a className={viewall.clickToView} href="" onClick={(e) => showArticle(e, item.id)}>{item.title}</a></td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ViewAll;
