-- Row Level Security (RLS) Policies for SQL Injection Protection
-- Execute these in your Supabase SQL Editor

-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Enable RLS on notes table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own tasks
CREATE POLICY "Users can view own tasks" ON tasks
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert their own tasks
CREATE POLICY "Users can insert own tasks" ON tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own tasks
CREATE POLICY "Users can update own tasks" ON tasks
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can only delete their own tasks
CREATE POLICY "Users can delete own tasks" ON tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Policy: Users can only see notes for their own tasks
CREATE POLICY "Users can view own task notes" ON notes
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM tasks 
            WHERE tasks.id = notes.task_id 
            AND tasks.user_id = auth.uid()
        )
    );

-- Policy: Users can only insert notes for their own tasks
CREATE POLICY "Users can insert own task notes" ON notes
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM tasks 
            WHERE tasks.id = notes.task_id 
            AND tasks.user_id = auth.uid()
        )
    );

-- Policy: Users can only update notes for their own tasks
CREATE POLICY "Users can update own task notes" ON notes
    FOR UPDATE USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM tasks 
            WHERE tasks.id = notes.task_id 
            AND tasks.user_id = auth.uid()
        )
    );

-- Policy: Users can only delete notes for their own tasks
CREATE POLICY "Users can delete own task notes" ON notes
    FOR DELETE USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM tasks 
            WHERE tasks.id = notes.task_id 
            AND tasks.user_id = auth.uid()
        )
    );

-- Additional security functions
CREATE OR REPLACE FUNCTION validate_task_input(
    title_input TEXT,
    description_input TEXT DEFAULT NULL,
    notes_input TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Length validations
    IF LENGTH(title_input) < 1 OR LENGTH(title_input) > 200 THEN
        RAISE EXCEPTION 'Title must be between 1 and 200 characters';
    END IF;
    
    IF description_input IS NOT NULL AND LENGTH(description_input) > 1000 THEN
        RAISE EXCEPTION 'Description cannot exceed 1000 characters';
    END IF;
    
    IF notes_input IS NOT NULL AND LENGTH(notes_input) > 2000 THEN
        RAISE EXCEPTION 'Notes cannot exceed 2000 characters';
    END IF;
    
    -- Basic SQL injection pattern detection
    IF title_input ~* '(select|insert|update|delete|drop|union|alter|create|exec|execute|--|\/\*|\*\/|''|"|;)' THEN
        RAISE EXCEPTION 'Invalid characters detected in title';
    END IF;
    
    RETURN TRUE;
END;
$$;

-- Updated secure task creation function
CREATE OR REPLACE FUNCTION create_task_secure(
    p_title TEXT,
    p_description TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_status_name TEXT DEFAULT 'To Do',
    p_priority_level TEXT DEFAULT 'Routine',
    p_deadline TIMESTAMPTZ DEFAULT NULL,
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    task_id UUID;
    user_uuid UUID;
BEGIN
    -- Get current user
    user_uuid := auth.uid();
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated';
    END IF;
    
    -- Validate inputs
    PERFORM validate_task_input(p_title, p_description, p_notes);
    
    -- Validate status and priority
    IF p_status_name NOT IN ('To Do', 'In Progress', 'Done') THEN
        RAISE EXCEPTION 'Invalid status';
    END IF;
    
    IF p_priority_level NOT IN ('Urgent', 'Important', 'Routine') THEN
        RAISE EXCEPTION 'Invalid priority level';
    END IF;
    
    -- Insert task
    INSERT INTO tasks (
        title, description, status_name, priority_level,
        deadline, start_date, end_date, user_id
    ) VALUES (
        p_title, p_description, p_status_name, p_priority_level,
        p_deadline, p_start_date, p_end_date, user_uuid
    ) RETURNING id INTO task_id;
    
    -- Insert note if provided
    IF p_notes IS NOT NULL AND LENGTH(TRIM(p_notes)) > 0 THEN
        INSERT INTO notes (task_id, notes, user_id)
        VALUES (task_id, p_notes, user_uuid);
    END IF;
    
    RETURN task_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION validate_task_input(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION create_task_secure(TEXT, TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;