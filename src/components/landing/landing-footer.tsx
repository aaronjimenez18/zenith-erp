import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacidad", href: "#" },
  { label: "Términos", href: "#" },
  { label: "Seguridad", href: "#" },
  { label: "Soporte", href: "mailto:soporte@zenitherp.com" },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t border-[#e3e2df] bg-[#faf9f5] px-4 py-12 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="font-display text-lg font-semibold text-[#134235]">
            ERP Zenith
          </p>
          <p className="mt-1 text-sm text-[#717975]">
             {new Date().getFullYear()} | Todos los derechos reservados.
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6">
          {FOOTER_LINKS.map((link) =>
            link.href.startsWith("mailto") ? (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[#404945] transition-colors hover:text-[#134235]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#404945] transition-colors hover:text-[#134235]"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
