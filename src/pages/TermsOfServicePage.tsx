import { PageMeta } from '../components/PageFrame'

const sections = [
  { title: '1. About These Terms', paragraphs: ['These Terms of Service apply to your access to and use of mediazhub.com and to enquiries or services offered by Mediazz Hub. By using this website, you agree to these terms. If you do not agree, please do not use the website.', 'Mediazz Hub is a creative media production house based in Indore, Madhya Pradesh, India, providing services to clients in India and elsewhere.'] },
  { title: '2. Services and Project Scope', paragraphs: ['Our services may include commercial and advertising shoots, product photography, video and reels production, brand films, podcast production, creative strategy, AI media production, website development, automation and related digital services.', 'The exact deliverables, timelines, formats, fees, revisions and responsibilities for a project will be set out in a written proposal, quotation, work order or other written confirmation. A project begins only after the scope and applicable commercial terms are accepted by both parties.'] },
  { title: '3. Enquiries, Quotes and Payments', paragraphs: ['Submitting an enquiry through this website does not create a client relationship or guarantee availability. Quotes are based on the brief and assumptions shared at the time and may be revised if the scope or requirements change.', 'Payment amounts, advance requirements, milestones, taxes and due dates will be communicated in the accepted proposal or invoice. Work may be paused where agreed payments are overdue, subject to the applicable project agreement.'] },
  { title: '4. Client Responsibilities', paragraphs: ['You are responsible for providing accurate project information, timely feedback, approvals, access, permissions and materials needed for the work. You must have the rights and permissions required for any logos, footage, music, images, scripts, personal data or other materials you provide.', 'Delays in receiving required materials, approvals or payments may affect the delivery schedule.'] },
  { title: '5. Revisions, Approvals and Delivery', paragraphs: ['The number of revisions, approval stages, delivery formats and handover requirements will be specified in the project proposal or written agreement. Additional changes or work outside the agreed scope may require additional fees and time.', 'You are responsible for reviewing and approving final deliverables before publication, distribution or commercial use.'] },
  { title: '6. Intellectual Property', paragraphs: ['Unless otherwise agreed in writing, Mediazz Hub retains ownership of its pre-existing tools, templates, methods, processes and know-how. Ownership or licence rights for project-specific final deliverables, raw footage, editable project files, concepts and third-party assets will be governed by the accepted project proposal or written agreement.', 'You must not use third-party materials supplied by Mediazz Hub beyond the licence or permissions applicable to those materials.'] },
  { title: '7. Portfolio and Publicity', paragraphs: ['Mediazz Hub may request permission to display completed work in its portfolio, website or social channels. We will not treat project approval alone as permission to publish confidential or unreleased client materials; any portfolio use should be agreed with the client.'] },
  { title: '8. Third-Party Platforms and AI Tools', paragraphs: ['Some projects may involve third-party platforms, software, hosting providers, advertising networks or AI tools. Their availability, terms, output and privacy practices are controlled by those providers. We do not guarantee uninterrupted operation or specific results from third-party services or AI-generated outputs.', 'Clients should review AI-assisted and other deliverables for factual accuracy, rights, suitability and compliance before using them publicly or commercially.'] },
  { title: '9. Cancellations and Changes', paragraphs: ['Project cancellation, rescheduling, refunds, expenses and fees for work already completed will be handled according to the written proposal or agreement for that project. Please raise any requested change or cancellation in writing as early as possible.'] },
  { title: '10. Website Use and Disclaimers', paragraphs: ['You agree not to misuse this website, attempt unauthorised access, disrupt its operation or submit unlawful, misleading or infringing content.', 'Website content is provided for general information and may be updated without notice. To the extent permitted by applicable law, the website is provided on an “as available” basis, without guarantees that it will always be uninterrupted, error-free or suitable for every purpose.'] },
  { title: '11. Limitation of Liability', paragraphs: ['To the extent permitted by applicable law, Mediazz Hub will not be liable for indirect, incidental, special or consequential losses arising from general use of this website. Any liability relating to a paid project will be governed by the applicable written project agreement and law. Nothing in these terms excludes liability that cannot lawfully be excluded.'] },
  { title: '12. Governing Law and Contact', paragraphs: ['These terms are governed by the laws of India. Subject to applicable law, courts having jurisdiction in Indore, Madhya Pradesh shall have jurisdiction over disputes arising from these website terms.', 'For questions about these terms or our services, contact mediazzhub@gmail.com or +91 8358063254.'] },
  { title: '13. Updates to These Terms', paragraphs: ['We may update these terms from time to time. Changes will be published on this page with an updated effective date.'] },
]

export default function TermsOfServicePage() {
  return (
    <>
      <PageMeta title="Terms of Service" description="Read the terms governing use of the Mediazz Hub website and enquiries for its creative production and digital services." />
      <main className="min-h-screen bg-[#0b0b0d] px-6 pb-24 pt-36 text-white sm:px-8 lg:pb-32 lg:pt-44">
        <div className="mx-auto max-w-[1100px]">
          <p className="mb-5 text-xs font-bold tracking-[0.3em] text-[#c5a46d] uppercase">Legal · Mediazz Hub</p>
          <h1 className="font-display text-5xl font-bold tracking-[-0.05em] sm:text-7xl">Terms of <span className="italic text-[#e0bd7e]">Service.</span></h1>
          <p className="mt-7 max-w-2xl text-white/60">Please read these terms before using our website or engaging Mediazz Hub for creative production and digital services.</p>
          <p className="mt-4 text-xs tracking-wider text-white/40">Effective date: 25 November 2026</p>
          <div className="mt-14 border-t border-white/15">
            {sections.map((section) => (
              <section key={section.title} className="border-b border-white/10 py-8 sm:py-10">
                <h2 className="font-display text-xl font-semibold text-[#e0bd7e] sm:text-2xl">{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 max-w-3xl text-sm leading-8 text-white/65">{paragraph}</p>)}
              </section>
            ))}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-white/35">These terms are general website terms. Project-specific terms in an accepted written agreement will govern that project where applicable.</p>
        </div>
      </main>
    </>
  )
}
