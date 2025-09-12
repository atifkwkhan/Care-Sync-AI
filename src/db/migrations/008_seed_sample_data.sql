-- Insert sample doctors
INSERT INTO doctors (first_name, last_name, email, specialty, license_number) VALUES
('Petra', 'Winsburry', 'petra.winsburry@caresync.ai', 'General Medicine', 'MD001'),
('Olivia', 'Martinez', 'olivia.martinez@caresync.ai', 'Cardiology', 'MD002'),
('Dr. Sarah', 'Johnson', 'sarah.johnson@caresync.ai', 'Pediatrics', 'MD003'),
('Dr. Michael', 'Chen', 'michael.chen@caresync.ai', 'Dermatology', 'MD004'),
('Dr. Emily', 'Davis', 'emily.davis@caresync.ai', 'Internal Medicine', 'MD005')
ON CONFLICT (email) DO NOTHING;

-- Insert sample treatments
INSERT INTO treatments (name, description, category, duration_minutes) VALUES
('Routine Check-Up', 'General health examination and consultation', 'General', 30),
('Cardiac Consultation', 'Heart health assessment and consultation', 'Cardiology', 45),
('Pediatric Check-Up', 'Child health examination and vaccination', 'Pediatrics', 25),
('Skin Allergy', 'Allergy testing and treatment consultation', 'Dermatology', 40),
('Follow-Up Visit', 'Post-treatment follow-up consultation', 'General', 20),
('Emergency Consultation', 'Urgent medical consultation', 'Emergency', 60)
ON CONFLICT DO NOTHING;

-- Insert sample patients
INSERT INTO patients (patient_id, first_name, last_name, date_of_birth, email, phone, status) VALUES
('301', 'Caren', 'G. Simpson', '1988-03-15', 'caren.simpson@email.com', '+1-555-0101', 'active'),
('302', 'Edgar', 'Warrow', '1978-07-22', 'edgar.warrow@email.com', '+1-555-0102', 'active'),
('303', 'Queen', 'Lawnston', '1992-11-08', 'queen.lawnston@email.com', '+1-555-0103', 'active'),
('304', 'Alice', 'Mitchell', '1985-05-14', 'alice.mitchell@email.com', '+1-555-0104', 'active'),
('305', 'Mikhail', 'Morozov', '1979-09-30', 'mikhail.morozov@email.com', '+1-555-0105', 'active'),
('306', 'Omar', 'Ali', '1991-12-03', 'omar.ali@email.com', '+1-555-0106', 'active'),
('307', 'Camila', 'Alvarez', '1987-04-18', 'camila.alvarez@email.com', '+1-555-0107', 'active'),
('308', 'Ocean', 'Jane Lupre', '1995-08-25', 'ocean.lupre@email.com', '+1-555-0108', 'new_patient'),
('309', 'Mateus', 'Fernandes', '1993-01-12', 'mateus.fernandes@email.com', '+1-555-0109', 'new_patient'),
('310', 'Thabo', 'van Rooyen', '1986-06-07', 'thabo.rooyen@email.com', '+1-555-0110', 'new_patient'),
('311', 'Shane', 'Riddick', '1980-10-20', 'shane.riddick@email.com', '+1-555-0111', 'inactive'),
('312', 'Pari', 'Desai', '1989-02-28', 'pari.desai@email.com', '+1-555-0112', 'inactive')
ON CONFLICT (patient_id) DO NOTHING;

-- Insert sample episodes (patient visits)
INSERT INTO episodes (episode_id, patient_id, doctor_id, treatment_id, check_in_date, status) 
SELECT 
    CASE 
        WHEN RANDOM() > 0.5 THEN 'Single - ' || LPAD((ROW_NUMBER() OVER())::text, 3, '0')
        ELSE 'Double - ' || LPAD((ROW_NUMBER() OVER())::text, 3, '0')
    END as episode_id,
    p.id as patient_id,
    d.id as doctor_id,
    t.id as treatment_id,
    CURRENT_DATE - INTERVAL '1 day' * (RANDOM() * 30)::int as check_in_date,
    'active' as status
FROM patients p
CROSS JOIN LATERAL (
    SELECT id FROM doctors ORDER BY RANDOM() LIMIT 1
) d
CROSS JOIN LATERAL (
    SELECT id FROM treatments ORDER BY RANDOM() LIMIT 1
) t
WHERE p.patient_id IN ('301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312')
ON CONFLICT DO NOTHING;
