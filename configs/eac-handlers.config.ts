import { EaCHandlers } from '../src/api/EaCHandlers.ts';

export const eacHandlers: EaCHandlers = {
  Clouds: {
    APIPath: 'http://localhost:5437/api/handlers/clouds',
  },
  IoT: {
    APIPath: 'http://localhost:5437/api/handlers/iot',
  },
  SourceConnections: {
    APIPath: 'http://localhost:5437/api/handlers/source-connections',
  },
  Sources: {
    APIPath: 'http://localhost:5437/api/handlers/sources',
  },
};
