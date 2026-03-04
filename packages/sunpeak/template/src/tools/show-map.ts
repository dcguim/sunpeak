import { z } from 'zod';
import type { AppToolConfig, ToolHandlerExtra } from 'sunpeak/mcp';

export const tool: AppToolConfig = {
  resource: 'map',
  title: 'Show Map',
  description: 'Show the map',
  annotations: { readOnlyHint: true },
  _meta: {
    ui: { visibility: ['model', 'app'] },
  },
};

export const schema = {
  query: z.string().describe('Search query for places (e.g., pizza, coffee, restaurants)'),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .describe('Center location for the search'),
  radius: z.number().describe('Search radius in miles'),
  minRating: z.number().describe('Minimum rating filter (1-5)'),
  priceRange: z.array(z.enum(['$', '$$', '$$$', '$$$$'])).describe('Price range filter'),
};

type Args = z.infer<z.ZodObject<typeof schema>>;

export default async function (_args: Args, _extra: ToolHandlerExtra) {
  return { structuredContent: { places: [] } };
}
