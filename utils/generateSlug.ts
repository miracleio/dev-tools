type GenerateOptions = {
  useUnderScore: boolean;
};

const generateSlug = (text: string, options?: GenerateOptions) => {
  return text
    .toLowerCase()
    .replace(/ /g, options?.useUnderScore ? "_" : "-")
    .replace(/[^\w-]+/g, "");
};

export default generateSlug;
