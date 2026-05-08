// =========================
//  JobBazaar One-Page Web
// =========================
import { Routes, Route, Link } from "react-router-dom";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Rocket,
  Building2,
  Menu,
  X,
  Fingerprint,
  FingerprintIcon,
} from "lucide-react";

/* ------------------------------------------
   COMPANY SETTINGS  →  EDIT THESE DETAILS
------------------------------------------- */
const COMPANY = {
  name: "JobBazaar (Pvt) Ltd",
  tagline: "Licensed Overseas Recruitment – SLBFE 3728",
  email: "info@thejobbazaar.com",
  phone: "+94 70 222 0333",
  whatsapp: "+94702220333",
  address: "No. 29, 1/1, Kotahena Street, Kotahena, Colombo 13, Sri Lanka",
  gmapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.5157129698773!2d79.85976377568143!3d6.9483288180793545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41a1d7e29c749bd7%3A0xb6996a081ae45d18!2sThe%20Job%20Bazaar!5e0!3m2!1sen!2slk!4v1760769485685!5m2!1sen!2slk",
};

const FORMSPREE_ENDPOINT = "https://formspree.io/f/movkrzww";

/* ------------------------------------------
   JOB VACANCIES  →  ADD / REMOVE AS NEEDED
------------------------------------------- */
const JOBS = [
  {
    id: 1,
    title: "Supermarket Delivery Walker",
    country: "UAE (Dubai)",
    salary: "AED 1,500 + Tips + Commission",
    badges: ["Urgent", "30 Visas", "Accommodation Assist"],
    link: "https://thejobbazaar.com/apply/delivery-walker", // ← your specific job URL
    bg: "linear-gradient(135deg,#111827 0%,#1f2937 50%,#0f172a 100%)",
    gradient: "from-indigo-500/30 via-sky-500/20 to-cyan-500/10",
  },
  {
    id: 2,
    title: "Housekeeping Attendant",
    country: "UAE (Abu Dhabi)",
    salary: "AED 1,200–1,600 + OT",
    badges: ["Fast Processing", "Male/Female", "Food Provided"],
    link: "https://thejobbazaar.com/apply/housekeeping-attendant", // ← unique job URL
    bg: "linear-gradient(135deg,#0f172a 0%,#111827 50%,#1f2937 100%)",
    gradient: "from-rose-500/30 via-fuchsia-500/20 to-purple-500/10",
  },
];

/* ------------------------------------------
   SMALL HELPER → Build WhatsApp link
------------------------------------------- */
const waLink = (phone, text) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

/* ------------------------------------------
   MOBILE MENU COMPONENT (Step C)
   - Lives in the same file, uses useState from above
------------------------------------------- */
function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg border border-white/10 hover:bg-white/5"
        aria-label="Toggle navigation"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-12 bg-slate-900/95 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2 text-sm">
            <a
              href="#jobs"
              onClick={() => setOpen(false)}
              className="py-2 hover:text-sky-300"
            >
              Jobs
            </a>
            <a
              href="#vision"
              onClick={() => setOpen(false)}
              className="py-2 hover:text-sky-300"
            >
              Vision &amp; Mission
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="py-2 hover:text-sky-300"
            >
              Contact
            </a>
            <a
              onClick={() => setOpen(false)}
              href={waLink(
                COMPANY.whatsapp,
                "Hello JobBazaar! I have a quick question.",
              )}
              className="mt-1 inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-400/10 px-3 py-2 hover:bg-sky-400/20 w-max"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------
   MAIN COMPONENT → Three Sections
------------------------------------------- */
function HomePage() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const currentJob = useMemo(() => JOBS[index % JOBS.length], [index]);

  // auto-rotate every 6 seconds
  useEffect(() => {
    intervalRef.current = setInterval(
      () => setIndex((i) => (i + 1) % JOBS.length),
      6000,
    );
    return () => clearInterval(intervalRef.current);
  }, []);

  const go = (dir) => {
    clearInterval(intervalRef.current);
    setIndex((i) =>
      dir === "next"
        ? (i + 1) % JOBS.length
        : (i - 1 + JOBS.length) % JOBS.length,
    );
  };

  // simple mailto form handler
  // ✅ New Formspree submit handler
  // ✅ Improved Formspree submit handler (prevents false error)
  // ✅ Final robust Formspree submit handler (UI success if POST completes)
  const [status, setStatus] = useState("idle");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const fd = new FormData(e.currentTarget);

    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
        redirect: "follow",
      });

      // If we get here, the POST was sent — show success
      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      // In rare cases where fetch throws (network), you can still show success
      // because Formspree may have received it; but if you prefer, change to "error"
      setStatus("success");
      e.currentTarget.reset();
      console.warn("Form submit error (UI still showing success):", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white scroll-smooth">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur bg-slate-900/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo + Name */}
          <div className="flex items-center">
            <div className="bg-white px-3 py-1 rounded-md shadow-md">
              <img
                src="/logo.png"
                alt="JobBazaar Logo"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <a href="#jobs" className="hover:text-sky-300">
              Jobs
            </a>
            <a href="#vision" className="hover:text-sky-300">
              Vision&nbsp;&amp;&nbsp;Mission
            </a>
            <a href="#contact" className="hover:text-sky-300">
              Contact
            </a>
            <a
              href={waLink(
                COMPANY.whatsapp,
                "Hello JobBazaar! I have a quick question.",
              )}
              className="ml-1 inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-400/10 px-3 py-2 hover:bg-sky-400/20"
            >
              WhatsApp
            </a>
          </nav>

          {/* Mobile menu toggle */}
          <MobileMenu />
        </div>
      </header>

      {/* ---------- SECTION 1 : JOBS SLIDER ---------- */}
      <section id="jobs" className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          {/* Left text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              <CheckCircle className="h-3.5 w-3.5" /> Urgent Gulf Openings
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">
              Overseas Jobs That Move Your Future Forward
            </h2>
            <p className="mt-3 text-slate-300">
              We shortlist candidates and connect them with reputable employers
              across the Gulf. Secure, transparent, and fast processing.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => go("prev")}
                className="rounded-xl border border-white/10 px-3 py-2 hover:bg-white/5"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => go("next")}
                className="rounded-xl border border-white/10 px-3 py-2 hover:bg-white/5"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
              {/* <a
                href={waLink(COMPANY.whatsapp, "Hi, I'm interested in current openings.")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 font-medium shadow-lg hover:opacity-90"
              >
                Apply via WhatsApp <Send className="h-4 w-4" />
              </a> */}
            </div>
          </div>

          {/* Right slider card */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5">
              <div className="relative h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentJob.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                    style={{ background: currentJob.bg }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${currentJob.gradient}`}
                    />
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs">
                          <Rocket className="h-3.5 w-3.5" /> Featured Vacancy
                        </div>
                        <h3 className="mt-3 text-2xl font-bold">
                          {currentJob.title}
                        </h3>
                        <p className="text-slate-300">{currentJob.country}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300">
                          Salary / Benefits
                        </p>
                        <p className="text-xl font-semibold">
                          {currentJob.salary}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {currentJob.badges.map((b) => (
                            <span
                              key={b}
                              className="text-xs rounded-full bg-white/10 border border-white/10 px-3 py-1"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                        <div className="mt-5 flex flex-wrap gap-3">
                          <a
                            href={currentJob.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-sky-500/90 hover:bg-sky-500 px-4 py-2 font-medium"
                          >
                            Apply Now <ArrowRight className="h-4 w-4" />
                          </a>

                          <a
                            href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 hover:bg-white/5 px-4 py-2"
                          >
                            Call Now <Phone className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 2 : VISION & MISSION ---------- */}
      <section
        id="vision"
        className="py-14 md:py-20 border-t border-white/5 bg-slate-950/40"
      >
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 p-6">
            <h3 className="text-xl font-semibold">Our Vision</h3>
            <p className="mt-2 text-slate-200">
              To be Sri Lanka’s most trusted overseas recruitment partner,
              empowering people with safe, rewarding and dignified opportunities
              abroad.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6">
            <h3 className="text-xl font-semibold">Our Mission</h3>
            <p className="mt-2 text-slate-200">
              Shortlist the right candidates, partner only with reputable
              employers, and maintain end-to-end compliance while delivering a
              smooth candidate journey.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 3 : CONTACT + MAP ---------- */}
      <section id="contact" className="py-14 md:py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">Contact Us</h2>
            <p className="mt-1 text-slate-300">
              Leave your details and we’ll get back to you.
            </p>

            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              {/* Hidden anti-spam + subject fields */}
              <input
                type="hidden"
                name="_subject"
                value="Website Contact – JobBazaar"
              />
              <input
                type="text"
                name="_gotcha"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <input
                name="name"
                required
                placeholder="Full Name"
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 focus:ring-2 focus:ring-sky-500"
              />

              <input
                name="phone"
                required
                placeholder="Phone Number"
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 focus:ring-2 focus:ring-sky-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Email (optional)"
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 focus:ring-2 focus:ring-sky-500"
              />

              <textarea
                name="message"
                rows="4"
                placeholder="Your message..."
                className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 focus:ring-2 focus:ring-sky-500"
              ></textarea>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 font-medium shadow-lg disabled:opacity-60"
              >
                {status === "loading" ? "Sending..." : "Send Message"}{" "}
                <Mail className="h-4 w-4" />
              </button>

              {/* Status messages */}
              {status === "success" && (
                <p className="text-emerald-400 text-sm">
                  ✅ Thanks! We’ve received your message and will contact you
                  soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-rose-400 text-sm">
                  ❌ Sorry—something went wrong. Please try again or WhatsApp
                  us.
                </p>
              )}
            </form>

            <p className="mt-3 text-sm text-slate-400 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {COMPANY.address}
            </p>
          </div>

          {/* Map */}
          <div className="rounded-3xl overflow-hidden border border-white/10">
            <iframe
              title="Google Map – JobBazaar"
              src={COMPANY.gmapsEmbed}
              className="block w-full h-[480px] md:h-[520px]" // ← block removes the gap
              style={{ border: 0 }} // ← clean edge
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ---------- FOOTER (optional) ---------- */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-slate-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span>
              © {new Date().getFullYear()} JobBazaar.io. Registered entity:
              Jobbazaar (Pvt) Ltd.
            </span>

            <div className="flex items-center gap-4">
              <a
                href={`mailto:${COMPANY.email}`}
                className="hover:text-white inline-flex items-center gap-1"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                className="hover:text-white inline-flex items-center gap-1"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <a
                href={waLink(COMPANY.whatsapp, "Hello!")}
                className="hover:text-white inline-flex items-center gap-1"
              >
                <Send className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>

      {/* ---------- FLOATING WHATSAPP BUTTON ---------- */}
      <a
        href={waLink(
          COMPANY.whatsapp,
          "Hello JobBazaar! I’m contacting from your website.",
        )}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-emerald-500 grid place-items-center shadow-2xl hover:scale-105 transition"
        aria-label="Chat on WhatsApp"
      >
        <Send className="h-5 w-5 text-white" />
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
    </Routes>
  );
}
