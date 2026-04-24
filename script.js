// Rotterdam coordinaten
const LAT = 51.9244;
const LON = 4.4777;

async function getWeather() {
    try {
        // Gratis weer-API (geen API-key nodig!)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Europe/Amsterdam`;
        
        const response = await fetch(url);
        const data = await response.json();
        const current = data.current;
        
        // Update de pagina
        document.getElementById('temperature').textContent = Math.round(current.temperature_2m) + '°C';
        document.getElementById('description').textContent = getWeatherDescription(current.weather_code);
        document.getElementById('wind').textContent = Math.round(current.wind_speed_10m) + ' km/u';
        document.getElementById('humidity').textContent = current.relative_humidity_2m + '%';
        document.getElementById('feelsLike').textContent = Math.round(current.apparent_temperature) + '°C';
        document.getElementById('message').textContent = getFamilyMessage(current.temperature_2m, current.weather_code);
        
        // Update tijd
        const now = new Date();
        document.getElementById('lastUpdate').textContent = now.toLocaleTimeString('nl-NL');
    } catch (error) {
        document.getElementById('temperature').textContent = 'Oeps!';
        document.getElementById('description').textContent = 'Kon geen weerdata ophalen';
        console.error(error);
    }
}

function getWeatherDescription(code) {
    const descriptions = {
        0: '☀️ Zonnig',
        1: '🌤️ Overwegend zonnig',
        2: '⛅ Half bewolkt',
        3: '☁️ Bewolkt',
        45: '🌫️ Mistig',
        48: '🌫️ Mistig',
        51: '🌦️ Lichte motregen',
        61: '🌧️ Lichte regen',
        63: '🌧️ Matige regen',
        65: '🌧️ Zware regen',
        71: '🌨️ Lichte sneeuw',
        73: '🌨️ Sneeuw',
        75: '❄️ Zware sneeuw',
        80: '🌦️ Regenbuien',
        95: '⛈️ Onweer',
    };
    return descriptions[code] || '🌡️ Onbekend weer';
}

function getFamilyMessage(temp, code) {
    // Regen?
    if ([51, 61, 63, 65, 80, 81, 82].includes(code)) {
        return '☔ Paraplu meenemen! Of gewoon lekker binnen met een kopje thee.';
    }
    // Sneeuw?
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return '⛄ Sneeuw! Tijd voor warme chocomel en misschien een sneeuwman.';
    }
    // Onweer?
    if ([95, 96, 99].includes(code)) {
        return '⛈️ Onweer op komst — blijf lekker binnen!';
    }
    // Op temperatuur gebaseerd
    if (temp < 0) return '🥶 IJskoud! Dikke jas, muts en handschoenen aan.';
    if (temp < 10) return '🧥 Koud hoor, warme jas aan!';
    if (temp < 15) return '🍂 Fris weer, trui mee voor de zekerheid.';
    if (temp < 20) return '😊 Prima weer om lekker naar buiten te gaan!';
    if (temp < 25) return '☀️ Heerlijk weer! Perfect voor een wandeling of de tuin.';
    if (temp < 30) return '🌞 Warm! Zonnebrand niet vergeten.';
    return '🔥 Bloedheet! Veel water drinken en zoek de schaduw op.';
}

// Laad het weer direct bij openen
getWeather();