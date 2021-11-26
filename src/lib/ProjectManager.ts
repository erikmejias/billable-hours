import { Writable, writable } from 'svelte/store';
import Network from '$lib/network';
import { AIRTABLE_BASE, AIRTABLE_HOST, QUERY_PROJECTS, TABLES } from './utils/constants';
import { AIRTABLE_API_KEY } from './utils/dummy';
import type {
	AirtableEmployeeResult,
	AuthenticationStatus,
	BillableEntry,
	UserCredentials,
	AirtableProjectsResult,
	UserProjects,
	AirtableBillableEntry
} from './utils/Types';
import { sanitizeRateValue } from './utils/utils';

export class ProjectManager {
	private userID: string;
	private projectList = writable([]);

	// constructor(userId: string) {
	// 	this.userID = userId;
	// 	this.updateProjectList();
	// }

	public registerUser(userId: string): void {
		this.userID = userId;
		this.updateProjectList();
	}

	public getProjects(): Writable<any[]> {
		return this.projectList;
	}

	public async updateProjectList(): Promise<void> {
		const requestURL = `${AIRTABLE_HOST}${AIRTABLE_BASE}/${QUERY_PROJECTS}`;
		const headers: Headers = new Headers();

		headers.append('Authorization', `Bearer ${AIRTABLE_API_KEY}`);
		const requestOptions: RequestInit = {
			method: 'GET',
			headers: headers
		};
		const result = ((await Network.getHTTP(
			requestURL,
			requestOptions
		)) as unknown) as AirtableProjectsResult;

		const recordsList: UserProjects[] = result.records.map((record) => {
			// Makes sure there is someone assigned to this project.
			if (record.fields['Employees 👇']) {
				return <UserProjects>{
					id: record.id,
					checked: record.fields['Dashboard 👇'],
					employeeID: record.fields['Employees 👇'][0],
					projectName: record.fields.Name,
					rateCard: sanitizeRateValue(record.fields['Rate card'])
				};
			}
		});

		let userProjects: UserProjects[] = [];
		console.log(recordsList);

		userProjects = recordsList.filter(
			(project) => project !== undefined && project.employeeID === this.userID && project.checked
		);

		console.log(userProjects);

		this.projectList.set(userProjects);
	}

	// Call the API and retrieve this user projects.
	static async authUser(userCredentials: UserCredentials): Promise<AuthenticationStatus> {
		const requestURL = `${AIRTABLE_HOST}${AIRTABLE_BASE}/${TABLES.EMPLOYEES}`;
		const headers: Headers = new Headers();
		let status = false;
		let userID: string;
		let userName: string;

		headers.append('Authorization', `Bearer ${AIRTABLE_API_KEY}`);
		const requestOptions: RequestInit = {
			method: 'GET',
			headers: headers
		};

		const data = ((await Network.getHTTP(
			requestURL,
			requestOptions
		)) as unknown) as AirtableEmployeeResult;

		const checkUser = (element) => element.fields.User === userCredentials.email;
		const userExists: number = data.records.findIndex(checkUser);

		if (
			userExists !== -1 &&
			data.records[userExists].fields.Password === userCredentials.password
		) {
			status = true;
			userID = data.records[userExists].id;
			userName = data.records[userExists].fields['Slack Full Name'];
		}

		return { status, userID, userName };
	}

	// Call the API and retrieve this user projects.
	static async getProjects(userID: string): Promise<UserProjects[]> {
		const requestURL = `${AIRTABLE_HOST}${AIRTABLE_BASE}/${QUERY_PROJECTS}`;
		const headers: Headers = new Headers();

		headers.append('Authorization', `Bearer ${AIRTABLE_API_KEY}`);
		const requestOptions: RequestInit = {
			method: 'GET',
			headers: headers
		};
		// TODO: Figure out why it needs unknown parsing before the correct type.
		const result = ((await Network.getHTTP(
			requestURL,
			requestOptions
		)) as unknown) as AirtableProjectsResult;

		const recordsList: UserProjects[] = result.records.map((record) => {
			// Makes sure there is someone assigned to this project.
			if (record.fields['Employees 👇']) {
				return <UserProjects>{
					id: record.id,
					checked: record.fields['Dashboard 👇'],
					employeeID: record.fields['Employees 👇'][0],
					projectName: record.fields.Name,
					rateCard: sanitizeRateValue(record.fields['Rate card'])
				};
			}
		});

		let userProjects: UserProjects[] = [];
		console.log(recordsList);

		userProjects = recordsList.filter(
			(project) => project !== undefined && project.employeeID === userID && project.checked
		);

		console.log(userProjects);

		return userProjects;
	}

	// Call the API and post new billable information
	static async submitBillableTime(billableEntry: BillableEntry): Promise<number> {
		console.log('Submit new entries', billableEntry.project);

		const data: AirtableBillableEntry = {
			fields: {
				'SLA - Dashboard': [billableEntry.project.id],
				'Task description': billableEntry.workDescription,
				'Total Time spent - HH.MM': billableEntry.time,
				'Rate card': billableEntry.project.rateCard
			}
		};
		const requestURL = `${AIRTABLE_HOST}${AIRTABLE_BASE}/${TABLES.TASKS}`;
		const headers: Headers = new Headers();

		headers.append('Authorization', `Bearer ${AIRTABLE_API_KEY}`);
		headers.append('Content-Type', 'application/json');

		const requestOptions: RequestInit = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(data)
		};

		console.log(data);

		const result = await Network.postHTTP(requestURL, requestOptions);
		return result;
	}
}
