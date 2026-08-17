// Hand-authored to match supabase/migrations/*.sql until a live project exists
// to generate this from (`supabase gen types typescript --linked > src/lib/supabase/types.ts`).
// Keep this file in sync with the migrations whenever they change. Shape
// (Tables/Views/Functions/Enums/CompositeTypes, Relationships per table)
// mirrors exactly what the Supabase CLI generator produces — postgrest-js's
// generics require Views/Functions to be present even when empty, and each
// table needs a Relationships array, or type inference silently degrades.

export type UserRole = "student" | "instructor" | "admin";
export type CourseStatus = "draft" | "published" | "archived";
export type EnrollmentStatus = "active" | "completed" | "refunded" | "revoked";
export type PaymentSubmissionStatus = "pending" | "approved" | "rejected";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          display_name: string;
          email: string | null;
          avatar_url: string | null;
          headline: string | null;
          bio: string | null;
          phone: string | null;
          country: string | null;
          activated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          display_name: string;
          email?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          phone?: string | null;
          country?: string | null;
          activated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          category: string | null;
          status: CourseStatus;
          instructor_id: string | null;
          price_cents: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          category?: string | null;
          status?: CourseStatus;
          instructor_id?: string | null;
          price_cents?: number;
          currency?: string;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey";
            columns: ["instructor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          status: EnrollmentStatus;
          progress_percent: number;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          status?: EnrollmentStatus;
          progress_percent?: number;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["enrollments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "enrollments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          created_at: string;
          handled: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          handled?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          unsubscribed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;
        Relationships: [];
      };
      payment_submissions: {
        Row: {
          id: string;
          student_id: string;
          method: string;
          reference: string;
          status: PaymentSubmissionStatus;
          submitted_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          method?: string;
          reference: string;
          status?: PaymentSubmissionStatus;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["payment_submissions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "payment_submissions_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_submissions_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      job_listings: {
        Row: {
          id: string;
          title: string;
          company: string;
          location: string | null;
          remote_type: string;
          skills: string[];
          apply_url: string | null;
          source: string | null;
          application_deadline: string | null;
          posted_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          company: string;
          location?: string | null;
          remote_type?: string;
          skills?: string[];
          apply_url?: string | null;
          source?: string | null;
          application_deadline?: string | null;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["job_listings"]["Insert"]>;
        Relationships: [];
      };
      scholarships: {
        Row: {
          id: string;
          name: string;
          organization: string;
          country: string | null;
          degree_level: string | null;
          eligibility: string | null;
          funding_details: string | null;
          application_requirements: string | null;
          application_url: string | null;
          opens_at: string | null;
          closes_at: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          organization: string;
          country?: string | null;
          degree_level?: string | null;
          eligibility?: string | null;
          funding_details?: string | null;
          application_requirements?: string | null;
          application_url?: string | null;
          opens_at?: string | null;
          closes_at?: string | null;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["scholarships"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      admin_review_payment: {
        Args: {
          p_submission_id: string;
          p_decision: PaymentSubmissionStatus;
          p_notes: string | null;
        };
        Returns: undefined;
      };
    };
    Enums: {
      user_role: UserRole;
      course_status: CourseStatus;
      enrollment_status: EnrollmentStatus;
      payment_submission_status: PaymentSubmissionStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Enrollment = Database["public"]["Tables"]["enrollments"]["Row"];
export type PaymentSubmission = Database["public"]["Tables"]["payment_submissions"]["Row"];
export type JobListing = Database["public"]["Tables"]["job_listings"]["Row"];
export type Scholarship = Database["public"]["Tables"]["scholarships"]["Row"];
