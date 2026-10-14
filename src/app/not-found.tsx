import { LinkButton } from "@/components/ui"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-gold-strong">404</p>
      <h1 className="text-3xl">Page not found</h1>
      <p className="max-w-md text-muted">That page is not part of the HRM platform. Try the module map.</p>
      <LinkButton href="/modules">Open module map</LinkButton>
    </div>
  )
}
