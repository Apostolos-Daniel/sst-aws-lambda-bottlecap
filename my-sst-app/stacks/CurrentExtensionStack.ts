import { StackContext, Api } from "sst/constructs";

export function APICurrent({ stack, app }: StackContext) {
  const numberOfFunctions = 10; // Adjust this as needed
  const stage = app.stage; // Get the stage name (e.g., "dev", "prod")
  const routes: Record<string, any> = {};

  for (let i = 1; i <= numberOfFunctions; i++) {
    const functionName = `current${i}${stage}`;
    const routePath = `GET /current${i}`;

    routes[routePath] = {
        function: {
          handler: "packages/functions/src/lambda-current.handler",
          functionName,
        },
    };
  }

  console.log("routes", routes);

  const api = new Api(stack, "api-current", {
    routes,
  });

  stack.addOutputs({
    ApiCurrentEndpoint: api.url,
  });
}
