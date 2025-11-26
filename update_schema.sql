-- Add new columns for FFCS support if they don't exist
ALTER TABLE public.timetable_entries 
ADD COLUMN IF NOT EXISTS slot_code TEXT,
ADD COLUMN IF NOT EXISTS slot_label TEXT;

-- Optional: Ensure the type check constraint exists (if not already present)
-- Note: Modifying constraints on existing tables can be tricky, so we'll skip enforcing the check constraint modification 
-- unless explicitly needed, to avoid further errors. The application logic handles the type validation.
