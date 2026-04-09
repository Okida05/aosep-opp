"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";

export default function LandingPage() {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: "🎯",
      title: t.landing.features.guidedOpportunities.title,
      desc: t.landing.features.guidedOpportunities.desc,
      now: true,
    },
    {
      icon: "🛣️",
      title: t.landing.features.learningPaths.title,
      desc: t.landing.features.learningPaths.desc,
      now: false,
    },
    {
      icon: "🤝",
      title: t.landing.features.peerMentorship.title,
      desc: t.landing.features.peerMentorship.desc,
      now: false,
    },
    {
      icon: "🏛️",
      title: t.landing.features.trainingCenters.title,
      desc: t.landing.features.trainingCenters.desc,
      now: false,
    },
    {
      icon: "✈️",
      title: t.landing.features.studyAbroad.title,
      desc: t.landing.features.studyAbroad.desc,
      now: false,
    },
    {
      icon: "📁",
      title: t.landing.features.portfolioBuilder.title,
      desc: t.landing.features.portfolioBuilder.desc,
      now: false,
    },
  ];

  const stats = [
    { val: "12+", label: t.landing.stats.opportunities },
    { val: "12", label: t.landing.stats.countries },
    { val: "3", label: t.landing.stats.fields },
    { val: language === 'dz' ? 'مجاني' : 'Free', label: t.landing.stats.free },
  ];

  return (
    <div className="page-enter">
      <Navbar />

      {/* Hero */}
      <section
        style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
        className="hero-gradient"
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            background: "var(--emerald-light)",
            color: "#065F46",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            marginBottom: "2rem",
            border: "1px solid rgba(14,159,110,0.2)",
          }}
        >
          🇩🇿 {t.landing.heroBadge}
        </div>

        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            color: "var(--navy)",
            maxWidth: 780,
            marginBottom: "1.25rem",
            lineHeight: 1.15,
          }}
        >
          {t.landing.heroTitle.split('global opportunities')[0]}
          <em style={{ fontStyle: "italic", color: "var(--emerald)" }}>global opportunities</em>
          <br />
          {t.landing.heroTitle.split('global opportunities')[1]?.replace(' for ', '') || 'for Algerian students'}
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
            color: "#6B7280",
            maxWidth: 560,
            marginBottom: "2.5rem",
            lineHeight: 1.7,
          }}
        >
          {t.landing.heroSubtitle}
        </p>

        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/onboarding"
            className="btn btn-primary"
            style={{ padding: "13px 32px", fontSize: 16, textDecoration: "none" }}
          >
            {t.nav.getStarted} →
          </Link>
          <Link href="/home" className="btn btn-ghost" style={{ textDecoration: "none" }}>
            {t.landing.browseOpportunities}
          </Link>
        </div>

      </section>

      {/* Stats strip */}
      <div
        data-dark-section
        style={{
          background: "var(--navy)",
          padding: "2rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          textAlign: "center",
        }}
      >
        {stats.map((s: { val: string; label: string }) => (
          <div key={s.val}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", color: "#fff" }}>{s.val}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>
              {t.landing.features.title}
            </p>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                color: "var(--navy)",
                marginBottom: "1rem",
              }}
            >
              {t.landing.features.subtitle}
            </h2>
            <p style={{ color: "#6B7280", maxWidth: 500, margin: "0 auto", fontSize: 15 }}>
              {t.landing.features.description}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {features.map((f: { icon: string; title: string; desc: string; now: boolean }) => (
              <div
                key={f.title}
                style={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "1.5rem",
                  boxShadow: "var(--shadow)",
                }}
              >
                {!f.now && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "2px 10px",
                      background: "var(--cream-dark)",
                      borderRadius: 10,
                      fontSize: 11,
                      color: "#6B7280",
                      fontWeight: 500,
                      marginBottom: 8,
                    }}
                  >
                    {t.landing.features.comingSoon}
                  </div>
                )}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    background: f.now ? "var(--emerald-light)" : "var(--cream-dark)",
                    fontSize: 20,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem", color: "var(--navy)", marginBottom: 6 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{f.desc}</p>
                {f.now && (
                  <div style={{ marginTop: "1rem" }}>
                    <Link
                      href="/onboarding"
                      className="btn btn-emerald btn-sm"
                      style={{ textDecoration: "none", fontSize: 13 }}
                    >
                      {t.landing.features.tryNow} →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        data-dark-section
        style={{
          padding: "4rem 1.5rem",
          background: "var(--navy)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "2rem",
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            {t.landing.cta.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2rem", lineHeight: 1.7 }}>
            {t.landing.cta.subtitle}
          </p>
          <Link
            href="/onboarding"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 32px",
              background: "var(--emerald)",
              color: "#fff",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
              textDecoration: "none",
              transition: "background .15s",
            }}
          >
            {t.landing.getStartedFree} →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
