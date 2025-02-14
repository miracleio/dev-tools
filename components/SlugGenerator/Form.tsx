"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import generateSlug from "@/utils/generateSlug";

const SlugGeneratorForm = () => {
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      data: "",
    },
    validationSchema: Yup.object({
      data: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const generatedSlug = generateSlug(values.data);
        setSlug(generatedSlug);
      } catch (error) {
        console.error("Error generating slug:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="wrapper flex flex-col gap-2">
          <div className="flex-col flex gap-1">
            <label htmlFor="data">Enter your text</label>
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
      {slug && (
        <div className="card mt-8">
          <h3 className="font-bold">Generated Slug:</h3>
          <pre className="whitespace-pre-wrap text-sm">{slug}</pre>
        </div>
      )}
    </div>
  );
};

export default SlugGeneratorForm;
