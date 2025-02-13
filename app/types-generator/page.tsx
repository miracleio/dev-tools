import TypesGeneratorForm from "@/components/TypesGenerator/Form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Types Generator",
  description: "Generate TypeScript types from JSON data.",
};

export default function TypesGeneratorPage() {
  return (
    <main>
      <section className="site-section">
        <div className="wrapper">
          <header className="section-header">
            <h1 className="text-3xl lg:text-5xl font-bold">Types Generator</h1>
          </header>
          <div className="py-8">
            <TypesGeneratorForm />
          </div>
        </div>
      </section>
    </main>
  );
}
