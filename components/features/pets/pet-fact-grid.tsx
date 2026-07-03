import type { ReactNode } from "react";
import { stegaClean } from "@sanity/client/stega";
import { Cake, Circle, Gauge, HeartHandshake, PawPrint, Smile, Sparkles, Truck, Zap } from "lucide-react";
import type { PET_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { availabilityLabels, cuddlePolicyLabels, temperamentLabels, urgencyLabels } from "./status";
import { formatPetAge } from "./format";
import { RatingMeter } from "./rating-meter";

type Pet = NonNullable<PET_BY_SLUG_QUERY_RESULT>;

type Fact = Readonly<{
  key: string;
  label: string;
  icon: ReactNode;
  value: ReactNode;
}>;

/**
 * Renders the structured pet facts as an icon-forward card grid. Rating-like
 * fields reuse the same fill-bar language as the index filters.
 */
export function PetFactGrid({ pet }: Readonly<{ pet: Pet }>) {
  const availabilityStatus = stegaClean(pet.availabilityStatus) as keyof typeof availabilityLabels;
  const pickupUrgency = stegaClean(pet.pickupUrgency) as keyof typeof urgencyLabels;
  const temperament = stegaClean(pet.temperament) as keyof typeof temperamentLabels;
  const cuddlePolicy = stegaClean(pet.cuddlePolicy) as keyof typeof cuddlePolicyLabels;

  const facts: Fact[] = [
    {
      key: "age",
      label: "Age",
      icon: <Cake aria-hidden="true" size={16} />,
      value: formatPetAge(pet.ageYears ?? null, pet.dateOfBirth ?? null)
    },
    {
      key: "breed",
      label: "Breed",
      icon: <PawPrint aria-hidden="true" size={16} />,
      value: pet.breed ?? "Not listed"
    },
    {
      key: "temperament",
      label: "Temperament",
      icon: <Smile aria-hidden="true" size={16} />,
      value: temperamentLabels[temperament] ?? "Unknown"
    },
    {
      key: "availability",
      label: "Availability",
      icon: (
        <Circle
          aria-hidden="true"
          size={11}
          className={availabilityStatus === "available" ? "fill-pet-mint text-pet-mint" : "fill-pet-coral text-pet-coral"}
        />
      ),
      value: availabilityLabels[availabilityStatus] ?? "Unknown"
    },
    {
      key: "pickup",
      label: "Pickup",
      icon: <Truck aria-hidden="true" size={16} />,
      value: urgencyLabels[pickupUrgency] ?? "Anytime"
    },
    {
      key: "cuddle",
      label: "Cuddle policy",
      icon: <HeartHandshake aria-hidden="true" size={16} />,
      value: cuddlePolicyLabels[cuddlePolicy] ?? "Unknown"
    }
  ];

  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact.key} className="rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur">
          <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-pet-muted">
            {fact.icon}
            {fact.label}
          </dt>
          <dd className="mt-2 font-display text-lg font-bold leading-tight text-pet-ink">{fact.value}</dd>
        </div>
      ))}

      <div className="rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur">
        <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-pet-muted">
          <Gauge aria-hidden="true" size={16} />
          Chaos
        </dt>
        <dd className="mt-3">
          <RatingMeter value={pet.chaosLevel} label="Chaos level" />
        </dd>
      </div>

      <div className="rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur">
        <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-pet-muted">
          <Sparkles aria-hidden="true" size={16} />
          Mess risk
        </dt>
        <dd className="mt-3">
          <RatingMeter value={pet.messRisk} label="Mess risk" />
        </dd>
      </div>

      <div className="rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur">
        <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-pet-muted">
          <Zap aria-hidden="true" size={16} />
          Energy
        </dt>
        <dd className="mt-3">
          <RatingMeter value={pet.energyLevel} label="Energy level" />
        </dd>
      </div>
    </dl>
  );
}
