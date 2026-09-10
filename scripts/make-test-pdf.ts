import fs from "fs";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { keccak256 } from "ethers";

const CONTRACT_ADDRESS = "0xd8FC6C229d7666865EDE56f56C68Af01cC5021BA";

async function createPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const content = `
PROOFCHAIN AUDIT REPORT

Protocol: ProofChain Test Audit
Contract: ${CONTRACT_ADDRESS}
Version: v1.0.0
Auditor: Test Auditor

------------------------------------

AUDIT SUMMARY:
- No critical vulnerabilities found
- Access control verified
- Events properly emitted

------------------------------------

NOTE:
This document is deterministic for blockchain verification.
`;

    page.drawText(content, {
        x: 40,
        y: 750,
        size: 10,
        font
    });

    const pdfBytes = await pdfDoc.save();

    fs.writeFileSync("test-audit.pdf", pdfBytes);

    const hash = keccak256(new Uint8Array(pdfBytes));

    console.log("\nPDF GENERATED: test-audit.pdf");
    console.log("PDF HASH (use in contract):", hash);
}

createPDF().catch(console.error);