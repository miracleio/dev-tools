import ApiKeysCalculatorForm from "@/components/ApiKeysCalculator/Form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Keys Calculator",
  description: "Calculate the number of API keys needed for a given interval.",
};

export default function TypesGeneratorPage() {
  return (
    <main>
      <section className="site-section">
        <div className="wrapper">
          <header className="section-header">
            <h1 className="text-3xl lg:text-5xl font-bold">
              API Keys Calculator
            </h1>
          </header>
          <div className="py-8">
            <ApiKeysCalculatorForm />
          </div>
        </div>
      </section>
    </main>
  );
}
