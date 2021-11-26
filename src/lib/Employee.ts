import type { SubmittedHistory, UserProjects } from './utils/Types';

export default class Employee {
	private projects: UserProjects[];
	private billableHistory: SubmittedHistory[];

	constructor(private userId: string, private fullName: string) {}

	public getName(): string {
		return this.fullName;
	}

	public getUserId(): string {
		return this.userId;
	}

	public getProjects(): UserProjects[] {
		return this.projects;
	}

	public setCurrentProjects(updatedProjects: UserProjects[]): void {
		this.projects = updatedProjects;
	}

	public setBillableHistory(updatedHistory: SubmittedHistory[]): void {
		this.billableHistory = updatedHistory;
	}

	public getBillableHistory(): SubmittedHistory[] {
		return this.billableHistory;
	}
}
