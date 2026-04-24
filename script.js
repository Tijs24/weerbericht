// Stolwijk coordinaten
const LAT = 51.9773;
const LON = 4.7888;

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
        return '☔ Regenjas mee! De vossen spelen bij elk weer, maar droog is lekkerder.';
    }
    // Sneeuw?
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return '⛄ Sneeuw in Stolwijk! Misschien maar een balletje gooien in de sneeuw.';
    }
    // Onweer?
    if ([95, 96, 99].includes(code)) {
        return '⛈️ Onweer op komst — training gaat waarschijnlijk niet door!';
    }
    // Op temperatuur gebaseerd
    if (temp < 0) return '🥶 IJskoud in Stolwijk! Dikke jas, muts en handschoenen aan.';
    if (temp < 10) return '🧥 Koud hoor, warme sportkleding aan voor de training!';
    if (temp < 15) return '🍂 Fris weer, extra laagje mee voor na de training.';
    if (temp < 20) return '😊 Prima voetbalweer voor De Vossen!';
    if (temp < 25) return '☀️ Heerlijk weer! Kans op een goede training vandaag.';
    if (temp < 30) return '🌞 Warm! Voldoende water meenemen naar de training.';
    return '🔥 Bloedheet! Veel drinken en pas op met lang in de zon.';
}

// Laad het weer direct bij openen
getWeather();