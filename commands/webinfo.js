const axios = require('axios');

module.exports = async (sock, from, msg, args, q) => {
    const url = args[0];
    if (!url) {
        await sock.sendMessage(from, { text: '❌ Please provide a URL.\nExample: .webinfo https://example.com' });
        return;
    }
    try {
        const response = await axios.get(url, { timeout: 10000 });
        const headers = response.headers;
        const html = response.data;
        // Extract title with regex
        let title = 'N/A';
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        if (titleMatch) title = titleMatch[1].trim();

        // Extract meta description
        let description = 'N/A';
        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
        if (descMatch) description = descMatch[1].trim();

        const result = `🌐 *Website Info for ${url}*\n\n` +
                       `📄 *Title:* ${title}\n` +
                       `📝 *Description:* ${description}\n` +
                       `🖥️ *Server:* ${headers['server'] || 'N/A'}\n` +
                       `📦 *Content-Type:* ${headers['content-type'] || 'N/A'}\n` +
                       `📏 *Content-Length:* ${headers['content-length'] || 'N/A'}\n` +
                       `🔄 *Last-Modified:* ${headers['last-modified'] || 'N/A'}\n` +
                       `📊 *Status Code:* ${response.status}`;
        await sock.sendMessage(from, { text: result });
    } catch (e) {
        await sock.sendMessage(from, { text: `❌ Error fetching website info: ${e.message}` });
    }
};
