async function ownerCommand(sock, from, msg) {
    // Auto React 👑
    await sock.sendMessage(from, {
        react: {
            text: "👑",
            key: msg.key
        }
    });

    const caption = `
╭━━━〔 👑 *DARK QUEEN MD OWNER* 👑 〕━━━⬣
┃
┃ 👤 *Owner:* DOPE SASA & ZADI
┃ 🤖 *Bot:* DARK QUEEN MD
┃ 💻 *Developer:* Sasa Dev
┃ ⚡ *Status:* Online 24/7
┃ 🚀 *Version:* Latest
┃
┣━━━━━━━━━━━━━━━━━━⬣
┃✨ *Need Help?*
┃
┃• Report Bugs 🐞
┃• Feature Requests 💡
┃• Bot Support 🛠️
┃• Premium Services ⭐
┃
┣━━━━━━━━━━━━━━━━━━⬣
┃⚠️ *Please don't spam the owner.*
┃📩 Send your message clearly and
┃wait patiently for a reply.
┃
┣━━━━━━━━━━━━━━━━━━⬣
┃🌐 *Powered By DARK QUEEN MD*
╰━━━━━━━━━━━━━━━━━━⬣
`;

    await sock.sendMessage(
        from,
        {
            image: {
                url: "https://i.ibb.co/YFrKWScZ/fab3b0c64145.jpg"
            },
            caption: caption
        },
        {
            quoted: msg
        }
    );
}

module.exports = ownerCommand;
