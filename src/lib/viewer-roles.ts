// Demo roles for the "View as" switch (safe to import in the browser).
export const VIEW_ROLES = [
  { code: "EXE", label: "Executive", note: "Company-wide, sees pay" },
  { code: "HRM", label: "HR Manager", note: "Company-wide HR data, sees pay" },
  { code: "PAY", label: "Payroll Officer", note: "Payroll and statutory, sees pay" },
  { code: "HRO", label: "HR Officer", note: "HR data, no pay" },
  { code: "CLH", label: "Cluster Head", note: "Cluster 1 properties only, no pay" },
  { code: "EMP", label: "Employee", note: "Own record only" },
] as const
export type ViewRole = (typeof VIEW_ROLES)[number]["code"]
