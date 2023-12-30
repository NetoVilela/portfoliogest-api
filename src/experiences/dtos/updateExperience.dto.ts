export interface UpdateExperienceDto {
  name: string;
  description: string;
  companyName: string;
  monthStart: number;
  yearStart: number;
  monthEnd: number;
  yearEnd: number;
  currentJob: boolean;
  status: boolean;
}
