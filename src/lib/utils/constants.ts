const DEV_AIRTABLE_BASE = 'appj6wjZv8c5qE2Ub';
const PROD_AIRTABLE_BASE = 'appujCdXb429eypFL';

export enum TABLES {
	EMPLOYEES = 'FS Team',
	CLIENTS = 'Clients',
	PROJECTS = 'Projects',
	DASHBOARD = 'Dashboard',
	TASKS = 'Tasks'
}
export const AIRTABLE_HOST = 'https://api.airtable.com/v0/';
export const AIRTABLE_BASE = PROD_AIRTABLE_BASE;
export const QUERY_PROJECTS = TABLES.DASHBOARD;
export const QUERY_HISTORY = TABLES.TASKS;

export const STATUS_DEFAULT = 0;
export const STATUS_SUCCESS = 1;
export const STATUS_FAIL = 2;
export const USER_PROFILE = 'userProfile';
export const USER_FULLNAME = 'userFullName';
export const CREATE_BILLABLE_EVENT = 'createBillableEntry';
