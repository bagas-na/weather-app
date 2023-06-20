import { format } from 'date-fns';
import './styles.css';

const myAPIkey = '8049dc7b3a714333835133908231606';
let currentWeather;
const units = 'C';

const getCurrentWeather = async (query = 'Bandung') => {
  const aqi = 'yes';
  const alerts = 'yes';
  const days = '1';
  const location = query;
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${myAPIkey}&q=${location}&days=${days}&saqi=${aqi}&alerts=${alerts}`,
    { mode: 'cors' },
  );

  const responseJSON = await response.json();
  // console.table(responseJSON.location);
  // console.table(responseJSON.current);
  // console.table(responseJSON.forecast.forecastday[0].astro);
  // console.table(responseJSON.forecast.forecastday[0].day);
  // console.table(responseJSON.forecast.forecastday[0].hour);
  // console.log(responseJSON.forecast);
  return responseJSON;
};

const updateTimeLocation = (weather) => {
  const date = document.getElementById('current-date');
  const time = document.getElementById('current-time');

  const locName = document.getElementById('loc-name');
  // const locRegion = document.getElementById('loc-region');
  const locCountry = document.getElementById('loc-country');

  const [currentDate, currentTime] = weather.localtime.split(' ');

  const dateTime = new Date(...currentDate.split('-'), ...currentTime.split(':'));
  date.textContent = `${format(dateTime, 'EEEE, d MMMM yyyy')}`;
  time.textContent = `Local time: ${format(dateTime, 'hh:mm a')}`;

  locName.textContent = `${weather.name}, `;
  // locRegion.textContent = weather.region;
  locCountry.textContent = weather.country;
};

const updateCurrentWeather = (weather, unit) => {
  const status = document.getElementById('status');
  const statusImg = document.getElementById('status-img');
  const currentTemp = document.getElementById('current-temp');

  const perceivedTemp = document.getElementById('perceived-temp');
  const humidity = document.getElementById('humidity');
  const wind = document.getElementById('wind');

  const sunrise = document.getElementById('sunrise');
  const sunset = document.getElementById('sunset');
  const highestTemp = document.getElementById('highest-temp');
  const lowestTemp = document.getElementById('lowest-temp');

  status.textContent = weather.current.condition.text;
  statusImg.setAttribute('src', weather.current.condition.icon);
  currentTemp.textContent = unit === 'C' ? `${weather.current.temp_c}°C` : `${weather.current.temp_f}°F`;

  const perceivedTempText = document.createElement('p');
  perceivedTempText.textContent = unit === 'C' ? `${weather.current.feelslike_c}°C` : `${weather.current.feelslike_f}°F`;
  perceivedTemp.removeChild(perceivedTemp.lastChild);
  perceivedTemp.appendChild(perceivedTempText);

  const humidityText = document.createElement('p');
  humidityText.textContent = `${weather.current.humidity}%`;
  humidity.removeChild(humidity.lastChild);
  humidity.appendChild(humidityText);

  const windText = document.createElement('p');
  windText.textContent = unit === 'C' ? `${weather.current.wind_kph} km/h` : `${weather.current.wind_mph} mph`;
  wind.removeChild(wind.lastChild);
  wind.appendChild(windText);

  const sunriseText = document.createElement('p');
  sunriseText.textContent = `${weather.forecast.forecastday[0].astro.sunrise}`;
  sunrise.removeChild(sunrise.lastChild);
  sunrise.appendChild(sunriseText);

  const sunsetText = document.createElement('p');
  sunsetText.textContent = `${weather.forecast.forecastday[0].astro.sunset}`;
  sunset.removeChild(sunset.lastChild);
  sunset.appendChild(sunsetText);

  const highestTempText = document.createElement('p');
  highestTempText.textContent = unit === 'C' ? `${weather.forecast.forecastday[0].day.maxtemp_c}°C` : `${weather.forecast.forecastday[0].day.maxtemp_f}°F`;
  highestTemp.removeChild(highestTemp.lastChild);
  highestTemp.appendChild(highestTempText);

  const lowestTempText = document.createElement('p');
  lowestTempText.textContent = unit === 'C' ? `${weather.forecast.forecastday[0].day.mintemp_c}°C` : `${weather.forecast.forecastday[0].day.mintemp_f}°F`;
  lowestTemp.removeChild(lowestTemp.lastChild);
  lowestTemp.appendChild(lowestTempText);
};

const updateHourlyForecast = (weather, unit) => {
  const forecastComponent = (forecastHour) => {
    const [currentDate, currentTime] = forecastHour.time.split(' ');
    const dateTime = new Date(...currentDate.split('-'), ...currentTime.split(':'));
    const time = document.createElement('p');
    time.classList.add('time');
    time.textContent = `${format(dateTime, 'hh:mm a')}`;

    const image = document.createElement('img');
    image.setAttribute('src', forecastHour.condition.icon);
    image.setAttribute('alt', forecastHour.condition.text);
    image.classList.add('forecast-img');

    const temp = document.createElement('p');
    temp.classList.add('forecast-temp');
    temp.textContent = unit === 'C' ? `${forecastHour.temp_c}°C` : `${forecastHour.temp_f}°F`;

    const forecast = document.createElement('div');
    forecast.classList.add('forecast');
    forecast.append(time, image, temp);

    return forecast;
  };

  const hourlyForecast = document.getElementById('hourly-forecast');
  while (hourlyForecast.lastChild) {
    hourlyForecast.removeChild(hourlyForecast.lastChild);
  }

  for (let i = 0; i < weather.length; i += 1) {
    const forecast = forecastComponent(weather[i]);
    hourlyForecast.appendChild(forecast);
  }
};

const updateUI = (weather, unit) => {
  updateTimeLocation(weather.location);
  updateCurrentWeather(weather, unit);
  updateHourlyForecast(weather.forecast.forecastday[0].hour, unit);
};

const cities = document.querySelectorAll('.major-cities > ul > li');
cities.forEach((city) => city.addEventListener('click', () => {
  console.log(city.textContent);
  getCurrentWeather(city.textContent).then((weather) => {
    currentWeather = weather;
    updateUI(currentWeather, units);
  });
}));

getCurrentWeather().then((weather) => {
  currentWeather = weather;
  updateUI(currentWeather, units);
});
