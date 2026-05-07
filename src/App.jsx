import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '784fe5191fc340c0842151833260705';

  const getIcon = (code) => {
    if (code === 1000) return '☀️';
    if ([1003, 1006, 1009].includes(code)) return '⛅';
    if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195].includes(code)) return '🌧️';
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) return '⛈️';
    if ([1066, 1114, 1117, 1210, 1213, 1219, 1225].includes(code)) return '❄️';
    return '🌤️';
  };

  const getWeather = () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError('City not found — please check the spelling and try again.');
          setLoading(false);
        } else {
          setWeather(data);
          const now = new Date();
          const allHours = data.forecast.forecastday.flatMap(day => day.hour);
          const upcoming = allHours.filter(h => new Date(h.time) >= now).slice(0, 8);
          setForecast(upcoming);
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      });
  };

  const getBg = (temp) => {
    if (temp >= 35) return '#ff6b35';
    if (temp >= 25) return '#f7b731';
    if (temp >= 15) return '#45aaf2';
    return '#778ca3';
  };

  return (
    <div className="app">
      <div className="header" style={{ background: weather ? getBg(weather.current.temp_c) : '#6c63ff' }}>
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

      {loading && (
        <div className="loading">
          <div className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>
      )}
      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="weather-card">
          <div className="weather-icon">{getIcon(weather.current.condition.code)}</div>
          <div className="city-name">{weather.location.name}, {weather.location.country}</div>
          <div className="temp">{Math.round(weather.current.temp_c)}°C</div>
          <div className="desc">{weather.current.condition.text}</div>

          <div className="minmax">
            <span>↑ {Math.round(weather.forecast.forecastday[0].day.maxtemp_c)}°C</span>
            <span>↓ {Math.round(weather.forecast.forecastday[0].day.mintemp_c)}°C</span>
          </div>

          <div className="details-grid">
            <div className="detail-box">
              <span className="detail-label">Feels like</span>
              <span className="detail-val">{Math.round(weather.current.feelslike_c)}°C</span>
            </div>
            <div className="detail-box">
              <span className="detail-label">Humidity</span>
              <span className="detail-val">{weather.current.humidity}%</span>
            </div>
            <div className="detail-box">
              <span className="detail-label">Wind</span>
              <span className="detail-val">{weather.current.wind_kph} km/h</span>
            </div>
            <div className="detail-box">
              <span className="detail-label">Pressure</span>
              <span className="detail-val">{weather.current.pressure_mb} hPa</span>
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
                <div className="forecast-time">
                  {new Date(item.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
                <div className="forecast-icon">{getIcon(item.condition.code)}</div>
                <div className="forecast-temp">{Math.round(item.temp_c)}°</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
