async function pingCommand(sock, from, msg) {
    // React with 🥶 and measure ping using the reaction round‑trip time
    const start = Date.now();
    await sock.sendMessage(from, { react: { text: '🥶', key: msg.key } });
    const ping = Date.now() - start;

    // Determine connection status and create a stylish progress bar
    let statusEmoji, statusText, speedLevel;
    if (ping <= 200) {
        statusEmoji = '🟢';
        statusText = 'Fast Speed';
    } else if (ping <= 600) {
        statusEmoji = '🟡';
        statusText = 'Medium Speed';
    } else {
        statusEmoji = '🔴';
        statusText = 'Slow Speed';
    }

    // Scale ping to a 1–10 level (inverse: lower ping = higher level)
    const maxPing = 1000;
    const clampedPing = Math.min(ping, maxPing);
    speedLevel = Math.round((1 - clampedPing / maxPing) * 10);
    speedLevel = Math.min(10, Math.max(1, speedLevel));

    const bar = '█'.repeat(speedLevel) + '░'.repeat(10 - speedLevel);
    const percentage = speedLevel * 10;

    // Modern, stylish caption
    const caption = `*⚡ PING STATUS ⚡*\n\n` +
                    `*Response Time:* \`${ping}ms\`\n` +
                    `*Connection:* ${statusEmoji} ${statusText}\n` +
                    `*Speed:* \`[${bar}]\` ${percentage}%`;

    // Send the video with the crafted caption
    await sock.sendMessage(from, {
        video: { url: 'https://files.catbox.moe/sxewqi.mp4' },
        caption: caption
    }, { quoted: msg });
}

module.exports = pingCommand;
