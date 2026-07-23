export type Filter = {
	assignee?: string;
	show_completed?: boolean;
	labels?: string[];
	due_date?: Date | null;
};
