-- Create episodes table
CREATE TABLE IF NOT EXISTS episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id VARCHAR(20) UNIQUE NOT NULL, -- Display ID like "Single - 123", "Double - 456"
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    treatment_id UUID REFERENCES treatments(id) ON DELETE SET NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE,
    status VARCHAR(50) DEFAULT 'active', -- active, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_episodes_patient_id ON episodes(patient_id);
CREATE INDEX IF NOT EXISTS idx_episodes_doctor_id ON episodes(doctor_id);
CREATE INDEX IF NOT EXISTS idx_episodes_treatment_id ON episodes(treatment_id);
CREATE INDEX IF NOT EXISTS idx_episodes_check_in_date ON episodes(check_in_date);
CREATE INDEX IF NOT EXISTS idx_episodes_status ON episodes(status);
