import { Contestant } from "../contestant";

export interface Team {
  id: string;
  name: string;
  created_at: Date;
  members: Contestant[];
  updated_at?: Date;
}

export interface GetTeamListPayload extends Partial<Team> {
  page: number;
  limit: number;
}
