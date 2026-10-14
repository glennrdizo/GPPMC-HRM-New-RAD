const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 })
const num = new Intl.NumberFormat("en-PH")
const date = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })

export const formatPeso = (n: number) => peso.format(n)
export const formatNumber = (n: number) => num.format(n)
export const formatDate = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? date.format(new Date(`${iso}T00:00:00Z`)) : iso)
export const maskId = (v: string) => v.replace(/\d(?=[\d-]{4})/g, "•")
