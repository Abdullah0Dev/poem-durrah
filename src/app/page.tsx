import { Book } from "@/components/book/Book";
import { hamasa } from "@/data/hamasa";

export default function Home() {
  return (
    <main className="relative flex min-h-svh items-center justify-center px-3 py-6">
      <div aria-hidden className="lamp" />
      <Book {...hamasa} />
    </main>
  );
}
