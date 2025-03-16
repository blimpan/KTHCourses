CREATE OR REPLACE FUNCTION search_courses(
    search_term text, 
    periods text[], 
    pagination_offset integer, 
    limit_count integer
)
RETURNS TABLE (
    id bigint,
    course_code text,
    name text,
    ects_credits double precision,
    edu_level text,
    subject text,
    examiners text,
    school text,
    start_periods text,
    goals text,
    content text,
    total_count bigint
) AS $$
BEGIN
    -- Declare variable for the parsed search term
    DECLARE 
        ts_query tsquery;
    BEGIN
        -- Create the search term query
        ts_query := plainto_tsquery('english', search_term);

        RETURN QUERY
        WITH filtered_courses AS (
            SELECT DISTINCT ON (cm.id)  -- Ensure distinct by course ID
                cm.id, 
                cm.course_code, 
                cm.name, 
                cm.ects_credits, 
                cm.edu_level, 
                cm.subject, 
                cm.examiners, 
                cm.school, 
                cm.start_periods, 
                cm.goals, 
                cm.content,
                cm.full_text  -- Ensure full_text is included
            FROM courses_main cm
            JOIN course_title ct ON cm.course_code = ct.course_code
            JOIN course_starts cs ON cm.course_code = cs.course_code
            WHERE 
                (search_term IS NULL OR search_term = '' OR 
                 cm.course_code ILIKE '%' || search_term || '%'  -- Match course code
                 OR cm.name ILIKE '%' || search_term || '%'      -- Match course name
                 OR cm.full_text @@ ts_query  -- Full-text search for content
                )
              AND (array_length(periods, 1) IS NULL OR array_length(periods, 1) = 0 
                   OR cs.start_period = ANY(periods))  -- Filter by periods if provided
            ORDER BY cm.id  -- Ensures the correct row is selected for each id
        )
        SELECT 
            fc.id, fc.course_code, fc.name, fc.ects_credits, 
            fc.edu_level, fc.subject, fc.examiners, fc.school, 
            fc.start_periods, fc.goals, fc.content,
            COUNT(*) OVER() AS total_count
        FROM filtered_courses fc
        ORDER BY ts_rank(fc.full_text, ts_query) DESC,  -- Rank by relevance of full-text search
                 fc.id  -- Then order by course ID for consistency
        LIMIT limit_count OFFSET pagination_offset;  -- Pagination
    END;
END;
$$ LANGUAGE plpgsql;
