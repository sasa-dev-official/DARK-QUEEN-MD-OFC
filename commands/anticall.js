async function anticallCommand(sock, from, msg, isAdmin, botData, saveBotData, userId, args) {
    if (!isAdmin) return await sock.sendMessage(from, { text: "❌ Only owner can use this command." }, { quoted: msg });
    
    const action = args[0]?.toLowerCase();
    const currentStatus = botData.antiCall[userId] ? '✅ Enabled' : '❌ Disabled';
    
    if (action === 'on') {
        botData.antiCall[userId] = true;
        saveBotData();
        const message = `╔═══════════════════════════╗\n` +
                       `║   📞 𝗔𝗡𝗧𝗜-𝗖𝗔𝗟𝗟 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗢𝗡   ║\n` +
                       `╚═══════════════════════════╝\n\n` +
                       `🛡️ *Status:* ${currentStatus}\n` +
                       `✅ *Action:* Turned *ON*\n\n` +
                       `🔰 *Features:*\n` +
                       `• All incoming calls will be automatically rejected.\n` +
                       `• If a caller persists (3 attempts), they will be blocked.\n\n` +
                       `🔒 *Your bot is now protected.*`;
        await sock.sendMessage(from, { text: message }, { quoted: msg });
    } else if (action === 'off') {
        botData.antiCall[userId] = false;
        saveBotData();
        const message = `╔═══════════════════════════╗\n` +
                       `║   📞 𝗔𝗡𝗧𝗜-𝗖𝗔𝗟𝗟 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗢𝗡   ║\n` +
                       `╚═══════════════════════════╝\n\n` +
                       `🛡️ *Status:* ${currentStatus}\n` +
                       `❌ *Action:* Turned *OFF*\n\n` +
                       `⚠️ *Warning:* Calls will now be allowed.\n` +
                       `   (But the bot may still reject them if not handled.)\n\n` +
                       `🔓 *Your bot is now unprotected.*`;
        await sock.sendMessage(from, { text: message }, { quoted: msg });
    } else {
        const message = `╔═══════════════════════════╗\n` +
                       `║   📞 𝗔𝗡𝗧𝗜-𝗖𝗔𝗟𝗟 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗢𝗡   ║\n` +
                       `╚═══════════════════════════╝\n\n` +
                       `🛡️ *Current Status:* ${currentStatus}\n\n` +
                       `📌 *Usage:*\n` +
                       `   .anticall on  → Enable protection\n` +
                       `   .anticall off → Disable protection\n\n` +
                       `💡 *Note:* When enabled, callers will be rejected and\n` +
                       `   blocked after 3 consecutive attempts.`;
        await sock.sendMessage(from, { text: message }, { quoted: msg });
    }
}

module.exports = anticallCommand;