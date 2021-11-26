import Network from '$lib/network';
import {
	AIRTABLE_BASE,
	AIRTABLE_HOST,
	QUERY_HISTORY,
	QUERY_PROJECTS,
	TABLES,
	USER_FULLNAME,
	USER_PROFILE
} from '$lib/utils/constants';
import { AIRTABLE_API_KEY } from '$lib/utils/dummy';
import type {
	AirtableBillableEntry,
	AirtableEmployeeResult,
	AirtableHistoryResult,
	AirtableProjectsResult,
	AuthenticationStatus,
	BillableEntry,
	SubmittedHistory,
	UserCredentials,
	UserProjects
} from '$lib/utils/Types';
import { sanitizeRateValue } from '$lib/utils/utils';

export async function authenticateUser(
	userCredentials?: UserCredentials
): Promise<AuthenticationStatus> {
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

	if (userExists !== -1 && data.records[userExists].fields.Password === userCredentials.password) {
		status = true;
		userID = data.records[userExists].id;
		userName = data.records[userExists].fields['Slack Full Name'];
	}

	// Save this user to session storage
	saveUserSession({ status, userID, userName });

	return { status, userID, userName };
}

export function saveUserSession(authStatus: AuthenticationStatus): void {
	// Save user on SessionStorage.
	const user = authStatus.userID;
	sessionStorage.setItem(USER_PROFILE, user);
	sessionStorage.setItem(USER_FULLNAME, authStatus.userName);
}

export function getUserSession(): AuthenticationStatus {
	let status = false;
	const userID = sessionStorage.getItem(USER_PROFILE);
	const userName = sessionStorage.getItem(USER_FULLNAME);

	if (userID && userID) status = true;

	return { status, userID, userName };
}

// Call the API and retrieve this user projects.
export async function getProjects(userID: string): Promise<UserProjects[]> {
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
				projectName: record.fields['Dashboard (Staff Assignments)']
			};
		}
	});

	let userProjects: UserProjects[] = [];

	userProjects = recordsList.filter(
		(project) => project !== undefined && project.employeeID === userID && project.checked
	);

	return userProjects;
}

// Call the API and post new billable information
export async function submitBillableTime(billableEntry: BillableEntry): Promise<number> {
	let data: AirtableBillableEntry;
	// TODO: Refactor
	if (billableEntry.project) {
		data = {
			fields: {
				Date: billableEntry.date,
				'SLA - Dashboard': [billableEntry.project.id],
				'Task description': billableEntry.workDescription,
				'Total Time spent - HH.MM': billableEntry.time
			}
		};
	} else {
		data = {
			fields: {
				Date: billableEntry.date,
				'Task description': billableEntry.workDescription,
				'Total Time spent - HH.MM': billableEntry.time
			}
		};
	}
	console.log('Submit new entries', billableEntry.project);

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

// Call the API and post new billable information
export async function getBillableHistory(userId: string): Promise<SubmittedHistory[]> {
	const requestURL = `${AIRTABLE_HOST}${AIRTABLE_BASE}/${QUERY_HISTORY}`;
	const headers: Headers = new Headers();

	headers.append('Authorization', `Bearer ${AIRTABLE_API_KEY}`);
	const requestOptions: RequestInit = {
		method: 'GET',
		headers: headers
	};

	const result = ((await Network.getHTTP(
		requestURL,
		requestOptions
	)) as unknown) as AirtableHistoryResult;

	const recordsList: SubmittedHistory[] = result.records.map((record) => {
		// Makes sure there is someone assigned to this project.

		if (record.fields['SLA - Dashboard'] && record.fields['Employees 👇 (from SLA - Dashboard)']) {
			// TODO: Get Project Name instead of just returning the Project ID
			return <SubmittedHistory>{
				employeeId: record.fields['Employees 👇 (from SLA - Dashboard)'][0],
				date: record.fields.Date,
				time: record.fields['Total Time spent - HH.MM'],
				workDescription: record.fields['Task description'],
				project: record.fields['SLA - Dashboard'][0]
			};
		}
	});

	let userHistory: SubmittedHistory[] = [];

	userHistory = recordsList.filter(
		(project) =>
			project !== undefined && project.employeeId === userId && project.date && project.time
	);

	return userHistory;
}
