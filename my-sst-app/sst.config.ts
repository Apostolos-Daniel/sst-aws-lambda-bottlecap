import { SSTConfig } from "sst";
import { APICurrent, } from "./stacks/CurrentExtensionStack";
import { APIBottleCap } from "./stacks/BottleCapExtensionStack";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Datadog } from "datadog-cdk-constructs-v2";
import { Stack } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "bottlecap-test",
      region: "eu-west-1",
    };
  },
  
  async stacks(app) {
    const datadogApiKeySecretArn = `arn:aws:secretsmanager:${app.region}:643476110649:secret:DdApiKeySecret-XiVnMDcSAlrU-GhvrL0`;
    console.log("Datadog API Key Secret ARN", datadogApiKeySecretArn);
    
    // Allow functions to access secret
    app.addDefaultFunctionPermissions([
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [datadogApiKeySecretArn],
        actions: ["secretsmanager:GetSecretValue"],
      }),
    ]);
    app.setDefaultFunctionProps({
      nodejs: {
        esbuild: {
          external: ["datadog-lambda-js", "dd-trace", "aws-sdk"],
        },
      },
      runtime: "nodejs20.x",
    });
    app.stack(APICurrent).stack(APIBottleCap);
    await app.finish();

    // Attach the Datadog contruct to each stack
    app.node.children.forEach((stack) => {
      if (stack instanceof Stack) {
        const serviceName = stack.stackName.endsWith("APIBottleCap") ? "bottlecapeu" : "currenteu";
        console.log("Adding Datadog to stack", stack.stackName);
        console.log("Service name", serviceName);
        const datadog = new Datadog(stack, "datadog", {
          // Get the latest version from
          // https://github.com/Datadog/datadog-lambda-js/releases
          nodeLayerVersion: 107,
          // Get the latest version from
          // https://github.com/Datadog/datadog-lambda-extension/releases
          extensionLayerVersion: 63,
          site: "datadoghq.eu",
          apiKeySecretArn: datadogApiKeySecretArn,
          enableColdStartTracing: true,
          env: app.stage,
          service: serviceName,
          version: "1.0.0",
        });

        datadog.addLambdaFunctions(stack.getAllFunctions());
      }
    });
  },
} satisfies SSTConfig;

