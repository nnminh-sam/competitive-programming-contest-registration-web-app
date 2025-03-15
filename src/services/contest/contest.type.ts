export interface Contest {
  id: string;
  name: string;
  description: string;
  start_at: string;
  duration: number;
  formal_name: string;
  banner: string;
  created_at: string;
  updated_at: string;
  type: "Single" | "Team";
}

export interface GetContestListPayload extends Partial<Contest> {
  page: number;
  limit: number;
}
