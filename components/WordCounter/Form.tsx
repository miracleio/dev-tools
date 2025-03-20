"use client";

import {
  WordCounter,
  WordCountOptions,
  WordCountStats,
} from "@/utils/wordCounter";
import { InformationCircleFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

interface WordCounterFormInput {
  text: string;
  stripHtml: boolean;
  stripMarkdown: boolean;
  countCodeBlocks: boolean;
  countImageAlt: boolean;
  countLinkUrls: boolean;
  countMediaElements: boolean;
}

const WordCounterForm = () => {
  const [result, setResult] = useState<WordCountStats | null>(null);
  const [, setWordCount] = useState<number | null>(null);

  const wordCounter = new WordCounter();

  const fields: {
    name: keyof WordCounterFormInput;
    label: string;
    type: "textarea" | "checkbox";
    placeholder?: string;
    info: string;
  }[] = [
    {
      name: "text",
      label: "Text to analyze",
      type: "textarea",
      placeholder: "Paste your text, HTML, or Markdown here...",
      info: "Enter the text content you want to analyze. This can include HTML, Markdown, or plain text.",
    },
    {
      name: "stripHtml",
      label: "Strip HTML tags",
      type: "checkbox",
      info: "Remove HTML tags from the content before counting words.",
    },
    {
      name: "stripMarkdown",
      label: "Strip Markdown formatting",
      type: "checkbox",
      info: "Remove Markdown formatting from the content before counting words.",
    },
    {
      name: "countCodeBlocks",
      label: "Count code blocks",
      type: "checkbox",
      info: "Include text within code blocks in the word count.",
    },
    {
      name: "countImageAlt",
      label: "Count image alt text",
      type: "checkbox",
      info: "Include alt text from images in the word count.",
    },
    {
      name: "countLinkUrls",
      label: "Count link URLs",
      type: "checkbox",
      info: "Include URLs from links in the word count.",
    },
    {
      name: "countMediaElements",
      label: "Count media elements",
      type: "checkbox",
      info: "Count media elements (video, audio, etc.) as words.",
    },
  ];

  const formik = useFormik<WordCounterFormInput>({
    initialValues: {
      text: "",
      stripHtml: true,
      stripMarkdown: true,
      countCodeBlocks: true,
      countImageAlt: true,
      countLinkUrls: false,
      countMediaElements: false,
    },
    validationSchema: Yup.object().shape({
      text: Yup.string().required("Text is required"),
      stripHtml: Yup.boolean(),
      stripMarkdown: Yup.boolean(),
      countCodeBlocks: Yup.boolean(),
      countImageAlt: Yup.boolean(),
      countLinkUrls: Yup.boolean(),
      countMediaElements: Yup.boolean(),
    }),
    onSubmit: (values) => {
      const options: WordCountOptions = {
        stripHtml: values.stripHtml,
        stripMarkdown: values.stripMarkdown,
        countCodeBlocks: values.countCodeBlocks,
        countImageAlt: values.countImageAlt,
        countLinkUrls: values.countLinkUrls,
        countMediaElements: values.countMediaElements,
      };

      const wordCount = wordCounter.countWords(values.text, options);
      setWordCount(wordCount);

      const result = wordCounter.analyzeText(values.text, options);
      setResult(result);
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="wrapper flex flex-col gap-4">
          {/* Text input */}
          <div className="flex-col flex gap-1">
            <label htmlFor="text">Text to analyze</label>
            <textarea
              id="text"
              placeholder="Paste your text, HTML, or Markdown here..."
              {...formik.getFieldProps("text")}
              className="form-input h-60"
            />
            <div className="form-info">
              <HugeiconsIcon
                icon={InformationCircleFreeIcons}
                color="currentColor"
                className="icon w-4 h-4"
                strokeWidth={1}
              />
              <span>
                Enter the text content you want to analyze. This can include
                HTML, Markdown, or plain text.
              </span>
            </div>
            {formik.touched.text && formik.errors.text ? (
              <p className="form-error">{formik.errors.text}</p>
            ) : null}
          </div>

          {/* Checkbox options */}
          <div className="grid md:grid-cols-2 gap-3">
            {fields
              .filter((field) => field.type === "checkbox")
              .map(({ name, label, info }) => (
                <div key={name} className="flex gap-2 items-start">
                  <input
                    type="checkbox"
                    id={name}
                    {...formik.getFieldProps(name)}
                    checked={formik.values[name] as boolean}
                    className="mt-1"
                  />
                  <div className="flex flex-col">
                    <label htmlFor={name} className="cursor-pointer">
                      {label}
                    </label>
                    <div className="form-info">
                      <span>{info}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="action-cont">
            <button
              type="submit"
              className="btn primary"
              disabled={!formik.isValid || formik.values.text.trim() === ""}
            >
              <span>Analyze Text</span>
            </button>
          </div>
        </div>
      </form>

      {result && (
        <div className="result-section mt-4 card">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
            Word Count Analysis
          </h3>
          <ul className="mt-2 space-y-3">
            <li className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
              <strong className="text-gray-900 dark:text-gray-100">
                Total Words:
              </strong>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {result.totalWords.toLocaleString()}
              </span>
              <small className="text-gray-500 dark:text-gray-400">
                The total number of words in your text.
              </small>
            </li>
            <li className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
              <strong className="text-gray-900 dark:text-gray-100">
                Unique Words:
              </strong>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {result.uniqueWords.toLocaleString()}
              </span>
              <small className="text-gray-500 dark:text-gray-400">
                The number of different words used in your text.
              </small>
            </li>
            <li className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
              <strong className="text-gray-900 dark:text-gray-100">
                Sentences:
              </strong>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {result.sentences.toLocaleString()}
              </span>
              <small className="text-gray-500 dark:text-gray-400">
                The estimated number of sentences in your text.
              </small>
            </li>
            <li className="text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-1">
              <strong className="text-gray-900 dark:text-gray-100">
                Average Word Length:
              </strong>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {result.averageWordLength.toFixed(1)} characters
              </span>
              <small className="text-gray-500 dark:text-gray-400">
                The average length of words in your text.
              </small>
            </li>
          </ul>

          <h4 className="font-semibold mt-4 text-gray-800 dark:text-gray-200">
            Most Common Words:
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(result.wordFrequency)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([word, count]) => (
                <div key={word} className="tag">
                  {word}{" "}
                  <span className="text-gray-500 dark:text-gray-400">
                    ({count})
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordCounterForm;
