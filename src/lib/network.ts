export default class Network {
	static async getHTTP(requestURL: string, requestOptions: RequestInit): Promise<JSON> {
		try {
			const data = await fetch(requestURL, requestOptions);
			const dataResults = await data.json();

			return dataResults;
		} catch (error) {
			console.log(error);
		}
	}
	static async postHTTP(requestURL: string, requestOptions: RequestInit): Promise<number> {
		try {
			const data = await fetch(requestURL, requestOptions);
			return data.status;
		} catch (error) {
			console.log(error);
		}
	}
}
