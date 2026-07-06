const axios = require('axios');

module.exports = async (sock, from, msg, args, q) => {
    const city = args.join(' ');
    if (!city) {
        await sock.sendMessage(from, { text: '❌ Please provide a city name.\nExample: .weather London' });
        return;
    }
    try {
        // Using wttr.in with JSON output
        const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
        const data = response.data;
        if (!data.current_condition || data.current_condition.length === 0) {
            await sock.sendMessage(from, { text: `❌ Weather data not found for "${city}".` });
            return;
        }
        const current = data.current_condition[0];
        const temp = current.temp_C;
        const feelsLike = current.FeelsLikeC;
        const humidity = current.humidity;
        const wind = current.windSpeedKmph;
        const desc = current.weatherDesc[0].value;
        const result = `🌡️ *Weather in ${city}*\n\n` +
                       `🌤️ *Condition:* ${desc}\n` +
                       `🌡️ *Temperature:* ${temp}°C (Feels like ${feelsLike}°C)\n` +
                       `💧 *Humidity:* ${humidity}%\n` +
                       `💨 *Wind:* ${wind} km/h\n` +
                       `🕒 *Updated:* ${current.observation_time}`;
        await sock.sendMessage(from, { text: result });
    } catch (e) {
        await sock.sendMessage(from, { text: `❌ Error fetching weather: ${e.message}` });
    }
};
