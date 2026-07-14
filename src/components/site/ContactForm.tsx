'use client';

import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CTAButton } from '@/components/ui/CTAButton';
import { BRAND } from '@/lib/brand';

type FieldKey = 'firstName' | 'lastName' | 'phone' | 'email' | 'info';

interface FieldState {
  value: string;
  touched: boolean;
}

const EMPTY: Record<FieldKey, FieldState> = {
  firstName: { value: '', touched: false },
  lastName: { value: '', touched: false },
  phone: { value: '', touched: false },
  email: { value: '', touched: false },
  info: { value: '', touched: false },
};

/** Format digits into (XXX) XXX-XXXX progressively as the user types. */
function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function validate(key: FieldKey, value: string): string | null {
  const v = value.trim();
  switch (key) {
    case 'firstName':
    case 'lastName':
      return v.length >= 2 ? null : 'Required';
    case 'phone':
      return v.replace(/\D/g, '').length === 10 ? null : 'Enter a 10-digit number';
    case 'email':
      return /^\S+@\S+\.\S+$/.test(v) ? null : 'Enter a valid email';
    case 'info':
      return null; // optional
  }
}

const REQUIRED: FieldKey[] = ['firstName', 'lastName', 'phone', 'email'];

export default function ContactForm() {
  const [fields, setFields] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const liveRef = useRef<HTMLParagraphElement>(null);

  const set = (key: FieldKey, value: string) =>
    setFields((f) => ({ ...f, [key]: { value, touched: f[key].touched } }));
  const touch = (key: FieldKey) =>
    setFields((f) => ({ ...f, [key]: { ...f[key], touched: true } }));

  const errors = useMemo(() => {
    const e = {} as Record<FieldKey, string | null>;
    (Object.keys(fields) as FieldKey[]).forEach((k) => (e[k] = validate(k, fields[k].value)));
    return e;
  }, [fields]);

  const completedRequired = REQUIRED.filter((k) => !errors[k]).length;
  const allValid = completedRequired === REQUIRED.length;
  const progress = (completedRequired / REQUIRED.length) * 100;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) {
      setFields((f) => {
        const next = { ...f };
        REQUIRED.forEach((k) => (next[k] = { ...next[k], touched: true }));
        return next;
      });
      return;
    }
    setSending(true);
    // Demo submit — in production this posts to the CRM / JURIS AI intake.
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  const reset = () => {
    setFields(EMPTY);
    setSent(false);
  };

  const inputCls = (key: FieldKey) => {
    const bad = fields[key].touched && errors[key];
    const good = fields[key].value && !errors[key];
    return `peer w-full rounded-xl border bg-paper px-4 py-3 text-sm text-ink placeholder-transparent outline-none transition ${
      bad ? 'border-[#b4533e]/60 focus:border-[#b4533e]' : good ? 'border-forest/45' : 'border-hairline focus:border-forest/50'
    }`;
  };

  return (
    <section id="contact" className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">Get in touch</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Tell Laurie about your move
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-muted">
          Share a few details and Laurie will follow up personally — or keep chatting with{' '}
          {BRAND.assistant} for an answer right now.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-10 overflow-hidden rounded-3xl border border-hairline bg-card p-6 shadow-[0_30px_70px_-45px_rgba(22,26,23,0.4)] sm:p-9"
      >
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-forest/10 text-3xl text-forest">
                ✓
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink">
                Thanks, {fields.firstName.value.trim()}!
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                Your details are in. Laurie will reach out to{' '}
                <span className="font-semibold text-ink">{fields.phone.value}</span> and{' '}
                <span className="font-semibold text-ink">{fields.email.value.trim()}</span> shortly.
              </p>
              <CTAButton variant="secondary" className="mt-6" onClick={reset}>
                Send another
              </CTAButton>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={submit}
              noValidate
              className="space-y-5"
            >
              {/* completion meter */}
              <div>
                <div className="mb-2 flex items-center justify-between text-xs text-muted">
                  <span>Contact details</span>
                  <span className="font-mono">{completedRequired}/4 complete</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-hairline">
                  <motion.div
                    className="h-full rounded-full bg-forest"
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="First name" k="firstName" fields={fields} errors={errors}
                  inputCls={inputCls} onSet={set} onTouch={touch} autoComplete="given-name" />
                <Field label="Last name" k="lastName" fields={fields} errors={errors}
                  inputCls={inputCls} onSet={set} onTouch={touch} autoComplete="family-name" />
                <Field label="Phone number" k="phone" fields={fields} errors={errors}
                  inputCls={inputCls} onSet={(k, v) => set(k, formatPhone(v))} onTouch={touch}
                  type="tel" inputMode="tel" autoComplete="tel" />
                <Field label="Email" k="email" fields={fields} errors={errors}
                  inputCls={inputCls} onSet={set} onTouch={touch} type="email" inputMode="email"
                  autoComplete="email" />
              </div>

              {/* Optional textarea */}
              <div className="relative">
                <textarea
                  id="f-info"
                  rows={3}
                  value={fields.info.value}
                  onChange={(e) => set('info', e.target.value)}
                  placeholder="Additional information"
                  className="peer w-full resize-none rounded-xl border border-hairline bg-paper px-4 py-3 text-sm text-ink placeholder-transparent outline-none transition focus:border-forest/50"
                />
                <label
                  htmlFor="f-info"
                  className="pointer-events-none absolute left-4 top-3 text-sm text-muted transition-all peer-focus:-top-2 peer-focus:bg-card peer-focus:px-1 peer-focus:text-xs peer-focus:text-forest peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:bg-card peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Anything else? <span className="text-muted/70">(optional)</span>
                </label>
              </div>

              <div className="flex flex-col-reverse items-center gap-3 pt-1 sm:flex-row sm:justify-between">
                <p ref={liveRef} aria-live="polite" className="text-xs text-muted">
                  {allValid ? 'Ready to send.' : 'Fill in your name, phone, and email.'}
                </p>
                <CTAButton type="submit" disabled={sending || !allValid} className="w-full sm:w-auto">
                  {sending ? 'Sending…' : 'Send to Laurie'}
                </CTAButton>
              </div>
              <p className="text-center text-[11px] text-muted sm:text-left">
                Demo form — submissions are simulated. Ellie qualifies &amp; books only.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function Field({
  label,
  k,
  fields,
  errors,
  inputCls,
  onSet,
  onTouch,
  ...input
}: {
  label: string;
  k: FieldKey;
  fields: Record<FieldKey, FieldState>;
  errors: Record<FieldKey, string | null>;
  inputCls: (k: FieldKey) => string;
  onSet: (k: FieldKey, v: string) => void;
  onTouch: (k: FieldKey) => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const bad = fields[k].touched && errors[k];
  const good = fields[k].value && !errors[k];
  const id = `f-${k}`;
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          value={fields[k].value}
          onChange={(e) => onSet(k, e.target.value)}
          onBlur={() => onTouch(k)}
          placeholder={label}
          className={inputCls(k)}
          {...input}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-3 text-sm text-muted transition-all peer-focus:-top-2 peer-focus:bg-card peer-focus:px-1 peer-focus:text-xs peer-focus:text-forest peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:bg-card peer-[:not(:placeholder-shown)]:px-1 peer-[:not(:placeholder-shown)]:text-xs"
        >
          {label}
        </label>
        {good && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-forest">✓</span>
        )}
      </div>
      <AnimatePresence>
        {bad && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 pl-1 text-xs text-[#b4533e]"
          >
            {errors[k]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
