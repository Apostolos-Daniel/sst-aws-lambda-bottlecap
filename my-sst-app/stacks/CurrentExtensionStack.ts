import { StackContext, Api } from "sst/constructs";

export function APICurrent({ stack }: StackContext) {
    // Set default environment variables for all functions in this stack
    stack.setDefaultFunctionProps({
      environment: {
        DD_SERVICE: "current",
      },
    });
  const api = new Api(stack, "api-current", {
    routes: {
      "GET /": {
        function: {
          handler: "packages/functions/src/lambda-current.handler",
          functionName: "current",
        },
      },
      "GET /current1": {
        function: {
          handler: "packages/functions/src/lambda-current.handler",
          functionName: "current1",
        },
      },
    },
  });

  stack.addOutputs({
    ApiCurrentEndpoint: api.url,
  });
}
