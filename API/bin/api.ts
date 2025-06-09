#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TaskApiStack } from "../lib/api-stack";

const app = new cdk.App();
new TaskApiStack(app, "ApiStack");
