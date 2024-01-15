// Example alternative import
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import { createReadStream } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const extractTextFromPDF = async (filePath) => {
  try {
    // Construct the correct file path
    filePath = path.join(process.cwd(), "public", "files", filePath);

    const dataBuffer = await fs.readFile(filePath);

    const data = await pdfParse(dataBuffer);

    console.log(data);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const dirPath = path.join(process.cwd(), "public", "files");

    try {
      // Attempt to read the directory
      const status = await fs.readdir(dirPath);
      console.log("Directory already exists:", status);
    } catch (error) {
      // If readdir throws an error, it means the directory doesn't exist
      console.log("Directory does not exist, creating...");

      try {
        // Attempt to create the directory
        await fs.mkdir(dirPath);
        console.log("Directory created successfully!");
      } catch (mkdirError) {
        console.error("Error creating directory:", mkdirError);
        // Handle the error accordingly
      }
    }
 
    let originalpath = "";
    const options = {};
    options.uploadDir = path.join(process.cwd(), "/public/files");
    options.filename = (name, ext, path, form) => {
      originalpath = Date.now().toString() + "_" + path.originalFilename;
      return originalpath;
    };

    const form = formidable(options);
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    })
      .then(async ({ fields, files }) => {
        console.log(options);
        const data = await extractTextFromPDF(originalpath);
        console.log("data");
        res.json(data);
      })
      .catch((error) => {
        console.error("Error parsing the form:", error.message);
        res.status(500).json({ error: "Error parsing the form" });
      });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
