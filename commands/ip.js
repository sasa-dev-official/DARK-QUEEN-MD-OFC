const axios = require('axios');

module.exports = async (sock, from, msg, args, q) => {
    let ip = args[0];
    if (!ip) {
        // If no IP provided, we could fetch the user's own IP by checking connection, but we don't have it.
        // So we ask.
        await sock.sendMessage(from, { text: '❌ Please provide an IP address.\nExample: .ip 8.8.8.8' });
        return;
    }
    ip = ip.trim();
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,isp,org,as,query`, { timeout: 10000 });
        const data = response.data;
        if (data.status === 'fail') {
            await sock.sendMessage(from, { text: `❌ IP lookup failed: ${data.message || 'Unknown error'}` });
            return;
        }
        const result = `📡 *IP Lookup for ${ip}*\n\n` +
                       `🌍 *Country:* ${data.country || 'N/A'}\n` +
                       `🏙️ *Region:* ${data.regionName || 'N/A'}\n` +
                       `📍 *City:* ${data.city || 'N/A'}\n` +
                       `🏢 *ISP:* ${data.isp || 'N/A'}\n` +
                       `🔗 *Organization:* ${data.org || 'N/A'}\n` +
                       `📌 *AS:* ${data.as || 'N/A'}`;
        await sock.sendMessage(from, { text: result });
    } catch (e) {
        await sock.sendMessage(from, { text: `❌ Error fetching IP info: ${e.message}` });
    }
};
