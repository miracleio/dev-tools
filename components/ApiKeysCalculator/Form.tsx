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
      availableKeys: 12,
    },
    validationSchema: Yup.object({
      knownInterval: Yup.number().required(),
      limitReachedInDays: Yup.number().required(),
      operationInterval: Yup.number().required(),
      requestsPerMonth: Yup.number().required(),
      availableKeys: Yup.number(),
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
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApiKeysCalculatorForm;
