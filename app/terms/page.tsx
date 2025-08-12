import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Sendam Marketplace",
  description: "Read the terms and conditions for using Sendam's secure escrow marketplace platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our secure marketplace platform.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: August 8, 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 p-8 md:p-12">
            <div className="prose max-w-none">
              
              {/* Acceptance */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By accessing and using Sendam Marketplace ("Service"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These terms apply to all users of the service, including without limitation users who are merchants, 
                  vendors, customers, or contributors of content.
                </p>
              </section>

              {/* Service Description */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sendam Marketplace is an escrow-protected online marketplace platform that enables users to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Buy and sell items with escrow protection</li>
                  <li>List items for sale subject to admin approval</li>
                  <li>Process secure payments through Paystack integration</li>
                  <li>Participate in dispute resolution processes</li>
                  <li>Access buyer and seller protection features</li>
                </ul>
              </section>

              {/* User Accounts */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Account Registration</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To use our services, you must create an account and provide accurate, current, and complete information. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>

                <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Account Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>You must be at least 18 years old to use our services</li>
                  <li>Provide accurate and truthful information</li>
                  <li>Keep your login credentials secure</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </section>

              {/* Selling Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Selling on Sendam</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Item Listings</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>All items must be approved by our admin team before listing</li>
                  <li>Provide accurate descriptions and images of your items</li>
                  <li>Set fair and reasonable prices</li>
                  <li>Items must comply with applicable laws and regulations</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Prohibited Items</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You may not list the following items:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Illegal or regulated items</li>
                  <li>Stolen or counterfeit goods</li>
                  <li>Items that infringe intellectual property rights</li>
                  <li>Dangerous or hazardous materials</li>
                  <li>Adult content or services</li>
                  <li>Items that violate platform policies</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">4.3 Seller Obligations</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Honor all sales made through the platform</li>
                  <li>Deliver items in the condition described</li>
                  <li>Respond promptly to buyer inquiries</li>
                  <li>Provide accurate bank information for payments</li>
                </ul>
              </section>

              {/* Buying Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Buying on Sendam</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">5.1 Buyer Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Make payments through our secure system only</li>
                  <li>Inspect items upon delivery</li>
                  <li>Confirm receipt to release funds to the seller</li>
                  <li>Report any issues promptly</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">5.2 Delivery Options</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Two delivery options are available:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Sendam Verification (10% fee):</strong> We inspect and verify the item before delivery</li>
                  <li><strong>Direct Meeting:</strong> Meet the seller directly at no additional cost</li>
                </ul>
              </section>

              {/* Escrow System */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Escrow System</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">6.1 How It Works</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Buyer payments are held in escrow until delivery confirmation</li>
                  <li>Funds are released to sellers after buyer confirmation or automatic release</li>
                  <li>14-day automatic release period for buyer protection</li>
                  <li>Dispute resolution available through our admin team</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">6.2 Dispute Resolution</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If disputes arise, our admin team will mediate based on:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Evidence provided by both parties</li>
                  <li>Platform transaction records</li>
                  <li>Communication history</li>
                  <li>Applicable laws and platform policies</li>
                </ul>
              </section>

              {/* Fees */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Fees and Payments</h2>
                
                <h3 className="text-xl font-medium text-gray-800 mb-3">7.1 Service Fees</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Sendam Verification: 10% service fee on the item price</li>
                  <li>Direct Meeting: No additional platform fees</li>
                  <li>Payment processing fees as charged by Paystack</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-800 mb-3">7.2 Payment Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  All payments are processed securely through Paystack. Sellers receive payments after successful 
                  transaction completion, minus applicable fees.
                </p>
              </section>

              {/* User Conduct */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. User Conduct</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Users agree not to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Use the service for illegal activities</li>
                  <li>Attempt to circumvent our escrow system</li>
                  <li>Create fake or duplicate accounts</li>
                  <li>Harass or abuse other users</li>
                  <li>Manipulate reviews or ratings</li>
                  <li>Upload malicious content or code</li>
                  <li>Violate intellectual property rights</li>
                </ul>
              </section>

              {/* Liability */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sendam Marketplace acts as an intermediary platform. While we implement security measures and escrow 
                  protection, we are not liable for:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Quality, safety, or legality of items listed</li>
                  <li>Truth or accuracy of user listings</li>
                  <li>Ability of sellers to complete transactions</li>
                  <li>Ability of buyers to pay for items</li>
                  <li>Actions of users on the platform</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Sendam platform, including its original content, features, and functionality, is owned by Sendam 
                  and protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Users retain ownership of content they upload but grant us license to use it for platform operations.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Account Termination</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We reserve the right to terminate accounts that violate our terms of service. Users may also 
                  close their accounts at any time, subject to completion of pending transactions.
                </p>
              </section>

              {/* Modifications */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Modifications to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. Users will be notified of material 
                  changes, and continued use of the service constitutes acceptance of the new terms.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These terms are governed by the laws of Nigeria. Any disputes shall be resolved through 
                  binding arbitration or in the courts of Nigeria.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700"><strong>Email:</strong> legal@sendam.com</p>
                  <p className="text-gray-700"><strong>Support:</strong> Through our contact form at /contact</p>
                  <p className="text-gray-700"><strong>Address:</strong> Nigeria</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
