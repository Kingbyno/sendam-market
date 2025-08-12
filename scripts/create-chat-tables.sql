-- Create chat_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('buyer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table if it doesn't exist
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'delivered', 'completed')),
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_item_buyer ON chat_messages(item_id, buyer_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_purchases_buyer ON purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_seller ON purchases(seller_id);
CREATE INDEX IF NOT EXISTS idx_purchases_item ON purchases(item_id);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Admins can view all chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Admins can insert chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view their purchases" ON purchases;

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view their own chat messages" ON chat_messages
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Users can insert their own chat messages" ON chat_messages
  FOR INSERT WITH CHECK (buyer_id = auth.uid() AND sender = 'buyer');

-- Create RLS policies for purchases
CREATE POLICY "Users can view their purchases" ON purchases
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can insert their purchases" ON purchases
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Insert some demo chat messages for testing
INSERT INTO chat_messages (item_id, buyer_id, message, sender, created_at) VALUES
  ('mock1', (SELECT id FROM auth.users LIMIT 1), 'Hi, I''m interested in this vintage camera. Is it still available?', 'buyer', NOW() - INTERVAL '2 hours'),
  ('mock1', (SELECT id FROM auth.users LIMIT 1), 'Hello! Yes, the camera is still available. It''s in excellent condition with the original case.', 'admin', NOW() - INTERVAL '1 hour 30 minutes'),
  ('mock1', (SELECT id FROM auth.users LIMIT 1), 'Great! Can you tell me more about the condition? Any scratches or issues?', 'buyer', NOW() - INTERVAL '1 hour'),
  ('mock1', (SELECT id FROM auth.users LIMIT 1), 'The camera body is in very good condition with minimal wear. The lens is clear with no scratches. All functions work perfectly.', 'admin', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;
