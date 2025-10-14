-- SQL Functions to create in Supabase SQL Editor

-- Function 1: Get tasks with notes using parameters
CREATE OR REPLACE FUNCTION get_tasks_with_notes(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  status_name TEXT,
  priority_level TEXT,
  deadline TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  user_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  notes TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.title,
    t.description,
    t.status_name,
    t.priority_level,
    t.deadline,
    t.start_date,
    t.end_date,
    t.user_id,
    t.created_at,
    t.updated_at,
    n.note as notes
  FROM tasks t
  LEFT JOIN notes n ON t.id = n.task_id
  WHERE t.user_id = p_user_id
  ORDER BY t.created_at DESC;
END;
$$;

-- Function 2: Alternative approach with JSON aggregation
CREATE OR REPLACE FUNCTION get_user_tasks_with_notes(user_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', t.id,
      'title', t.title,
      'description', t.description,
      'status_name', t.status_name,
      'priority_level', t.priority_level,
      'deadline', t.deadline,
      'start_date', t.start_date,
      'end_date', t.end_date,
      'user_id', t.user_id,
      'created_at', t.created_at,
      'updated_at', t.updated_at,
      'notes', n.note
    ) ORDER BY t.created_at DESC
  )
  INTO result
  FROM tasks t
  LEFT JOIN notes n ON t.id = n.task_id
  WHERE t.user_id = user_id_param;
  
  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_tasks_with_notes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_tasks_with_notes(UUID) TO authenticated;