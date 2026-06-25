import { useState, useId, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle, Loader2, Mail, MapPin } from 'lucide-react'
import {
  NightModeBackground,
  NightModeToggle,
  useNightMode,
} from '../components/core/NightMode'
import Footer from '../components/core/Footer'

/* Web3Forms submission
   Public form-to-email relay. The access key is rate-limited and
   spam-filtered server-side; bundling it into the client is the intended
   usage pattern. Source it from a Vite env var so it's swappable per env.
   See https://docs.web3forms.com/
*/
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined

interface Web3FormsResponse {
  success : boolean
  message?: string
}

async function submitContact(payload: {
  name    : string
  email   : string
  message : string
}): Promise<void> {
  if (!WEB3FORMS_KEY) {
    throw new Error('VITE_WEB3FORMS_ACCESS_KEY não está configurada.')
  }

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method  : 'POST',
    headers : {
      'Content-Type' : 'application/json',
      Accept         : 'application/json',
    },
    body: JSON.stringify({
      access_key : WEB3FORMS_KEY,
      from_name  : 'INTEGRA-TE — Formulário de contacto',
      subject    : `Mensagem de ${payload.name}`,
      ...payload,
    }),
  })

  const data = (await res.json().catch(() => ({}))) as Web3FormsResponse
  if (!res.ok || !data.success) {
    throw new Error(data.message ?? 'Falha no envio.')
  }
}

/* ─── Form state & validation ────────────────────────────────────────────── */
interface FormState {
  name          : string
  email         : string
  message       : string
  consentimento : boolean
}

type FieldName = keyof FormState
type FieldErrors = Partial<Record<FieldName, string>>

type SubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string }

const INITIAL_FORM: FormState = {
  name          : '',
  email         : '',
  message       : '',
  consentimento : false,
}

const MAX = { name: 100, email: 200, message: 2000 } as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}
  const name    = form.name.trim()
  const email   = form.email.trim()
  const message = form.message.trim()

  if (!name)                            errors.name = 'Indique o seu nome.'
  else if (name.length < 2)            errors.name = 'O nome deve ter pelo menos 2 caracteres.'
  else if (form.name.length > MAX.name) errors.name = `Máximo ${MAX.name} caracteres.`

  if (!email)                           errors.email = 'Indique o seu email.'
  else if (!EMAIL_RE.test(email))       errors.email = 'Email inválido.'
  else if (form.email.length > MAX.email) errors.email = `Máximo ${MAX.email} caracteres.`

  if (!message)                         errors.message = 'Escreva a sua mensagem.'
  else if (message.length < 10)         errors.message = 'A mensagem deve ter pelo menos 10 caracteres.'
  else if (form.message.length > MAX.message) errors.message = `Máximo ${MAX.message} caracteres.`

  if (!form.consentimento)              errors.consentimento = 'Tem de aceitar a política de privacidade.'

  return errors
}

/* ─── Page root ──────────────────────────────────────────────────────────── */
export default function Contact() {
  return <ContactContent />
}

/* ─── Inner content (needs NightMode context) ────────────────────────────── */
function ContactContent() {
  const { isNightMode } = useNightMode()

  const [form, setForm]               = useState<FormState>(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submission, setSubmission]   = useState<SubmissionState>({ status: 'idle' })

  const formId = useId()

  function setField<K extends FieldName>(name: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [name]: value }))
    if (fieldErrors[name]) setFieldErrors((e) => ({ ...e, [name]: undefined }))
  }

  function handleBlur(name: FieldName) {
    const errors = validate(form)
    setFieldErrors((e) => ({ ...e, [name]: errors[name] }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errors = validate(form)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      const firstError = (Object.keys(errors) as FieldName[])[0]
      document.getElementById(`${formId}-${firstError}`)?.focus()
      return
    }
    setSubmission({ status: 'submitting' })
    try {
      await submitContact({
        name    : form.name.trim(),
        email   : form.email.trim(),
        message : form.message.trim(),
      })
      setSubmission({ status: 'success' })
      setForm(INITIAL_FORM)
      setFieldErrors({})
    } catch (err) {
      setSubmission({
        status  : 'error',
        message : err instanceof Error
          ? 'Não foi possível enviar a mensagem. Verifique a sua ligação e tente novamente.'
          : 'Erro desconhecido.',
      })
    }
  }

  function resetForm() {
    setForm(INITIAL_FORM)
    setFieldErrors({})
    setSubmission({ status: 'idle' })
  }

  const isSubmitting = submission.status === 'submitting'

  const sectionBg = isNightMode
    ? 'bg-slate-900/50 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.3)] border border-white/10'
    : 'bg-blue-600/30 backdrop-blur-xs rounded-3xl shadow-[0_18px_45px_rgba(31,38,135,0.28)] border border-white/30'

  const cardBg = isNightMode
    ? 'bg-slate-800/70 border border-white/10'
    : 'bg-white/95'

  return (
    <main
      id="main-content"
      className="relative h-screen w-full px-3 md:px-5 py-2 font-['Nunito',sans-serif] overflow-x-hidden overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >

      {/* ── Decorative elements ── */}
      <img src="/src/assets/bush.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] left-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-48 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/bush_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] left-[-3%] z-2 w-28 sm:w-36 md:w-44 lg:w-48 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="/src/assets/bush2.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-48 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/bush2_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-1%] right-[-2%] z-2 w-28 sm:w-36 md:w-44 lg:w-48 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="/src/assets/books.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-48 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/books_night.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[2%] left-[3%] z-1 w-28 sm:w-36 md:w-44 lg:w-48 object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />
      <img src="/src/assets/rainbow.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed top-[14%] left-[-5%] z-1 w-28 sm:w-36 md:w-44 lg:w-100 object-contain rotate-24 transition-opacity duration-700 ${
          isNightMode ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <img src="/src/assets/bottom_cloud.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-29%] left-0 z-30 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-0' : 'opacity-100'}`} />
      <img src="/src/assets/bottom_cloud2.webp" alt="" aria-hidden="true"
        className={`pointer-events-none fixed bottom-[-29%] left-0 z-30 w-full object-contain transition-opacity duration-700 ${isNightMode ? 'opacity-100' : 'opacity-0'}`} />

      <NightModeBackground
        dayImage="/src/assets/bg_day.webp"
        nightImage="/src/assets/bg_night.webp"
      />

      {/* ── Content panel ── */}
      <motion.div
        className="max-w-[95%] w-full mx-auto relative z-10 mt-40 pb-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className={`max-w-2xl mx-auto overflow-hidden ${sectionBg}`}>

          {/* Panel header */}
          <div className="relative px-5 pt-3 pb-2 flex items-center overflow-visible">
            <img
              src="/src/assets/stars.webp"
              alt="" aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 h-[100%] w-2/3 -translate-y-2/3 mx-auto object-contain"
            />
            <h1
              className="relative z-10 font-['Fredoka',sans-serif] text-3xl font-black text-white"
              style={{
                textShadow: isNightMode ? 'none' :
                  '-1px 0 #2563eb, 0 1px #2563eb, 1px 0 #2563eb, 0 -1px #2563eb, ' +
                  '1px 1px #2563eb, -1px -1px #2563eb, 1px -1px #2563eb, -1px 1px #2563eb',
              }}
            >
              Contacta-nos!
            </h1>
          </div>

          {/* Panel body */}
          <div className="px-4 pb-4 pt-2">
            <div className={`rounded-2xl shadow-sm p-5 sm:p-7 font-['Fredoka',sans-serif] ${cardBg}`}>

              {submission.status === 'success' ? (
                <SuccessFrame onReset={resetForm} isNightMode={isNightMode} />
              ) : (
                <>
                  {submission.status === 'error' && (
                    <SubmissionErrorBanner message={submission.message} isNightMode={isNightMode} />
                  )}

                  <form
                    noValidate
                    onSubmit={handleSubmit}
                    aria-label="Formulário de contacto"
                    className="flex flex-col gap-5"
                  >
                    <Field id={`${formId}-name`} label="Nome" required error={fieldErrors.name} isNightMode={isNightMode}>
                      <input
                        id={`${formId}-name`}
                        type="text"
                        name="name"
                        value={form.name}
                        maxLength={MAX.name}
                        autoComplete="name"
                        disabled={isSubmitting}
                        aria-invalid={fieldErrors.name ? true : undefined}
                        aria-describedby={fieldErrors.name ? `${formId}-name-error` : undefined}
                        onChange={(e) => setField('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        className={inputClass(!!fieldErrors.name, isNightMode)}
                      />
                    </Field>

                    <Field id={`${formId}-email`} label="Email" required error={fieldErrors.email} isNightMode={isNightMode}>
                      <input
                        id={`${formId}-email`}
                        type="email"
                        name="email"
                        value={form.email}
                        maxLength={MAX.email}
                        autoComplete="email"
                        disabled={isSubmitting}
                        aria-invalid={fieldErrors.email ? true : undefined}
                        aria-describedby={fieldErrors.email ? `${formId}-email-error` : undefined}
                        onChange={(e) => setField('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={inputClass(!!fieldErrors.email, isNightMode)}
                      />
                    </Field>

                    <Field
                      id={`${formId}-message`}
                      label="Mensagem"
                      required
                      error={fieldErrors.message}
                      hint={`${form.message.length}/${MAX.message}`}
                      isNightMode={isNightMode}
                    >
                      <textarea
                        id={`${formId}-message`}
                        name="message"
                        value={form.message}
                        rows={6}
                        maxLength={MAX.message}
                        disabled={isSubmitting}
                        aria-invalid={fieldErrors.message ? true : undefined}
                        aria-describedby={fieldErrors.message ? `${formId}-message-error` : undefined}
                        onChange={(e) => setField('message', e.target.value)}
                        onBlur={() => handleBlur('message')}
                        className={`${inputClass(!!fieldErrors.message, isNightMode)} resize-y`}
                      />
                    </Field>

                    <div>
                      <label
                        htmlFor={`${formId}-consentimento`}
                        className="flex items-start gap-3 cursor-pointer"
                      >
                        <input
                          id={`${formId}-consentimento`}
                          type="checkbox"
                          name="consentimento"
                          checked={form.consentimento}
                          disabled={isSubmitting}
                          aria-invalid={fieldErrors.consentimento ? true : undefined}
                          aria-describedby={fieldErrors.consentimento ? `${formId}-consentimento-error` : undefined}
                          onChange={(e) => setField('consentimento', e.target.checked)}
                          onBlur={() => handleBlur('consentimento')}
                          className="mt-1 h-5 w-5 shrink-0 rounded border-neutral-300 text-brand-blue-500 focus:ring-brand-blue-400"
                        />
                        <span className={`text-sm ${isNightMode ? 'text-slate-300' : 'text-neutral-600'}`}>
                          Aceito o tratamento dos meus dados conforme a{' '}
                          <Link
                            to="/privacidade"
                            className={`underline ${isNightMode ? 'text-blue-400 hover:text-blue-300' : 'text-brand-blue-500'}`}
                          >
                            política de privacidade
                          </Link>
                          .{' '}
                          <span className="text-red-400" aria-hidden="true">*</span>
                        </span>
                      </label>
                      {fieldErrors.consentimento && (
                        <p
                          id={`${formId}-consentimento-error`}
                          role="alert"
                          className="mt-1.5 flex items-center gap-1.5 text-sm text-red-400"
                        >
                          <AlertCircle size={14} aria-hidden="true" />
                          {fieldErrors.consentimento}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className={`
                        inline-flex items-center justify-center gap-2
                        rounded-xl px-6 py-3
                        font-['Fredoka',sans-serif] font-bold text-sm text-white
                        transition-colors duration-150 shadow-sm
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${isNightMode
                          ? 'bg-blue-500 hover:bg-blue-400 active:bg-blue-600'
                          : 'bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af]'
                        }
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                          A enviar…
                        </>
                      ) : (
                        <>
                          <Send size={18} aria-hidden="true" />
                          Enviar mensagem
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

              <ContactInfo isNightMode={isNightMode} />
            </div>
          </div>
        </div>
      </motion.div>

      <NightModeToggle />
      <Footer />
      <div className="mb-50"></div>
    </main>
  )
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function inputClass(hasError: boolean, isNightMode: boolean): string {
  return `
    w-full rounded-xl border px-3.5 py-2.5
    text-sm transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:cursor-not-allowed
    ${isNightMode
      ? 'bg-slate-700/60 text-white placeholder:text-slate-400 disabled:bg-slate-800/50'
      : 'bg-white text-neutral-800 placeholder:text-neutral-400 disabled:bg-neutral-50'
    }
    ${hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-300/40'
      : isNightMode
        ? 'border-white/20 focus:border-blue-400 focus:ring-blue-400/30'
        : 'border-neutral-300 focus:border-blue-400 focus:ring-blue-300'
    }
  `
}

interface FieldProps {
  id          : string
  label       : string
  required?   : boolean
  error?      : string
  hint?       : string
  isNightMode : boolean
  children    : React.ReactNode
}

function Field({ id, label, required, error, hint, isNightMode, children }: FieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className={`font-['Fredoka',sans-serif] font-bold text-sm ${isNightMode ? 'text-slate-200' : 'text-neutral-700'}`}
        >
          {label}{' '}
          {required && <span className="text-red-400" aria-hidden="true">*</span>}
        </label>
        {hint && (
          <span className={`text-xs ${isNightMode ? 'text-slate-400' : 'text-neutral-400'}`}>
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-sm text-red-400"
        >
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

function SubmissionErrorBanner({ message, isNightMode }: { message: string; isNightMode: boolean }) {
  return (
    <div
      role="alert"
      className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 ${
        isNightMode
          ? 'border-red-700/50 bg-red-900/30 text-red-300'
          : 'border-red-200 bg-red-50 text-red-600'
      }`}
    >
      <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-400" aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

function SuccessFrame({ onReset, isNightMode }: { onReset: () => void; isNightMode: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center gap-4 text-center rounded-2xl border px-6 py-10 ${
        isNightMode
          ? 'border-green-700/50 bg-green-900/20'
          : 'border-green-200 bg-green-50'
      }`}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
        <CheckCircle2 size={32} aria-hidden="true" />
      </span>
      <div>
        <h2 className={`font-['Fredoka',sans-serif] font-black text-xl mb-1 ${isNightMode ? 'text-green-400' : 'text-green-600'}`}>
          Mensagem enviada!
        </h2>
        <p className={`text-sm ${isNightMode ? 'text-slate-300' : 'text-neutral-600'}`}>
          Obrigado pelo seu contacto. Responderemos o mais breve possível.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className={`font-['Fredoka',sans-serif] font-bold text-sm underline underline-offset-2 ${
          isNightMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
        }`}
      >
        Enviar outra mensagem
      </button>
    </div>
  )
}

function ContactInfo({ isNightMode }: { isNightMode: boolean }) {
  return (
    <section
      aria-labelledby="contact-info-heading"
      className={`mt-8 pt-6 border-t ${isNightMode ? 'border-white/10' : 'border-neutral-200'}`}
    >
      <h2
        id="contact-info-heading"
        className={`font-['Fredoka',sans-serif] font-black text-lg mb-4 ${isNightMode ? 'text-slate-200' : 'text-neutral-700'}`}
      >
        Outras formas de contacto
      </h2>
      <ul className={`flex flex-col gap-3 text-sm ${isNightMode ? 'text-slate-300' : 'text-neutral-600'}`}>
        <li className="flex items-start gap-3">
          <Mail size={18} className={`mt-0.5 shrink-0 ${isNightMode ? 'text-blue-400' : 'text-blue-600'}`} aria-hidden="true" />
          <span>
            <span className={`block font-bold ${isNightMode ? 'text-slate-100' : 'text-neutral-700'}`}>Email</span>
            <span className={isNightMode ? 'text-slate-500' : 'text-neutral-400'}>a confirmar</span>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <MapPin size={18} className={`mt-0.5 shrink-0 ${isNightMode ? 'text-blue-400' : 'text-blue-600'}`} aria-hidden="true" />
          <span>
            <span className={`block font-bold ${isNightMode ? 'text-slate-100' : 'text-neutral-700'}`}>Morada</span>
            <span className={isNightMode ? 'text-slate-500' : 'text-neutral-400'}>a confirmar</span>
          </span>
        </li>
      </ul>
    </section>
  )
}
