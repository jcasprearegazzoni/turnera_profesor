export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">misu</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gestion de turnos para profes de Tenis y Padel
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
