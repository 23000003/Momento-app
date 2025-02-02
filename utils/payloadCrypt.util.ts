import bs58 from "bs58";
import { Buffer } from "buffer";
import { SolanaConfig } from "@/config/solana";

global.Buffer = Buffer;

// still has other types TBD
type decryptPayloadType = {
  public_key: string;
  session: string;
  signature: string;
};

export const decryptPayload = (
  data: string,
  nonce: string,
  sharedSecret?: Uint8Array
): decryptPayloadType => {
  if (!sharedSecret) throw new Error("missing shared secret");

  const decryptedData = SolanaConfig.naclHelper.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  );

  if (!decryptedData) {
    throw new Error("Unable to decrypt data");
  }

  console.log(
    JSON.parse(Buffer.from(decryptedData).toString("utf8")),
    "PARSED"
  );

  return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
};

type Payload = {
  session: string | null;
  transaction?: string;
};
export const encryptPayload = (payload: Payload, sharedSecret?: Uint8Array) => {
  if (!sharedSecret) throw new Error("missing shared secret");

  const nonce = SolanaConfig.naclHelper.randomBytes(24);

  const encryptedPayload = SolanaConfig.naclHelper.box.after(
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret
  );

  return [nonce, encryptedPayload];
};
