import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Xendam",
  description: "Learn how Xendam protects your privacy and handles your personal information in our secure marketplace.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: August 8, 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 p-8 md:p-12">
            <div className="prose max-w-none">
              
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to Xendam Marketplace ("we," "our," or "us"). We are committed to protecting your personal 
                  information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, 
                  and safeguard your information when you use our marketplace platform.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using Xendam, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you create an account or use our services, we may collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Payment information (bank account details for sellers)</li>
                  <li>Profile information and preferences</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Transaction Information</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Item listings and descriptions</li>
                  <li>Purchase and sale history</li>
                  <li>Escrow transaction details</li>
                  <li>Communication related to transactions</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">2.3 Technical Information</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Device information and IP addresses</li>
                  <li>Browser type and version</li>
                  <li>Usage patterns and preferences</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Provide and maintain our marketplace services</li>
                  <li>Process transactions and manage escrow services</li>
                  <li>Verify user identities and prevent fraud</li>
                  <li>Send notifications about your transactions</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and provide customer support</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell or rent your personal information to third parties. We may share your information:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>With other users as necessary for transactions (e.g., contact information for delivery)</li>
                  <li>With payment processors (Paystack) to facilitate transactions</li>
                  <li>With service providers who assist in our operations</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>In connection with business transfers or acquisitions</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication and session management</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information by our staff</li>
                  <li>Secure escrow system for financial transactions</li>
                </ul>
              </section>

              {/* Data Retention */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services, 
                  comply with legal obligations, resolve disputes, and enforce our agreements. Transaction 
                  records may be retained for longer periods as required by law.
                </p>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data (subject to legal requirements)</li>
                  <li>Object to processing of your information</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze usage, 
                  and provide personalized content. You can control cookie settings through your 
                  browser preferences.
                </p>
              </section>

              {/* Third-Party Services */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Services</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our service integrates with third-party providers:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Paystack:</strong> Payment processing (subject to their privacy policy)</li>
                  <li><strong>Google OAuth:</strong> Authentication services (subject to Google's privacy policy)</li>
                </ul>
              </section>

              {/* Updates */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Policy Updates</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by posting the new policy on this page and updating the "last updated" date.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have questions about this Privacy Policy or how we handle your data, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Email:</strong> privacy@xendam.com</p>
                  <p className="text-gray-700"><strong>Support:</strong> Through our contact form at /contact</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
