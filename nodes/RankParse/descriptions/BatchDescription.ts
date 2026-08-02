import type { INodeProperties } from 'n8n-workflow';

const RESOURCE = 'batch';

export const batchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'batchBacklinks',
		displayOptions: { show: { resource: [RESOURCE] } },
		options: [
			{
				name: 'Batch Backlinks',
				value: 'batchBacklinks',
				description: 'Look up backlinks for up to 50 domains in one request (2 credits per successfully queried domain)',
				action: 'Look up backlinks for multiple domains',
				routing: {
					request: { method: 'POST', url: '/v1/batch' },
					output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] },
				},
			},
		],
	},
];

export const batchFields: INodeProperties[] = [
	{
		displayName: 'Domains',
		name: 'domains',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'example.com,another.com,third.com',
		description: 'Comma-separated list of domains to look up backlinks for (1-50 domains)',
		displayOptions: { show: { resource: [RESOURCE], operation: ['batchBacklinks'] } },
		routing: {
			send: {
				property: 'domains',
				type: 'body',
				value: '={{$value.split(",").map((d) => d.trim()).filter((d) => d.length > 0)}}',
			},
		},
	},
];
