-- Create escrow transactions table
CREATE TABLE IF NOT EXISTS escrow_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_reference VARCHAR(255) UNIQUE NOT NULL,
    item_id UUID NOT NULL,
    buyer_id UUID NOT NULL,
    seller_id UUID NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    service_fee DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    delivery_option VARCHAR(50) NOT NULL CHECK (delivery_option IN ('sendam', 'direct')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'delivered', 'confirmed', 'released', 'disputed', 'refunded')),
    payment_method VARCHAR(50),
    paystack_reference VARCHAR(255),
    
    -- Timestamps for auto-release logic
    paid_at TIMESTAMP,
    delivered_at TIMESTAMP,
    confirmation_deadline TIMESTAMP,
    auto_release_at TIMESTAMP,
    released_at TIMESTAMP,
    
    -- Dispute handling
    dispute_reason TEXT,
    disputed_at TIMESTAMP,
    dispute_resolved_at TIMESTAMP,
    dispute_resolution TEXT,
    
    -- Admin actions
    admin_notes TEXT,
    admin_action_by UUID,
    admin_action_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_escrow_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    CONSTRAINT fk_escrow_buyer FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_escrow_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_escrow_admin FOREIGN KEY (admin_action_by) REFERENCES users(id)
);

-- Create payment releases table for tracking auto-releases
CREATE TABLE IF NOT EXISTS payment_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escrow_transaction_id UUID NOT NULL,
    release_type VARCHAR(50) NOT NULL CHECK (release_type IN ('buyer_confirmed', 'auto_released', 'admin_released', 'dispute_resolved')),
    released_amount DECIMAL(12,2) NOT NULL,
    service_fee_deducted DECIMAL(12,2) DEFAULT 0,
    seller_received DECIMAL(12,2) NOT NULL,
    release_reason TEXT,
    released_by UUID,
    released_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_release_escrow FOREIGN KEY (escrow_transaction_id) REFERENCES escrow_transactions(id) ON DELETE CASCADE,
    CONSTRAINT fk_release_user FOREIGN KEY (released_by) REFERENCES users(id)
);

-- Create payment notifications table
CREATE TABLE IF NOT EXISTS payment_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escrow_transaction_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    
    CONSTRAINT fk_notification_escrow FOREIGN KEY (escrow_transaction_id) REFERENCES escrow_transactions(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_user FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_escrow_status ON escrow_transactions(status);
CREATE INDEX IF NOT EXISTS idx_escrow_auto_release ON escrow_transactions(auto_release_at) WHERE status = 'delivered';
CREATE INDEX IF NOT EXISTS idx_escrow_buyer ON escrow_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_escrow_seller ON escrow_transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_escrow_item ON escrow_transactions(item_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_escrow_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    -- Set confirmation deadline when status changes to delivered
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        NEW.delivered_at = CURRENT_TIMESTAMP;
        NEW.confirmation_deadline = CURRENT_TIMESTAMP + INTERVAL '3 days';
        NEW.auto_release_at = CURRENT_TIMESTAMP + INTERVAL '14 days';
    END IF;
    
    -- Set released timestamp when payment is released
    IF NEW.status IN ('released', 'confirmed') AND OLD.status NOT IN ('released', 'confirmed') THEN
        NEW.released_at = CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for timestamp updates
DROP TRIGGER IF EXISTS trigger_update_escrow_timestamps ON escrow_transactions;
CREATE TRIGGER trigger_update_escrow_timestamps
    BEFORE UPDATE ON escrow_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_escrow_timestamps();

-- Insert sample escrow transaction for testing
INSERT INTO escrow_transactions (
    transaction_reference,
    item_id,
    buyer_id,
    seller_id,
    amount,
    service_fee,
    total_amount,
    delivery_option,
    status,
    paid_at
) VALUES (
    'ESC_' || EXTRACT(EPOCH FROM NOW())::bigint || '_TEST',
    (SELECT id FROM items LIMIT 1),
    (SELECT id FROM users WHERE email LIKE '%buyer%' LIMIT 1),
    (SELECT id FROM users WHERE email LIKE '%seller%' LIMIT 1),
    50000.00,
    7500.00,
    57500.00,
    'sendam',
    'paid',
    CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;
