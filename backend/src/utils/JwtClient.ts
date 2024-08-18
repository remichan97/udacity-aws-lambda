import axios from "axios";
import * as https from "https";

class JwtClient {
	private Options: {
		strictSsl: boolean;
		jwtsUri: string;
	}

	constructor(options) {
		this.Options = {
			strictSsl: true,
			...options
		}
	}

	async getJwk()
	{
		const client = axios.create({
			httpsAgent: new https.Agent({
				rejectUnauthorized: this.Options.strictSsl,
			})
		});

		try {
			const response = await client.get(this.Options.jwtsUri, {
				headers: {
					"Content-Type": "application/json",
				}
			});
			console.log(response.data);
		} catch (e) {
			console.log(e);
		}


	}
}

export default JwtClient