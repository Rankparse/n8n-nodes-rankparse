import {
  NodeConnectionTypes,
  type INodeType,
  type INodeTypeDescription,
} from "n8n-workflow";

import {
  linkGraphOperations,
  linkGraphFields,
} from "./descriptions/LinkGraphDescription";
import {
  domainIntelligenceOperations,
  domainIntelligenceFields,
} from "./descriptions/DomainIntelligenceDescription";
import {
  pageSiteOperations,
  pageSiteFields,
} from "./descriptions/PageSiteDescription";
import { batchOperations, batchFields } from "./descriptions/BatchDescription";
import {
  dashboardOperations,
  dashboardFields,
} from "./descriptions/DashboardDescription";

export class RankParse implements INodeType {
  description: INodeTypeDescription = {
    displayName: "RankParse",
    name: "rankParse",
    icon: { light: "file:rankparse.svg", dark: "file:rankparse.dark.svg" },
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description:
      "Query backlinks, domain authority, tech stack, page SEO, and site health from the RankParse API",
    defaults: { name: "RankParse" },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [
      {
        name: "rankParseApi",
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: "https://api.rankparse.com",
      headers: {
        Accept: "application/json",
      },
    },
    properties: [
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        default: "linkGraph",
        options: [
          { name: "Batch", value: "batch" },
          { name: "Dashboard", value: "dashboard" },
          { name: "Domain Intelligence", value: "domainIntelligence" },
          { name: "Link Graph", value: "linkGraph" },
          { name: "Page / Site", value: "pageSite" },
        ],
      },
      ...linkGraphOperations,
      ...domainIntelligenceOperations,
      ...pageSiteOperations,
      ...batchOperations,
      ...dashboardOperations,
      ...linkGraphFields,
      ...domainIntelligenceFields,
      ...pageSiteFields,
      ...batchFields,
      ...dashboardFields,
    ],
  };
}
