export type BookStatus = 'reading' | 'finished' | 'want' | 'unknown';

export type Book = {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  status: BookStatus;
  statusLabel: string;
  rating: number | null;
  date: string | null;
};

export type BooksPayload = {
  books: Book[];
  count: number;
  updatedAt: string;
};

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  reading: 'Reading',
  finished: 'Finished',
  want: 'Want to read',
  unknown: 'Uncategorised',
};

const BOOK_STATUSES: readonly BookStatus[] = ['reading', 'finished', 'want', 'unknown'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isBookStatus(value: unknown): value is BookStatus {
  return typeof value === 'string' && BOOK_STATUSES.includes(value as BookStatus);
}

function readNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

function readRating(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(5, value));
}

function parseBook(value: unknown): Book | null {
  if (!isRecord(value)) return null;

  const id = readNullableString(value.id);
  const title = readNullableString(value.title);
  if (!id || !title) return null;

  const status = isBookStatus(value.status) ? value.status : 'unknown';

  return {
    id,
    title,
    author: readNullableString(value.author),
    category: readNullableString(value.category),
    status,
    statusLabel:
      readNullableString(value.statusLabel) ?? BOOK_STATUS_LABELS[status],
    rating: readRating(value.rating),
    date: readNullableString(value.date),
  };
}

/**
 * The API contract is untrusted browser input, so validate the shape instead
 * of casting the JSON response.
 */
export function parseBooksPayload(value: unknown): BooksPayload | null {
  if (!isRecord(value) || !Array.isArray(value.books)) return null;

  const books = value.books
    .map(parseBook)
    .filter((book): book is Book => book !== null);

  // A non-empty payload that contains no valid books means the API contract
  // changed; surfacing an error is safer than rendering an empty shelf.
  if (value.books.length > 0 && books.length === 0) return null;

  return {
    books,
    count: books.length,
    updatedAt: readNullableString(value.updatedAt) ?? '',
  };
}
