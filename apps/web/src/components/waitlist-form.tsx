'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface WaitlistFormProps {
  className?: string;
  source?: string;
}

export function WaitlistForm({ className, source }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const joinWaitlist = useMutation(api.waitlist.join);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Ange en giltig e-postadress');
      return;
    }

    setStatus('loading');

    try {
      await joinWaitlist({ email, source });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Något gick fel. Försök igen.');
    }
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 text-success"
          >
            <Mail className="w-6 h-6" />
            <span className="font-semibold">
              Kolla din inkorg! Vi har skickat en bekräftelselänk.
            </span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Din e-postadress"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                error={status === 'error'}
                disabled={status === 'loading'}
              />
              {status === 'error' && (
                <p className="mt-2 text-sm text-error">{errorMessage}</p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading'}
              className="whitespace-nowrap"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Få tidig tillgång'
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
