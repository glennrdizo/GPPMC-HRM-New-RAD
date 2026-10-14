export const SITE_NAME = "GD Prime HRM"
export const SITE_TITLE = "GD Prime HRM | HRM Platform of GD Prime Property Management Corporation"
export const SITE_DESCRIPTION =
  "All 28 modules of the GD Prime HRM Platform in one app: employee 201 records, recruitment, onboarding, timekeeping with geofencing, leave, payroll, statutory compliance, performance, relations, deployment and analytics."
export const siteUrl = () =>
  new URL(process.env.NEXT_PUBLIC_SITE_URL
    ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"))
