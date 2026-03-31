import {
  collection,
  writeBatch,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { EncryptedPayloadV1 } from "../utils/secretCrypto";

export type Hint = { text: string; order: number };

export type PublicSecretDoc = {
  secretId: string;
  ownerUid: string;
  title: string;
  theme: string;
  hints: Hint[];
  encryptedPayload: EncryptedPayloadV1;
  createdAt: any;
  updatedAt: any;
};

export type UserSecretDoc = {
  secretId: string;
  title: string;
  theme: string;
  hintsCount: number;
  createdAt: any;
};

export type SecretSummary = {
  secretId: string;
  title: string;
  theme: string;
  createdAt: Date | null;
  hintsCount: number;
};

const publicSecretsCol = collection(db, "secrets");

export const createSecretDoc = async (input: {
  ownerUid: string;
  title: string;
  theme: string;
  hints: Hint[];
  encryptedPayload: EncryptedPayloadV1;
}): Promise<string> => {
  const publicDocRef = doc(publicSecretsCol);
  const userDocRef = doc(
    db,
    "users",
    input.ownerUid,
    "secrets",
    publicDocRef.id,
  );

  const publicPayload: PublicSecretDoc = {
    secretId: publicDocRef.id,
    ownerUid: input.ownerUid,
    title: input.title,
    theme: input.theme,
    hints: input.hints,
    encryptedPayload: input.encryptedPayload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const userPayload: UserSecretDoc = {
    secretId: publicDocRef.id,
    title: input.title,
    theme: input.theme,
    hintsCount: Array.isArray(input.hints) ? input.hints.length : 0,
    createdAt: serverTimestamp(),
  };

  const batch = writeBatch(db);
  batch.set(publicDocRef, publicPayload);
  batch.set(userDocRef, userPayload);
  await batch.commit();

  return publicDocRef.id;
};

export const getSecretDoc = async (
  secretId: string,
): Promise<PublicSecretDoc> => {
  const snap = await getDoc(doc(publicSecretsCol, secretId));
  if (!snap.exists()) {
    throw new Error("Secret not found");
  }
  return snap.data() as PublicSecretDoc;
};

export const listSecretsForUser = async (
  ownerUid: string,
): Promise<SecretSummary[]> => {
  const userSecretsCol = collection(db, "users", ownerUid, "secrets");
  const q = query(userSecretsCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data() as UserSecretDoc;
    const createdAt =
      data.createdAt && typeof (data.createdAt as any).toDate === "function"
        ? (data.createdAt as any).toDate()
        : null;

    return {
      secretId: data.secretId,
      title: data.title,
      theme: data.theme,
      createdAt,
      hintsCount: data.hintsCount ?? 0,
    };
  });
};

export const deleteSecretDoc = async (secretId: string, currentUid: string) => {
  const existing = await getSecretDoc(secretId);
  if (existing.ownerUid !== currentUid) {
    throw new Error("Not allowed");
  }

  const batch = writeBatch(db);
  batch.delete(doc(publicSecretsCol, secretId));
  batch.delete(doc(db, "users", currentUid, "secrets", secretId));
  await batch.commit();
};
