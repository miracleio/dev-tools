export interface TypeGenerationOptions {
  useTypeAlias?: boolean; // Determines whether to use 'type' or 'interface'
}

export function generateTypeScriptTypes(
  data: unknown,
  typeName: string = "GeneratedType",
  options: TypeGenerationOptions = { useTypeAlias: false }
): string {
  const useTypeAlias = options.useTypeAlias ?? false;

  function getType(value: unknown): string {
    if (Array.isArray(value)) {
      if (value.length === 0) return "any[]"; // Handle empty arrays

      const arrayTypes = new Set(value.map(getType));

      return arrayTypes.size === 1
        ? `${[...arrayTypes][0]}[]`
        : `(${[...arrayTypes].join(" | ")})[]`;
    }
    if (value === null) return "null";
    if (typeof value === "object") {
      if (!value) return "null";
      return generateAnonymousType(value as Record<string, unknown>);
    }
    return typeof value;
  }

  function generateAnonymousType(obj: Record<string, unknown>): string {
    const entries = Object.entries(obj)
      .map(([key, value]) => `  ${key}: ${getType(value)};`)
      .join("\n");

    return `{\n${entries}\n}`;
  }

  function generateNamedType(
    obj: Record<string, unknown>,
    name: string
  ): string {
    const entries = Object.entries(obj)
      .map(([key, value]) => `  ${key}: ${getType(value)};`)
      .join("\n");

    return useTypeAlias
      ? `type ${name} = {\n${entries}\n};`
      : `interface ${name} {\n${entries}\n}`;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error(
        "Invalid input: Cannot generate types from an empty array."
      );
    }
    const uniqueTypes = new Set(data.map(getType));

    if (uniqueTypes.size === 1 && isPlainObject(data[0])) {
      // If all elements are objects of the same shape, generate a single interface
      return (
        generateNamedType(data[0] as Record<string, unknown>, typeName) + "[]"
      );
    } else {
      // Otherwise, return a union type (always as a type alias)
      return `type ${typeName} = ${[...uniqueTypes].join(" | ")};`;
    }
  }

  if (isPlainObject(data)) {
    return generateNamedType(data as Record<string, unknown>, typeName);
  }

  throw new Error(
    "Invalid input: Expected a JSON object or an array of objects."
  );
}

/**
 * Helper function to check if a value is a plain object
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
