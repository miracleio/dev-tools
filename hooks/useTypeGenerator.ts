import { useEffect, useRef, useState } from "react";

export const useTypeGenerator = () => {
  const workerRef = useRef<Worker | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedTypes, setGeneratedTypes] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/typeGeneratorWorker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    workerRef.current.onmessage = (event) => {
      setLoading(false);
      if (event.data.success) {
        setGeneratedTypes(event.data.generatedTypes);
      } else {
        setError(event.data.error);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const generateTypes = (data: string, useTypeAlias: boolean) => {
    setLoading(true);
    setGeneratedTypes(null);
    setError(null);
    workerRef.current?.postMessage({ data, useTypeAlias });
  };

  return { loading, generatedTypes, error, generateTypes };
};
