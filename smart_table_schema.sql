-- Create the smart_timetable_entries table
CREATE TABLE public.smart_timetable_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject_name TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('theory', 'lab')),
    day TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number TEXT,
    slot_code TEXT,
    slot_label TEXT,
    credit NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.smart_timetable_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own smart entries" 
ON public.smart_timetable_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own smart entries" 
ON public.smart_timetable_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own smart entries" 
ON public.smart_timetable_entries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own smart entries" 
ON public.smart_timetable_entries FOR DELETE 
USING (auth.uid() = user_id);
