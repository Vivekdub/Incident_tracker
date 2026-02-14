type Props = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const showPages: (number | "ellipsis")[] = (() => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const set = new Set<number>([1, totalPages, page, page - 1, page + 1]);
    const sorted = Array.from(set).filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    const out: (number | "ellipsis")[] = [];
    let prev = 0;
    for (const p of sorted) {
      if (p > prev + 1) out.push("ellipsis");
      out.push(p);
      prev = p;
    }
    return out;
  })();

  return (
    <div className="incident-pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(1)}
        aria-label="First"
      >
        &laquo;
      </button>
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous"
      >
        &lsaquo;
      </button>
      {showPages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="px-2 text-gray-500">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={p === page ? "active" : ""}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next"
      >
        &rsaquo;
      </button>
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
        aria-label="Last"
      >
        &raquo;
      </button>
      <span className="page-info">
        Page {page} of {totalPages}
      </span>
    </div>
  );
}
