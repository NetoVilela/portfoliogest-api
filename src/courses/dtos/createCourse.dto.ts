export interface CreateCourseDto {
  name: string;
  institution: string;
  institutionAcronym: string;
  degreeId: number;
  situationId: number;
  monthStart: number;
  yearStart: number;
  monthEnd: number;
  yearEnd: number;
}
