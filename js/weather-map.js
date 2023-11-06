import keys from "./keys.js";

// INITIALIZE MAPBOX
mapboxgl.accessToken = keys.mapbox;
const map = new mapboxgl.Map({
    container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
    center: [-122.33178089059577, 47.60769856291158], // starting position [lng, lat]
    zoom: 9 // starting zoom
});// Add the control to the map.
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});
// INITIALIZE MARKER FOR MAPBOX
const marker = new mapboxgl.Marker({
    draggable: true
})
    .setLngLat([-122.33178089059577, 47.60769856291158])
    .addTo(map);

// return a LngLat object such as {lng: 0, lat: 0}
// var {lng,lat} = map.getCenter();
//
// [lng, lat] = [coord.lng, coord.lat];
// console.log('longitude: ', lng, 'latitude: ', lat);

$('#mapbox-search').attr('placeholder','Search a city...');


document.getElementById('mapbox-search').appendChild(geocoder.onAdd(map));

const currentCityElement = document.getElementById('insert-weather');
const forecastElement = document.getElementById('insert-forecast');
const updateButton = document.getElementById('update-forecast-btn');

// NEW CITY 5 DAY FORECAST/CURRENT FORECAST
function updateForecast() {
    const cityInput = document.getElementById('mapbox-search').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${keys.weatherMap}&units=imperial`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Call the updateCurrentCityForecast function with the retrieved data
            updateCurrentCityForecast(data);

            const { lat, lon } = data.coord;
            map.flyTo({
                center: [lon, lat],
                essential: true,
                zoom: 13
            });
            if (marker) {
                marker.remove();
            }
            marker.setLngLat([lon, lat]).addTo(map);
            // Fetch forecast data for the searched city
            const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${keys.weatherMap}&units=imperial`;
            return fetch(forecastApiUrl);
        })
        .then(response => response.json())
        .then(data => {
            // Update the 5-day forecast with the retrieved data
            let html = '';

            for (let i = 0; i < 5; i++) {
                const forecastData = data.list[i * 8];
                const date = new Date(forecastData.dt * 1000);
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                const weatherIconUrl = `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png`;

                html += `
<div className="card" style="width: 18rem;">
<ul className="list-group list-group-flush">
<li className="list-group-item">${dayOfWeek}</li>
<li className="list-group-item">Main: ${forecastData.main.temp.toFixed(0)}°F</li>
<li className="list-group-item">Low: ${forecastData.main.temp_min}°F</li>
<li className="list-group-item">${forecastData.weather[0].main}</li>
<li className="list-group-item"><img src="${weatherIconUrl}" alt="weather-icon"></li>
</ul>
</div>`;
            }

            // Insert the forecast data into the element with id 'insert-forecast'
            document.getElementById('insert-forecast').innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    // Add an event listener to the input box to handle Enter key press event
    const searchInput = document.getElementById('mapbox-search');
    searchInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            const cityInput = searchInput.value;
            updateForecast(cityInput);
        }
    });
}

// Add an event listener to the search button to trigger the updateForecast function
const searchButton = document.getElementById('update-forecast-btn');
searchButton.addEventListener('click', updateForecast);

        updateButton.addEventListener('click', updateForecast);

const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'
const BASE_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast?'
// Fetch forecast data using fetch API
fetch(`${BASE_FORECAST_URL}lat=${47.60537214369371}&lon=${-122.32423484983421}&appid=${keys.weatherMap}&units=imperial`)
    .then(response => response.json())
    .then(data => {
        // console.log(data.list)
        let html = '';

        for (let i = 0; i < 5; i++) {
            const forecastData = data.list[i * 8];
            // console.log(data.list[i*8])
            const date = new Date(forecastData.dt * 1000);
            // console.log(date)
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
            const weatherIconUrl = `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png`



            // Each Forecast Card
            html +=
                ` <div className="card" style="width: 18rem;">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">${dayOfWeek}</li>
                    <li className="list-group-item">Main: ${forecastData.main.temp.toFixed(0)}°F</li>
                    <li class="list-group-item">Low: ${forecastData.main.temp_min}°F</li>
                    <li className="list-group-item">${forecastData.weather[0].main}</li>
                    <li className="list-group-item"><img src="${weatherIconUrl}" alt="weather-icon"></li>
                </ul>
            </div>`;
        }

        // Insert to #insert-forecast element
        document.getElementById('insert-forecast').innerHTML = html;
    })
    .catch(error => {
        console.error('Error fetching forecast data:', error);
    });
// ***************************************************************************
// ***************************************************************************

    // SEATTLE CURRENT FORECAST-TOP CARD
    function updateCurrentCityForecast(data) {
        console.log(data)
        let iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        let html = `
<div class="city-forecast">
<div class="city-name">${data.name}</div>
<br>
<div class="city-temperature">${data.main.temp.toFixed(0)}°F</div>
<div class="city-image d-flex"><img src="${iconUrl}" alt="Weather Icon"></div>

<!--<div class="cloud-img">${data.weather[0].icon}</div>-->
</div>`;

        let iconImageURL = '';

        if (data.weather[0].main === 'Clear' && data.main.temp > 70) {
            iconImageURL = 'url(" https://openweathermap.org/img/wn/01d@2x.png")';
            $("#insert-weather").css('color', 'black');
        } else if (data.weather[0].main === 'Clear' && data.main.temp <= 70) {
            iconImageURL = 'url(" https://openweathermap.org/img/wn/02d@2x.png")';
        } else if (data.weather[0].main === 'Rain') {
            iconImageURL = 'url("https://openweathermap.org/img/wn/11d@2x.png")';
        } else if (data.weather[0].main === 'Clouds') {
            iconImageURL = 'url("https://openweathermap.org/img/wn/03d@2x.png")';
        } else {
            iconImageURL = 'url("https://openweathermap.org/img/wn/11d@2x.png")';
        }

        // Apply the background image to my card
        $("#insert-weather-img").innerText;

        $("#insert-weather").html(html);
    }

// This is for the top card, current city forecast.
    function fetchAndUpdateCurrentCityWeather() {
        $.get(BASE_WEATHER_URL + `lat=${47.60537214369371}&lon=${-122.32423484983421}&appid=${keys.weatherMap}&units=imperial`).done((data) => {
            updateCurrentCityForecast(data);
        });
    }
// Call the function to update the current city weather when the page loads
    fetchAndUpdateCurrentCityWeather();




