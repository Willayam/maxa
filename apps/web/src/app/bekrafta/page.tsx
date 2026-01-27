'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useConvexAvailable } from '@/components/convex-provider';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { SiteHeader } from '@/components/site/site-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const confirmEmail = useMutation(api.waitlist.confirmEmail);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    confirmEmail({ token })
      .then((result) => {
        if (result.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        setStatus('error');
      });
  }, [token, confirmEmail]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full text-center"
    >
      {status === 'loading' && (
        <div className="space-y-4">
          <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
          <p className="text-xl font-semibold text-foreground">
            Bekräftar din e-post...
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl font-black text-foreground">
            Du är på listan!
          </h1>
          <p className="text-lg text-foreground-muted">
            Tack för att du bekräftade din e-post. Vi hör av oss så fort Maxa är redo att lanseras!
          </p>
          <Link href="/">
            <Button size="lg">Tillbaka till startsidan</Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto bg-error/20 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-error" />
          </div>
          <h1 className="text-3xl font-black text-foreground">
            Något gick fel
          </h1>
          <p className="text-lg text-foreground-muted">
            Länken verkar vara ogiltig eller har redan använts. Prova att registrera dig igen.
          </p>
          <Link href="/">
            <Button size="lg">Tillbaka till startsidan</Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

function ConvexUnavailableFallback() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full text-center space-y-6"
    >
      <div className="w-20 h-20 mx-auto bg-error/20 rounded-full flex items-center justify-center">
        <XCircle className="w-12 h-12 text-error" />
      </div>
      <h1 className="text-3xl font-black text-foreground">
        Tjänsten är inte tillgänglig
      </h1>
      <p className="text-lg text-foreground-muted">
        Bekräftelsefunktionen är inte tillgänglig just nu. Försök igen senare.
      </p>
      <Link href="/">
        <Button size="lg">Tillbaka till startsidan</Button>
      </Link>
    </motion.div>
  );
}

export default function ConfirmPage() {
  const convexAvailable = useConvexAvailable();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="flex items-center justify-center min-h-[80vh] px-6 pt-16">
        {convexAvailable ? (
          <Suspense
            fallback={
              <div className="text-center">
                <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
              </div>
            }
          >
            <ConfirmContent />
          </Suspense>
        ) : (
          <ConvexUnavailableFallback />
        )}
      </main>
    </div>
  );
}
