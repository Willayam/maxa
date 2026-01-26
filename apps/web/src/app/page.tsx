'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Target,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { WaitlistForm } from '@/components/waitlist-form';
import { FeatureCard } from '@/components/feature-card';
import { AppPreviewMockup } from '@/components/app-preview-mockup';

const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Personlig daglig plan',
    description: 'Slipp fundera på vad du ska plugga. Appen ger dig dagens uppgifter baserat på din nivå.',
    accentColor: 'ord' as const,
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Fokus på svagheterna',
    description: 'Algoritmen hittar var du tappar poäng och tränar dig där det gör störst skillnad.',
    accentColor: 'xyz' as const,
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Riktiga HP-frågor',
    description: 'Träna på frågor i samma format som provet. Inga överraskningar på provdagen.',
    accentColor: 'mek' as const,
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI som förklarar',
    description: 'Fastnar du? Max förklarar steg för steg tills du verkligen förstår.',
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
                Kom in på{' '}
                <span className="text-primary">drömutbildningen</span>
              </h1>
              <p className="text-xl text-foreground-muted mb-8 max-w-lg">
                Din personliga HP-coach i mobilen. Få en daglig plan som tar dig från där du är nu till poängen du behöver – på bara 15 min om dagen.
              </p>
              <WaitlistForm className="max-w-md" source="hero" />
              <p className="mt-4 text-sm text-foreground-muted">
                Bli en av de första att få tillgång – vi lanserar inför vårens HP.
              </p>
            </motion.div>

            {/* Right: Phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <AppPreviewMockup variant="dashboard" animate={false} />
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
              Så hjälper Maxa dig höja poängen
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              Ingen fluff – bara det som faktiskt fungerar för att förbättra ditt HP-resultat.
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
              <AppPreviewMockup
                variant="practice"
                className="-rotate-6"
                animate={false}
              />
              <AppPreviewMockup
                variant="progress"
                className="rotate-6 mt-12"
                animate={false}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                Sluta gissa vad du ska plugga
              </h2>
              <p className="text-lg text-foreground-muted mb-6">
                Maxa ger dig en personlig plan baserad på din nivå, dina svagheter och hur många dagar du har kvar till provet.
              </p>
              <ul className="space-y-3">
                {[
                  'Vet exakt vad du ska göra varje dag',
                  'Hittar och tränar dina svagheter automatiskt',
                  '15 minuter om dagen räcker',
                  'AI-coach som förklarar tills du fattar',
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
              Redo att ta dig in på drömutbildningen?
            </h2>
            <p className="text-lg text-foreground-muted mb-8">
              Gå med i väntelistan och få tidig tillgång innan vårens HP.
            </p>
            <WaitlistForm className="max-w-md mx-auto" source="footer-cta" />
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
