import { cookies } from "next/headers"
import { ACTIVE, CLUSTERS, EMPLOYEES, PROPERTIES, type Employee } from "@/lib/data"
import { VIEW_ROLES, type ViewRole } from "@/lib/viewer-roles"
export { VIEW_ROLES, type ViewRole }

// Demo access model (HRM-00.02 roles, HRM-00.03 data scope). The "View as" switch sets a cookie; nothing here is a login.
export const ROLE_COOKIE = "hrm_view_as"

export type Viewer = { role: ViewRole; label: string; seesPay: boolean; properties: string[] | null; self: Employee }

export async function getViewer(): Promise<Viewer> {
  const raw = (await cookies()).get(ROLE_COOKIE)?.value
  const role = (VIEW_ROLES.find((r) => r.code === raw)?.code ?? "HRM") as ViewRole
  const label = VIEW_ROLES.find((r) => r.code === role)!.label
  const self = role === "EMP" ? ACTIVE.find((e) => e.position === "Housekeeper")! : role === "CLH" ? ACTIVE.find((e) => e.position === "Property Manager")! : EMPLOYEES[0]
  return {
    role, label, self,
    seesPay: role === "EXE" || role === "HRM" || role === "PAY",
    properties: role === "CLH" ? PROPERTIES.filter((p) => p.cluster === CLUSTERS[0]).map((p) => p.id) : role === "EMP" ? [self.property] : null,
  }
}

// Rows about people are limited to the viewer's scope: a cluster head sees their properties, an employee only themself.
export const inScope = (v: Viewer, empId: string) => {
  if (v.role === "EMP") return empId === v.self.id
  if (!v.properties) return true
  const e = EMPLOYEES.find((x) => x.id === empId)
  return !!e && v.properties.includes(e.property)
}
