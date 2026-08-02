import type { INodeProperties } from 'n8n-workflow';
import { domainField, limitField, urlField } from './SharedFields';

const RESOURCE = 'pageSite';

export const pageSiteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'pageSeo',
		displayOptions: { show: { resource: [RESOURCE] } },
		options: [
			{
				name: 'Page SEO',
				value: 'pageSeo',
				description: 'Real-time SEO audit of a URL: meta tags, Open Graph, JSON-LD, headings, links (3 credits)',
				action: 'Get a full SEO audit for a URL',
				routing: { request: { method: 'GET', url: '/v1/page-seo' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Page Performance',
				value: 'pagePerformance',
				description: 'Core Web Vitals and Lighthouse scores via PageSpeed Insights (3 credits, charged only on success)',
				action: 'Get page performance and core web vitals',
				routing: { request: { method: 'GET', url: '/v1/page-performance' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Tech Stack',
				value: 'techStack',
				description: 'Real-time detected server, CMS, and framework signals (2 credits)',
				action: 'Get the detected tech stack for a domain',
				routing: { request: { method: 'GET', url: '/v1/tech-stack' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Site Health',
				value: 'siteHealth',
				description: 'Real-time HTTPS, HSTS, redirect, and security header check (2 credits)',
				action: 'Run a real-time site health check',
				routing: { request: { method: 'GET', url: '/v1/site-health' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Sitemap',
				value: 'sitemap',
				description: 'Discover and parse a domain\'s sitemap.xml URL inventory (2 credits)',
				action: 'Discover and parse a sitemap',
				routing: { request: { method: 'GET', url: '/v1/sitemap' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Crawl History',
				value: 'crawlHistory',
				description: 'First/last seen dates and snapshot count via Wayback Machine (2 credits)',
				action: 'Get crawl history for a domain',
				routing: { request: { method: 'GET', url: '/v1/crawl-history' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Schema Markup',
				value: 'schemaMarkup',
				description: 'Structured data extraction (0 credits - v1 stub, returns "not_yet_available")',
				action: 'Get schema markup for a URL',
				routing: { request: { method: 'GET', url: '/v1/schema-markup' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				name: 'Internal Links',
				value: 'internalLinks',
				description: 'Internal link graph for a domain (0 credits - v1 stub, returns "not_yet_available")',
				action: 'Get internal links for a domain',
				routing: { request: { method: 'GET', url: '/v1/internal-links' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
			{
				// Grouped under Page/Site rather than the OpenAPI spec's "Link Graph" tag: it answers
				// "which of my pages perform" (a site-level question), not "who links to me".
				name: 'Top Pages',
				value: 'topPages',
				description: 'Get pages on a domain ranked by inbound link count (2 credits)',
				action: 'Get top pages by inbound links',
				routing: { request: { method: 'GET', url: '/v1/top-pages' }, output: { postReceive: [{ type: 'rootProperty', properties: { property: 'data' } }] } },
			},
		],
	},
];

export const pageSiteFields: INodeProperties[] = [
	domainField(RESOURCE, ['techStack', 'siteHealth', 'sitemap', 'crawlHistory', 'internalLinks', 'topPages']),
	urlField(RESOURCE, ['pageSeo', 'pagePerformance', 'schemaMarkup']),
	limitField(RESOURCE, ['sitemap', 'internalLinks', 'topPages']),
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Number of results to skip (for paging through Internal Links results)',
		displayOptions: { show: { resource: [RESOURCE], operation: ['internalLinks'] } },
		routing: { request: { qs: { offset: '={{$value}}' } } },
	},
	{
		displayName: 'Strategy',
		name: 'strategy',
		type: 'options',
		default: 'mobile',
		options: [
			{ name: 'Mobile', value: 'mobile' },
			{ name: 'Desktop', value: 'desktop' },
		],
		description: 'Device strategy for the PageSpeed Insights analysis',
		displayOptions: { show: { resource: [RESOURCE], operation: ['pagePerformance'] } },
		routing: { request: { qs: { strategy: '={{$value}}' } } },
	},
];
