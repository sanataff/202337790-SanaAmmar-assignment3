import { useMemo, useState } from 'react';
import {
  DrawablyBadge,
  DrawablyButton,
  DrawablyCard,
  DrawablyList,
  DrawablyTabs,
} from 'drawably/react';
import { BOOK_STATUS_LABELS, type Book, type BookStatus } from '../lib/books';
import { useBooks } from '../hooks/useBooks';
import MaskedText from './MaskedText';
import Reveal from './Reveal';

type BookFilter = 'all' | BookStatus;

const BOOKS_PREVIEW_COUNT = 4;

const FILTERS: Array<{ value: BookFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
  { value: 'want', label: 'Want to read' },
];

function yearOf(value: string | null): number | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.getFullYear();
}

function Rating({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <span
      className="book-row__rating"
      aria-label={`Rated ${value} out of 5`}
      title={`Rated ${value} out of 5`}
    >
      {'★'.repeat(filled)}
      {'☆'.repeat(Math.max(0, 5 - filled))}
    </span>
  );
}

function BookRow({ book }: { book: Book }) {
  const year = yearOf(book.date);

  return (
    <li className="book-row">
      <div className="book-row__main">
        <h3 className="book-row__title">
          <span dir="auto">{book.title}</span>
        </h3>
        {(book.author || book.category || year) && (
          <p className="book-row__meta">
            {book.author && <span dir="auto">{book.author}</span>}
            {book.category && <span>{book.category}</span>}
            {year && <span>{year}</span>}
          </p>
        )}
      </div>

      <div className="book-row__aside">
        {book.rating !== null && <Rating value={book.rating} />}
        <DrawablyBadge className={`book-row__status book-row__status--${book.status}`}>
          {book.statusLabel || BOOK_STATUS_LABELS[book.status]}
        </DrawablyBadge>
      </div>
    </li>
  );
}

function BooksSkeleton() {
  return (
    <>
      <p className="books__loading" role="status">
        Loading books from Notion…
      </p>
      <div className="books__skeleton" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <div className="books__skeleton-row" key={item}>
            <span />
            <span />
          </div>
        ))}
      </div>
    </>
  );
}

export default function Books() {
  const { status, books, error, reload } = useBooks();
  const [filter, setFilter] = useState<BookFilter>('all');
  const [showAllBooks, setShowAllBooks] = useState(false);

  const counts = useMemo(() => {
    const next: Record<BookStatus, number> = {
      reading: 0,
      finished: 0,
      want: 0,
      unknown: 0,
    };

    for (const book of books) next[book.status] += 1;
    return next;
  }, [books]);

  const visibleBooks = useMemo(
    () => (filter === 'all' ? books : books.filter((book) => book.status === filter)),
    [books, filter],
  );
  const displayedBooks = showAllBooks
    ? visibleBooks
    : visibleBooks.slice(0, BOOKS_PREVIEW_COUNT);

  const activeFilter = FILTERS.findIndex((item) => item.value === filter);
  const hasBooks = books.length > 0;
  const initialLoading = status === 'loading' && !hasBooks;
  const isRefreshing = status === 'loading' && hasBooks;
  const emptyFilterLabel = filter === 'all' ? 'books' : BOOK_STATUS_LABELS[filter];
  const countLabel = hasBooks
    ? `${visibleBooks.length} of ${books.length} books`
    : 'Live from Notion';

  return (
    <section id="reading" className="section books">
      <div className="section__head">
        <h2 className="section__title">
          <MaskedText>Reading</MaskedText>
        </h2>
        <DrawablyBadge className="section__meta" aria-live="polite">
          {countLabel}
        </DrawablyBadge>
      </div>

      <Reveal className="books__intro">
        <p>
          A live shelf from my Notion library: what I am reading, what I finished,
          and what is next. Notes and quotes stay private.
        </p>
      </Reveal>

      {hasBooks && (
        <div className="books__toolbar">
          <DrawablyTabs
            className="filters__tabs"
            aria-label="Filter books by reading status"
            active={activeFilter}
          >
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                className="tab"
                onClick={() => {
                  setFilter(item.value);
                  setShowAllBooks(false);
                }}
              >
                {item.label}
                {item.value !== 'all' && counts[item.value] > 0 && (
                  <span className="tab__count"> ({counts[item.value]})</span>
                )}
              </button>
            ))}
          </DrawablyTabs>

          <DrawablyButton
            onClick={reload}
            disabled={isRefreshing}
            state={isRefreshing ? 'loading' : 'idle'}
          >
            {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </DrawablyButton>
        </div>
      )}

      {initialLoading && <BooksSkeleton />}

      {status === 'error' && (
        <DrawablyCard className="empty books__state" role="alert">
          <p className="empty__title">The shelf is unavailable</p>
          <p className="empty__body">{error}</p>
          <DrawablyButton onClick={reload}>Try again</DrawablyButton>
        </DrawablyCard>
      )}

      {status === 'success' && books.length === 0 && (
        <DrawablyCard className="empty books__state" role="status">
          <p className="empty__title">No books yet</p>
          <p className="empty__body">
            The Book List in Notion is empty or has not been shared with the
            integration.
          </p>
          <DrawablyButton onClick={reload}>Refresh</DrawablyButton>
        </DrawablyCard>
      )}

      {hasBooks && visibleBooks.length === 0 && (
        <DrawablyCard className="empty books__state" role="status">
          <p className="empty__title">Nothing on this shelf</p>
          <p className="empty__body">
            There are no books marked “{emptyFilterLabel}” right now.
          </p>
          <DrawablyButton onClick={() => setFilter('all')}>Show all books</DrawablyButton>
        </DrawablyCard>
      )}

      {hasBooks && visibleBooks.length > 0 && (
        <DrawablyList className="book-list" marker="dash" key={filter}>
          {displayedBooks.map((book) => (
            <BookRow key={book.id} book={book} />
          ))}
        </DrawablyList>
      )}

      {visibleBooks.length > BOOKS_PREVIEW_COUNT && (
        <div className="books__expand">
          <DrawablyButton
            type="button"
            aria-expanded={showAllBooks}
            onClick={() => setShowAllBooks((expanded) => !expanded)}
          >
            {showAllBooks ? 'Show fewer books' : `Show all ${visibleBooks.length} books`}
          </DrawablyButton>
        </div>
      )}
    </section>
  );
}
