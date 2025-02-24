CREATE OR REPLACE FUNCTION search_courses(search_term text, periods text[], limit_count integer)
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
    content text
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT cm.*
    FROM courses_main cm
    JOIN course_title ct ON cm.course_code = ct.course_code
    JOIN course_starts cs ON cm.course_code = cs.course_code
    WHERE (search_term IS NULL OR search_term = '' OR ct.title ILIKE '%' || search_term || '%')
      AND (array_length(periods, 1) IS NULL OR array_length(periods, 1) = 0 OR cs.start_period = ANY(periods))
    ORDER BY cm.id
    LIMIT limit_count;  -- Limit the number of returned rows
END;
$$ LANGUAGE plpgsql;