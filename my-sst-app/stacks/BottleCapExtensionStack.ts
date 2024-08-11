import { StackContext, Api } from "sst/constructs";

export function APIBottleCap({ stack }: StackContext) {  
  // Set default environment variables for all functions in this stack
  stack.setDefaultFunctionProps({
    environment: {
      DD_EXTENSION_VERSION: "next",
      DD_SERVICE: "bottlecap",
    },
  });
  const api = new Api(stack, "api-bottle-cap", {
    routes: {
      "GET /": {
        function: {
          handler: "packages/functions/src/lambda-bottlecap.handler",
          functionName: "bottlecap",
        },
      },
      "GET /bottlecap1": {
        function: {
          handler: "packages/functions/src/lambda-bottlecap.handler",
          functionName: "bottlecap1",
        },
      },
    },
  });

  stack.addOutputs({
    ApiBottleCapEndpoint: api.url,
  });
}
