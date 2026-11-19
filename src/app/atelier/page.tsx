import type { Metadata } from "next";
import { Atelier } from "@/components/Atelier";

export const metadata: Metadata = {
  title: "Atelier de blason",
  description: "Composez votre propre blason et obtenez son blasonnement en français héraldique.",
};

export default function AtelierPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-4xl font-bold text-wine-dark">L&apos;atelier du héraut</h1>
      <p className="mt-2 mb-8 max-w-2xl text-ink-soft">
        Composez un écu : champ, pièce, meuble. Le blasonnement s&apos;écrit tout seul, et l&apos;atelier vous prévient
        quand vous enfreignez la règle de contrariété.
      </p>
      <Atelier />
    </div>
  );
}
