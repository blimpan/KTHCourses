

export interface Course { 
    ai_summary: string;
    content: string;
    course_code: string;
    ects_credits: number;
    edu_level: string;
    examiners: string;
    goals: string;
    id: number;
    name: string;
    school: string;
    start_periods: string;
    subject: string;
    [key: string]: any;
}