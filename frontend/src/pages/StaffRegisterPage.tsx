import { useState } from "react";
import { useNavigate } from "react-router";
import { Save, Eye, EyeOff, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Btn } from "@/components/ui/Btn";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { FormSection } from "@/components/ui/FormSection";
import { genId, cls } from "@/lib/utils";
import type { AppUser, Role } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  { value: "doctor", label: "Doctor / Medical Officer" },
  { value: "lab",    label: "Lab Technician" },
  { value: "jmo",    label: "Judicial Medical Officer" },
];

const DESIGNATION_PRESETS: Record<string, string[]> = {
  doctor: ["Medical Officer", "Senior Medical Officer", "Consultant", "Registrar", "House Officer"],
  lab:    ["Lab Technician", "Senior Lab Technician", "Chief Lab Technician"],
  jmo:    ["Judicial Medical Officer", "Additional JMO", "Senior JMO", "Consultant JMO"],
};

export function StaffRegisterPage() {
  const { addUser, users } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    role: "doctor" as Role, designation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image file size should be less than 2MB");
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }
  };

  const set = (k: string) => (v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim())        e.name        = "Full name is required.";
    if (!form.email.trim())       e.email       = "Email is required.";
    if (!form.phone.trim())       e.phone       = "Phone number is required.";
    if (!form.designation.trim()) e.designation  = "Designation is required.";
    if (form.password.length < 6) e.password     = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (users.some(u => u.email === form.email.trim())) e.email = "Email already exists.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    let profilePictureUrl = "";
    try {
      if (imageFile) {
        profilePictureUrl = await api.storage.uploadImage(imageFile);
      }
      const newUser: AppUser = {
        id: genId("USR"),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
        designation: form.designation.trim(),
        profilePictureUrl: profilePictureUrl || undefined,
      };
      await addUser(newUser);
      navigate("/staff");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to register staff. Profile picture upload might have failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const presets = DESIGNATION_PRESETS[form.role] ?? [];

  return (
    <div>
      <PageHeader
        title="Register New Staff"
        subtitle="Create login credentials for a doctor or lab technician"
        onBack={() => navigate("/staff")}
        actions={
          <>
            <Btn variant="secondary" onClick={() => navigate("/staff")} disabled={isSubmitting}>Cancel</Btn>
            <Btn variant="primary" icon={<Save size={14} />} onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Staff"}
            </Btn>
          </>
        }
      />

      <div className="max-w-xl">
        <FormSection title="Personal Details">
          <FormField label="Profile Picture">
            <div className="flex items-center gap-4 mt-1">
              <div className="relative group w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 hover:bg-slate-100/80 transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center gap-1">
                    <User size={24} />
                    <span className="text-[10px] font-medium">Upload</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={cls(
                  "cursor-pointer bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded px-2.5 py-1 text-xs font-medium inline-block text-center transition-colors",
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                )}>
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
                {imageFile && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold text-left transition-colors disabled:opacity-50"
                  >
                    Remove Photo
                  </button>
                )}
                <p className="text-[10px] text-slate-400">JPG, PNG or WEBP. Max 2MB.</p>
              </div>
            </div>
          </FormField>

          <FormField label="Full Name" required>
            <Input value={form.name} onChange={set("name")} placeholder="e.g. Dr. Amal Perera" />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </FormField>

          <FormField label="Phone Number" required>
            <Input value={form.phone} onChange={set("phone")} placeholder="e.g. 0771234567" />
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
          </FormField>

          <FormField label="Role" required>
            <Select value={form.role} onChange={v => { set("role")(v); set("designation")(""); }}
              options={ROLE_OPTIONS} />
          </FormField>

          <FormField label="Designation" required>
            <Input value={form.designation} onChange={set("designation")} placeholder="e.g. Medical Officer" />
            {errors.designation && <p className="text-xs text-red-600 mt-1">{errors.designation}</p>}
            {presets.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {presets.map(p => (
                  <button key={p} type="button"
                    onClick={() => set("designation")(p)}
                    className="px-2 py-0.5 text-xs rounded border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors">
                    {p}
                  </button>
                ))}
              </div>
            )}
          </FormField>
        </FormSection>

        <FormSection title="Login Credentials">
          <FormField label="Email Address" required>
            <Input value={form.email} onChange={set("email")} placeholder="e.g. dr.perera@forensic.gov" />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            <p className="text-xs text-slate-400 mt-1">Enter a valid email address.</p>
          </FormField>

          <FormField label="Password" required>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e => set("password")(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full border border-slate-300 rounded px-3 py-1.5 pr-10 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </FormField>

          <FormField label="Confirm Password" required>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e => set("confirmPassword")(e.target.value)}
              placeholder="Re-enter password"
              className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
            {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
          </FormField>
        </FormSection>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>Note:</strong> The new staff member will be able to log in immediately after registration.
          Share the email and password with them securely.
        </div>
      </div>
    </div>
  );
}
