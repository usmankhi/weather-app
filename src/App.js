import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '34dbc7d8e1f60c241c3d9dbf1c6e5eb8';

  const getWeather = () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        if (data.cod !== 200) {
          setError('City nahi mili — dobara likho!');
          setLoading(false);
        } else {
          setWeather(data);
          return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&cnt=5`);
        }
      })
      .then(res => res && res.json())
      .then(data => {
        if (data && data.list) setForecast(data.list);
        setLoading(false);
      })
      .catch(() => { setError('Kuch masla hua!'); setLoading(false); });
  };

  const getIcon = (code) => {
    if (code.includes('01')) return '☀️';
    if (code.includes('02') || code.includes('03') || code.includes('04')) return '⛅';
    if (code.includes('09') || code.includes('10')) return '🌧️';
    if (code.includes('11')) return '⛈️';
    if (code.includes('13')) return '❄️';
    return '🌤️';
  };

  const getBg = (temp) => {
    if (temp >= 35) return '#ff6b35';
    if (temp >= 25) return '#f7b731';
    if (temp >= 15) return '#45aaf2';
    return '#778ca3';
  };

  return (
    <div className="app">
      <div className="header" style={{ background: weather ? getBg(weather.main.temp) : '#6c63ff' }}>
        <h1>Weather App</h1>
        <div className="search-row">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && getWeather()}
          />
          <button onClick={getWeather}>Search</button>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="weather-card">
          <div className="weather-icon">{getIcon(weather.weather[0].icon)}</div>
          <div className="city-name">{weather.name}, {weather.sys.country}</div>
          <div className="temp">{Math.round(weather.main.temp)}°C</div>
          <div className="desc">{weather.weather[0].description}</div>

          <div className="details-grid">
            <div className="detail-box">
              <span className="detail-label">Feels like</span>
              <span className="detail-val">{Math.round(weather.main.feels_like)}°C</span>
            </div>
            <div className="detail-box">
              <span className="detail-label">Humidity</span>
              <span className="detail-val">{weather.main.humidity}%</span>
            </div>
            <div className="detail-box">
              <span className="detail-label">Wind</span>
              <span className="detail-val">{weather.wind.speed} m/s</span>
            </div>
            <div className="detail-box">
              <span className="detail-label">Pressure</span>
              <span className="detail-val">{weather.main.pressure} hPa</span>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <div className="forecast-title">Next Few Hours</div>
          <div className="forecast-list">
            {forecast.map((item, i) => (
              <div className="forecast-item" key={i}>
                <div className="forecast-time">{new Date(item.dt * 1000).getHours()}:00</div>
                <div className="forecast-icon">{getIcon(item.weather[0].icon)}</div>
                <div className="forecast-temp">{Math.round(item.main.temp)}°</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;