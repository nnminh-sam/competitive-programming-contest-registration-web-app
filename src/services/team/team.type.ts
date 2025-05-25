import { Contestant } from "../contestant";

export interface Team {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  members: Contestant[];
}

export interface TeamResponse {
  data: Team;
  isError: boolean;
  message?: string;
}

export interface GetTeamListPayload extends Partial<Team> {
  page: number;
  limit: number;
}

export interface UpdateTeamPayload {
  name?: string;
  description?: string;
  members?: string[];
}
