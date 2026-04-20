export interface ScheduleMeetingDTO {
	projectId: string;
	title: string;
	link?: string;
	date: Date;
	type: "single" | "group";
	createdBy: string;
	participants?: string[];
	duration?: number;
}
