'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Target,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { SiteHeader } from '@/components/site/site-header';
import { WaitlistForm } from '@/components/waitlist-form';
import { FeatureCard } from '@/components/feature-card';
import { PhoneMockup } from '@/components/phone-mockup';

const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Träna alla HP-delar',
    description: 'ORD, LÄS, MEK, ELF, XYZ, KVA, NOG och DTK - allt på ett ställe.',
    accentColor: 'ord' as const,
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Dagliga mål & streaks',
    description: 'Bygg studievanor som varar med dagliga utmaningar och streaks.',
    accentColor: 'xyz' as const,
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Följ din utveckling',
    description: 'Se dina framsteg i realtid och fokusera på dina svaga områden.',
    accentColor: 'mek' as const,
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Max - din AI-coach',
    description: 'Få personlig hjälp och förklaringar från din AI-studiekompis.',
    accentColor: 'kva' as const,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6">
                Maxa ditt{' '}
                <span className="text-primary">HP-resultat</span>
              </h1>
              <p className="text-xl text-foreground-muted mb-8 max-w-lg">
                Plugga smart för Högskoleprovet med gamifierad träning och din personliga AI-coach Max.
              </p>
              <WaitlistForm className="max-w-md" />
              <p className="mt-4 text-sm text-foreground-muted">
                Bli en av de första att testa Maxa. Appen lanseras snart!
              </p>
            </motion.div>

            {/* Right: Phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <PhoneMockup
                src="/screenshots/dashboard.png"
                alt="Maxa app dashboard"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-background-secondary">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Allt du behöver för att lyckas
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              Maxa kombinerar beprövade studietekniker med modern AI för att hjälpa dig nå dina mål.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center gap-4"
            >
              <PhoneMockup
                src="/screenshots/practice.png"
                alt="Maxa träningsläge"
                className="-rotate-6"
              />
              <PhoneMockup
                src="/screenshots/progress.png"
                alt="Maxa framsteg"
                className="rotate-6 mt-12"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                Designad för att du ska lyckas
              </h2>
              <p className="text-lg text-foreground-muted mb-6">
                Maxa gör pluggandet roligt med dagliga utmaningar, streaks och en AI-coach som hjälper dig när du kör fast.
              </p>
              <ul className="space-y-3">
                {[
                  'Anpassad till Högskoleprovets format',
                  'Spaced repetition för bättre inlärning',
                  'Detaljerad statistik över dina framsteg',
                  'Fungerar offline - plugga var som helst',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-background-secondary">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Redo att maxa ditt HP?
            </h2>
            <p className="text-lg text-foreground-muted mb-8">
              Gå med i väntelistan och bli en av de första att testa Maxa.
            </p>
            <WaitlistForm className="max-w-md mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-2xl font-black text-primary">Maxa</div>
          <p className="text-sm text-foreground-muted">
            &copy; {new Date().getFullYear()} Maxa. Alla rättigheter förbehållna.
          </p>
        </div>
      </footer>
    </div>
  );
}
