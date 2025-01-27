// src/utils/cryptoUtils.js
import CryptoJS from 'crypto-js'; // Assuming you're using crypto-js

// Function to encrypt data
 export default function encryptData(data, key) {
  console.log(data);
  if (!key) throw new Error('Encryption key is required');
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  return encrypted;
}
 