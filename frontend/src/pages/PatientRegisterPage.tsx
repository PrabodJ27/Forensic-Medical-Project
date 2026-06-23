import { useState } from "react";
import { useNavigate } from "react-router";
import { Save } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Btn } from "@/components/ui/Btn";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { genId } from "@/lib/utils";
import type { Patient } from "@/types";

export function PatientRegisterPage() {
  const { currentUser, addPatient } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", dob: "", sex: "Male", address: "", nic: "", email: "", phone: "" });
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.dob || !form.nic || !form.email || !form.phone || !currentUser) return;
    const dob = new Date(form.dob);
    const age = new Date().getFullYear() - dob.getFullYear();
    const p: Patient = {
      id: genId("P"),
      name: form.name, dob: form.dob, age, sex: form.sex,
      address: form.address, nic: form.nic, email: form.email, phone: form.phone,
      registeredAt: new Date().toISOString(), registeredBy: currentUser.name,
    };
    addPatient(p);
    navigate("/patients");
  };

  return (
    <div>
      <PageHeader
        title="Register New Patient"
        onBack={() => navigate("/patients")}
        actions={
          <>
            <Btn variant="secondary" onClick={() => navigate("/patients")}>Cancel</Btn>
            <Btn variant="primary" icon={<Save size={14} />} onClick={handleSave}>Register Patient</Btn>
          </>
        }
      />
      <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-x-4">
          <FormField label="Full Name" required><Input value={form.name} onChange={set("name")} placeholder="Full name" /></FormField>
          <FormField label="NIC Number" required><Input value={form.nic} onChange={set("nic")} placeholder="e.g. 901234567V" /></FormField>
          <FormField label="Date of Birth" required><Input type="date" value={form.dob} onChange={set("dob")} /></FormField>
          <FormField label="Sex" required>
            <Select value={form.sex} onChange={set("sex")}
              options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]} />
          </FormField>
          <FormField label="Email Address" required><Input type="email" value={form.email} onChange={set("email")} placeholder="e.g. patient@example.com" /></FormField>
          <FormField label="Phone Number" required><Input value={form.phone} onChange={set("phone")} placeholder="e.g. 0712345678" /></FormField>
          <FormField label="Address" colSpan="full">
            <Textarea value={form.address} onChange={set("address")} rows={2} placeholder="Full residential address" />
          </FormField>
        </div>
        <p className="text-xs text-slate-400 mt-2">* Required. Patient ID auto-generated on registration.</p>
      </div>
    </div>
  );
}
