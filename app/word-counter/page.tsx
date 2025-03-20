import WordCounterForm from "@/components/WordCounter/Form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter",
  description: "Count the number of words in a text.",
};

export default function WordCountPage() {
  return (
    <main>
      <section className="site-section">
        <div className="wrapper">
          <header className="section-header">
            <h1 className="text-3xl lg:text-5xl font-bold">Word Counter</h1>
          </header>
          <div className="py-8">
            <WordCounterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
