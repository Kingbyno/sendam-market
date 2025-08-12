-- Create seller_payment_info table (admin-only access)
CREATE TABLE IF NOT EXISTS seller_payment_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL REFERENCES auth.users(id), -- Admin who created this
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seller_id)
);

-- Create terms_agreements table
CREATE TABLE IF NOT EXISTS terms_agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agreement_type TEXT NOT NULL CHECK (agreement_type IN ('seller_terms', 'buyer_terms', 'privacy_policy')),
  version TEXT NOT NULL DEFAULT '1.0',
  agreed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  UNIQUE(user_id, agreement_type, version)
);

-- Create terms_versions table to track different versions
CREATE TABLE IF NOT EXISTS terms_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agreement_type TEXT NOT NULL CHECK (agreement_type IN ('seller_terms', 'buyer_terms', 'privacy_policy')),
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agreement_type, version)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seller_payment_info_seller ON seller_payment_info(seller_id);
CREATE INDEX IF NOT EXISTS idx_terms_agreements_user ON terms_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_terms_agreements_type ON terms_agreements(agreement_type);
CREATE INDEX IF NOT EXISTS idx_terms_versions_active ON terms_versions(agreement_type, is_active);

-- Enable Row Level Security
ALTER TABLE seller_payment_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seller_payment_info (Admin-only access)
CREATE POLICY "Only admins can view seller payment info" ON seller_payment_info
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@sendam.com', 'admin@example.com', 'promisetheking@gmail.com', 'kingbyno007@gmail.com')
    )
  );

CREATE POLICY "Only admins can insert seller payment info" ON seller_payment_info
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@sendam.com', 'admin@example.com', 'promisetheking@gmail.com', 'kingbyno007@gmail.com')
    )
  );

CREATE POLICY "Only admins can update seller payment info" ON seller_payment_info
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@sendam.com', 'admin@example.com', 'promisetheking@gmail.com', 'kingbyno007@gmail.com')
    )
  );

-- RLS Policies for terms_agreements
CREATE POLICY "Users can view their own agreements" ON terms_agreements
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own agreements" ON terms_agreements
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all agreements" ON terms_agreements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@sendam.com', 'admin@example.com', 'promisetheking@gmail.com', 'kingbyno007@gmail.com')
    )
  );

-- RLS Policies for terms_versions (Public read, admin write)
CREATE POLICY "Anyone can view active terms versions" ON terms_versions
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage terms versions" ON terms_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@sendam.com', 'admin@example.com', 'promisetheking@gmail.com', 'kingbyno007@gmail.com')
    )
  );

-- Insert default terms versions
INSERT INTO terms_versions (agreement_type, version, title, content, is_active) VALUES
('seller_terms', '1.0', 'Seller Terms and Conditions', 
'# Seller Terms and Conditions

## 1. Item Listing Requirements
- All items must be accurately described
- Photos must represent the actual item condition
- Prohibited items cannot be listed
- Pricing must be fair and reasonable

## 2. Payment and Fees
- Sendam charges a 5% commission on successful sales
- Payment will be processed within 3-5 business days after delivery confirmation
- Sellers are responsible for providing accurate payment information

## 3. Delivery and Fulfillment
- Items must be delivered within the agreed timeframe
- Proper packaging is required to prevent damage
- Tracking information must be provided when available

## 4. Seller Responsibilities
- Respond to buyer inquiries promptly
- Maintain accurate inventory
- Honor all sales commitments
- Comply with local laws and regulations

## 5. Prohibited Activities
- Selling counterfeit or illegal items
- Misrepresenting item condition or authenticity
- Engaging in fraudulent activities
- Violating intellectual property rights

By accepting these terms, you agree to comply with all seller requirements and acknowledge that violations may result in account suspension or termination.', 
true),

('buyer_terms', '1.0', 'Buyer Terms and Conditions',
'# Buyer Terms and Conditions

## 1. Purchase Process
- All purchases are final once payment is confirmed
- Buyers must provide accurate delivery information
- Payment must be completed within 24 hours of commitment

## 2. Payment Security
- All payments are processed securely through Paystack
- Payment information is encrypted and protected
- Refunds are subject to our refund policy

## 3. Delivery and Inspection
- Inspect items immediately upon delivery
- Report any issues within 24 hours of delivery
- Keep all packaging materials until satisfied with purchase

## 4. Buyer Responsibilities
- Provide accurate contact and delivery information
- Be available to receive deliveries
- Communicate respectfully with sellers and administrators
- Report any suspicious activities

## 5. Dispute Resolution
- Contact Sendam support for any issues
- Provide evidence for any claims or disputes
- Cooperate with investigation processes
- Accept final decisions from Sendam administration

## 6. Prohibited Activities
- Making false claims or disputes
- Attempting to circumvent the platform
- Engaging in fraudulent activities
- Harassing sellers or other users

By accepting these terms, you agree to comply with all buyer requirements and acknowledge our dispute resolution process.',
true),

('privacy_policy', '1.0', 'Privacy Policy',
'# Privacy Policy

## 1. Information We Collect
- Account information (name, email, phone)
- Transaction history and preferences
- Device and usage information
- Location data for delivery purposes

## 2. How We Use Your Information
- Process transactions and deliveries
- Provide customer support
- Improve our services
- Send important notifications
- Prevent fraud and ensure security

## 3. Information Sharing
- We do not sell personal information to third parties
- Information may be shared with service providers
- Legal compliance may require information disclosure
- Anonymized data may be used for analytics

## 4. Data Security
- All sensitive data is encrypted
- Secure servers and protocols are used
- Regular security audits are conducted
- Access is restricted to authorized personnel only

## 5. Your Rights
- Access your personal information
- Request data correction or deletion
- Opt-out of marketing communications
- Download your data

## 6. Data Retention
- Account data is retained while account is active
- Transaction records kept for legal compliance
- Deleted accounts are purged within 30 days
- Backup data may persist for up to 90 days

## 7. Contact Information
For privacy concerns, contact us at privacy@sendam.com

This policy is effective as of the date of acceptance and may be updated periodically.',
true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for seller_payment_info
CREATE TRIGGER update_seller_payment_info_updated_at 
    BEFORE UPDATE ON seller_payment_info 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
