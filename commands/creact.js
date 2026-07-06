const { delay } = require('@whiskeysockets/baileys');

async function creactCommand(sock, from, msg, isAdmin, sessions, args) {
    if (!isAdmin) return await sock.sendMessage(from, { text: "❌ Only owner can use this command." }, { quoted: msg });

    if (args.length < 2) {
        return await sock.sendMessage(from, {
            text: "❌ Please provide a channel post URL and at least one emoji.\n\nUsage: .creact <post_url> <emoji1> [emoji2] ...\nExample: .creact https://whatsapp.com/channel/0029VbCW8bFKwqSWEFsYZ43b/136 🥹,🫶,🌝"
        }, { quoted: msg });
    }

    const url = args[0];
    const emojiArgs = args.slice(1);

    // Extract emojis: either comma-separated or space-separated
    let emojis = [];
    for (const part of emojiArgs) {
        if (part.includes(',')) {
            const parts = part.split(',').map(e => e.trim()).filter(e => e.length > 0);
            emojis.push(...parts);
        } else {
            emojis.push(part);
        }
    }

    if (emojis.length === 0) {
        return await sock.sendMessage(from, { text: "❌ No valid emojis provided." }, { quoted: msg });
    }

    // Validate URL format
    const match = url.match(/^https?:\/\/whatsapp\.com\/channel\/([^\/]+)\/(\d+)/i);
    if (!match) {
        return await sock.sendMessage(from, { text: "❌ Invalid channel post URL. Format: https://whatsapp.com/channel/<channelID>/<postID>" }, { quoted: msg });
    }

    const channelID = match[1];
    const postID = match[2];
    const channelJid = `${channelID}@newsletter`;

    // Send initial message with loading react
    await sock.sendMessage(from, {
        react: {
            text: "⏳",
            key: msg.key
        }
    });

    // Start message with image
    await sock.sendMessage(from, {
        image: {
            url: "https://i.ibb.co/PqcDrmb/98f7a191fbf2.jpg"
        },
        caption:
`╭━━━〔 ❤️ REACT SYSTEM 〕━━━╮

🚀 *React Process Started*

📌 *Channel ID :* ${channelID}
📌 *Post ID    :* ${postID}
😊 *Emojis     :* ${emojis.join(' ')}

⚡ Connecting active sessions...
🔥 Powered By *DARK QUEEN MD*

╰━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });

    const activeSessions = Object.values(sessions).filter(s => s.isConnected && s.sock);

    let successCount = 0;
    let failCount = 0;
    let results = [];

    for (let i = 0; i < activeSessions.length; i++) {
        const session = activeSessions[i];
        const emoji = emojis[i % emojis.length]; // round-robin

        try {
            // Construct message key
            const messageKey = {
                remoteJid: channelJid,
                id: postID,
                fromMe: false
            };

            await session.sock.sendMessage(channelJid, {
                react: {
                    text: emoji,
                    key: messageKey
                }
            });

            successCount++;
            results.push(`✅ ${session.userId} → ${emoji}`);
            console.log(`[Creact] Session ${session.userId} reacted with ${emoji} to post ${postID} ✅`);

        } catch (e) {
            failCount++;
            results.push(`❌ ${session.userId} → ${e.message}`);
            console.error(`[Creact] Session ${session.userId} failed: ${e.message}`);
        }

        await delay(1000); // avoid rate limiting
    }

    // Final result
    const resultText = results.length > 0 ? results.join('\n') : 'No reactions attempted.';
    await sock.sendMessage(from, {
        image: {
            url: "https://i.ibb.co/PqcDrmb/98f7a191fbf2.jpg"
        },
        caption:
`╭━━━〔 ❤️ REACT COMPLETED 〕━━━╮

🎭 *DARK QUEEN MD*

📊 *Reaction Report*

┃ 👥 Total Sessions : ${activeSessions.length}
┃ ✅ Success         : ${successCount}
┃ ❌ Failed          : ${failCount}

━━━━━━━━━━━━━━━━━━

😊 *Assigned Emojis:*
${emojis.join(' ')}

📋 *Details:*
${resultText}

━━━━━━━━━━━━━━━━━━

⚡ Fast • Secure • Automated

👑 Powered By
*Sasa Dev × Sadiya Dev*

╰━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: msg });
}

module.exports = creactCommand;