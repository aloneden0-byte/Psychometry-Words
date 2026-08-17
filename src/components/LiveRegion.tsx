/** Shared visually-hidden aria-live host for status announcements (reveal state, grading feedback). */
export function LiveRegion({ message }: { message: string }) {
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
