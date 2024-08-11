import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {

  // add a structured log
  const log = {
    message: "Hello world",
    timestamp: new Date().toISOString(),
    functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
    functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
    ddExtensionVersion: process.env.DD_EXTENSION_VERSION,
  };

  // Log the structured log object as a JSON string
  console.log(JSON.stringify(log));

  return {
    statusCode: 200,
    body: `Hello world. The time is ${new Date().toISOString()}. This function is using DD_EXTENSION_VERSION: ${process.env.DD_EXTENSION_VERSION}`,
  };
});
