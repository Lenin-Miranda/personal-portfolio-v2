"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { ArrowRight, ArrowUpRight } from "./Icons";

const INTENT_OPTIONS = [
  { label: "A full-time opportunity", value: "full-time" },
  { label: "A contract project", value: "contract" },
  { label: "A product collaboration", value: "collaboration" },
  { label: "Something else", value: "other" },
] as const;

const FIELD_STEPS = ["Name", "Email", "Intent", "Message", "Review"] as const;
const FIELD_ORDER = ["name", "email", "intent", "message"] as const;
const REVIEW_STEP = FIELD_ORDER.length;

type FieldName = (typeof FIELD_ORDER)[number];
type SubmissionState = "error" | "idle" | "sending" | "success";
type ContactValues = {
  email: string;
  intent: string;
  message: string;
  name: string;
  website: string;
};

const INITIAL_VALUES: ContactValues = {
  email: "",
  intent: "",
  message: "",
  name: "",
  website: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field: FieldName, value: string) {
  const normalizedValue = value.trim();

  if (field === "name") {
    return normalizedValue.length >= 2
      ? ""
      : "Please enter at least two characters.";
  }

  if (field === "email") {
    return EMAIL_PATTERN.test(normalizedValue)
      ? ""
      : "Enter a valid email address so I can reply.";
  }

  if (field === "intent") {
    return INTENT_OPTIONS.some((option) => option.value === normalizedValue)
      ? ""
      : "Choose the option that best fits your message.";
  }

  return normalizedValue.length >= 20
    ? ""
    : "Add a little more context — at least 20 characters.";
}

type ContactFormProps = {
  fallbackEmail: string;
};

export default function ContactForm({ fallbackEmail }: ContactFormProps) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ContactValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);
  const shouldMoveFocusRef = useRef(false);
  const startedAtRef = useRef(0);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!shouldMoveFocusRef.current) return;

    const timeout = window.setTimeout(
      () => {
        stageRef.current
          ?.querySelector<HTMLElement>("[data-step-focus]")
          ?.focus({ preventScroll: true });
        shouldMoveFocusRef.current = false;
      },
      reduceMotion ? 0 : 300,
    );

    return () => window.clearTimeout(timeout);
  }, [reduceMotion, step, submissionState]);

  function updateValue(field: keyof ContactValues, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));

    if (field !== "website") {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
    }

    if (submissionState === "error") {
      setSubmissionState("idle");
      setSubmissionMessage("");
    }
  }

  function moveToStep(nextStep: number) {
    shouldMoveFocusRef.current = true;
    setStep(nextStep);
  }

  function advance() {
    const activeField = FIELD_ORDER[step];

    if (!activeField) return;

    const error = validateField(activeField, values[activeField]);
    setErrors((currentErrors) => ({
      ...currentErrors,
      [activeField]: error,
    }));

    if (error) {
      stageRef.current
        ?.querySelector<HTMLElement>("[data-step-focus]")
        ?.focus({ preventScroll: true });
      return;
    }

    moveToStep(step + 1);
  }

  function handleFieldKeyDown(
    event: KeyboardEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    if (event.key !== "Enter") return;

    const isTextarea = event.currentTarget instanceof HTMLTextAreaElement;
    const shouldAdvanceTextarea =
      isTextarea && (event.metaKey || event.ctrlKey);

    if (!isTextarea || shouldAdvanceTextarea) {
      event.preventDefault();
      advance();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step < REVIEW_STEP) {
      advance();
      return;
    }

    if (submissionState === "sending") return;

    setSubmissionState("sending");
    setSubmissionMessage("");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify({
          ...values,
          startedAt: startedAtRef.current,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          payload?.error ?? "The message could not be sent. Please try again.",
        );
      }

      shouldMoveFocusRef.current = true;
      setSubmissionState("success");
    } catch (error) {
      setSubmissionMessage(
        error instanceof Error
          ? error.message
          : "The message could not be sent. Please try again.",
      );
      setSubmissionState("error");
    }
  }

  function resetForm() {
    startedAtRef.current = Date.now();
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmissionMessage("");
    setSubmissionState("idle");
    moveToStep(0);
  }

  const intentLabel =
    INTENT_OPTIONS.find((option) => option.value === values.intent)?.label ??
    values.intent;

  return (
    <form
      aria-label="Contact Lenin Miranda"
      className="contact-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="contact-progress">
        <p>
          Inquiry /{" "}
          {String(Math.min(step + 1, FIELD_STEPS.length)).padStart(2, "0")}
        </p>
        <ol aria-label="Contact form progress">
          {FIELD_STEPS.map((label, index) => (
            <li
              aria-current={index === step ? "step" : undefined}
              className={index <= step ? "is-active" : undefined}
              key={label}
            >
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="contact-progress-label">{label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="contact-form-stage" ref={stageRef}>
        <AnimatePresence initial={false} mode="wait">
          {submissionState === "success" ? (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="contact-success"
              exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
              initial={reduceMotion ? false : { opacity: 0, x: 18 }}
              key="success"
              transition={{ duration: reduceMotion ? 0 : 0.24 }}
            >
              <p className="contact-step-kicker">Message accepted</p>
              <h3 data-step-focus tabIndex={-1}>
                Thanks, {values.name}.
              </h3>
              <p>
                Your note is on its way. I’ll reply to{" "}
                <strong>{values.email}</strong> as soon as I can.
              </p>
              <button
                className="text-link contact-reset"
                onClick={resetForm}
                type="button"
              >
                Send another message
                <ArrowRight />
              </button>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="contact-step"
              exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
              initial={reduceMotion ? false : { opacity: 0, x: 18 }}
              key={step}
              transition={{ duration: reduceMotion ? 0 : 0.24 }}
            >
              {step === 0 ? (
                <>
                  <p className="contact-step-kicker">Question 01 / 04</p>
                  <label htmlFor="contact-name">What should I call you?</label>
                  <p className="contact-field-hint" id="contact-name-hint">
                    Your name, or the name of your team.
                  </p>
                  <input
                    aria-describedby={`contact-name-hint${errors.name ? " contact-name-error" : ""}`}
                    aria-invalid={Boolean(errors.name)}
                    autoComplete="name"
                    data-step-focus
                    id="contact-name"
                    maxLength={80}
                    name="name"
                    onChange={(event) =>
                      updateValue("name", event.target.value)
                    }
                    onKeyDown={handleFieldKeyDown}
                    placeholder="Your name"
                    required
                    type="text"
                    value={values.name}
                  />
                  {errors.name ? (
                    <p
                      className="contact-field-error"
                      id="contact-name-error"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  ) : null}
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <p className="contact-step-kicker">Question 02 / 04</p>
                  <label htmlFor="contact-email">Where can I reply?</label>
                  <p className="contact-field-hint" id="contact-email-hint">
                    I’ll only use this address to respond to your inquiry.
                  </p>
                  <input
                    aria-describedby={`contact-email-hint${errors.email ? " contact-email-error" : ""}`}
                    aria-invalid={Boolean(errors.email)}
                    autoComplete="email"
                    data-step-focus
                    id="contact-email"
                    inputMode="email"
                    maxLength={254}
                    name="email"
                    onChange={(event) =>
                      updateValue("email", event.target.value)
                    }
                    onKeyDown={handleFieldKeyDown}
                    placeholder="you@company.com"
                    required
                    type="email"
                    value={values.email}
                  />
                  {errors.email ? (
                    <p
                      className="contact-field-error"
                      id="contact-email-error"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  ) : null}
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <p className="contact-step-kicker">Question 03 / 04</p>
                  <label htmlFor="contact-intent">What brings you here?</label>
                  <p className="contact-field-hint" id="contact-intent-hint">
                    Choose the closest fit. You can add the nuance next.
                  </p>
                  <select
                    aria-describedby={`contact-intent-hint${errors.intent ? " contact-intent-error" : ""}`}
                    aria-invalid={Boolean(errors.intent)}
                    data-step-focus
                    id="contact-intent"
                    name="intent"
                    onChange={(event) =>
                      updateValue("intent", event.target.value)
                    }
                    onKeyDown={handleFieldKeyDown}
                    required
                    value={values.intent}
                  >
                    <option value="">Select an option</option>
                    {INTENT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.intent ? (
                    <p
                      className="contact-field-error"
                      id="contact-intent-error"
                      role="alert"
                    >
                      {errors.intent}
                    </p>
                  ) : null}
                </>
              ) : null}

              {step === 3 ? (
                <>
                  <p className="contact-step-kicker">Question 04 / 04</p>
                  <label htmlFor="contact-message">
                    What are you working on?
                  </label>
                  <p className="contact-field-hint" id="contact-message-hint">
                    Share the problem, role, timeline, or whatever matters.
                    20–2000 characters. Press ⌘/Ctrl + Enter to continue.
                  </p>
                  <textarea
                    aria-describedby={`contact-message-hint${errors.message ? " contact-message-error" : ""}`}
                    aria-invalid={Boolean(errors.message)}
                    data-step-focus
                    id="contact-message"
                    maxLength={2000}
                    name="message"
                    onChange={(event) =>
                      updateValue("message", event.target.value)
                    }
                    onKeyDown={handleFieldKeyDown}
                    placeholder="A little context goes a long way…"
                    required
                    rows={6}
                    value={values.message}
                  />
                  <div className="contact-field-footer">
                    {errors.message ? (
                      <p
                        className="contact-field-error"
                        id="contact-message-error"
                        role="alert"
                      >
                        {errors.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span>{values.message.length} / 2000</span>
                  </div>
                </>
              ) : null}

              {step === REVIEW_STEP ? (
                <>
                  <p className="contact-step-kicker">Final check</p>
                  <h3 data-step-focus tabIndex={-1}>
                    Ready to send?
                  </h3>
                  <dl className="contact-review">
                    <div>
                      <dt>Name</dt>
                      <dd>{values.name}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{values.email}</dd>
                    </div>
                    <div>
                      <dt>Intent</dt>
                      <dd>{intentLabel}</dd>
                    </div>
                    <div>
                      <dt>Message</dt>
                      <dd>{values.message}</dd>
                    </div>
                  </dl>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <label
        aria-hidden="true"
        className="contact-honeypot"
        htmlFor="contact-website"
      >
        Website
        <input
          autoComplete="off"
          id="contact-website"
          name="website"
          onChange={(event) => updateValue("website", event.target.value)}
          tabIndex={-1}
          type="text"
          value={values.website}
        />
      </label>

      {submissionState === "error" ? (
        <p className="contact-submit-error" role="alert">
          {submissionMessage}{" "}
          <a href={`mailto:${fallbackEmail}`}>Email me directly instead.</a>
        </p>
      ) : null}

      {submissionState !== "success" ? (
        <div className="contact-form-actions">
          {step > 0 ? (
            <button
              className="contact-back"
              disabled={submissionState === "sending"}
              onClick={() => moveToStep(step - 1)}
              type="button"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            aria-busy={submissionState === "sending"}
            className="button button-primary contact-next"
            disabled={submissionState === "sending"}
            type="submit"
          >
            {submissionState === "sending"
              ? "Sending…"
              : step === REVIEW_STEP
                ? "Send message"
                : "Next"}
            <ArrowRight />
          </button>
        </div>
      ) : null}

      <p className="contact-form-privacy">
        Sent securely from this site. Prefer your own email client?{" "}
        <a href={`mailto:${fallbackEmail}`}>
          Write directly
          <ArrowUpRight />
        </a>
      </p>
    </form>
  );
}
