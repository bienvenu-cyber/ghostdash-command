import LegalPageLayout from "@/components/legal/LegalPageLayout";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content:
      "By accessing or using GhostDash, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not use our platform.\n\nWe reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the revised terms.",
  },
  {
    id: "use-of-service",
    title: "Use of Service",
    content:
      "GhostDash provides customizable dashboard tools for content creators. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.\n\nYou agree not to use the service for any unlawful purpose, to impersonate others, or to interfere with the platform's operation. We reserve the right to suspend accounts that violate these guidelines.",
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content:
      "All content, features, and functionality of GhostDash — including design, code, graphics, and branding — are owned by GhostDash and protected by international copyright and trademark laws.\n\nYou retain ownership of any content you create using our tools. However, you grant us a limited license to display and process your content as necessary to provide the service.",
  },
  {
    id: "limitation-liability",
    title: "Limitation of Liability",
    content:
      'GhostDash is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service. In no event shall GhostDash be liable for any indirect, incidental, or consequential damages.\n\nOur total liability for any claims arising from use of the service shall not exceed the amount you paid us in the 12 months preceding the claim.',
  },
  {
    id: "termination",
    title: "Termination",
    content:
      "We may terminate or suspend your account at our discretion if you violate these terms or engage in conduct that we determine is harmful to the platform or other users.\n\nUpon termination, your right to use the service ceases immediately. You may request export of your data within 30 days of termination.",
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content:
      "These terms shall be governed by and construed in accordance with applicable international laws. Any disputes shall be resolved through binding arbitration in the jurisdiction of our principal place of business.\n\nIf any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.",
  },
  {
    id: "contact",
    title: "Contact",
    content:
      "For questions about these Terms of Service, please contact us via Telegram at @ghostdashadmin or through the contact options available on our website.\n\nWe aim to respond to all inquiries within 48 hours.",
  },
];

const Terms = () => (
  <LegalPageLayout
    title="Terms of Service"
    description="Read the terms and conditions governing the use of GhostDash services."
    lastUpdated="March 1, 2026"
    sections={sections}
  />
);

export default Terms;
