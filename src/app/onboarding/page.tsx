"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, saveProfile } from "@/lib/matching";

type Step = 1 | 2 | 3;

const FIELDS = [
  { label: "Computer Science", value: "Computer Science", emoji: "💻" },
  { label: "Engineering", value: "Engineering", emoji: "⚙️" },
  { label: "Business", value: "Business", emoji: "📊" },
  { label: "Law", value: "Law", emoji: "⚖️" },
];
const LEVELS = ["L1", "L2", "L3", "Master", "High school", "None"];
const ENGLISH_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<UserProfile>({
    field: "Computer Science",
    level: "L3",
    english: "B2",
    ielts: "no",
    goal: "study",
  });

  function set<K extends keyof UserProfile>(k: K, v: UserProfile[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function finish() {
    saveProfile(form);
    router.push("/home");
  }

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  function RadioGroup<K extends keyof UserProfile>({
    fieldKey,
    opts,
  }: {
    fieldKey: K;
    opts: { label: string; value: string; emoji?: string }[];
  }) {
    return (
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {opts.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`radio-opt${form[fieldKey] === o.value ? " selected" : ""}`}
            onClick={() => set(fieldKey, o.value as UserProfile[K])}
            aria-pressed={form[fieldKey] === o.value}
          >
            {o.emoji && <span>{o.emoji}</span>}
            <span>{o.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          minHeight: "100vh",
          position: "relative",
          zIndex: 100,
          pointerEvents: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
          background: "var(--cream)",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 101,
            pointerEvents: "auto",
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 24,
            padding: "2.5rem",
            width: "100%",
            maxWidth: 580,
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "var(--emerald)",
              fontWeight: 600,
              marginBottom: "1.5rem",
              textTransform: "uppercase",
              letterSpacing: ".1em",
            }}
          >
            Step {step} of {totalSteps}
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: 4,
              background: "var(--cream-dark)",
              borderRadius: 4,
              marginBottom: "2rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "var(--emerald)",
                borderRadius: 4,
                transition: "width .4s ease",
              }}
            />
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "var(--navy)", marginBottom: ".5rem" }}>
                Tell us about yourself
              </h2>
              <p style={{ color: "#6B7280", fontSize: 14, marginBottom: "2rem" }}>
                We use this to match opportunities to your profile.
              </p>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--navy)", marginBottom: 8 }}>
                  Your field of study
                </label>
                <RadioGroup fieldKey="field" opts={FIELDS} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--navy)", marginBottom: 8 }}>
                  Your level
                </label>
                <RadioGroup
                  fieldKey="level"
                  opts={LEVELS.map((l) => ({ label: l, value: l }))}
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "var(--navy)", marginBottom: ".5rem" }}>
                Your language profile
              </h2>
              <p style={{ color: "#6B7280", fontSize: 14, marginBottom: "2rem" }}>
                This affects which opportunities you can access right now.
              </p>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--navy)", marginBottom: 8 }}>
                  English level
                </label>
                <RadioGroup
                  fieldKey="english"
                  opts={ENGLISH_LEVELS.map((l) => ({ label: l, value: l }))}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--navy)", marginBottom: 8 }}>
                  Do you have an IELTS certificate?
                </label>
                <RadioGroup
                  fieldKey="ielts"
                  opts={[
                    { label: "Yes, I have IELTS", value: "yes", emoji: "✅" },
                    { label: "No IELTS yet", value: "no", emoji: "❌" },
                  ]}
                />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "var(--navy)", marginBottom: ".5rem" }}>
                What is your main goal?
              </h2>
              <p style={{ color: "#6B7280", fontSize: 14, marginBottom: "2rem" }}>
                We&apos;ll prioritize the most relevant opportunities for you.
              </p>

              <RadioGroup
                fieldKey="goal"
                opts={[
                  { label: "Study Abroad — Scholarship / Exchange", value: "study", emoji: "🎓" },
                  { label: "Internship / Remote Work", value: "internship", emoji: "💼" },
                ]}
              />

              <div
                style={{
                  marginTop: "2rem",
                  background: "var(--emerald-light)",
                  borderRadius: 12,
                  padding: "1rem",
                  fontSize: 13,
                  color: "#065F46",
                  lineHeight: 1.6,
                }}
              >
                ✓ Your profile will be used to calculate a match score for every opportunity. You can update it anytime
                from your profile.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 10, marginTop: "2rem" }}>
            {step > 1 && (
              <button
                className="btn btn-ghost"
                style={{ flexShrink: 0 }}
                onClick={() => setStep((s) => (s - 1) as Step)}
              >
                ← Back
              </button>
            )}
            {step < totalSteps ? (
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setStep((s) => (s + 1) as Step)}
              >
                Continue →
              </button>
            ) : (
              <button
                className="btn btn-emerald"
                style={{ flex: 1, background: "var(--emerald)" }}
                onClick={finish}
              >
                Find My Opportunities →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
