import SlugGeneratorForm from "@/components/SlugGenerator/Form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slug Generator",
  description: "Generate URL-friendly slugs from text.",
};

export default function TypesGeneratorPage() {
  return (
    <main>
      <section className="site-section">
        <div className="wrapper">
          <header className="section-header">
            <h1 className="text-3xl lg:text-5xl font-bold">Slug Generator</h1>
          </header>
          <div className="py-8">
            <SlugGeneratorForm />
          </div>
        </div>
      </section>
    </main>
  );
}
