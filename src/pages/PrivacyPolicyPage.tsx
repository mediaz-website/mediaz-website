import { PageMeta } from '../components/PageFrame'

const sections = [
  { title: '1. Information We Collect', paragraphs: ['When you contact Mediazz Hub or submit a project enquiry, we may collect the information you provide, such as your name, business or brand name, email address, WhatsApp number, requested services, budget range and project description.', 'We may also receive basic technical information that your browser shares when you visit the website, such as device, browser and usage data, where available.'] },
  { title: '2. How We Use Your Information', paragraphs: ['We use enquiry information to respond to your request, understand your project, prepare proposals or estimates, communicate about services and provide customer support.', 'We may use technical information to maintain website security, troubleshoot issues and improve website performance.'] },
  { title: '3. How Information Is Stored and Shared', paragraphs: ['Enquiry information submitted through this website may be stored in our website database and service providers used to operate the website. We do not sell your personal information.', 'We may share information with trusted service providers only when reasonably necessary to operate the website or deliver a requested service, or when disclosure is required by law.'] },
  { title: '4. Project Content and Confidentiality', paragraphs: ['If you share briefs, photographs, videos, brand assets or other project materials with us, we use them to assess or perform the work you request. Please do not submit information or materials that you are not authorised to share.', 'Any specific confidentiality, data handling or non-disclosure requirements should be agreed in writing before sensitive materials are provided.'] },
  { title: '5. Cookies and External Services', paragraphs: ['The website or services embedded in it may use cookies or similar technologies for essential functionality, security or performance. Third-party websites and platforms linked from this website operate under their own privacy policies; please review those policies separately.'] },
  { title: '6. Data Retention and Security', paragraphs: ['We retain enquiry and project information for as long as reasonably necessary to respond to enquiries, manage projects, maintain business records and meet legal obligations. We take reasonable steps to protect information, but no internet transmission or storage system can be guaranteed to be completely secure.'] },
  { title: '7. Your Choices', paragraphs: ['You may contact us to request access to, correction of or deletion of personal information you have provided, subject to applicable legal and business record-keeping requirements. You may also choose not to provide requested information, although we may then be unable to respond fully to your enquiry.'] },
  { title: '8. Children’s Privacy', paragraphs: ['This website and our services are intended for businesses and general audiences, not for children. We do not knowingly seek to collect personal information from children.'] },
  { title: '9. Changes to This Policy', paragraphs: ['We may update this Privacy Policy from time to time. The revised version will be published on this page with an updated effective date.'] },
  { title: '10. Contact Us', paragraphs: ['For questions or requests relating to this Privacy Policy, contact Mediazz Hub at mediazzhub@gmail.com or +91 8358063254. Mediazz Hub is based in Indore, Madhya Pradesh, India.'] },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageMeta title="Privacy Policy" description="Read how Mediazz Hub collects, uses, stores and protects information shared through mediazhub.com." />
      <main className="min-h-screen bg-[#0b0b0d] px-6 pb-24 pt-36 text-white sm:px-8 lg:pb-32 lg:pt-44">
        <div className="mx-auto max-w-[1100px]">
          <p className="mb-5 text-xs font-bold tracking-[0.3em] text-[#c5a46d] uppercase">Legal · Mediazz Hub</p>
          <h1 className="font-display text-5xl font-bold tracking-[-0.05em] sm:text-7xl">Privacy <span className="italic text-[#e0bd7e]">Policy.</span></h1>
          <p className="mt-7 max-w-2xl text-white/60">This policy explains how Mediazz Hub handles information when you visit our website or contact us about our creative production and digital services.</p>
          <p className="mt-4 text-xs tracking-wider text-white/40">Effective date: 25 November 2026</p>
          <div className="mt-14 border-t border-white/15">
            {sections.map((section) => (
              <section key={section.title} className="border-b border-white/10 py-8 sm:py-10">
                <h2 className="font-display text-xl font-semibold text-[#e0bd7e] sm:text-2xl">{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 max-w-3xl text-sm leading-8 text-white/65">{paragraph}</p>)}
              </section>
            ))}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-white/35">This page is general website information and is not a substitute for legal advice.</p>
        </div>
      </main>
    </>
  )
}
