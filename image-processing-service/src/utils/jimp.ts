import { Jimp, JimpMime } from 'jimp';
import { streamToBuffer } from '@/utils/streamToBuffer';
import { Readable } from 'stream';

export const transformImage = async (imageStream: Readable) => {
  // Convert the Body stream to a Buffer
  const imageBuffer = await streamToBuffer(imageStream);

  const image = await Jimp.read(imageBuffer);

  image.rotate(180);

  image.greyscale();

  // Get the image buffer
  return await image.getBuffer(JimpMime.png);
};
