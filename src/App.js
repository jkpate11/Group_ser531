import { useRef, useState } from 'react';
import './App.css';

function App() {
  const queryRef = useRef('');
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
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
          {tableData.map((row, rowIndex) => (
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

  return (
    <div className="container">
      <div>
        <form onSubmit={handleQuery}>
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

        <div>
          <h2>Result:</h2>
          {renderTable()}
        </div>
      </div>
    </div>
  );
}

export default App;
