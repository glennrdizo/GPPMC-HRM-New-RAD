import {
  Activity, BadgeCheck, BarChart3, Briefcase, CalendarDays, ClipboardCheck, Clock, Coins, DoorOpen, FileText, Gavel, GraduationCap, HandCoins,
  HeartPulse, KeyRound, Landmark, LayoutDashboard, Map, MapPin, Megaphone, Network, Plug, ScaleIcon, ShieldAlert, Smartphone, Star, TrendingUp,
  UserCheck, Users, Wallet, Workflow, type LucideIcon,
} from "lucide-react"

export const MODULE_ICONS: Record<string, LucideIcon> = {
  PAS: KeyRound, DSH: LayoutDashboard, WAN: Workflow, INT: Plug, ORG: Network, ECR: Users, RAT: Briefcase, ONB: ClipboardCheck, PES: UserCheck,
  TKA: Clock, LVM: CalendarDays, CMP: TrendingUp, PAY: Wallet, STC: Landmark, BEN: HandCoins, PMS: Star, LND: GraduationCap, CPS: BadgeCheck,
  ERD: Gavel, GWS: Megaphone, OSH: HeartPulse, SRV: Activity, DCI: MapPin, ESS: Smartphone, SEP: DoorOpen, PDA: FileText, CAR: ShieldAlert, ANR: BarChart3,
}
export const GROUP_ICONS: Record<string, LucideIcon> = { A: KeyRound, B: Users, C: Briefcase, D: Coins, E: Star, F: ScaleIcon, G: MapPin, H: BarChart3 }
export { Map as MapIcon, LayoutDashboard }
