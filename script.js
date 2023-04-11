const API_KEY = "490550b82c4b85bf04a5cf2ef1e4ac31";
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function searchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const cityName = data.name;

      const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_KEY}&units=metric`;

      fetch(oneCallUrl)
        .then((response) => response.json())
        .then((data) => {
          clearWeatherContainer();
          renderCurrentWeather(data.current, cityName);
          renderHourlyForecast(data.hourly);
          renderDailyForecast(data.daily);
        });
    });
}

function clearWeatherContainer() {
  const weatherContainer = document.querySelector(".weather-container");
  weatherContainer.innerHTML = "";
}

function renderCurrentWeather(current, cityName) {
  const weatherContainer = document.querySelector(".weather-container");

  const currentWeatherCard = document.createElement("div");
  currentWeatherCard.classList.add("current-weather-card");
  currentWeatherCard.innerHTML = `
    <div class="current-weather-container">
    
    <div class="current-container1"

    <h2 id="city_name">${cityName}</h2>
    <p class="current-time">${new Date().toLocaleString()}</p>
    <img src="https://openweathermap.org/img/wn/${
      current.weather[0].icon
    }@2x.png" alt="weather icon"/>

    </div>

    <div class="current-container2"
   
    <p>Temperature: ${current.temp} °C</p>
    <p>Weather: ${current.weather[0].description}</p>
    <p>Feels like: ${current.feels_like} °C</p>
    <p>Pressure: ${current.pressure} hPa</p>
    <p>Humidity: ${current.humidity} %</p>
    <p>Wind Speed: ${current.wind_speed} m/s</p>
    <p>Sunrise: ${new Date(current.sunrise * 1000).toLocaleTimeString()}</p>
    <p>Sunset: ${new Date(current.sunset * 1000).toLocaleTimeString()}</p>

    </div>

    </div>
  `;

  weatherContainer.appendChild(currentWeatherCard);
}

function renderHourlyForecast(hourly) {
  const weatherContainer = document.querySelector(".weather-container");

  const hourlyForecastContainer = document.createElement("div");
  hourlyForecastContainer.classList.add("hourly-forecast-container");

  hourly.forEach((hourlyForecast, index) => {
    if (index >= 24) return;

    const hourlyForecastCard = document.createElement("div");
    hourlyForecastCard.classList.add("hourly-forecast-card");
    if (index === 0) {
      hourlyForecastCard.classList.add("today");
    }
    hourlyForecastCard.innerHTML = `
      <p class="time">${
        new Date(hourlyForecast.dt * 1000).toLocaleTimeString(
          navigator.language,
          { hour: "numeric" }
        )}</p>
      <img src="https://openweathermap.org/img/wn/${
        hourlyForecast.weather[0].icon
      }@2x.png" alt="weather icon"/>
      <p class="temperature">${hourlyForecast.temp} °C</p>
    `;

    hourlyForecastContainer.appendChild(hourlyForecastCard);
  });

  weatherContainer.appendChild(hourlyForecastContainer);
}

function renderDailyForecast(daily) {
  const weatherContainer = document.querySelector(".weather-container");

  const dailyForecastContainer = document.createElement("div");
  dailyForecastContainer.classList.add("daily-forecast-container");

  daily.forEach((dailyForecast, index) => {
    if (index === 0) return;

    const dailyForecastCard = document.createElement("div");
    dailyForecastCard.classList.add("daily-forecast-card");
    dailyForecastCard.innerHTML = `
      <p class="day">${DAYS_OF_WEEK[new Date(
        dailyForecast.dt * 1000
      ).getDay()]}</p>
      <img src="https://openweathermap.org/img/wn/${
        dailyForecast.weather[0].icon
      }@2x.png" alt="weather icon"/>
      <p class="temperature">${dailyForecast.temp.day} °C</p>
      <p class="weather-description">${
        dailyForecast.weather[0].description
      }</p>
      <p class="feels-like">Feels like: ${
        dailyForecast.feels_like.day
      } °C</p>
      <p class="pressure">Pressure: ${dailyForecast.pressure} hPa</p>
      <p class="humidity">Humidity: ${dailyForecast.humidity} %</p>
      <p class="wind-speed">Wind Speed: ${
        dailyForecast.wind_speed
      } m/s</p>
      <p class="sunrise">Sunrise: ${new Date(
        dailyForecast.sunrise * 1000
      ).toLocaleTimeString()}</p>
      <p class="sunset">Sunset: ${new Date(
        dailyForecast.sunset * 1000
      ).toLocaleTimeString()}</p>
    `;

    dailyForecastContainer.appendChild(dailyForecastCard);
  });

  weatherContainer.appendChild(dailyForecastContainer);
}

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = searchInput.value;
  searchWeather(city);
});

