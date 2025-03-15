export interface Affiliation {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface GetAffiliationListPayload extends Partial<Affiliation> {
  page: number;
  limit: number;
}
