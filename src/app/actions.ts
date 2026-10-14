"use server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { VIEW_ROLES } from "@/lib/viewer-roles"

const ROLE_COOKIE = "hrm_view_as"

// Demo only: switches whose eyes the app shows (HRM-00.03 data scope). Not a login.
export async function setViewAs(formData: FormData) {
  const role = String(formData.get("role"))
  if (!VIEW_ROLES.some((r) => r.code === role)) return
  ;(await cookies()).set(ROLE_COOKIE, role, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 30 })
  revalidatePath("/", "layout")
}
