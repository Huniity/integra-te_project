import { useState, useId, type FormEvent } from 'react'
import { Send, CheckCircle2, AlertCircle, Loader2, Mail, MapPin } from 'lucide-react'
import { submitContact, ApiError, ValidationError } from '../libs/api'

/* Form state, error channels, submission state */
interface FormState {
  nome          : string
  email         : string
  mensagem      : string
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
  nome          : '',
  email         : '',
  mensagem      : '',
  consentimento : false,
}

const MAX = {
  nome     : 100,
  email    : 200,
  mensagem : 2000,
} as const

/* HTML5-aligned email regex — covers >99% of real addresses */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Client-side validation - runs on field blur (single field) and
   on submit (all fields). Trims whitespace before checking emptiness
   but uses raw length for max-length enforcement.
*/

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}

  const nome     = form.nome.trim()
  const email    = form.email.trim()
  const mensagem = form.mensagem.trim()

  if (!nome)                       errors.nome = 'Indique o seu nome.'
  else if (nome.length < 2)        errors.nome = 'O nome deve ter pelo menos 2 caracteres.'
  else if (form.nome.length > MAX.nome) errors.nome = `Máximo ${MAX.nome} caracteres.`

  if (!email)                      errors.email = 'Indique o seu email.'
  else if (!EMAIL_RE.test(email))  errors.email = 'Email inválido.'
  else if (form.email.length > MAX.email) errors.email = `Máximo ${MAX.email} caracteres.`

  if (!mensagem)                   errors.mensagem = 'Escreva a sua mensagem.'
  else if (mensagem.length < 10)   errors.mensagem = 'A mensagem deve ter pelo menos 10 caracteres.'
  else if (form.mensagem.length > MAX.mensagem) errors.mensagem = `Máximo ${MAX.mensagem} caracteres.`

  if (!form.consentimento)         errors.consentimento = 'Tem de aceitar a política de privacidade.'

  return errors
}

/* Page component */
export default function Contact() {
  const [form, setForm]               = useState<FormState>(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submission, setSubmission]   = useState<SubmissionState>({ status: 'idle' })

  /* useId gives a stable form-scoped prefix so IDs are unique even
     if the Contact page is ever embedded twice on the same DOM. */
  const formId = useId()

  function setField<K extends FieldName>(name: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [name]: value }))
    /* Clear the error as the user starts fixing it (don't wait for re-blur) */
    if (fieldErrors[name]) {
      setFieldErrors((e) => ({ ...e, [name]: undefined }))
    }
  }

  function handleBlur(name: FieldName) {
    const errors = validate(form)
    setFieldErrors((e) => ({ ...e, [name]: errors[name] }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    /* Re-run full validation - all errors visible after first submit attempt */
    const errors = validate(form)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      /* Move focus to first invalid field for keyboard users */
      const firstError = (Object.keys(errors) as FieldName[])[0]
      document.getElementById(`${formId}-${firstError}`)?.focus()
      return
    }

    setSubmission({ status: 'submitting' })

    try {
      await submitContact({
        nome          : form.nome.trim(),
        email         : form.email.trim(),
        mensagem      : form.mensagem.trim(),
        consentimento : form.consentimento,
      })
      setSubmission({ status: 'success' })
      setForm(INITIAL_FORM)
      setFieldErrors({})
    } catch (err) {
      if (err instanceof ValidationError) {
        /* Map DRF field errors back to per-field UI errors */
        const mapped: FieldErrors = {}
        for (const [field, msgs] of Object.entries(err.fields)) {
          if (field in INITIAL_FORM && msgs[0]) {
            mapped[field as FieldName] = msgs[0]
          }
        }
        setFieldErrors(mapped)
        setSubmission({ status: 'error', message: 'Há campos por corrigir.' })
      } else if (err instanceof ApiError && err.status === 403) {
        setSubmission({
          status  : 'error',
          message : 'Sessão expirada. Recarregue a página e tente novamente.',
        })
      } else {
        setSubmission({
          status  : 'error',
          message : 'Não foi possível enviar a mensagem. Verifique a sua ligação e tente novamente.',
        })
      }
    }
  }

  function resetForm() {
    setForm(INITIAL_FORM)
    setFieldErrors({})
    setSubmission({ status: 'idle' })
  }

  const isSubmitting = submission.status === 'submitting'

  /* Render */
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-4 py-10">

      <header className="mb-8">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-800">
          Contactos
        </h1>
        <p className="mt-2 font-body text-neutral-500">
          Tem dúvidas ou sugestões? Envie-nos uma mensagem.
        </p>
      </header>

      {submission.status === 'success' ? (
        <SuccessFrame onReset={resetForm} />
      ) : (
        <>
          {submission.status === 'error' && (
            <SubmissionErrorBanner message={submission.message} />
          )}

          <form
            noValidate
            onSubmit={handleSubmit}
            aria-label="Formulário de contacto"
            className="flex flex-col gap-5"
          >

            <Field id={`${formId}-nome`} label="Nome" required error={fieldErrors.nome}>
              <input
                id={`${formId}-nome`}
                type="text"
                name="nome"
                value={form.nome}
                maxLength={MAX.nome}
                autoComplete="name"
                disabled={isSubmitting}
                aria-invalid={fieldErrors.nome ? true : undefined}
                aria-describedby={fieldErrors.nome ? `${formId}-nome-error` : undefined}
                onChange={(e) => setField('nome', e.target.value)}
                onBlur={() => handleBlur('nome')}
                className={inputClass(!!fieldErrors.nome)}
              />
            </Field>

            <Field id={`${formId}-email`} label="Email" required error={fieldErrors.email}>
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
                className={inputClass(!!fieldErrors.email)}
              />
            </Field>

            <Field
              id={`${formId}-mensagem`}
              label="Mensagem"
              required
              error={fieldErrors.mensagem}
              hint={`${form.mensagem.length}/${MAX.mensagem}`}
            >
              <textarea
                id={`${formId}-mensagem`}
                name="mensagem"
                value={form.mensagem}
                rows={6}
                maxLength={MAX.mensagem}
                disabled={isSubmitting}
                aria-invalid={fieldErrors.mensagem ? true : undefined}
                aria-describedby={fieldErrors.mensagem ? `${formId}-mensagem-error` : undefined}
                onChange={(e) => setField('mensagem', e.target.value)}
                onBlur={() => handleBlur('mensagem')}
                className={`${inputClass(!!fieldErrors.mensagem)} resize-y`}
              />
            </Field>

            {/* GDPR consent - layout differs (checkbox + inline label) */}
            <div>
              <label htmlFor={`${formId}-consentimento`} className="flex items-start gap-3 cursor-pointer">
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
                <span className="font-body text-sm text-neutral-600">
                  Aceito o tratamento dos meus dados conforme a{' '}
                  <a href="/privacy" className="underline text-brand-blue-500">
                    política de privacidade
                  </a>
                  . <span className="text-brand-red-500" aria-hidden="true">*</span>
                </span>
              </label>
              {fieldErrors.consentimento && (
                <p
                  id={`${formId}-consentimento-error`}
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-sm text-brand-red-500"
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
              className="
                inline-flex items-center justify-center gap-2
                rounded-pill px-6 py-3
                font-display font-bold text-sm text-white
                bg-brand-blue-500 hover:bg-brand-blue-400 active:bg-brand-blue-600
                disabled:bg-neutral-300 disabled:cursor-not-allowed
                shadow-sm transition-colors duration-150
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-400
              "
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

      <ContactInfo />
    </main>
  )
}

/* Sub-components */
function inputClass(hasError: boolean): string {
  return `
    w-full rounded-xl border px-3.5 py-2.5
    font-body text-sm text-neutral-800 bg-white
    placeholder:text-neutral-400
    transition-colors duration-150
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:bg-neutral-50 disabled:cursor-not-allowed
    ${hasError
      ? 'border-brand-red-500 focus:border-brand-red-500 focus:ring-brand-red-300'
      : 'border-neutral-300 focus:border-brand-blue-400 focus:ring-brand-blue-300'
    }
  `
}

interface FieldProps {
  id        : string
  label     : string
  required? : boolean
  error?    : string
  hint?     : string
  children  : React.ReactNode
}

function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="font-display font-bold text-sm text-neutral-700">
          {label} {required && <span className="text-brand-red-500" aria-hidden="true">*</span>}
        </label>
        {hint && <span className="font-body text-xs text-neutral-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-sm text-brand-red-500"
        >
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

function SubmissionErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="
        mb-5 flex items-start gap-3
        rounded-xl border border-brand-red-200 bg-brand-red-100
        px-4 py-3
      "
    >
      <AlertCircle size={20} className="shrink-0 text-brand-red-500 mt-0.5" aria-hidden="true" />
      <p className="font-body text-sm text-brand-red-600">{message}</p>
    </div>
  )
}

function SuccessFrame({ onReset }: { onReset: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="
        flex flex-col items-center gap-4 text-center
        rounded-2xl border border-brand-green-200 bg-brand-green-100
        px-6 py-10
      "
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green-500 text-white">
        <CheckCircle2 size={32} aria-hidden="true" />
      </span>
      <div>
        <h2 className="font-display font-black text-xl text-brand-green-600 mb-1">
          Mensagem enviada!
        </h2>
        <p className="font-body text-sm text-neutral-600">
          Obrigado pelo seu contacto. Responderemos o mais breve possível.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="font-display font-bold text-sm text-brand-blue-500 hover:text-brand-blue-400 underline underline-offset-2"
      >
        Enviar outra mensagem
      </button>
    </div>
  )
}

function ContactInfo() {
  return (
    <section aria-labelledby="contact-info-heading" className="mt-12 pt-8 border-t border-neutral-200">
      <h2 id="contact-info-heading" className="font-display font-black text-lg text-neutral-700 mb-4">
        Outras formas de contacto
      </h2>
      <ul className="flex flex-col gap-3 font-body text-sm text-neutral-600">
        <li className="flex items-start gap-3">
          <Mail size={18} className="text-brand-blue-500 mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            <span className="block font-bold text-neutral-700">Email</span>
            {/* TODO: confirm with PO before launch */}
            <span className="text-neutral-400">a confirmar</span>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <MapPin size={18} className="text-brand-blue-500 mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            <span className="block font-bold text-neutral-700">Morada</span>
            {/* TODO: confirm with PO before launch */}
            <span className="text-neutral-400">a confirmar</span>
          </span>
        </li>
      </ul>
    </section>
  )
}