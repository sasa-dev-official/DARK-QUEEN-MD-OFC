const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// Ensure temp directory exists
const TEMP_DIR = path.join(__dirname, '../temp');
fs.ensureDirSync(TEMP_DIR);

module.exports = async (sock, from, msg) => {
    // Check if it's a reply
    if (!msg.message.extendedTextMessage || !msg.message.extendedTextMessage.contextInfo.quotedMessage) {
        await sock.sendMessage(from, { text: '❌ Please reply to an image or video to create a sticker.' });
        return;
    }

    const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;
    let mediaType = null;
    let mediaMessage = null;

    if (quoted.imageMessage) {
        mediaType = 'image';
        mediaMessage = quoted.imageMessage;
    } else if (quoted.videoMessage) {
        mediaType = 'video';
        mediaMessage = quoted.videoMessage;
    } else {
        await sock.sendMessage(from, { text: '❌ Please reply to an image or video.' });
        return;
    }

    try {
        // Download media
        const stream = await downloadContentFromMessage(mediaMessage, mediaType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        let webpBuffer;

        if (mediaType === 'image') {
            // Convert image to webp
            webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
        } else if (mediaType === 'video') {
            // Extract a frame using ffmpeg
            const tempVideoPath = path.join(TEMP_DIR, `${Date.now()}_video.mp4`);
            const tempImagePath = path.join(TEMP_DIR, `${Date.now()}_frame.png`);

            await fs.writeFile(tempVideoPath, buffer);

            await new Promise((resolve, reject) => {
                ffmpeg(tempVideoPath)
                    .setFfmpegPath(ffmpegPath)
                    .screenshots({
                        timestamps: ['00:00:01'],
                        filename: path.basename(tempImagePath),
                        folder: path.dirname(tempImagePath),
                        size: '512x?'
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            const imageBuffer = await fs.readFile(tempImagePath);
            webpBuffer = await sharp(imageBuffer).webp({ quality: 80 }).toBuffer();

            // Cleanup temp files
            await fs.unlink(tempVideoPath).catch(() => {});
            await fs.unlink(tempImagePath).catch(() => {});
        }

        // Send sticker with metadata
        const stickerAuthor = 'Dope Sasa 💋';
        const stickerPack = 'ᴅᴀʀᴋ Qᴜᴇᴇɴ ᴍᴅ 👅';

        await sock.sendMessage(from, {
            sticker: webpBuffer,
            mimetype: 'image/webp',
            fileLength: webpBuffer.length,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: stickerAuthor,
                    body: stickerPack,
                    mediaType: 1,
                    mediaUrl: 'https://whatsapp.com/channel/0029VbCyoLS2f3EEZIOnuP0p',
                    sourceUrl: 'https://whatsapp.com/channel/0029VbCyoLS2f3EEZIOnuP0p',
                    showAdAttribution: true
                }
            }
        });
    } catch (error) {
        console.error('Sticker error:', error);
        await sock.sendMessage(from, { text: `❌ Failed to create sticker: ${error.message}` });
    }
};