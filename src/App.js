import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '34dbc7d8e1f60c241c3d9dbf1c6e5eb8';

  const getWeather = () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        if (data.cod !== 200) {
          setError('City nahi mili — dobara likho!');
          setWeather(null);
        } else {
          setWeather(data);
        }
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <h1>🌤️ Weather App</h1>

      <div className="input-row">
        <input
          type="text"
          placeholder="City likho... (e.g. Karachi)"
          value={city}
          onChange={e => setCity(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && getWeather()}
        />
        <button onClick={getWeather}>Search</button>
      </div>

      {loading && <p style={{textAlign:'center', color:'#888'}}>Loading...</p>}
      {error && <p style={{textAlign:'center', color:'red'}}>{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <div className="temp">{Math.round(weather.main.temp)}°C</div>
          <div className="desc">{weather.weather[0].description}</div>
          <div className="details">
            <div><span>Feels like</span><strong>{Math.round(weather.main.feels_like)}°C</strong></div>
            <div><span>Humidity</span><strong>{weather.main.humidity}%</strong></div>
            <div><span>Wind</span><strong>{weather.wind.speed} m/s</strong></div>
            <div><span>Min / Max</span><strong>{Math.round(weather.main.temp_min)}° / {Math.round(weather.main.temp_max)}°</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;