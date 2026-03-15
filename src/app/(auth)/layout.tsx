/**
 * Layout para las páginas de autenticación (login, registro).
 * Centrado vertical y horizontalmente, fondo con gradiente sutil.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md">
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            🎾 CourtManager
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Gestión de turnos para profes de Tenis y Pádel
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
