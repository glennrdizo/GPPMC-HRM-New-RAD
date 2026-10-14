import * as D from "@/lib/data"
import { formatDate, formatPeso } from "@/lib/format"
import { inScope, type Viewer } from "@/lib/viewer"

// Each module's working view: KPI tiles and one or more tables, built from the sample data and limited to the viewer's scope.
export type Tone = "royal" | "teal" | "rust" | "violet" | "amber" | "sky" | "green" | "rose" | "red" | "slate"
export type Stat = { label: string; value: string | number; hint?: string; tone: Tone }
export type Kind = "text" | "emp" | "property" | "date" | "money" | "badge" | "number" | "percent" | "id"
export type Column = { key: string; label: string; kind?: Kind; pay?: boolean; primary?: boolean }
export type Row = Record<string, string | number | boolean>
export type Table = { title: string; description?: string; columns: Column[]; rows: Row[]; href?: (row: Row) => string | undefined }
export type Workspace = { stats: Stat[]; tables: Table[]; note?: string }

const sum = (rows: Row[], key: string) => rows.reduce((s, r) => s + Number(r[key] ?? 0), 0)
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "0%")
const empHref = (r: Row) => (r.emp ? `/employees/${r.emp}` : undefined)
const C = (key: string, label: string, kind: Kind = "text", extra: Partial<Column> = {}): Column => ({ key, label, kind, ...extra })

export function workspace(code: string, v: Viewer): Workspace {
  const people = D.ACTIVE.filter((e) => inScope(v, e.id))
  const scoped = <T extends { emp: string }>(rows: T[]) => rows.filter((r) => inScope(v, r.emp))
  const props = D.PROPERTIES.filter((p) => !v.properties || v.properties.includes(p.id))

  switch (code) {
    case "PAS": return {
      stats: [
        { label: "User accounts", value: D.ACTIVE.length + 4, hint: "One per Employee Number", tone: "royal" },
        { label: "Roles", value: D.ROLES.length, hint: "Role catalogue", tone: "violet" },
        { label: "MFA coverage", value: "100%", hint: "HR, FAD and approvers", tone: "green" },
        { label: "Orphan accounts", value: 0, hint: "Auto-deactivated on separation", tone: "slate" },
      ],
      tables: [
        { title: "Role catalogue", description: "Roles combine with a data scope; one person may hold several, subject to segregation of duties.", columns: [C("code", "Code", "id"), C("role", "Role", "text", { primary: true }), C("holder", "Typical holder"), C("scope", "Default data scope"), C("pay", "Sees pay", "badge")], rows: D.ROLES.map((r) => ({ ...r, pay: r.pay ? "Yes" : "No" })) },
        { title: "Audit trail (today)", columns: [C("at", "When"), C("user", "User", "id"), C("action", "Action", "text", { primary: true }), C("record", "Record", "id")], rows: D.AUDIT_LOG },
      ],
    }
    case "DSH": return dashboardWorkspace(v)
    case "WAN": {
      const rows = D.REQUESTS.filter((r) => inScope(v, r.emp))
      const pending = rows.filter((r) => r.status === "Pending")
      return {
        stats: [
          { label: "Waiting for approval", value: pending.length, tone: "amber" },
          { label: "Past the time standard", value: pending.filter((r) => r.overdue).length, hint: "Escalated (no approval by silence)", tone: "red" },
          { label: "At President / VP", value: pending.filter((r) => r.step !== "First approver").length, tone: "violet" },
          { label: "Decided this week", value: rows.length - pending.length, tone: "green" },
        ],
        tables: [{ title: "Approval inbox", description: "Every request goes first approver, then President or VP. Out-of-area punches and loans are first-approver-final.", href: empHref,
          columns: [C("id", "Request", "id"), C("type", "Type", "text", { primary: true }), C("emp", "Employee", "emp"), C("submitted", "Submitted", "date"), C("step", "Current step"), C("sla", "Due", "date"), C("status", "Status", "badge")],
          rows: rows.map((r) => ({ ...r, status: r.status === "Pending" && r.overdue ? "Overdue" : r.status })) }],
      }
    }
    case "INT": return {
      stats: [
        { label: "Interfaces", value: D.INTEGRATIONS.length, tone: "royal" },
        { label: "Healthy", value: D.INTEGRATIONS.filter((i) => i.status === "Healthy").length, tone: "green" },
        { label: "Warnings", value: D.INTEGRATIONS.filter((i) => i.status !== "Healthy").length, tone: "amber" },
        { label: "Re-keyed records", value: 0, hint: "Integrate, don't re-key", tone: "slate" },
      ],
      tables: [{ title: "Integration status", columns: [C("name", "Interface", "text", { primary: true }), C("direction", "Direction"), C("frequency", "Frequency"), C("last", "Last run"), C("status", "Status", "badge")], rows: D.INTEGRATIONS }],
    }
    case "ORG": {
      const rows = props.map((p) => ({ ...p, property: p.id, headcount: D.ACTIVE.filter((e) => e.property === p.id).length }))
      return {
        stats: [
          { label: "Properties", value: props.length, hint: "Head Office and project sites", tone: "royal" },
          { label: "Clusters", value: new Set(props.map((p) => p.cluster)).size, tone: "teal" },
          { label: "Departments", value: D.DEPARTMENTS.length, tone: "violet" },
          { label: "Approved positions", value: D.POSITIONS.length, tone: "amber" },
        ],
        tables: [
          { title: "Properties and sites", description: "Each site carries its wage region and the geofence radius used by mobile time capture.", columns: [C("id", "Code", "id"), C("name", "Property", "text", { primary: true }), C("cluster", "Cluster"), C("city", "City"), C("region", "Wage region"), C("radius", "Geofence (m)", "number"), C("headcount", "Headcount", "number")], rows },
          { title: "Positions and bands", columns: [C("title", "Position", "text", { primary: true }), C("dept", "Department"), C("band", "Band", "id"), C("site", "Deployed to")], rows: D.POSITIONS.map((p) => ({ title: p.title, dept: p.dept, band: p.band, site: p.site ? "Project sites" : "Head Office" })) },
        ],
      }
    }
    case "ECR": {
      const all = D.EMPLOYEES.filter((e) => inScope(v, e.id))
      return {
        stats: [
          { label: "Active employees", value: people.length, tone: "royal" },
          { label: "Regular", value: people.filter((e) => e.status === "Regular").length, hint: pct(people.filter((e) => e.status === "Regular").length, people.length), tone: "green" },
          { label: "Probationary", value: people.filter((e) => e.status === "Probationary").length, tone: "amber" },
          { label: "Separated (kept, never deleted)", value: all.length - people.length, tone: "slate" },
        ],
        tables: [{ title: "Employee masterlist", description: "One employee, one number, one record. Open a row for the 201 file.", href: empHref,
          columns: [C("emp", "Employee", "emp", { primary: true }), C("id", "Employee No.", "id"), C("position", "Position"), C("property", "Property", "property"), C("status", "Status", "badge"), C("hired", "Date hired", "date"), C("rate", "Monthly rate", "money", { pay: true })],
          rows: all.map((e) => ({ emp: e.id, id: e.id, position: e.position, property: e.property, status: e.status, hired: e.hired, rate: e.rate })) }],
      }
    }
    case "RAT": {
      const apps = D.APPLICANTS.filter((a) => !v.properties || v.properties.includes(a.property))
      return {
        stats: [
          { label: "Open requisitions", value: D.REQUISITIONS.filter((r) => r.status === "Open").length, tone: "royal" },
          { label: "Applicants in pipeline", value: apps.filter((a) => a.stage !== "Hired").length, tone: "sky" },
          { label: "Offers out", value: apps.filter((a) => a.stage === "Offer").length, tone: "amber" },
          { label: "Hired (30 days)", value: apps.filter((a) => a.stage === "Hired").length, tone: "green" },
        ],
        tables: [
          { title: "Manpower requisitions", columns: [C("id", "MRF", "id"), C("position", "Position", "text", { primary: true }), C("property", "Property", "property"), C("heads", "Heads", "number"), C("reason", "Reason"), C("opened", "Opened", "date"), C("status", "Status", "badge")], rows: D.REQUISITIONS },
          { title: "Applicants", columns: [C("id", "Applicant", "id"), C("name", "Name", "text", { primary: true }), C("position", "Position"), C("property", "Property", "property"), C("stage", "Stage", "badge"), C("source", "Source"), C("score", "Exam score", "number"), C("applied", "Applied", "date")], rows: apps },
        ],
      }
    }
    case "ONB": {
      const rows = scoped(D.NEW_HIRES)
      return {
        stats: [
          { label: "New hires (60 days)", value: rows.length, tone: "royal" },
          { label: "Checklists complete", value: rows.filter((r) => r.done === r.total).length, tone: "green" },
          { label: "Missing requirements", value: rows.filter((r) => r.missing !== "-").length, tone: "amber" },
          { label: "Contracts e-signed", value: pct(rows.filter((r) => r.missing !== "Signed contract").length, rows.length), tone: "violet" },
        ],
        tables: [{ title: "Onboarding checklists", href: empHref, columns: [C("emp", "New hire", "emp", { primary: true }), C("start", "Start date", "date"), C("progress", "Checklist"), C("missing", "Still missing")], rows: rows.map((r) => ({ ...r, progress: `${r.done} of ${r.total}` })) }],
      }
    }
    case "PES": {
      const probation = people.filter((e) => e.status === "Probationary").map((e) => ({ emp: e.id, hired: e.hired, end: D.probationEnd(e), position: e.position, property: e.property, action: D.probationEnd(e) <= "2026-11-14" ? "Decide this month" : "On track" }))
      return {
        stats: [
          { label: "On probation", value: probation.length, tone: "amber" },
          { label: "Decision due in 30 days", value: probation.filter((p) => p.action !== "On track").length, hint: "Before the 6th month (Labor Code Art. 296)", tone: "red" },
          { label: "Contractual / project-based", value: people.filter((e) => e.status === "Contractual" || e.status === "Project-based").length, tone: "violet" },
          { label: "Regularized this year", value: 9, tone: "green" },
        ],
        tables: [{ title: "Probation tracker", href: empHref, columns: [C("emp", "Employee", "emp", { primary: true }), C("position", "Position"), C("property", "Property", "property"), C("hired", "Hired", "date"), C("end", "Probation ends", "date"), C("action", "Action", "badge")], rows: probation.sort((a, b) => a.end.localeCompare(b.end)) }],
      }
    }
    case "TKA": {
      const rows = scoped(D.ATTENDANCE)
      const count = (s: string) => rows.filter((r) => r.status === s).length
      return {
        stats: [
          { label: "Present today", value: count("Present") + count("Late"), hint: pct(count("Present") + count("Late"), rows.length - count("Rest day")), tone: "green" },
          { label: "Late", value: count("Late"), tone: "amber" },
          { label: "Absent", value: count("Absent"), tone: "red" },
          { label: "Outside geofence", value: rows.filter((r) => r.geofence === "Outside").length, hint: "Needs Timekeeper approval", tone: "violet" },
        ],
        tables: [{ title: `Attendance today (${formatDate(D.TODAY)})`, href: empHref, columns: [C("emp", "Employee", "emp", { primary: true }), C("shift", "Shift"), C("timeIn", "Time in"), C("lateMin", "Late (min)", "number"), C("source", "Source"), C("geofence", "Geofence", "badge"), C("status", "Status", "badge")], rows }],
      }
    }
    case "LVM": {
      const rows = scoped(D.LEAVES)
      return {
        stats: [
          { label: "Pending requests", value: rows.filter((r) => r.status === "Pending" || r.status === "Endorsed").length, tone: "amber" },
          { label: "On leave today", value: rows.filter((r) => r.status === "Approved" && r.from <= D.TODAY && r.to >= D.TODAY).length, tone: "sky" },
          { label: "Approved (30 days)", value: rows.filter((r) => r.status === "Approved").length, tone: "green" },
          { label: "Leave types", value: D.LEAVE_TYPES.length, hint: "Incl. statutory leaves", tone: "violet" },
        ],
        tables: [
          { title: "Leave requests", href: empHref, columns: [C("id", "Request", "id"), C("emp", "Employee", "emp", { primary: true }), C("type", "Type", "id"), C("from", "From", "date"), C("to", "To", "date"), C("days", "Days", "number"), C("reason", "Reason"), C("status", "Status", "badge")], rows },
          { title: "Leave types and annual credits", columns: [C("code", "Code", "id"), C("name", "Leave type", "text", { primary: true }), C("credits", "Days", "number")], rows: D.LEAVE_TYPES.map((t) => ({ ...t })) },
        ],
      }
    }
    case "CMP": return {
      stats: [
        { label: "Salary bands", value: D.BANDS.length, tone: "royal" },
        { label: "Below minimum wage", value: 0, hint: "Checked against the wage order in force", tone: "green" },
        { label: "Increments pending", value: 4, tone: "amber" },
        { label: "Wage orders tracked", value: D.MIN_WAGES.length, tone: "violet" },
      ],
      tables: [
        { title: "Salary structure (monthly)", columns: [C("band", "Band", "id"), C("title", "Level", "text", { primary: true }), C("min", "Minimum", "money", { pay: true }), C("mid", "Midpoint", "money", { pay: true }), C("max", "Maximum", "money", { pay: true })], rows: D.BANDS },
        { title: "Minimum wage orders (effective-dated)", columns: [C("region", "Region", "id"), C("order", "Wage order", "text", { primary: true }), C("effective", "Effective", "date"), C("daily", "Daily rate", "money")], rows: D.MIN_WAGES },
      ],
    }
    case "PAY": {
      const rows = scoped(D.PAYROLL)
      return {
        stats: [
          { label: "Current run", value: D.PAY_PERIOD.label, hint: `Pay date ${formatDate(D.PAY_PERIOD.payDate)}`, tone: "royal" },
          { label: "Employees in run", value: rows.length, tone: "teal" },
          { label: "Gross pay", value: v.seesPay ? formatPeso(sum(rows, "gross")) : "Restricted", tone: "green" },
          { label: "Net pay", value: v.seesPay ? formatPeso(sum(rows, "net")) : "Restricted", tone: "amber" },
        ],
        note: v.seesPay ? undefined : "Pay amounts are hidden for your role. Pay never leaves the pay-restricted tables for Timekeepers, HR Officers, managers or supervisors.",
        tables: [
          { title: "Pay runs", columns: [C("code", "Run", "id"), C("period", "Period", "text", { primary: true }), C("headcount", "Employees", "number"), C("status", "Status", "badge")], rows: D.PAY_RUNS },
          { title: `Payroll register - ${D.PAY_PERIOD.label}`, href: empHref, columns: [C("emp", "Employee", "emp", { primary: true }), C("basic", "Basic", "money", { pay: true }), C("ot", "Overtime", "money", { pay: true }), C("allowance", "Allowance", "money", { pay: true }), C("gross", "Gross", "money", { pay: true }), C("deductions", "Deductions", "money", { pay: true }), C("net", "Net pay", "money", { pay: true })],
            rows: rows.map((p) => ({ emp: p.emp, basic: p.basic, ot: p.ot + p.nd, allowance: p.allowance, gross: p.gross, deductions: p.gross - p.net, net: p.net })) },
        ],
      }
    }
    case "STC": return {
      stats: [
        { label: "Filings this month", value: D.REMITTANCES.filter((r) => r.period === "Sep 2026").length, tone: "royal" },
        { label: "Filed on time", value: D.REMITTANCES.filter((r) => r.status === "Filed").length, tone: "green" },
        { label: "Prepared, not filed", value: D.REMITTANCES.filter((r) => r.status === "Prepared").length, tone: "amber" },
        { label: "Penalties this year", value: v.seesPay ? formatPeso(0) : "Restricted", tone: "slate" },
      ],
      tables: [{ title: "Statutory remittance calendar", columns: [C("agency", "Agency", "id"), C("form", "Form", "text", { primary: true }), C("period", "Period"), C("due", "Due", "date"), C("amount", "Amount", "money", { pay: true }), C("status", "Status", "badge")], rows: D.REMITTANCES }],
    }
    case "BEN": {
      const rows = scoped(D.BENEFIT_CLAIMS)
      return {
        stats: [
          { label: "Claims (30 days)", value: rows.length, tone: "royal" },
          { label: "Pending", value: rows.filter((r) => r.status === "Pending").length, tone: "amber" },
          { label: "HMO enrolled", value: pct(people.length - 6, people.length), tone: "green" },
          { label: "Claimed amount", value: v.seesPay ? formatPeso(sum(rows, "amount")) : "Restricted", tone: "violet" },
        ],
        tables: [{ title: "Benefit and allowance claims", href: empHref, columns: [C("id", "Claim", "id"), C("emp", "Employee", "emp", { primary: true }), C("type", "Type"), C("amount", "Amount", "money", { pay: true }), C("filed", "Filed", "date"), C("status", "Status", "badge")], rows }],
      }
    }
    case "PMS": {
      const rows = scoped(D.EVALUATIONS)
      return {
        stats: [
          { label: "Evaluations in cycle", value: rows.length, tone: "royal" },
          { label: "Overdue", value: rows.filter((r) => r.due < D.TODAY && r.status !== "Approved").length, tone: "red" },
          { label: "Approved", value: rows.filter((r) => r.status === "Approved").length, tone: "green" },
          { label: "Very satisfactory or better", value: pct(rows.filter((r) => /Outstanding|Very/.test(r.rating)).length, rows.filter((r) => r.rating !== "-").length), tone: "amber" },
        ],
        tables: [{ title: "Performance reviews", href: empHref, columns: [C("emp", "Employee", "emp", { primary: true }), C("kind", "Review"), C("due", "Due", "date"), C("rating", "Rating"), C("status", "Status", "badge")], rows }],
      }
    }
    case "LND": return {
      stats: [
        { label: "Courses", value: D.COURSES.length, tone: "royal" },
        { label: "Mandatory courses", value: D.COURSES.filter((c) => c.mandatory).length, tone: "red" },
        { label: "Upcoming sessions", value: D.SESSIONS.length, tone: "sky" },
        { label: "Compliance (mandatory)", value: "87%", tone: "green" },
      ],
      tables: [
        { title: "Upcoming sessions", columns: [C("title", "Course", "text", { primary: true }), C("date", "Date", "date"), C("venue", "Venue"), C("seats", "Seats", "number"), C("enrolled", "Enrolled", "number")], rows: D.SESSIONS },
        { title: "Course catalogue", columns: [C("code", "Code", "id"), C("title", "Course", "text", { primary: true }), C("hours", "Hours", "number"), C("provider", "Provider"), C("mandatory", "Type", "badge")], rows: D.COURSES.map((c) => ({ ...c, mandatory: c.mandatory ? "Mandatory" : "Elective" })) },
      ],
    }
    case "CPS": return {
      stats: [
        { label: "Critical roles", value: D.SUCCESSION.length, tone: "royal" },
        { label: "With a ready-now successor", value: D.SUCCESSION.filter((s) => s.ready === "Ready now").length, tone: "green" },
        { label: "No successor", value: D.SUCCESSION.filter((s) => s.ready === "No successor").length, tone: "red" },
        { label: "Promotions this year", value: 7, tone: "amber" },
      ],
      tables: [{ title: "Succession bench", columns: [C("role", "Critical role", "text", { primary: true }), C("emp", "Incumbent", "emp"), C("ready", "Readiness", "badge"), C("candidates", "Candidates", "number"), C("risk", "Flight risk", "badge")], rows: D.SUCCESSION.map((s) => ({ ...s, emp: s.incumbent })), href: empHref }],
    }
    case "ERD": {
      const rows = scoped(D.CASES)
      return {
        stats: [
          { label: "Open cases", value: rows.filter((r) => r.stage !== "Closed").length, tone: "amber" },
          { label: "Notices to explain out", value: rows.filter((r) => r.stage === "Notice to explain").length, hint: "5 calendar days to answer", tone: "red" },
          { label: "Hearings scheduled", value: rows.filter((r) => r.stage === "Hearing").length, tone: "violet" },
          { label: "Closed (90 days)", value: rows.filter((r) => r.stage === "Closed").length, tone: "green" },
        ],
        tables: [{ title: "Disciplinary cases (two-notice due process)", href: empHref, columns: [C("id", "Case", "id"), C("emp", "Employee", "emp", { primary: true }), C("offense", "Offense"), C("stage", "Stage", "badge"), C("opened", "Opened", "date"), C("due", "Next deadline", "date")], rows }],
      }
    }
    case "GWS": return {
      stats: [
        { label: "Open matters", value: D.GRIEVANCES.filter((g) => g.status !== "Resolved").length, tone: "amber" },
        { label: "Anonymous reports", value: D.GRIEVANCES.filter((g) => g.channel.includes("anonymous")).length, tone: "violet" },
        { label: "CODI cases", value: D.GRIEVANCES.filter((g) => g.channel.includes("CODI")).length, hint: "Restricted to CODI members", tone: "red" },
        { label: "Resolved this year", value: 5, tone: "green" },
      ],
      note: "Details of grievance, whistleblower and Safe Spaces cases are visible only to the assigned investigator or CODI.",
      tables: [{ title: "Case register (details restricted)", columns: [C("id", "Reference", "id"), C("channel", "Channel", "text", { primary: true }), C("category", "Category"), C("opened", "Opened", "date"), C("status", "Status", "badge")], rows: D.GRIEVANCES }],
    }
    case "OSH": {
      const rows = D.INCIDENTS.filter((r) => !v.properties || v.properties.includes(r.property))
      return {
        stats: [
          { label: "Incidents (60 days)", value: rows.length, tone: "amber" },
          { label: "Lost-time incidents", value: rows.filter((r) => r.lostDays > 0).length, tone: "red" },
          { label: "Days since last LTI", value: 23, tone: "green" },
          { label: "Annual medical exams done", value: "82%", tone: "sky" },
        ],
        tables: [{ title: "Safety incidents", columns: [C("id", "Report", "id"), C("type", "Incident", "text", { primary: true }), C("property", "Property", "property"), C("date", "Date", "date"), C("lostDays", "Lost days", "number"), C("status", "Status", "badge")], rows }],
      }
    }
    case "SRV": return {
      stats: [
        { label: "Active surveys", value: D.SURVEYS.filter((s) => s.closes >= D.TODAY).length, tone: "royal" },
        { label: "Engagement response rate", value: `${D.SURVEYS[0].response}%`, tone: "sky" },
        { label: "Last pulse score", value: "4.1 / 5", tone: "green" },
        { label: "eNPS", value: "+18", tone: "amber" },
      ],
      tables: [{ title: "Surveys", columns: [C("title", "Survey", "text", { primary: true }), C("type", "Type"), C("opens", "Opens", "date"), C("closes", "Closes", "date"), C("response", "Response %", "percent"), C("score", "Score")], rows: D.SURVEYS }],
    }
    case "DCI": {
      const roster = D.ROSTER.filter((r) => !v.properties || v.properties.includes(r.property))
      const reqs = D.CLIENT_REQUESTS.filter((r) => !v.properties || v.properties.includes(r.property))
      return {
        stats: [
          { label: "Contracted headcount", value: sum(roster, "contract"), tone: "royal" },
          { label: "Deployed", value: sum(roster, "deployed"), tone: "teal" },
          { label: "Sites under-deployed", value: roster.filter((r) => r.variance < 0).length, tone: "red" },
          { label: "Open client requests", value: reqs.filter((r) => r.status !== "Fulfilled").length, tone: "amber" },
        ],
        tables: [
          { title: "Deployment roster vs contract", columns: [C("property", "Property", "property", { primary: true }), C("contract", "Contract", "number"), C("deployed", "Deployed", "number"), C("variance", "Variance", "number"), C("state", "Status", "badge")], rows: roster.map((r) => ({ ...r, state: r.variance < 0 ? "Under" : r.variance > 0 ? "Over" : "On contract" })) },
          { title: "Client requests", columns: [C("id", "Request", "id"), C("request", "Request", "text", { primary: true }), C("property", "Property", "property"), C("received", "Received", "date"), C("sla", "SLA"), C("status", "Status", "badge")], rows: reqs },
        ],
      }
    }
    case "ESS": {
      const me = v.self
      const bal = D.leaveBalance(me)
      const pay = D.PAYROLL.find((p) => p.emp === me.id)
      return {
        stats: [
          { label: "Vacation leave left", value: bal[0].balance, hint: `of ${bal[0].credits} days`, tone: "sky" },
          { label: "Sick leave left", value: bal[1].balance, hint: `of ${bal[1].credits} days`, tone: "teal" },
          { label: "My open requests", value: D.REQUESTS.filter((r) => r.emp === me.id && r.status === "Pending").length + 1, tone: "amber" },
          { label: "Next payslip", value: pay ? formatPeso(pay.net) : "-", hint: `Pay date ${formatDate(D.PAY_PERIOD.payDate)}`, tone: "green" },
        ],
        note: `Showing ${D.fullName(me)}'s own self-service view (${me.position}). Employees always see their own pay.`,
        tables: [
          { title: "My leave balances", columns: [C("name", "Leave", "text", { primary: true }), C("credits", "Credits", "number"), C("taken", "Taken", "number"), C("balance", "Balance", "number")], rows: bal.map((b) => ({ ...b })) },
          { title: "My requests", columns: [C("id", "Request", "id"), C("type", "Type", "text", { primary: true }), C("submitted", "Submitted", "date"), C("status", "Status", "badge")], rows: [{ id: "REQ-9399", type: "Certificate of employment", submitted: D.TODAY, status: "Pending" }, ...D.LEAVES.filter((l) => l.emp === me.id).map((l) => ({ id: l.id, type: `Leave (${l.type})`, submitted: l.from, status: l.status }))] },
        ],
      }
    }
    case "SEP": {
      const rows = scoped(D.SEPARATIONS)
      return {
        stats: [
          { label: "Separations in process", value: rows.filter((r) => r.finalPay !== "Released").length, tone: "amber" },
          { label: "Clearances pending", value: rows.filter((r) => r.clearance !== "Complete").length, tone: "red" },
          { label: "Final pay within 30 days", value: "100%", hint: "DOLE Labor Advisory 06-20", tone: "green" },
          { label: "Attrition (YTD)", value: "6.8%", tone: "slate" },
        ],
        tables: [{ title: "Separations", href: empHref, columns: [C("emp", "Employee", "emp", { primary: true }), C("type", "Type"), C("lastDay", "Last day", "date"), C("clearance", "Clearance", "badge"), C("finalPay", "Final pay", "badge")], rows }],
      }
    }
    case "PDA": return {
      stats: [
        { label: "Policies in force", value: D.POLICIES.length, tone: "royal" },
        { label: "Average acknowledgment", value: `${Math.round(D.POLICIES.reduce((s, p) => s + p.ack, 0) / D.POLICIES.length)}%`, tone: "green" },
        { label: "Below 85%", value: D.POLICIES.filter((p) => p.ack < 85).length, tone: "amber" },
        { label: "Documents generated (month)", value: 214, tone: "violet" },
      ],
      tables: [{ title: "Policy library", columns: [C("code", "Code", "id"), C("title", "Policy", "text", { primary: true }), C("version", "Version"), C("effective", "Effective", "date"), C("ack", "Acknowledged", "percent")], rows: D.POLICIES }],
    }
    case "CAR": return {
      stats: [
        { label: "Open audit findings", value: D.AUDIT_FINDINGS.filter((f) => f.status !== "Closed").length, tone: "amber" },
        { label: "Overdue actions", value: D.AUDIT_FINDINGS.filter((f) => f.status === "Overdue").length, tone: "red" },
        { label: "Risks on register", value: D.RISKS.length, tone: "violet" },
        { label: "High residual risks", value: D.RISKS.filter((r) => r.likelihood * r.impact >= 15).length, tone: "rose" },
      ],
      tables: [
        { title: "Audit findings", columns: [C("id", "Finding", "id"), C("area", "Area", "text", { primary: true }), C("rating", "Rating", "badge"), C("owner", "Owner"), C("due", "Due", "date"), C("status", "Status", "badge")], rows: D.AUDIT_FINDINGS },
        { title: "HR risk register", columns: [C("id", "Risk", "id"), C("risk", "Description", "text", { primary: true }), C("score", "Score", "number"), C("owner", "Owner"), C("treatment", "Treatment")], rows: D.RISKS.map((r) => ({ ...r, score: r.likelihood * r.impact })) },
      ],
    }
    case "ANR": return {
      stats: [
        { label: "Headcount", value: people.length, tone: "royal" },
        { label: "Turnover (YTD)", value: "6.8%", tone: "rose" },
        { label: "Average tenure", value: `${(people.reduce((s, e) => s + (2026 - Number(e.hired.slice(0, 4))), 0) / people.length).toFixed(1)} yrs`, tone: "teal" },
        { label: "Time to fill", value: "24 days", tone: "amber" },
      ],
      tables: [
        { title: "Standard report library", columns: [C("code", "Code", "id"), C("title", "Report", "text", { primary: true }), C("cadence", "Cadence"), C("owner", "Owner")], rows: D.REPORTS },
        { title: "Headcount by property", columns: [C("property", "Property", "property", { primary: true }), C("headcount", "Headcount", "number"), C("share", "Share", "percent")], rows: props.map((p) => { const n = people.filter((e) => e.property === p.id).length; return { property: p.id, headcount: n, share: Math.round((n / Math.max(1, people.length)) * 100) } }) },
      ],
    }
  }
  return { stats: [], tables: [] }
}

export function dashboardWorkspace(v: Viewer): Workspace {
  const people = D.ACTIVE.filter((e) => inScope(v, e.id))
  const att = D.ATTENDANCE.filter((a) => inScope(v, a.emp))
  const present = att.filter((a) => a.status === "Present" || a.status === "Late").length
  return {
    stats: [
      { label: "Active headcount", value: people.length, hint: `${new Set(people.map((e) => e.property)).size} properties`, tone: "royal" },
      { label: "Present today", value: present, hint: pct(present, att.filter((a) => a.status !== "Rest day").length) + " attendance", tone: "green" },
      { label: "Pending approvals", value: D.REQUESTS.filter((r) => r.status === "Pending" && inScope(v, r.emp)).length, hint: "Across all request types", tone: "amber" },
      { label: "Open vacancies", value: D.REQUISITIONS.filter((r) => r.status === "Open").reduce((s, r) => s + r.heads, 0), hint: `${D.REQUISITIONS.filter((r) => r.status === "Open").length} requisitions`, tone: "violet" },
    ],
    tables: [],
  }
}
