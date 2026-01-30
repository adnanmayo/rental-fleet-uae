import Link from "next/link";
import { generateMetadata as genMeta } from "@/lib/seo-utils";
import { siteConfig } from "@/lib/site-config";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = genMeta({
  title: "Terms of Service",
  description: "Terms of Service for Rental Fleet UAE - Review the terms and conditions for using our website and services.",
  keywords: ["terms of service", "terms and conditions", "legal"],
  canonical: `${siteConfig.url}/terms`
});

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms", href: "/terms" }]} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-700 mb-4">
              Last Updated: January 15, 2026
            </p>
            <p className="text-gray-600">
              Please read these terms carefully before using our website and services.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service constitute a legally binding agreement made between you and Rental Fleet UAE ({siteConfig.domain}), concerning your access to and use of the website as well as any related applications, services, or tools.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing the website, you agree that you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these terms, then you are expressly prohibited from using the website and you must discontinue use immediately.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">2. Intellectual Property Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Unless otherwise indicated, the website is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the website (collectively, the &quot;Content&quot;) are owned or controlled by us or licensed to us.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Content and the trademarks, service marks, and logos contained therein are protected by copyright and trademark laws. You are granted a limited license to access and use the website and to download or print a copy of any portion of the Content for your personal, non-commercial use only.
              </p>
            </div>

            {/* User Representations */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">3. User Representations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By using the website, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>All registration information you submit will be true, accurate, current, and complete</li>
                <li>You will maintain the accuracy of such information</li>
                <li>You have the legal capacity and agree to comply with these Terms of Service</li>
                <li>You are not under the age of 18</li>
                <li>You will not access the website through automated or non-human means</li>
                <li>You will not use the website for any illegal or unauthorized purpose</li>
                <li>Your use of the website will not violate any applicable law or regulation</li>
              </ul>
            </div>

            {/* Prohibited Activities */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">4. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not access or use the website for any purpose other than that for which we make the website available. The website may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                As a user of the website, you agree not to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Systematically retrieve data or content from the website to create a collection, database, or directory</li>
                <li>Make unauthorized use of the website, including collecting usernames and email addresses</li>
                <li>Use the website to advertise or offer to sell goods and services without our prior written consent</li>
                <li>Circumvent, disable, or interfere with security-related features of the website</li>
                <li>Engage in unauthorized framing of or linking to the website</li>
                <li>Trick, defraud, or mislead us and other users</li>
                <li>Make improper use of our support services or submit false reports</li>
                <li>Interfere with, disrupt, or create an undue burden on the website</li>
                <li>Attempt to impersonate another user or use the username of another user</li>
                <li>Upload or transmit viruses, trojan horses, or other malicious material</li>
                <li>Use any information obtained from the website to harass, abuse, or harm another person</li>
                <li>Decipher, decompile, disassemble, or reverse engineer any software comprising the website</li>
              </ul>
            </div>

            {/* User Generated Content */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">5. User Generated Contributions</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The website may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality. Any contribution you transmit to the website will be considered non-confidential and non-proprietary.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                By providing any contribution, you grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right and license to use, copy, reproduce, distribute, sell, resell, publish, broadcast, retitle, archive, store, publicly perform, publicly display, reformat, translate, and create derivative works of your contributions.
              </p>
            </div>

            {/* Links and Third-Party Content */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Third-Party Websites and Content</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The website may contain links to other websites (&quot;Third-Party Websites&quot;) as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Such Third-Party Websites and third-party content include our partners:{" "}
                <a
                  href={siteConfig.promotedSites.autycloud.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  AutyCloud
                </a>
                {" "}and{" "}
                <a
                  href={siteConfig.promotedSites.adnanRentals.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Adnan Rentals
                </a>
                . We do not investigate, monitor, or check such Third-Party Websites for accuracy, appropriateness, or completeness. We are not responsible for any third-party content accessed through the website.
              </p>
            </div>

            {/* Website Management */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">7. Website Management</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right, but not the obligation, to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Monitor the website for violations of these Terms of Service</li>
                <li>Take appropriate legal action against anyone who violates the law or these Terms</li>
                <li>Refuse, restrict access to, limit availability of, or disable any contribution or portion thereof</li>
                <li>Remove from the website or disable all files and content that are excessive in size or burdensome to our systems</li>
                <li>Otherwise manage the website in a manner designed to protect our rights and property</li>
              </ul>
            </div>

            {/* Privacy Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">8. Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We care about data privacy and security. Please review our{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                  Privacy Policy
                </Link>
                . By using the website, you agree to be bound by our Privacy Policy, which is incorporated into these Terms of Service.
              </p>
            </div>

            {/* Modifications */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">9. Modifications and Interruptions</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to change, modify, or remove the contents of the website at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the website without notice at any time.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We cannot guarantee the website will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the website, resulting in interruptions, delays, or errors.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">10. Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                THE WEBSITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE WEBSITE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE WEBSITE AND YOUR USE THEREOF.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE WEBSITE&apos;S CONTENT OR THE CONTENT OF ANY WEBSITES LINKED TO THIS WEBSITE.
              </p>
            </div>

            {/* Limitations of Liability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">11. Limitations of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE WEBSITE.
              </p>
            </div>

            {/* Indemnification */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys&apos; fees and expenses, made by any third party due to or arising out of your use of the website or breach of these Terms of Service.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms shall be governed by and defined following the laws of the United Arab Emirates. Rental Fleet UAE and yourself irrevocably consent that the courts of the United Arab Emirates shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
              </p>
            </div>

            {/* Dispute Resolution */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">14. Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Any legal action of whatever nature brought by either you or us shall be commenced or prosecuted in the courts of the United Arab Emirates, and the parties hereby consent to, and waive all defenses of lack of personal jurisdiction and forum non conveniens with respect to venue and jurisdiction in such courts.
              </p>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">15. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-blue-600 hover:text-blue-700 underline">
                    {siteConfig.contact.email}
                  </a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Website:</strong>{" "}
                  <a href={siteConfig.url} className="text-blue-600 hover:text-blue-700 underline">
                    {siteConfig.url}
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> {siteConfig.contact.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/privacy"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">Privacy Policy</h4>
                  <p className="text-sm text-gray-600">Learn how we protect your data</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/contact"
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">Contact Us</h4>
                  <p className="text-sm text-gray-600">Get in touch with our team</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
