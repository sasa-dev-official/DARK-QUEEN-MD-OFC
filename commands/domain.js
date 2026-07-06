const axios = require('axios');

module.exports = async (sock, from, msg, args, q) => {
    if (!args[0]) {
        await sock.sendMessage(from, { text: '❌ Please provide a domain name.\nExample: .domain example.com' });
        return;
    }
    const domain = args[0].toLowerCase().trim();
    try {
        const response = await axios.get(`https://api.hackertarget.com/whois/?q=${domain}`, { timeout: 10000 });
        const data = response.data;
        // Hackertarget returns plain text with newlines
        const lines = data.split('\n').slice(0, 15); // first 15 lines
        const result = `🌝 *Domain WHOIS Info for ${domain}*\n\n` +
                       '```\n' + lines.join('\n') + '\n```\n' +
                       '*(truncated to 15 lines)*';
        await sock.sendMessage(from, { text: result });
    } catch (e) {
        await sock.sendMessage(from, { text: `❌ Error fetching WHOIS: ${e.message}` });
    }
};
