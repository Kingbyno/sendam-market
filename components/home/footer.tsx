"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-white via-blue-50/50 to-violet-50/50 border-t border-blue-100/50">
      <div className="container mx-auto px-6 py-12">
        {/* Logo and Description - Full width on all screens */}
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center space-x-2 mb-4 group"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Sendam
            </span>
          </Link>
          <p className="text-gray-600 max-w-md leading-relaxed mb-6">
            The most secure marketplace with escrow protection. Buy and sell with confidence knowing every transaction is protected until delivery confirmation.
          </p>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Secure Escrow System</span>
            </div>
          </div>
        </div>

        {/* Links sections - Side by side on mobile, spread on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Empty spacers for desktop to center the two sections */}
          <div className="hidden md:block"></div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Marketplace</h3>
            <div className="space-y-3">
              <Link
                href="/marketplace"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Browse Items
              </Link>
              <Link
                href="/sell"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Sell Items
              </Link>
              <Link
                href="/auth/login"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <div className="space-y-3">
              <Link
                href="/about"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                About Us
              </Link>
              <Link
                href="/terms"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* Empty spacer for desktop symmetry */}
          <div className="hidden md:block"></div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-blue-100/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © {currentYear} Sendam. All rights reserved. • Secure marketplace with escrow protection
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"></span>
                <span>Powered by Paystack</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
