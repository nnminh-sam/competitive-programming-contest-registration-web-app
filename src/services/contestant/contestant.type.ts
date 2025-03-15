export interface Contestant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  school_year: string;
  student_id: string;
  gender: string;
  team_id?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  username?: string;
}
