import type { INodeProperties } from 'n8n-workflow';

const RESOURCE = 'dashboard';

export const dashboardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'credits',
		displayOptions: { show: { resource: [RESOURCE] } },
		options: [
			{
				name: 'Get Credit Balance',
				value: 'credits',
				description: 'Check the current credit balance for this API key (0 credits)',
				action: 'Get credit balance',
				routing: { request: { method: 'GET', url: '/v1/credits' } },
			},
			{
				name: 'Get Account Profile',
				value: 'me',
				description: 'Get the account profile and credit balance for this API key (0 credits)',
				action: 'Get account profile',
				routing: { request: { method: 'GET', url: '/v1/me' } },
			},
			{
				name: 'List API Keys',
				value: 'listKeys',
				description: 'List this account\'s API keys, masked (0 credits)',
				action: 'List API keys',
				routing: { request: { method: 'GET', url: '/v1/keys' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'keys' } }] } },
			},
			{
				name: 'Get Usage Log',
				value: 'usage',
				description: 'Get paginated usage log entries for this account (0 credits)',
				action: 'Get usage log',
				routing: { request: { method: 'GET', url: '/v1/usage' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'usage' } }] } },
			},
			{
				name: 'Get Credit Pricing',
				value: 'pricing',
				description: 'Get current credit pack pricing tiers - public, no auth required (0 credits)',
				action: 'Get credit pricing',
				routing: { request: { method: 'GET', url: '/v1/pricing' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'tiers' } }] } },
			},
		],
	},
];

export const dashboardFields: INodeProperties[] = [
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 200 },
		description: 'Max number of usage log entries to return (max 200)',
		displayOptions: { show: { resource: [RESOURCE], operation: ['usage'] } },
		routing: { request: { qs: { limit: '={{$value}}' } } },
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Number of usage log entries to skip',
		displayOptions: { show: { resource: [RESOURCE], operation: ['usage'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
];
