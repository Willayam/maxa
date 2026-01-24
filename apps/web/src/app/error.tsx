"use client";

export default function GlobalError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4">Nagot gick fel</h1>
        <p className="text-text-muted mb-8">
          Ett ovantat fel intraffade. Forsok igen eller ga tillbaka.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-primary text-text-primary font-bold uppercase px-6 py-3 rounded-xl border-b-[4px] border-primary-dark"
          >
            Forsok igen
          </button>
          <a
            href="/"
            className="bg-white text-text-primary font-bold uppercase px-6 py-3 rounded-xl border-2 border-border"
          >
            Till startsidan
          </a>
        </div>
      </div>
    </div>
  );
}
