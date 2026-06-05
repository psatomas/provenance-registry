import { keccak256 } from "ethers";

export async function hashPdf(file: File) {
    const buffer = await file.arrayBuffer();

    return keccak256(new Uint8Array(buffer));
}