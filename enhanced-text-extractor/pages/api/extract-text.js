// Example alternative import
import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { HumanMessage } from "@langchain/core/messages";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import { configDotenv } from "dotenv";

configDotenv();

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

    console.log(data.text);
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
        const finaldata = await processing(data);
        console.log(finaldata,"final data received");
        res.json({finaldata,success:"True"});
      })
      .catch((error) => {
        console.error("Error parsing the form:", error.message);
        res.status(500).json({ error: "Error parsing the form" });
      });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

async function processing(text) {

  // Instantiate the parser
  const parser = new JsonOutputFunctionsParser();

  // Define the function schema
  const extractionFunctionSchema = {
    name: "extractor",
    description: "Extracts fields from the input.",
    parameters: {
      type: "object",
      properties: {
        policy_holder_name: {
          type: "string",
          description: "Policy Holder's Name",
        },
        date_of_birth: {
          type: "string",
          description: "Date of Birth",
        },
        policy_number: {
          type: "string",
          description: "Policy Number",
        },
        claim_number: {
          type: "string",
          description: "Claim Number",
        },
        surgery_date: {
          type: "string",
          description: "Surgery Date",
        },
        type_of_surgery: {
          type: "string",
          description: "Type of Surgery",
        },
        surgeon_name: {
          type: "string",
          description: "Surgeon's Name",
        },
        medical_provider_address: {
          type: "string",
          description: "Medical Provider Address",
        },
        total_surgery_cost: {
          type: "string",
          description: "Total Surgery Cost",
        },
        deductible_paid: {
          type: "string",
          description: "Deductible Paid",
        },
        conditions_related_to_work: {
          type: "string",
          description: "Conditions Related to Work",
        },
        date_of_symptoms: {
          type: "string",
          description: "Date of Symptoms",
        },
        address_for_correspondence: {
          type: "string",
          description: "Address for Correspondence",
        },
        phone_number: {
          type: "string",
          description: "Phone Number",
        },
        email_address: {
          type: "string",
          description: "Email Address",
        },
        employer_name: {
          type: "string",
          description: "Employer Name",
        },
      },
      required: [
        "policy_holder_name",
        "date_of_birth",
        "policy_number",
        "claim_number",
        "surgery_date",
        "type_of_surgery",
        "surgeon_name",
        "medical_provider_address",
        "total_surgery_cost",
        "deductible_paid",
        "conditions_related_to_work",
        "date_of_symptoms",
        "address_for_correspondence",
        "phone_number",
        "email_address",
        "employer_name",
      ],
    },
  };

  // Instantiate the ChatOpenAI class
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAPIKEY,
  });

  // Create a new runnable, bind the function to the model, and pipe the output through the parser
  const runnable = model
    .bind({
      functions: [extractionFunctionSchema],
      function_call: { name: "extractor" },
    })
    .pipe(parser);

  // Invoke the runnable with an input
  const result = await runnable.invoke([new HumanMessage(text)]);
  return result
}
