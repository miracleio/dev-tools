"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import Spinner from "@/components/Spinner";
import { useTypeGenerator } from "@/hooks/useTypeGenerator";

const TypesGeneratorForm = () => {
  const { loading, generatedTypes, error, generateTypes } = useTypeGenerator();

  const preprocessToJson = (input: string) => {
    try {
      // Attempt to parse the input as JSON
      JSON.parse(input);
      // If parsing succeeds, return the input as it's already valid JSON
      return input;
    } catch (e) {
      console.log("Parsing failed, proceeding with preprocessing", e);
      // If parsing fails, proceed with preprocessing
      return input
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Wrap unquoted keys in double quotes
        .replace(/'/g, '"') // Replace single quotes with double quotes
        .replace(/,\s*}/g, "}") // Remove trailing commas before closing object
        .replace(/,\s*]/g, "]"); // Remove trailing commas before closing array
    }
  };

  const formik = useFormik({
    initialValues: {
      data: "",
    },
    validationSchema: Yup.object({
      data: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log(values.data);

      const cleanedJson = preprocessToJson(values.data);
      console.log({ cleanedJson });

      const parsedData = JSON.parse(cleanedJson); // Convert to valid JSON
      console.log(parsedData); // You can pass this to generateTypeScriptTypes
      generateTypes(parsedData, false); // Change to true if you want to use `type` instead of `interface`
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="wrapper flex flex-col gap-2">
          <div className="flex-col flex gap-1">
            <label htmlFor="data">Enter your JSON data</label>
            <textarea
              id="data"
              cols={30}
              rows={10}
              {...formik.getFieldProps("data")}
              className="form-input"
            ></textarea>
            {formik.touched.data && formik.errors.data ? (
              <p className="text-red-500">{formik.errors.data}</p>
            ) : null}
          </div>
          <div className="action-cont">
            <button type="submit" className="btn primary" disabled={loading}>
              <span>Generate</span>
              <Spinner loading={loading} />
            </button>
          </div>
        </div>
      </form>

      {/* Display Errors */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Display Generated Types */}
      {generatedTypes && (
        <div className="card mt-8">
          <h3 className="font-bold">Generated TypeScript:</h3>
          <pre className="whitespace-pre-wrap text-sm">{generatedTypes}</pre>
        </div>
      )}
    </div>
  );
};

export default TypesGeneratorForm;
