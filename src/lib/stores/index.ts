import Employee from '$lib/Employee';
import type { BillableEntry, AuthenticationStatus } from '$lib/utils/Types';
import { writable } from 'svelte/store';
import {
	authenticateUser,
	getBillableHistory,
	getProjects,
	getUserSession,
	submitBillableTime
} from '$lib/api';

// Defining a custom writable store for employees.
const createEmployeeRecord = () => {
	const { subscribe, set, update } = writable<Employee>();
	let authStatus: AuthenticationStatus;
	let employee: Employee;

	return {
		subscribe,
		/**
		 * Authenticate the user with their credentials.
		 * @param email @param password parameters to auhenticate.
		 * If successful, the user details will be saved to Session Storage.
		 */
		auth: async (email: string, password: string) => {
			// Check user credentials to authenticate
			authStatus = await authenticateUser({ email, password });

			if (authStatus.status === true) {
				employee = new Employee(authStatus.userID, authStatus.userName);
				set(employee);
			}
		},
		/**
		 * Authenticate the user session checking Session Storage.
		 * If successful, the user details will be saved to Session Storage.
		 */
		userSession: async () => {
			// Check session storage to retrieve user authentication
			authStatus = getUserSession();

			if (authStatus.status === true) {
				employee = new Employee(authStatus.userID, authStatus.userName);
				set(employee);
			}
		},
		/**
		 * Fetch and update available projects to this user.
		 */
		fetchProjects: async () => {
			const currentProjects = await getProjects(authStatus.userID);
			const billableHistory = await getBillableHistory(employee.getUserId());

			// const updatedEmployee:
			update((employee) => {
				employee.setCurrentProjects(currentProjects);
				employee.setBillableHistory(billableHistory);
				return employee;
			});
		},
		/**
		 * Save a new billable entry to the Airtable database.
		 * @param billableEntry with the details for this transaction.
		 * @returns A number that indicates the result.
		 */
		submitBillableTime: async (billableEntry: BillableEntry) => {
			const status = await submitBillableTime(billableEntry);

			return status;
		}
	};
};

export const employeeRecord = createEmployeeRecord();
