import { EaCHandlers } from "../src/api/EaCHandlers.ts";

export const eacHandlers: EaCHandlers = {
  Clouds: {
    APIPath: "http://localhost:5437/api/eac/handlers/clouds",
  },
  GitHubApps: {
    APIPath: "http://localhost:5437/api/eac/handlers/github-apps",
  },
  IoT: {
    APIPath: "http://localhost:5437/api/eac/handlers/iot",
  },
  SourceConnections: {
    APIPath: "http://localhost:5437/api/eac/handlers/source-connections",
  },
  Sources: {
    APIPath: "http://localhost:5437/api/eac/handlers/sources",
  },
};
