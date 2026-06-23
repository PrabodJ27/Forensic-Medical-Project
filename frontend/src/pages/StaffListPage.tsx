import { useNavigate } from "react-router";
import { Plus, Stethoscope, FlaskConical, Shield, Scale } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Btn } from "@/components/ui/Btn";
import { cls } from "@/lib/utils";
import type { Role } from "@/types";

const ROLE_LABELS: Record<Role, string> = {
  doctor: "Doctor",
  admin:  "Admin / Police",
  lab:    "Lab Technician",
  jmo:    "Judicial Medical Officer",
};

const ROLE_COLORS: Record<Role, string> = {
  doctor: "bg-blue-100 text-blue-700",
  admin:  "bg-slate-100 text-slate-700",
  lab:    "bg-emerald-100 text-emerald-700",
  jmo:    "bg-purple-100 text-purple-700",
};

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  doctor: <Stethoscope size={14} />,
  admin:  <Shield size={14} />,
  lab:    <FlaskConical size={14} />,
  jmo:    <Scale size={14} />,
};

export function StaffListPage() {
  const { users } = useApp();
  const navigate = useNavigate();

  const doctors  = users.filter(u => u.role === "doctor");
  const jmos     = users.filter(u => u.role === "jmo");
  const labTechs = users.filter(u => u.role === "lab");
  const admins   = users.filter(u => u.role === "admin");

  const Section = ({ title, items }: { title: string; items: typeof users }) => (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
      <div className="px-5 py-3 border-b border-border bg-slate-50 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <span className="text-xs text-slate-400">{items.length} member{items.length !== 1 ? "s" : ""}</span>
      </div>
      {items.length === 0
        ? <div className="px-5 py-6 text-sm text-slate-400 text-center italic">No members registered.</div>
        : (
          <div className="divide-y divide-border">
            {items.map(u => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cls("w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm",
                    u.role === "doctor" ? "bg-blue-100 text-blue-600"
                    : u.role === "jmo"  ? "bg-purple-100 text-purple-600"
                    : u.role === "lab"  ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-100 text-slate-600")}>
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.designation}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className={cls("inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium", ROLE_COLORS[u.role])}>
                      {ROLE_ICONS[u.role]} {ROLE_LABELS[u.role]}
                    </span>
                    <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{u.email}</code>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Phone: {u.phone}</span>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Staff Management"
        subtitle="Manage doctors, lab technicians and admin accounts"
        actions={
          <Btn variant="primary" icon={<Plus size={14} />} onClick={() => navigate("/staff/register")}>
            Register Staff
          </Btn>
        }
      />
      <Section title="Doctors / Medical Officers" items={doctors} />
      <Section title="Judicial Medical Officers (JMO)" items={jmos} />
      <Section title="Lab Technicians" items={labTechs} />
      <Section title="Admin / Police Staff" items={admins} />
    </div>
  );
}
