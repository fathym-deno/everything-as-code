import { EaCHandlers } from "../src/api/EaCHandlers.ts";

export const eacHandlers: EaCHandlers = {
  Clouds: {
    APIPath: "http://localhost:5437/api/eac/handlers/clouds",
    Order: 100,
  },
  GitHubApps: {
    APIPath: "http://localhost:5437/api/eac/handlers/github-apps",
    Order: 100,
  },
  IoT: {
    APIPath: "http://localhost:5437/api/eac/handlers/iot",
    Order: 200,
  },
  SourceConnections: {
    APIPath: "http://localhost:5437/api/eac/handlers/source-connections",
    Order: 100,
  },
  Sources: {
    APIPath: "http://localhost:5437/api/eac/handlers/sources",
    Order: 200,
  },
};
