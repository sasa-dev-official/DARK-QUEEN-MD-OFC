const axios = require('axios');

module.exports = async (sock, from, msg, args, q) => {
    const url = args[0];
    if (!url) {
        await sock.sendMessage(from, { text: '❌ Please provide a URL to fetch.\nExample: .fetch https://example.com' });
        return;
    }
    try {
        const response = await axios.get(url, { timeout: 10000 });
        // Get the HTML source
        const source = response.data;
        // Show first 1000 characters
        const preview = source.substring(0, 1000);
        const result = `🍁 *Fetched source of ${url}*\n\n` +
                       `📊 *Status:* ${response.status}\n` +
                       `📦 *Content-Type:* ${response.headers['content-type'] || 'N/A'}\n` +
                       `📏 *Length:* ${source.length} chars\n\n` +
                       '```html\n' + preview + '\n```\n' +
                       '*(truncated to first 1000 chars)*';
        await sock.sendMessage(from, { text: result });
    } catch (e) {
        await sock.sendMessage(from, { text: `❌ Error fetching source: ${e.message}` });
    }
};
