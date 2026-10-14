// Built-in sample data. Generated from a fixed seed so every page shows the same people and numbers.
// Names, numbers and amounts are illustrative only; nothing here is a real person or a real payroll.

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = rng(20261014)
const pick = <T,>(a: readonly T[]) => a[Math.floor(rand() * a.length)]
const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1))
const pad = (n: number, w = 4) => String(n).padStart(w, "0")

export const TODAY = "2026-10-14"
const day = (offset: number) => { const d = new Date(`${TODAY}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0, 10) }

// ---------- Organization (HRM-02) ----------
export type Property = { id: string; name: string; cluster: string; city: string; region: string; radius: number; client: string; type: string }
export const CLUSTERS = ["Cluster 1 - Makati", "Cluster 2 - BGC", "Cluster 3 - Ortigas", "Cluster 4 - Quezon City", "Cluster 5 - South"] as const
export const PROPERTIES: Property[] = [
  { id: "HO", name: "Head Office", cluster: "Head Office", city: "Makati", region: "NCR", radius: 100, client: "GPPMC", type: "Office" },
  { id: "P01", name: "Ayala Tower One", cluster: CLUSTERS[0], city: "Makati", region: "NCR", radius: 150, client: "Ayala Tower One Condominium Corp.", type: "Office tower" },
  { id: "P02", name: "Salcedo Residences", cluster: CLUSTERS[0], city: "Makati", region: "NCR", radius: 120, client: "Salcedo Residences HOA", type: "Residential" },
  { id: "P03", name: "Legaspi Park View", cluster: CLUSTERS[0], city: "Makati", region: "NCR", radius: 120, client: "Legaspi Park View Condo Corp.", type: "Residential" },
  { id: "P04", name: "Uptown Parksuites", cluster: CLUSTERS[1], city: "Taguig", region: "NCR", radius: 150, client: "Uptown Parksuites Condo Corp.", type: "Residential" },
  { id: "P05", name: "One Serendra", cluster: CLUSTERS[1], city: "Taguig", region: "NCR", radius: 200, client: "One Serendra Condo Corp.", type: "Residential" },
  { id: "P06", name: "High Street South", cluster: CLUSTERS[1], city: "Taguig", region: "NCR", radius: 180, client: "High Street South Corp.", type: "Mixed use" },
  { id: "P07", name: "Ortigas East Plaza", cluster: CLUSTERS[2], city: "Pasig", region: "NCR", radius: 150, client: "Ortigas East Plaza Corp.", type: "Office tower" },
  { id: "P08", name: "Capitol Commons", cluster: CLUSTERS[2], city: "Pasig", region: "NCR", radius: 200, client: "Capitol Commons Estate", type: "Mixed use" },
  { id: "P09", name: "Eastwood Lofts", cluster: CLUSTERS[3], city: "Quezon City", region: "NCR", radius: 150, client: "Eastwood Lofts Condo Corp.", type: "Residential" },
  { id: "P10", name: "Vertis North Suites", cluster: CLUSTERS[3], city: "Quezon City", region: "NCR", radius: 150, client: "Vertis North Suites Corp.", type: "Residential" },
  { id: "P11", name: "Alabang Town Heights", cluster: CLUSTERS[4], city: "Muntinlupa", region: "NCR", radius: 200, client: "Alabang Town Heights HOA", type: "Residential" },
  { id: "P12", name: "Nuvali Lakeside", cluster: CLUSTERS[4], city: "Santa Rosa", region: "IV-A", radius: 250, client: "Nuvali Lakeside Estate", type: "Township" },
  { id: "P13", name: "Cebu IT Park Tower", cluster: CLUSTERS[4], city: "Cebu City", region: "VII", radius: 150, client: "Cebu IT Park Tower Corp.", type: "Office tower" },
]

export const DEPARTMENTS = ["Human Resources", "Finance and Admin", "Property Operations", "Engineering", "Housekeeping", "Security", "Administration", "IT"] as const

type Position = { title: string; dept: (typeof DEPARTMENTS)[number]; band: string; rate: [number, number]; site: boolean }
export const POSITIONS: Position[] = [
  { title: "HR Manager", dept: "Human Resources", band: "M2", rate: [85000, 95000], site: false },
  { title: "HR Officer", dept: "Human Resources", band: "S2", rate: [32000, 40000], site: false },
  { title: "HR Assistant", dept: "Human Resources", band: "R3", rate: [21000, 25000], site: false },
  { title: "Payroll Officer", dept: "Finance and Admin", band: "S2", rate: [34000, 42000], site: false },
  { title: "Accounting Staff", dept: "Finance and Admin", band: "R3", rate: [22000, 27000], site: false },
  { title: "IT Officer", dept: "IT", band: "S1", rate: [30000, 38000], site: false },
  { title: "Executive Assistant", dept: "Administration", band: "S1", rate: [28000, 34000], site: false },
  { title: "Property Manager", dept: "Property Operations", band: "M1", rate: [55000, 70000], site: true },
  { title: "Admin Assistant", dept: "Property Operations", band: "R3", rate: [19000, 23000], site: true },
  { title: "Building Engineer", dept: "Engineering", band: "S1", rate: [30000, 38000], site: true },
  { title: "Technician", dept: "Engineering", band: "R2", rate: [17500, 21000], site: true },
  { title: "Housekeeping Supervisor", dept: "Housekeeping", band: "S1", rate: [22000, 26000], site: true },
  { title: "Housekeeper", dept: "Housekeeping", band: "R1", rate: [16100, 17000], site: true },
  { title: "Security Supervisor", dept: "Security", band: "S1", rate: [23000, 27000], site: true },
  { title: "Security Officer", dept: "Security", band: "R1", rate: [16100, 17500], site: true },
]

// ---------- Employees (HRM-03) ----------
const FIRST = ["Andrea", "Miguel", "Joy", "Bea", "Carlo", "Liza", "Ramon", "Nena", "Paolo", "Kristine", "Mark", "Angelica", "Joshua", "Patricia", "Rafael", "Camille", "Jerome", "Maricel", "Vincent", "Rowena", "Adrian", "Shiela", "Dennis", "Lorna", "Gerald", "Jasmine", "Noel", "Rhea", "Arnel", "Princess", "Edwin", "Maribel", "Jayson", "Cherry", "Rodel", "Grace", "Alvin", "Lovely", "Benjie", "Teresa"] as const
const LAST = ["Santos", "Reyes", "Bautista", "Lim", "Mendoza", "Garcia", "Cruz", "Flores", "Dela Cruz", "Ramos", "Aquino", "Villanueva", "Castillo", "Navarro", "Torres", "Gonzales", "Fernandez", "Domingo", "Mercado", "Pascual", "Soriano", "Manalo", "Salazar", "Tolentino", "Gutierrez", "Ocampo", "Rivera", "Valdez", "Morales", "De Leon"] as const

export type Status = "Regular" | "Probationary" | "Contractual" | "Project-based" | "Separated"
export type Employee = {
  id: string; first: string; last: string; gender: "F" | "M"; position: string; dept: string; band: string; property: string
  status: Status; hired: string; birth: string; rate: number; email: string; mobile: string; sss: string; tin: string; philhealth: string; pagibig: string
  manager?: string; civil: string; address: string
}

const FEMALE = new Set(["Andrea", "Joy", "Bea", "Liza", "Nena", "Kristine", "Angelica", "Patricia", "Camille", "Maricel", "Rowena", "Shiela", "Lorna", "Jasmine", "Rhea", "Princess", "Maribel", "Cherry", "Grace", "Lovely", "Teresa"])

function makeEmployees(): Employee[] {
  const list: Employee[] = []
  const add = (pos: Position, property: string) => {
    const first = pick(FIRST), last = pick(LAST), n = list.length + 1
    const hiredYear = int(2012, 2026), hiredMonth = hiredYear === 2026 ? int(1, 9) : int(1, 12)
    const recent = hiredYear === 2026 && hiredMonth >= 5
    const status: Status = n % 37 === 0 ? "Separated" : recent ? "Probationary" : pos.title.match(/Housekeeper|Security Officer/) && rand() < 0.2 ? "Project-based" : rand() < 0.06 ? "Contractual" : "Regular"
    list.push({
      id: `GP-${pad(1000 + n)}`, first, last, gender: FEMALE.has(first) ? "F" : "M", position: pos.title, dept: pos.dept, band: pos.band, property, status,
      hired: `${hiredYear}-${pad(hiredMonth, 2)}-${pad(int(1, 28), 2)}`, birth: `${int(1968, 2003)}-${pad(int(1, 12), 2)}-${pad(int(1, 28), 2)}`,
      rate: Math.round(int(pos.rate[0], pos.rate[1]) / 50) * 50,
      email: `${first}.${last}`.toLowerCase().replace(/\s/g, "") + `${n}@gdprime.example`, mobile: `0917 ${pad(int(100, 999), 3)} ${pad(int(1000, 9999))}`,
      sss: `34-${pad(int(1000000, 9999999), 7)}-${int(1, 9)}`, tin: `${pad(int(100, 999), 3)}-${pad(int(100, 999), 3)}-${pad(int(100, 999), 3)}-000`,
      philhealth: `12-${pad(int(100000000, 999999999), 9)}-${int(1, 9)}`, pagibig: `1211-${pad(int(1000, 9999))}-${pad(int(1000, 9999))}`,
      civil: pick(["Single", "Married", "Married", "Single", "Widowed"]), address: `${int(1, 250)} ${pick(["Rizal", "Mabini", "Bonifacio", "Luna", "Del Pilar", "Quezon"])} St., ${PROPERTIES.find((p) => p.id === property)!.city}`,
    })
  }
  for (const pos of POSITIONS.filter((p) => !p.site)) for (let i = 0; i < (pos.title.match(/HR Officer|Accounting/) ? 3 : pos.title === "HR Assistant" ? 2 : 1); i++) add(pos, "HO")
  for (const prop of PROPERTIES.slice(1)) {
    for (const pos of POSITIONS.filter((p) => p.site)) {
      const count = pos.title === "Housekeeper" ? int(2, 4) : pos.title === "Security Officer" ? int(2, 3) : pos.title === "Technician" ? int(1, 2) : pos.title === "Admin Assistant" ? 1 : rand() < 0.75 ? 1 : 0
      for (let i = 0; i < count; i++) add(pos, prop.id)
    }
  }
  // Each site's staff report to its Property Manager; Property Managers report to the HR Manager in this sample.
  for (const e of list) {
    const pm = list.find((x) => x.property === e.property && x.position === "Property Manager")
    e.manager = e.position === "Property Manager" || e.property === "HO" ? list[0].id : pm?.id
  }
  return list
}
export const EMPLOYEES = makeEmployees()
export const ACTIVE = EMPLOYEES.filter((e) => e.status !== "Separated")
export const employee = (id: string) => EMPLOYEES.find((e) => e.id === id)
export const fullName = (e: Pick<Employee, "first" | "last">) => `${e.first} ${e.last}`
export const nameOf = (id?: string) => { const e = id ? employee(id) : undefined; return e ? fullName(e) : "-" }
export const propertyName = (id: string) => PROPERTIES.find((p) => p.id === id)?.name ?? id
export const propertyOf = (e: Employee) => PROPERTIES.find((p) => p.id === e.property)!

// ---------- Timekeeping (HRM-07) ----------
export type Punch = { id: string; emp: string; shift: string; timeIn: string; timeOut: string; status: "Present" | "Late" | "Absent" | "On leave" | "Rest day"; geofence: "Inside" | "Outside" | "-"; source: string; lateMin: number }
export const ATTENDANCE: Punch[] = ACTIVE.map((e) => {
  const r = rand()
  const status: Punch["status"] = r < 0.06 ? "Absent" : r < 0.11 ? "On leave" : r < 0.17 ? "Rest day" : r < 0.3 ? "Late" : "Present"
  const lateMin = status === "Late" ? int(3, 45) : 0
  const shift = e.position.match(/Security/) && rand() < 0.4 ? "19:00-07:00" : "08:00-17:00"
  const startH = Number(shift.slice(0, 2))
  const inM = status === "Late" ? lateMin : -int(0, 20)
  const t = (h: number, m: number) => { const total = h * 60 + m; return `${pad(Math.floor(((total % 1440) + 1440) % 1440 / 60), 2)}:${pad(((total % 60) + 60) % 60, 2)}` }
  const working = status === "Present" || status === "Late"
  return {
    id: `T-${e.id}`, emp: e.id, shift, status, lateMin,
    timeIn: working ? t(startH, inM) : "-", timeOut: working && shift.startsWith("08") ? "-" : "-",
    geofence: working ? (rand() < 0.04 ? "Outside" : "Inside") : "-",
    source: working ? (e.property === "HO" ? "Biometric" : pick(["Mobile app", "Mobile app", "Biometric"])) : "-",
  }
})

// ---------- Leave (HRM-08) ----------
export const LEAVE_TYPES = [
  { code: "VL", name: "Vacation leave", credits: 15 }, { code: "SL", name: "Sick leave", credits: 15 }, { code: "SIL", name: "Service incentive leave", credits: 5 },
  { code: "ML", name: "Maternity leave (R.A. 11210)", credits: 105 }, { code: "PL", name: "Paternity leave (R.A. 8187)", credits: 7 },
  { code: "SPL", name: "Solo parent leave (R.A. 11861)", credits: 7 }, { code: "VAWC", name: "VAWC leave (R.A. 9262)", credits: 10 }, { code: "EL", name: "Emergency leave", credits: 3 },
] as const
export type Leave = { id: string; emp: string; type: string; from: string; to: string; days: number; reason: string; status: "Pending" | "Endorsed" | "Approved" | "Rejected" }
export const LEAVES: Leave[] = Array.from({ length: 34 }, (_, i) => {
  const e = pick(ACTIVE), type = pick(["VL", "VL", "SL", "SL", "SIL", "EL", "PL", "SPL"]), start = int(-20, 25), days = type === "PL" ? 7 : int(1, 4)
  return { id: `LV-26-${pad(201 + i)}`, emp: e.id, type, from: day(start), to: day(start + days - 1), days, reason: pick(["Family matter", "Medical check-up", "Out of town", "Fever", "Child's school event", "Personal errand"]),
    status: start < -3 ? pick(["Approved", "Approved", "Approved", "Rejected"]) : pick(["Pending", "Pending", "Endorsed", "Approved"]) }
})
export const leaveBalance = (e: Employee) => {
  const years = 2026 - Number(e.hired.slice(0, 4))
  const used = LEAVES.filter((l) => l.emp === e.id && l.status === "Approved")
  return LEAVE_TYPES.slice(0, 3).map((t) => {
    const credits = t.code === "SIL" ? (years >= 1 ? 5 : 0) : e.status === "Probationary" ? 0 : t.credits
    const taken = used.filter((l) => l.type === t.code).reduce((s, l) => s + l.days, 0) + (t.code === "VL" ? int(0, 5) : t.code === "SL" ? int(0, 4) : 0)
    return { ...t, credits, taken: Math.min(taken, credits), balance: Math.max(0, credits - taken) }
  })
}

// ---------- Payroll (HRM-10, HRM-11) ----------
// Illustrative semi-monthly computation for Oct 1-15, 2026. Real rates and tables are effective-dated configuration.
export const PAY_PERIOD = { code: "2026-10A", label: "Oct 1-15, 2026", payDate: "2026-10-15", cutoff: "2026-10-12" }
export type PayLine = { emp: string; basic: number; ot: number; nd: number; allowance: number; gross: number; sss: number; philhealth: number; pagibig: number; tax: number; loans: number; net: number }
const sssEE = (monthly: number) => Math.min(Math.max(monthly, 5000), 35000) * 0.05
const phEE = (monthly: number) => Math.min(Math.max(monthly, 10000), 100000) * 0.025
const tax = (monthly: number, statutory: number) => {
  const taxable = monthly - statutory
  if (taxable <= 20833) return 0
  if (taxable <= 33332) return (taxable - 20833) * 0.15
  if (taxable <= 66666) return 1875 + (taxable - 33333) * 0.2
  if (taxable <= 166666) return 8541.8 + (taxable - 66667) * 0.25
  return 33541.8 + (taxable - 166667) * 0.3
}
const r2 = (n: number) => Math.round(n * 100) / 100
export const PAYROLL: PayLine[] = ACTIVE.map((e) => {
  const basic = e.rate / 2, hourly = (e.rate * 12) / 261 / 8
  const ot = e.band.startsWith("M") ? 0 : r2(hourly * 1.25 * int(0, 10))
  const nd = e.position.match(/Security/) ? r2(hourly * 0.1 * 8 * int(0, 6)) : 0
  const allowance = e.property === "HO" ? 1000 : 750
  const sss = r2(sssEE(e.rate) / 2), philhealth = r2(phEE(e.rate) / 2), pagibig = 100
  const w = r2(tax(e.rate, sssEE(e.rate) + phEE(e.rate) + 200) / 2)
  const loans = rand() < 0.18 ? pick([500, 750, 1000, 1500]) : 0
  const gross = r2(basic + ot + nd + allowance)
  return { emp: e.id, basic, ot, nd, allowance, gross, sss, philhealth, pagibig, tax: w, loans, net: r2(gross - sss - philhealth - pagibig - w - loans) }
})
export const PAY_RUNS = [
  { code: "2026-10A", period: "Oct 1-15, 2026", status: "For validation", headcount: ACTIVE.length },
  { code: "2026-09B", period: "Sep 16-30, 2026", status: "Released", headcount: ACTIVE.length - 2 },
  { code: "2026-09A", period: "Sep 1-15, 2026", status: "Released", headcount: ACTIVE.length - 3 },
  { code: "2026-08B", period: "Aug 16-31, 2026", status: "Released", headcount: ACTIVE.length - 3 },
]
export const MIN_WAGES = [
  { region: "NCR", order: "NCR-26", effective: "2025-07-17", daily: 695, nonAgri: 695 },
  { region: "IV-A", order: "IVA-21", effective: "2025-10-01", daily: 560, nonAgri: 560 },
  { region: "VII", order: "ROVII-25", effective: "2025-10-08", daily: 540, nonAgri: 540 },
]
export const REMITTANCES = [
  { agency: "SSS", form: "R-3 / ML-1", period: "Sep 2026", due: "2026-10-31", amount: 0, status: "Prepared" },
  { agency: "PhilHealth", form: "RF-1", period: "Sep 2026", due: "2026-10-15", amount: 0, status: "Filed" },
  { agency: "Pag-IBIG", form: "MCRF", period: "Sep 2026", due: "2026-10-15", amount: 0, status: "Filed" },
  { agency: "BIR", form: "1601-C", period: "Sep 2026", due: "2026-10-10", amount: 0, status: "Filed" },
  { agency: "BIR", form: "2316", period: "CY 2025", due: "2026-01-31", amount: 0, status: "Filed" },
  { agency: "DOLE", form: "Establishment report (WAIR)", period: "2026", due: "2026-12-31", amount: 0, status: "Open" },
].map((r) => {
  const sum = (k: keyof PayLine) => PAYROLL.reduce((s, p) => s + (p[k] as number), 0) * 2
  return { ...r, amount: r.agency === "SSS" ? r2(sum("sss") * 2.9) : r.agency === "PhilHealth" ? r2(sum("philhealth") * 2) : r.agency === "Pag-IBIG" ? r2(sum("pagibig") * 2) : r.form === "1601-C" ? r2(sum("tax")) : 0 }
})

// ---------- Recruitment and onboarding (HRM-04, 05, 06) ----------
export const STAGES = ["Applied", "Screening", "Interview", "Exam", "Offer", "Hired"] as const
export const REQUISITIONS = [
  { id: "MRF-26-041", position: "Housekeeper", property: "P05", heads: 3, reason: "New contract scope", opened: day(-21), status: "Open" },
  { id: "MRF-26-042", position: "Security Officer", property: "P08", heads: 2, reason: "Replacement", opened: day(-18), status: "Open" },
  { id: "MRF-26-043", position: "Technician", property: "P12", heads: 1, reason: "Replacement", opened: day(-14), status: "Open" },
  { id: "MRF-26-044", position: "Building Engineer", property: "P13", heads: 1, reason: "New property", opened: day(-10), status: "Open" },
  { id: "MRF-26-045", position: "HR Officer", property: "HO", heads: 1, reason: "Additional headcount", opened: day(-7), status: "For approval" },
  { id: "MRF-26-046", position: "Admin Assistant", property: "P10", heads: 1, reason: "Replacement", opened: day(-3), status: "For approval" },
  { id: "MRF-26-038", position: "Property Manager", property: "P06", heads: 1, reason: "Replacement", opened: day(-48), status: "Filled" },
]
export const APPLICANTS = Array.from({ length: 42 }, (_, i) => {
  const req = pick(REQUISITIONS.filter((r) => r.status !== "Filled"))
  const stage = STAGES[Math.min(5, Math.floor(rand() * rand() * 7))]
  return { id: `APP-${pad(5100 + i)}`, name: `${pick(FIRST)} ${pick(LAST)}`, req: req.id, position: req.position, property: req.property, stage, source: pick(["JobStreet", "Referral", "Walk-in", "Facebook", "Indeed", "LinkedIn"]), applied: day(-int(1, 30)), score: int(62, 96) }
})
export const NEW_HIRES = EMPLOYEES.filter((e) => e.hired >= "2026-08-15").map((e, i) => ({
  emp: e.id, start: e.hired, done: Math.min(12, 6 + i % 7), total: 12,
  missing: pick(["NBI clearance", "Medical certificate", "Bank account", "-", "-", "Signed contract", "TIN verification"]),
}))
export const probationEnd = (e: Employee) => { const d = new Date(`${e.hired}T00:00:00Z`); d.setUTCMonth(d.getUTCMonth() + 6); return d.toISOString().slice(0, 10) }

// ---------- Approvals and workflow (HRM-26) ----------
export const REQUESTS = Array.from({ length: 22 }, (_, i) => {
  const type = pick(["Leave", "Overtime", "Official business", "Out-of-area punch", "Cash advance", "Certificate of employment", "201 update", "Schedule change", "Loan"])
  const age = int(0, 6), sla = type === "Leave" ? 2 : type.match(/Cash|Loan/) ? 3 : 1
  return { id: `REQ-${pad(9300 + i)}`, type, emp: pick(ACTIVE).id, submitted: day(-age), step: pick(["First approver", "First approver", "President / VP"]), sla: day(-age + sla), overdue: age > sla, status: age > 4 ? pick(["Approved", "Rejected"]) : "Pending" }
})

// ---------- Talent (HRM-13, 14, 15) ----------
export const EVALUATIONS = ACTIVE.filter((_, i) => i % 6 === 0).map((e, i) => ({ emp: e.id, kind: e.status === "Probationary" ? "Probationary (5th month)" : pick(["Annual 2026", "Mid-year 2026"]), due: day(int(-12, 30)), rating: i % 3 === 0 ? "-" : pick(["Outstanding", "Very satisfactory", "Very satisfactory", "Satisfactory", "Needs improvement"]), status: i % 3 === 0 ? "Not started" : pick(["Self-assessment", "Manager review", "Calibration", "Approved"]) }))
export const COURSES = [
  { code: "TRN-001", title: "New Employee Orientation", hours: 8, mandatory: true, provider: "HRD" },
  { code: "TRN-002", title: "Occupational Safety and Health (8h BOSH)", hours: 8, mandatory: true, provider: "Accredited OSH provider" },
  { code: "TRN-003", title: "Data Privacy Awareness (R.A. 10173)", hours: 2, mandatory: true, provider: "DPO" },
  { code: "TRN-004", title: "Customer Service Excellence", hours: 4, mandatory: false, provider: "HRD" },
  { code: "TRN-005", title: "Fire Safety and Evacuation", hours: 4, mandatory: true, provider: "BFP" },
  { code: "TRN-006", title: "Supervisory Development Program", hours: 16, mandatory: false, provider: "External" },
  { code: "TRN-007", title: "Safe Spaces Act (R.A. 11313)", hours: 2, mandatory: true, provider: "HRD" },
  { code: "TRN-008", title: "Electrical Safety for Technicians", hours: 8, mandatory: false, provider: "Engineering" },
]
export const SESSIONS = COURSES.slice(0, 6).map((c, i) => ({ course: c.code, title: c.title, date: day(int(2, 40)), venue: i % 2 ? "Head Office Training Room" : "Online (Teams)", seats: int(15, 30), enrolled: int(8, 20) }))
export const SUCCESSION = [
  { role: "HR Manager", incumbent: EMPLOYEES[0].id, ready: "Ready in 1-2 years", candidates: 2, risk: "Medium" },
  { role: "Payroll Officer", incumbent: EMPLOYEES.find((e) => e.position === "Payroll Officer")!.id, ready: "Ready now", candidates: 1, risk: "High" },
  ...ACTIVE.filter((e) => e.position === "Property Manager").slice(0, 5).map((e) => ({ role: `Property Manager - ${propertyName(e.property)}`, incumbent: e.id, ready: pick(["Ready now", "Ready in 1-2 years", "No successor"]), candidates: int(0, 3), risk: pick(["Low", "Medium", "High"]) })),
]

// ---------- Relations and welfare (HRM-16 to 19) ----------
export const CASES = Array.from({ length: 11 }, (_, i) => ({ id: `ER-26-${pad(31 + i, 3)}`, emp: pick(ACTIVE).id, offense: pick(["Tardiness (habitual)", "AWOL", "Insubordination", "Negligence of duty", "Violation of safety rules", "Uniform policy"]), stage: pick(["Incident report", "Notice to explain", "Hearing", "Decision", "Closed"]), opened: day(-int(2, 70)), due: day(int(-3, 10)) }))
export const GRIEVANCES = [
  { id: "GR-26-007", channel: "Grievance", category: "Work schedule", opened: day(-12), status: "Under review" },
  { id: "WB-26-002", channel: "Whistleblower (anonymous)", category: "Conflict of interest", opened: day(-30), status: "Investigation" },
  { id: "SS-26-001", channel: "Safe Spaces (CODI)", category: "Gender-based harassment", opened: day(-20), status: "CODI hearing" },
  { id: "GR-26-006", channel: "Grievance", category: "Pay discrepancy", opened: day(-41), status: "Resolved" },
]
export const INCIDENTS = Array.from({ length: 7 }, (_, i) => ({ id: `OSH-26-${pad(14 + i, 3)}`, property: pick(PROPERTIES.slice(1)).id, type: pick(["Slip and fall", "Minor cut", "Near miss", "Electrical shock (minor)", "Back strain"]), date: day(-int(1, 60)), lostDays: pick([0, 0, 0, 1, 2]), status: pick(["Open", "Investigated", "Closed", "Closed"]) }))
export const SURVEYS = [
  { title: "Employee Engagement Survey 2026", type: "Engagement", opens: day(-10), closes: day(10), response: 64, score: "-" },
  { title: "Pulse - Q3 2026", type: "Pulse", opens: day(-60), closes: day(-46), response: 78, score: "4.1 / 5" },
  { title: "Exit Interview (rolling)", type: "Exit", opens: "2026-01-01", closes: "2026-12-31", response: 88, score: "3.7 / 5" },
]

// ---------- Field, service and exit (HRM-20 to 22) ----------
export const CLIENT_REQUESTS = Array.from({ length: 9 }, (_, i) => ({ id: `CR-26-${pad(61 + i, 3)}`, property: pick(PROPERTIES.slice(1)).id, request: pick(["Replace housekeeper", "Additional guard (event)", "Relieve technician", "Reliever for leave", "Increase headcount", "Uniform compliance"]), received: day(-int(0, 15)), sla: `${int(1, 5)} days`, status: pick(["Open", "In progress", "Fulfilled", "Fulfilled"]) }))
export const ROSTER = PROPERTIES.slice(1).map((p) => { const staff = ACTIVE.filter((e) => e.property === p.id); const contract = staff.length + int(-1, 2); return { property: p.id, contract, deployed: staff.length, variance: staff.length - contract } })
export const SEPARATIONS = EMPLOYEES.filter((e) => e.status === "Separated").map((e) => ({ emp: e.id, type: "Resignation", lastDay: day(-int(5, 40)), clearance: "Complete", finalPay: "Released" })).concat(
  ACTIVE.filter((_, i) => i % 29 === 7).slice(0, 4).map((e) => ({ emp: e.id, type: pick(["Resignation", "End of contract", "Retirement"]), lastDay: day(int(3, 30)), clearance: pick(["In progress", "Pending"]), finalPay: "Not yet due" })))

// ---------- Governance (HRM-00, 23 to 27) ----------
export const POLICIES = [
  { code: "GDPPM-HR-PLB-HRM-001", title: "HR Management Playbook", version: "2.0", effective: "2026-01-01", ack: 91 },
  { code: "GPPMC-HR-POL-DPR-001", title: "Data Privacy Policy", version: "1.3", effective: "2025-11-01", ack: 96 },
  { code: "GPPMC-HR-POL-COC-001", title: "Code of Conduct and Discipline", version: "3.1", effective: "2026-03-01", ack: 88 },
  { code: "GPPMC-HR-POL-SSA-001", title: "Safe Spaces and Anti-Harassment", version: "1.1", effective: "2025-06-01", ack: 93 },
  { code: "GPPMC-HR-POL-ATT-001", title: "Attendance and Timekeeping", version: "2.2", effective: "2026-07-01", ack: 79 },
  { code: "GPPMC-HR-POL-OSH-001", title: "Occupational Safety and Health Program", version: "1.4", effective: "2026-02-15", ack: 85 },
]
export const AUDIT_FINDINGS = [
  { id: "IA-26-04", area: "Payroll - overtime approvals", rating: "High", owner: "Payroll", due: day(14), status: "Open" },
  { id: "IA-26-05", area: "201 file completeness", rating: "Medium", owner: "HR Records", due: day(30), status: "In progress" },
  { id: "IA-26-06", area: "User access review", rating: "Medium", owner: "ITD", due: day(-2), status: "Overdue" },
  { id: "IA-26-02", area: "Final pay within 30 days", rating: "Low", owner: "Payroll", due: day(-40), status: "Closed" },
]
export const RISKS = [
  { id: "HR-R01", risk: "Key-person dependency in payroll", likelihood: 3, impact: 5, owner: "HR Manager", treatment: "Cross-train second payroll officer" },
  { id: "HR-R02", risk: "Late statutory remittance penalties", likelihood: 2, impact: 4, owner: "FAD Head", treatment: "Remittance calendar with SLA escalation" },
  { id: "HR-R03", risk: "Personal data breach", likelihood: 2, impact: 5, owner: "DPO", treatment: "Masking, access review, breach drill" },
  { id: "HR-R04", risk: "Under-deployment against client contract", likelihood: 3, impact: 4, owner: "Operations Manager", treatment: "Roster variance alerts (HRM-20)" },
  { id: "HR-R05", risk: "Labor case from improper due process", likelihood: 2, impact: 4, owner: "ER Officer", treatment: "Two-notice workflow with hold points" },
]
export const INTEGRATIONS = [
  { name: "Biometric terminals (ZKTeco)", direction: "Inbound", frequency: "Every 15 min", last: `${TODAY} 07:45`, status: "Healthy" },
  { name: "Mobile time capture", direction: "Inbound", frequency: "Real time", last: `${TODAY} 07:58`, status: "Healthy" },
  { name: "Bank payroll file (BDO)", direction: "Outbound", frequency: "Per pay run", last: "2026-09-30 15:10", status: "Healthy" },
  { name: "SSS / PhilHealth / Pag-IBIG files", direction: "Outbound", frequency: "Monthly", last: "2026-10-09 10:02", status: "Healthy" },
  { name: "BIR alphalist / 1601-C", direction: "Outbound", frequency: "Monthly", last: "2026-10-09 10:05", status: "Healthy" },
  { name: "Accounting GL posting", direction: "Outbound", frequency: "Per pay run", last: "2026-09-30 16:20", status: "Warning" },
  { name: "HMO enrollment", direction: "Outbound", frequency: "Weekly", last: "2026-10-10 09:00", status: "Healthy" },
  { name: "GD Prime One events", direction: "Both", frequency: "Real time", last: `${TODAY} 07:59`, status: "Healthy" },
]
export const AUDIT_LOG = Array.from({ length: 14 }, (_, i) => ({
  at: `${TODAY} ${pad(7 - Math.floor(i / 3), 2)}:${pad(59 - i * 4, 2)}`, user: pick(["andrea.santos", "miguel.reyes", "joy.bautista", "system"]),
  action: pick(["Viewed 201 file (sensitive)", "Approved leave", "Edited pay rate", "Exported payroll register", "Created user account", "Changed role", "Imported attendance"]),
  record: pick(ACTIVE).id,
}))
export const ROLES = [
  { code: "EXE", role: "Executive", holder: "President, President/CEO, Senior Adviser", scope: "Company-wide, read; approvals per matrix", pay: true },
  { code: "HRM", role: "HR Manager", holder: "HR Manager, Assistant HR Manager", scope: "Company-wide HR data", pay: true },
  { code: "HRO", role: "HR Officer / HRBP", holder: "Recruitment, ER, L&D, Benefits, Welfare officers", scope: "Assigned divisions/clusters", pay: false },
  { code: "HRR", role: "HR Records", holder: "Records custodian, HR assistants", scope: "Company-wide core records", pay: false },
  { code: "VAL", role: "Salary Rate Validator", holder: "Compensation analyst", scope: "Pay rates and payroll registers", pay: true },
  { code: "PAY", role: "Payroll Officer", holder: "FAD payroll staff", scope: "Payroll, statutory, loans", pay: true },
  { code: "FIN", role: "FAD Approver", holder: "FAD Head", scope: "Payroll approval, remittance, GL", pay: true },
  { code: "MGR", role: "Line Manager", holder: "Department Heads, supervisors", scope: "Direct and indirect reports", pay: false },
  { code: "CLH", role: "Cluster / Site Manager", holder: "Operations Manager, Cluster Heads, Property Managers", scope: "Assigned properties", pay: false },
  { code: "EMP", role: "Employee", holder: "All employees", scope: "Own record", pay: false },
  { code: "APP", role: "Applicant", holder: "External applicants", scope: "Own application", pay: false },
  { code: "ERI", role: "Investigator / Decider", holder: "Designated per case", scope: "Assigned case only", pay: false },
  { code: "COD", role: "CODI Member", holder: "Committee members", scope: "CODI cases only", pay: false },
  { code: "DPO", role: "Data Protection Officer", holder: "DPO, Compliance Officers for Privacy", scope: "Audit and privacy logs", pay: false },
  { code: "AUD", role: "Internal Auditor", holder: "Internal Audit", scope: "Read-only, company-wide, logged", pay: false },
  { code: "ADM", role: "System Administrator", holder: "ITD", scope: "Configuration; no business data edit", pay: false },
]
export const BENEFIT_CLAIMS = Array.from({ length: 12 }, (_, i) => ({ id: `CLM-26-${pad(140 + i, 3)}`, emp: pick(ACTIVE).id, type: pick(["Rice subsidy", "Medical reimbursement", "Transportation", "HMO dependent", "Uniform allowance", "Bereavement assistance"]), amount: pick([1500, 2000, 2500, 3500, 5000, 10000]), filed: day(-int(1, 25)), status: pick(["Pending", "Approved", "Approved", "Released"]) }))
export const BANDS = [
  { band: "R1", title: "Rank and file I", min: 16100, mid: 17000, max: 18500 }, { band: "R2", title: "Rank and file II", min: 17500, mid: 19500, max: 21500 },
  { band: "R3", title: "Rank and file III", min: 19000, mid: 23000, max: 27000 }, { band: "S1", title: "Supervisory I", min: 22000, mid: 30000, max: 38000 },
  { band: "S2", title: "Supervisory II", min: 30000, mid: 36000, max: 42000 }, { band: "M1", title: "Managerial I", min: 50000, mid: 60000, max: 72000 },
  { band: "M2", title: "Managerial II", min: 75000, mid: 85000, max: 100000 },
]
export const REPORTS = [
  { code: "RPT-01", title: "Headcount and movements", cadence: "Monthly", owner: "HRD" }, { code: "RPT-02", title: "Attrition and turnover", cadence: "Monthly", owner: "HRD" },
  { code: "RPT-03", title: "Recruitment pipeline and time-to-fill", cadence: "Weekly", owner: "Recruitment" }, { code: "RPT-04", title: "Attendance, tardiness and absence", cadence: "Semi-monthly", owner: "Timekeeping" },
  { code: "RPT-05", title: "Payroll cost by property", cadence: "Semi-monthly", owner: "Payroll" }, { code: "RPT-06", title: "Statutory remittance status", cadence: "Monthly", owner: "Payroll" },
  { code: "RPT-07", title: "Training hours and compliance", cadence: "Quarterly", owner: "L&D" }, { code: "RPT-08", title: "ManCom HR report pack", cadence: "Monthly", owner: "HR Manager" },
]
