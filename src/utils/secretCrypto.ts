export type EncryptedPayloadV1 = {
  v: 1;
  alg: "AES-GCM";
  kdf: "PBKDF2";
  hash: "SHA-256";
  iterations: number;
  saltB64: string;
  ivB64: string;
  ctB64: string;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
  // Ensure we hand WebCrypto an ArrayBuffer (not a SharedArrayBuffer/ArrayBufferLike union).
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
};

const toBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

const fromBase64 = (b64: string): Uint8Array => {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const deriveAesKey = async (
  password: string,
  salt: ArrayBuffer,
  iterations: number,
) => {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
};

export const encryptSecretHtml = async (
  plaintextHtml: string,
  password: string,
): Promise<EncryptedPayloadV1> => {
  if (!password) throw new Error("Password is required");

  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const ivBytes = crypto.getRandomValues(new Uint8Array(12));
  const iterations = 150_000;

  const key = await deriveAesKey(
    password,
    toArrayBuffer(saltBytes),
    iterations,
  );
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: toArrayBuffer(ivBytes) },
    key,
    toArrayBuffer(encoder.encode(plaintextHtml)),
  );

  return {
    v: 1,
    alg: "AES-GCM",
    kdf: "PBKDF2",
    hash: "SHA-256",
    iterations,
    saltB64: toBase64(saltBytes),
    ivB64: toBase64(ivBytes),
    ctB64: toBase64(new Uint8Array(ciphertext)),
  };
};

export const decryptSecretHtml = async (
  payload: EncryptedPayloadV1,
  password: string,
): Promise<string> => {
  const saltBytes = fromBase64(payload.saltB64);
  const ivBytes = fromBase64(payload.ivB64);
  const ctBytes = fromBase64(payload.ctB64);

  const key = await deriveAesKey(
    password,
    toArrayBuffer(saltBytes),
    payload.iterations,
  );

  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: toArrayBuffer(ivBytes) },
      key,
      toArrayBuffer(ctBytes),
    );
    return decoder.decode(plaintext);
  } catch {
    throw new Error("Incorrect password");
  }
};
