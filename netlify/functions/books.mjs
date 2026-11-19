import notionPkg from '@notionhq/client';

// The SDK ships as CommonJS, so a default import is required in ESM.
const { Client } = notionPkg;

/**
 * Read the expected Notion property values and normalise them into the small
 * shape the portfolio needs. The database is private; only the fields below
 * are returned to the browser.
 */
const STATUS_META = {
  reading: { label: 'Reading', order: 0 },
  finished: { label: 'Finished', order: 1 },
  want: { label: 'Want to read', order: 2 },
  unknown: { label: 'Uncategorised', order: 3 },
};

class ConfigurationError extends Error {}

function readEnv(env, key) {
  return String(env?.[key] ?? process.env?.[key] ?? '').trim();
}

function readRichText(richText) {
  if (!Array.isArray(richText)) return '';
  return richText
    .map((item) => item?.plain_text ?? item?.text?.content ?? '')
    .join('')
    .trim();
}

function findProperty(properties, names, types) {
  for (const name of names) {
    const property = properties?.[name];
    if (property && (!types || types.includes(property.type))) {
      return property;
    }
  }
  return null;
}

function readSelect(property) {
  if (!property) return '';
  if (property.type === 'select') return property.select?.name ?? '';
  if (property.type === 'status') return property.status?.name ?? '';
  if (property.type === 'multi_select') {
    return property.multi_select?.map((item) => item.name).join(', ') ?? '';
  }
  return '';
}

function normaliseStatus(raw) {
  const value = String(raw ?? '').trim().toLowerCase();
  if (!value) return 'unknown';

  // The emoji is useful in Notion but is not needed in the portfolio.
  const text = value.replace(/[^\p{L}\p{N}\s/&-]/gu, '').trim();

  if (text.includes('to do') || text.includes('todo') || text.includes('want') || text.includes('to read') || text.includes('backlog')) {
    return 'want';
  }
  if (text.includes('doing') || text.includes('reading') || text.includes('current')) {
    return 'reading';
  }
  if (text.includes('done') || text.includes('finish') || text.includes('complete')) {
    return 'finished';
  }
  return 'unknown';
}

function parseRating(property) {
  if (!property) return null;

  if (property.type === 'number') {
    const value = Number(property.number);
    return Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : null;
  }

  const raw = readSelect(property);
  if (!raw) return null;

  const stars = [...raw].filter((character) => character === '⭐' || character === '★').length;
  if (stars > 0) return Math.min(5, stars);

  const numeric = raw.match(/(\d+(?:\.\d+)?)\s*(?:\/\s*5)?/);
  if (!numeric) return null;

  const value = Number(numeric[1]);
  return Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : null;
}

function readDate(property) {
  if (!property || property.type !== 'date') return null;
  return property.date?.start ?? null;
}

function mapPage(page) {
  const properties = page?.properties ?? {};

  const titleProperty =
    findProperty(properties, ['Title', 'Name', 'Book'], ['title']) ??
    Object.values(properties).find((property) => property.type === 'title');

  const title = readRichText(titleProperty?.title);
  if (!title) return null;

  const authorProperty = findProperty(properties, ['Author', 'Authors', 'Writer'], ['rich_text']);
  const categoryProperty = findProperty(
    properties,
    ['Non/Fiction', 'Genre', 'Category', 'Type'],
    ['select', 'status', 'multi_select'],
  );
  const statusProperty = findProperty(properties, ['Status', 'Reading Status', 'State'], ['select', 'status']);
  const ratingProperty = findProperty(properties, ['Rating', 'Stars', 'Score'], ['select', 'status', 'number']);
  const dateProperty = findProperty(properties, ['Date', 'Finished', 'Finished On', 'Read On'], ['date']);

  const status = normaliseStatus(readSelect(statusProperty));

  return {
    id: String(page.id),
    title,
    author: readRichText(authorProperty?.rich_text) || null,
    category: readSelect(categoryProperty) || null,
    status,
    statusLabel: STATUS_META[status].label,
    rating: parseRating(ratingProperty),
    date: readDate(dateProperty),
  };
}

async function resolveDataSourceId(notion, env) {
  const directId = readEnv(env, 'NOTION_DATA_SOURCE_ID');
  if (directId) return directId;

  const databaseId = readEnv(env, 'NOTION_DB_ID');
  if (!databaseId) {
    throw new ConfigurationError('Set NOTION_DB_ID or NOTION_DATA_SOURCE_ID.');
  }

  try {
    const database = await notion.databases.retrieve({ database_id: databaseId });
    const dataSourceId = database.data_sources?.[0]?.id;
    if (!dataSourceId) {
      throw new ConfigurationError(
        'The Notion database has no data source. Share the database with the integration and try again.',
      );
    }
    return dataSourceId;
  } catch (error) {
    // A data source ID is also accepted in NOTION_DB_ID for backwards
    // compatibility with the first version of this function.
    if (error?.code === 'object_not_found') return databaseId;

    if (error?.code === 'validation_error' && /is a page, not a database/i.test(error.message)) {
      throw new ConfigurationError(
        'NOTION_DB_ID points to a page, not a database. Copy the database ID from the database URL, or set NOTION_DATA_SOURCE_ID.',
      );
    }

    throw error;
  }
}

/**
 * Fetches the whole Book List data source, following Notion pagination.
 * Exported so the Vite dev middleware can reuse exactly the same logic.
 */
export async function fetchBooks(env = process.env) {
  const token = readEnv(env, 'NOTION_TOKEN');
  if (!token) {
    throw new ConfigurationError('Set NOTION_TOKEN.');
  }

  const notion = new Client({ auth: token });
  const dataSourceId = await resolveDataSourceId(notion, env);

  const pages = [];
  let cursor;
  let pageCount = 0;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 100,
      start_cursor: cursor,
    });

    pages.push(...response.results);
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    pageCount += 1;
  } while (cursor && pageCount < 10);

  const books = pages
    .map(mapPage)
    .filter(Boolean)
    .sort(
      (a, b) =>
        STATUS_META[a.status].order - STATUS_META[b.status].order ||
        (b.rating ?? 0) - (a.rating ?? 0) ||
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
    );

  return {
    books,
    count: books.length,
    updatedAt: new Date().toISOString(),
  };
}

function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...init.headers,
    },
  });
}

export default async function handler() {
  try {
    const payload = await fetchBooks(process.env);

    return json(payload, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[books] Failed to load Notion books:', error);

    const notConfigured = error instanceof ConfigurationError;

    return json(
      {
        error: notConfigured
          ? 'The reading list is not configured yet.'
          : 'Failed to load books from Notion.',
        code: notConfigured ? 'not_configured' : 'notion_error',
      },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}

export const config = { path: '/api/books' };
