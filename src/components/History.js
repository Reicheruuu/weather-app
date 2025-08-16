import React from "react";

function History({ history, onSelectCity }) {
  return (
    <div className="history-section">
        <h2>Recent Searches</h2>
        <div className="history-cards">
          {history.map((item, index) => (
            <div key={index} className="history-card" onClick={() => onSelectCity(item.cityName)}>
              <h3>{item.cityName}</h3>
              <p>{item.description}</p>
              <p>{item.temperature}°C</p>
              <small>{item.timestamp}</small>
            </div>
          ))}
        </div>
    </div>
  );
}

export default History;
