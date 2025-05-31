# Weather Dashboard - Assignment

## 🚀 Features

- 🌦 Real-time weather data with polling
- 🔎 City search with persistent last search
- ⚠ Graceful error handling
- 💾 Local storage support
- 📦 Context API for global state

## 🔧 Getting Started

```bash
git clone https://github.com/Sagar2401/weather-web.git
cd weather-dashboard
npm install
npm run dev
```

## Approached

I approached the Weather Dashboard assignment by focusing on modularity, real-time data updates, and user experience. I used React.js with Vite for fast setup and performance, and organized the app into reusable components such as SearchBar, WeatherCard, and ErrorMessage.

To manage the global state, I used the React Context API, making it easy to share weather data and user preferences (like unit selection) across components. I integrated the OpenWeatherMap API to fetch live weather information and implemented a polling mechanism that refreshes the data every 30 seconds.

For persistence, I used localStorage to remember the last searched city, ensuring a smooth experience when users revisit the app. I also implemented graceful error handling for cases like invalid city names or network issues.

Optional features like a 5-day forecast and temperature unit switching (°C/°F) were added to enhance the functionality and demonstrate deeper API integration.
