import LegalPageLayout from "@/components/legal/LegalPageLayout";

const sections = [
  {
    id: "data-collection",
    title: "Data Collection",
    content:
      "We collect information you provide directly when creating an account, such as your email address, display name, and payment details. We also automatically collect certain technical data including IP address, browser type, device information, and usage patterns when you interact with our platform.\n\nWe may collect information from third-party authentication providers if you choose to sign in through external services.",
  },
  {
    id: "how-we-use-data",
    title: "How We Use Your Data",
    content:
      "Your data is used to provide, maintain, and improve our services. This includes processing transactions, sending important account notifications, personalizing your experience, and ensuring platform security.\n\nWe analyze aggregated, anonymized usage data to understand how our platform is used and to improve our features. We never sell your personal information to third parties.",
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    content:
      "We use essential cookies to maintain your session and preferences. Analytics cookies help us understand usage patterns. You can control cookie preferences through your browser settings.\n\nWe use local storage to remember your authentication state and UI preferences. No tracking cookies are shared with advertising networks.",
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    content:
      "We use trusted third-party services to operate our platform, including Supabase for authentication and data storage, and secure payment processors for transactions.\n\nThese providers are bound by their own privacy policies and data processing agreements. We only share the minimum data necessary for each service to function.",
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data at any time. You can export your data or request account deletion by contacting our support team.\n\nIf you are located in the EU/EEA, you have additional rights under GDPR including the right to data portability, the right to restrict processing, and the right to object to processing.",
  },
  {
    id: "contact",
    title: "Contact",
    content:
      "For any privacy-related questions or requests, please reach out to us via Telegram at @ghostdashadmin or through the contact options available on our website.\n\nWe aim to respond to all privacy inquiries within 48 hours.",
  },
];

const Privacy = () => (
  <LegalPageLayout
    title="Privacy Policy"
    description="Learn how GhostDash collects, uses, and protects your personal information."
    lastUpdated="March 1, 2026"
    sections={sections}
  />
);

export default Privacy;
