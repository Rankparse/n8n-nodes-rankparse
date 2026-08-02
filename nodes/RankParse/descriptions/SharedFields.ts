import type { INodeProperties } from "n8n-workflow";

/**
 * Field builders shared across operations. RankParse's `limit` cap and default vary
 * per endpoint (see crawlgraph/rankparse-api/api/openapi.yaml component parameters
 * and each path's override), so callers pass those in rather than hardcoding one shape.
 */

export function domainField(
  resource: string,
  operations: string[],
  options: { required?: boolean } = {},
): INodeProperties {
  const { required = true } = options;
  return {
    displayName: "Domain",
    name: "domain",
    type: "string",
    default: "",
    required,
    placeholder: "example.com",
    description: 'The domain to query, without protocol (e.g. "example.com")',
    displayOptions: { show: { resource: [resource], operation: operations } },
    routing: { request: { qs: { domain: "={{$value}}" } } },
  };
}

export function urlField(
  resource: string,
  operations: string[],
): INodeProperties {
  return {
    displayName: "URL",
    name: "url",
    type: "string",
    default: "",
    required: true,
    placeholder: "https://example.com/about",
    description: "The full URL to analyze, including protocol",
    displayOptions: { show: { resource: [resource], operation: operations } },
    routing: { request: { qs: { url: "={{$value}}" } } },
  };
}

export function limitField(
  resource: string,
  operations: string[],
  options: { default?: number; maxValue?: number } = {},
): INodeProperties {
  const { maxValue = 1000 } = options;
  const field: INodeProperties = {
    displayName: "Limit",
    name: "limit",
    type: "number",
    default: 50,
    typeOptions: { minValue: 1, maxValue },
    description: "Max number of results to return",
    displayOptions: { show: { resource: [resource], operation: operations } },
    routing: { request: { qs: { limit: "={{$value}}" } } },
  };

  if (options.default !== undefined) {
    field.default = options.default;
  }

  return field;
}
