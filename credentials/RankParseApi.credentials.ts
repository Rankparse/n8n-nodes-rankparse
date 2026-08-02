import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RankParseApi implements ICredentialType {
	name = 'rankParseApi';

	displayName = 'RankParse API';

	documentationUrl = 'https://rankparse.com/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your RankParse API key (starts with "rp_"). Find it at https://rankparse.com/dashboard/keys.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.rankparse.com',
			url: '/v1/credits',
			method: 'GET',
		},
	};
}
