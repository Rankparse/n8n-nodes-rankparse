import type { INodeProperties } from 'n8n-workflow';
import { domainField, limitField } from './SharedFields';

const RESOURCE = 'domainIntelligence';

export const domainIntelligenceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'domainAuthority',
		displayOptions: { show: { resource: [RESOURCE] } },
		options: [
			{
				name: 'Domain Authority',
				value: 'domainAuthority',
				description: 'Get a 0-100 authority score enriched with RDAP + Tranco data (1 credit)',
				action: 'Get domain authority score',
				routing: { request: { method: 'GET', url: '/v1/domain-authority' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Domain Rank',
				value: 'domainRank',
				description: 'Get inbound edge count and unique linking domain metrics (2 credits)',
				action: 'Get domain rank metrics',
				routing: { request: { method: 'GET', url: '/v1/domain-rank' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Domain Overlap',
				value: 'domainOverlap',
				description: 'Find domains that link to 2-5 target domains at once (5 credits)',
				action: 'Find domains linking to multiple targets',
				routing: { request: { method: 'GET', url: '/v1/domain-overlap' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Similar Domains',
				value: 'similarDomains',
				description: 'Find domains that share linking domains with the target (5 credits)',
				action: 'Find similar domains',
				routing: { request: { method: 'GET', url: '/v1/similar-domains' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Competitor Gap',
				value: 'competitorGap',
				description: 'Find domains linking to a competitor but not to the target (5 credits)',
				action: 'Find competitor link gaps',
				routing: { request: { method: 'GET', url: '/v1/competitor-gap' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Link Audit',
				value: 'linkAudit',
				description: 'Composite backlink quality score, risk flags, and anchor profile in one call (8 credits)',
				action: 'Run a link profile audit',
				// LinkAudit responds with a flat object (domain, health_score, risk_flags, ...) - no `data` wrapper,
				// unlike every other endpoint. Pass the body through as a single item.
				routing: { request: { method: 'GET', url: '/v1/link-audit' } },
			},
			{
				name: 'Site Explorer',
				value: 'siteExplorer',
				description: 'Backlinks, authority, top pages, and anchor text in one call (10 credits)',
				action: 'Get a full site overview',
				routing: { request: { method: 'GET', url: '/v1/site-explorer' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
		],
	},
];

export const domainIntelligenceFields: INodeProperties[] = [
	domainField(RESOURCE, ['domainAuthority', 'domainRank', 'similarDomains', 'competitorGap', 'linkAudit', 'siteExplorer']),
	limitField(RESOURCE, ['domainOverlap']),
	limitField(RESOURCE, ['similarDomains'], { default: 100, maxValue: 100 }),
	limitField(RESOURCE, ['competitorGap'], { default: 50, maxValue: 200 }),
	{
		displayName: 'Domains',
		name: 'domains',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'example.com,competitor.com',
		description: 'Comma-separated domains to compare. Minimum 2, maximum 5.',
		displayOptions: { show: { resource: [RESOURCE], operation: ['domainOverlap'] } },
		routing: { request: { qs: { domains: '={{$value}}' } } },
	},
	{
		displayName: 'Competitor Domain (Vs)',
		name: 'vs',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'competitor.com',
		description: 'Competitor domain to compare against',
		displayOptions: { show: { resource: [RESOURCE], operation: ['competitorGap'] } },
		routing: { request: { qs: { vs: '={{$value}}' } } },
	},
];
