export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold mb-4">Sidan hittades inte</h1>
        <p className="text-text-muted mb-8">
          Vi kunde tyvarr inte hitta sidan du letar efter.
        </p>
        <a
          href="/"
          className="inline-block bg-primary text-text-primary font-bold uppercase px-6 py-3 rounded-xl border-b-[4px] border-primary-dark"
        >
          Till startsidan
        </a>
      </div>
    </div>
  );
}
