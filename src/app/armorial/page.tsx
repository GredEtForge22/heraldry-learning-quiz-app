import type { Metadata } from "next";
import { ArmorialBrowser } from "@/components/ArmorialBrowser";
import { ARMORIAL } from "@/lib/heraldry/armorial";

export const metadata: Metadata = {
  title: "Armorial",
  description: "Parcourez l'armorial : blasons des royaumes, provinces, villes et grandes maisons, avec leur blasonnement.",
};

export default function ArmorialPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-4xl font-bold text-wine-dark">L&apos;armorial</h1>
      <p className="mt-2 mb-6 max-w-2xl text-ink-soft">
        {ARMORIAL.length} blasons à découvrir, avec leur blasonnement et leur histoire. Activez le mode auto-test pour
        cacher les noms et vous entraîner avant le quiz.
      </p>
      <ArmorialBrowser />
    </div>
  );
}
