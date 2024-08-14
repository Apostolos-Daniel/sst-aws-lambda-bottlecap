import { StackContext, Api } from "sst/constructs";

export function APIBottleCap({ stack, app }: StackContext) {  
  // Set default environment variables for all functions in this stack
  stack.setDefaultFunctionProps({
    environment: {
      DD_EXTENSION_VERSION: "next",
    },
  });
  const numberOfFunctions = 10;  // Adjust this as needed
  const stage = app.stage;      // Get the stage name (e.g., "dev", "prod")
  const routes: Record<string, any> = {};

  for (let i = 1; i <= numberOfFunctions; i++) {
    const functionName = `bottlecap${i}${stage}`;
    const routePath = `GET /bottlecap${i}`;

    routes[routePath] = {
        function: {
          handler: "packages/functions/src/lambda-bottlecap.handler",
          functionName,
        },
    };
  }

  const api = new Api(stack, "api-bottlecap", {
    routes,
  });
  stack.addOutputs({
    ApiBottleCapEndpoint: api.url,
  });
}
