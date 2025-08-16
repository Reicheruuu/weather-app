import React from 'react';

function Forecast({ data }) {
  return (
    <div className="forecast">
      <h2>5-Day Forecast</h2>
      <div className="forecast-cards">
        {data.list
          .filter((item, index) => index % 8 === 0) // Get one reading per day
          .map((day, index) => (
            <div key={index} className="forecast-card">
              <h3>{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</h3>
              <img 
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
              />
              <p>{Math.round(day.main.temp)}°C</p>
              <p>{day.weather[0].description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Forecast;
