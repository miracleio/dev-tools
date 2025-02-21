"use client";

import apiKeysCalculator, {
  ApiKeysCalculatorInput,
  ApiKeysCalculatorOutput,
} from "@/utils/apiKeysCalculator";
import { InformationCircleFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

const ApiKeysCalculatorForm = () => {
  const [result, setResult] = useState<ApiKeysCalculatorOutput | null>(null);
  const fields: {
    name: keyof ApiKeysCalculatorInput;
    label: string;
    placeholder: string;
    info: string;
  }[] = [
    {
      name: "knownInterval",
      label: "Known Interval (minutes)",
      placeholder: "e.g., 20",
      info: "The interval (in minutes) at which the API key lasted limitReachedInDays",
    },
    {
      name: "limitReachedInDays",
      label: "Limit Reached in Days (e.g., 9)",
      placeholder: "e.g., 9",
      info: "The number of days it takes to hit the API key limit at a known interval",
    },
    {
      name: "operationInterval",
      label: "Operation Interval (e.g., 20)",
      placeholder: "e.g., 20",
      info: "The interval in minutes (e.g., every 1 min, 5 min, etc.). This is the interval at which you want to run your operations.",
    },
    {
      name: "requestsPerMonth",
      label: "Requests Per Month (e.g., 10,000)",
      placeholder: "e.g., 10,000",
      info: "Max requests per API key per month",
    },
    {
      name: "requestsPerOperation",
      label: "Requests Per Operation (optional)",
      placeholder: "e.g., 5",
      info: "Optional: If unknown, this will be calculated based on knownInterval and limitReachedInDays",
    },
    {
      name: "availableKeys",
      label: "Available Keys (e.g., 12)",
      placeholder: "e.g., 12",
      info: "Optional: Number of API keys available",
    },
  ];

  const formik = useFormik<ApiKeysCalculatorInput>({
    initialValues: {
      knownInterval: 20,
      limitReachedInDays: 9,
      operationInterval: 20,
      requestsPerMonth: 10_000,
      requestsPerOperation: undefined,
      availableKeys: 12,
    },
    validationSchema: Yup.object().shape({
      requestsPerMonth: Yup.number()
        .required("Requests per month is required")
        .positive("Must be a positive number"),

      operationInterval: Yup.number()
        .required("Operation interval is required")
        .positive("Must be a positive number"),

      availableKeys: Yup.number().nullable().min(0, "Cannot be negative"),

      requestsPerOperation: Yup.number()
        .nullable()
        .positive("Must be a positive number")
        .test(
          "requestsPerOperation-required",
          "Requests per operation is required if known interval and limit reached in days are missing",
          function (value) {
            const { knownInterval, limitReachedInDays } = this.parent;
            return !!value || (knownInterval && limitReachedInDays);
          }
        ),

      knownInterval: Yup.number()
        .nullable()
        .positive("Must be a positive number")
        .test(
          "knownInterval-required",
          "Known interval is required if requests per operation is missing",
          function (value) {
            const { requestsPerOperation, limitReachedInDays } = this.parent;
            return !!value || !!requestsPerOperation || !limitReachedInDays;
          }
        ),

      limitReachedInDays: Yup.number()
        .nullable()
        .positive("Must be a positive number")
        .test(
          "limitReachedInDays-required",
          "Limit reached in days is required if requests per operation is missing",
          function (value) {
            const { requestsPerOperation, knownInterval } = this.parent;
            return !!value || !!requestsPerOperation || !knownInterval;
          }
        ),
    }),
    onSubmit: (values) => {
      const result = apiKeysCalculator(values);
      setResult(result);
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="wrapper flex flex-col gap-2">
          {fields.map(({ name, label, placeholder, info }) => (
            <div key={name} className="flex-col flex gap-1">
              <label htmlFor={name}>{label}</label>
              <input
                type="number"
                id={name}
                placeholder={placeholder}
                {...formik.getFieldProps(name)}
                className="form-input"
              />
              <div className="form-info">
                <HugeiconsIcon
                  icon={InformationCircleFreeIcons}
                  color="currentColor"
                  className="icon w-4 h-4"
                  strokeWidth={1}
                />
                <span>{info}</span>
              </div>
              {formik.touched[name] && formik.errors[name] ? (
                <p className="form-error">{formik.errors[name]}</p>
              ) : null}
            </div>
          ))}
          <div className="action-cont">
            <button
              type="submit"
              className="btn primary"
              disabled={!formik.isValid}
            >
              <span>Calculate</span>
            </button>
          </div>
        </div>
      </form>
      {result && (
        <div className="result-section mt-4 card">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
            API Key Usage Analysis
          </h3>
          <ul className="mt-2 space-y-3">
            <li className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
              <strong className="text-gray-900 dark:text-gray-100">
                Required API Keys:
              </strong>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {result.requiredKeys.toLocaleString()}
              </span>
              <small className="text-gray-500 dark:text-gray-400">
                The estimated number of API keys needed to sustain your current
                usage.
              </small>
            </li>
            <li className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
              <strong className="text-gray-900 dark:text-gray-100">
                Suggested Request Interval:
              </strong>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {result.newInterval} minutes
              </span>
              <small className="text-gray-500 dark:text-gray-400">
                The recommended time interval between API requests to prevent
                exceeding rate limits.
              </small>
            </li>
            <li className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
              <strong className="text-gray-900 dark:text-gray-100">
                API Key Rotation Interval:
              </strong>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {result.apiKeyRotationInterval?.toFixed(2)} days
              </span>
              <small className="text-gray-500 dark:text-gray-400">
                Rotate API keys approximately every{" "}
                {result.apiKeyRotationInterval?.toFixed(2)} days to maintain
                continuous operation.
              </small>
            </li>
          </ul>

          <h4 className="font-semibold mt-4 text-gray-800 dark:text-gray-200">
            Example API Key Rotation Script:
          </h4>
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
            <code>
              {`
const fs = require("fs");
const path = require("path");

// Load API keys from environment variables
const apiKeys = [
  ${Array.from(
    { length: formik.values.availableKeys || result.requiredKeys },
    (_, i) => `process.env.API_KEY_${i + 1}`
  ).join(",\n  ")}
].filter(Boolean);

const statePath = path.join(__dirname, "state.json");

// Load or initialize state
let state = { lastRotation: 0, currentIndex: 0 };
if (fs.existsSync(statePath)) {
  state = JSON.parse(fs.readFileSync(statePath, "utf8"));
}

const now = Date.now();
const rotationInterval = ${
                result.apiKeyRotationInterval
              } * 24 * 60 * 60 * 1000; // Convert days to milliseconds

if (now - state.lastRotation >= rotationInterval) {
  state.currentIndex = (state.currentIndex + 1) % apiKeys.length;
  state.lastRotation = now;
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  console.log("🔄 API keys rotated!");
}

// Cron Job for automatic rotation
const cron = require("node-cron");
cron.schedule("0 0 * * *", () => {
  const now = Date.now();
  if (now - state.lastRotation >= rotationInterval) {
    state.currentIndex = (state.currentIndex + 1) % apiKeys.length;
    state.lastRotation = now;
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
    console.log("🔄 API keys rotated automatically!");
  }
});
        `}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiKeysCalculatorForm;
