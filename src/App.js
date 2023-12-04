import { useRef, useState } from 'react';
import './App.css';

function App() {
  const queryRef = useRef('');
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const URL = `http://54.200.226.251:3030/sample/query`;

  const handleQuery = async (e) => {
    e.preventDefault();

    const query = queryRef.current.value;
    const queryFinal = { query: query };

    var formBody = [];
    for (var property in queryFinal) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(queryFinal[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: formBody
      });

      if (res.ok) {
        const data = await res.json();
        setTableHeaders(data.head.vars);
        setTableData(data.results.bindings);
        setCurrentPage(1); 
      } else {
        setTableHeaders([]);
        setTableData([]);
      }
    } catch (error) {
      setTableHeaders([]);
      setTableData([]);
    }
  };

  const renderTable = () => {
    if (tableHeaders.length === 0) {
      return null;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const displayedData = tableData.slice(startIndex, endIndex);

    return (
      <table>
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {tableHeaders.map((header, headerIndex) => (
                <td key={headerIndex}>{row[header]?.value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(tableData.length / itemsPerPage);

    if (totalPages <= 1) {
      return null;
    }

    return (
      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <div>
      <h1 className="title">Homicide Tracker and Analyzer</h1>
        <form className="custom-form" onSubmit={handleQuery}>
          <textarea
            className="custom-textarea"
            ref={queryRef}
            placeholder="Query"
            required
          ></textarea>

          <button type="submit" className="custom-button">
            Submit
          </button>
        </form>

        <div className="table-container">
          <h2>Result:</h2>
          {renderTable()}
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}

export default App;
