export interface UserProfile {
	fullName: string;
	userID: string;
}

export interface UserCredentials {
	email: string;
	password: string;
}

export interface AuthenticationStatus {
	status: boolean;
	userID: string;
	userName?: string;
}

export interface UserProjects {
	id: string;
	checked: boolean;
	employeeID: string;
	projectName: string;
	createdTime: string;
}

export interface BillableEntry {
	date: string;
	time: number;
	workDescription: string;
	project?: UserProjects;
}

export interface SubmittedHistory {
	employeeId: string;
	date: string;
	time: number;
	workDescription: string;
	project: string;
}

export interface CreateBillableResult {
	selection: 'cancel' | 'create';
	billable?: BillableEntry;
}

// AIRTABLE STRUCTURE DEFINITIONS

export interface AirtableEmployeeResult {
	records: [
		{
			id: string;
			fields: {
				Password: string;
				'Slack Full Name': string;
				User: string;
				'JW Dashboard': string[];
			};
			createdTime: string;
		}
	];
}

export interface AirtableProjectsResult {
	records: [
		{
			id: string;
			fields: {
				'Dashboard 👇': boolean;
				'Projects 👇': string[];
				'Employees 👇': string[];
				'Dashboard (Staff Assignments)': string;
				Contracts: string[];
			};
			createdTime: string;
		}
	];
}

export interface AirtableHistoryResult {
	records: [
		{
			id: string;
			fields: {
				Date: string;
				'Employees 👇 (from SLA - Dashboard)': string[];
				'Task description': string;
				'Total Time spent - HH.MM': number;
				'SLA - Dashboard': string[];
			};
			createdTime: string;
		}
	];
}

export interface AirtableBillableEntry {
	fields: {
		'SLA - Dashboard'?: string[];
		'Task description': string;
		'Total Time spent - HH.MM': number;
		Date: string;
	};
}
