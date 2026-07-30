import fs from "fs";
import path from "path";

export async function extractTextFromFile(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    return extractFromPdf(filePath);
  } else if (ext === ".docx") {
    return extractFromDocx(filePath);
  } else {
    throw new Error("Unsupported file type");
  }
}

async function extractFromPdf(filePath: string): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function extractFromDocx(filePath: string): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}