import { useRef, useState } from 'react';
import './App.css';

function App() {
  const queryRef = useRef('');
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const URL = `http://54.191.86.183:3030/sample/query`;

  const queries = [
    'PREFIX homicide: <http://www.semanticweb.org/dvadher1/ontologies/2023/10/homicide-tracker-and-analyser#> \
    SELECT (COUNT(?offender) AS ?numGuns) \
    WHERE { \
      ?offender a homicide:Offender ; \
                 homicide:hasWeapon ?weapon . \
      FILTER(?weapon = 11 || ?weapon = 12 || ?weapon = 13 || ?weapon = 14 || ?weapon = 15) \
    }',
    'PREFIX homicide: <http://www.semanticweb.org/dvadher1/ontologies/2023/10/homicide-tracker-and-analyser#> \
    SELECT ?incident ?offender ?victim \
    WHERE { \
      ?incident a homicide:Incident ; \
                 homicide:hasHomMult ?homMult . \
      FILTER(str(?homMult) = "D") \
      ?incident homicide:involvesOffender ?offender . \
      ?incident homicide:involvesVictim ?victim .  \
    }',
    'PREFIX homicide: <http://www.semanticweb.org/dvadher1/ontologies/2023/10/homicide-tracker-and-analyser#> \
    SELECT ?month (COUNT(?incident) AS ?numIncidents) \
    WHERE { \
      ?incident a homicide:Incident ; \
                homicide:hasMonth ?rawMonth . \
      BIND(REPLACE(?rawMonth,"^0*","") AS ?month) \
    } \
    GROUP BY ?month \
    ORDER BY ?month',
    'PREFIX homicide: <http://www.semanticweb.org/dvadher1/ontologies/2023/10/homicide-tracker-and-analyser#> \
    SELECT ?state (COUNT(?incident) AS ?numIncidents) \
    WHERE { \
      ?incident a homicide:Incident ; \
                homicide:hasState ?state. \
    } \
    GROUP BY ?state \
    ORDER BY ?state',
    'PREFIX homicide: <http://www.semanticweb.org/dvadher1/ontologies/2023/10/homicide-tracker-and-analyser#> \
    SELECT ?offender \
    WHERE { \
      ?offender a homicide:Offender ; \
       homicide:hasRace ?o1race . \
       FILTER(?o1race = "B") \
    }'
  ];

  const handleQuery = async (e, query) => {
    e.preventDefault();
    queryRef.current.value = query;

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

  const renderQueryButtons = () => {
    return queries.map((query, index) => (
      <button key={index} onClick={(e) => handleQuery(e, query)}>
        Query {index + 1}
      </button>
    ));
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
      <div className="pagination">
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
        <form className="custom-form" onSubmit={(e) => handleQuery(e, queryRef.current.value)}>
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

        <div className="query-buttons">
          {renderQueryButtons()}
        </div>

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
