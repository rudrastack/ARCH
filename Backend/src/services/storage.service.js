import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PVT_KEY,
});

export async function uploadFile({ buffer, filename, folder = "ARKS" }) {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName: filename,
        folder
    })
    return result
}