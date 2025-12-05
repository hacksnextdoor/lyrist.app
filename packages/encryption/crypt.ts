import {Buffer} from 'buffer';
import {createCipheriv, createDecipheriv, BinaryLike, CipherKey} from 'crypto';

// const algorithm: CipherCCMTypes = 'chacha20-poly1305';
const algorithm = 'aes-256-cbc';

// generate 16 bytes of random data
const initVector = Buffer.from([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
]) as unknown as BinaryLike; // version 2: randomBytes(16)

// secret key generate 32 bytes of random data
const securityKey = Buffer.from([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 31, 32,
]) as unknown as CipherKey; // version 2: randomBytes(32)

export function encrypt(decryptedString: string) {
  // the cipher function
  const cipher = createCipheriv(algorithm, securityKey, initVector);
  // encrypt the message
  let encryptedData = cipher.update(decryptedString, 'utf-8', 'hex');
  // encoding
  return (encryptedData += cipher.final('hex'));
}

export function decrypt(encryptedString: string) {
  // Handle empty or invalid input
  if (!encryptedString || typeof encryptedString !== 'string') {
    return '';
  }
  try {
    // the decipher function
    const decipher = createDecipheriv(algorithm, securityKey, initVector);
    // decrypt the message
    let decryptedData = decipher.update(encryptedString, 'hex', 'utf-8');
    // decoding
    return (decryptedData += decipher.final('utf-8'));
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedString;
  }
}
