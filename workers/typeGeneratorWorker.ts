// ./workers/typeGeneratorWorker.ts

import { generateTypeScriptTypes } from "@/utils/generateTypeScriptTypes";

self.onmessage = (event) => {
  try {
    const { data, useTypeAlias } = event.data;
    const generatedTypes = generateTypeScriptTypes(data, "GeneratedType", {
      useTypeAlias,
    });
    self.postMessage({ success: true, generatedTypes });
  } catch (error) {
    console.log({ error });
    self.postMessage({ success: false, error: "Invalid JSON input" });
  }
};
