import type { AppUser, Patient, MLEFForm, LabRequest } from "@/types";

export const USERS: AppUser[] = [
  { id: "d1", name: "Dr. Amal Perera",        role: "doctor", designation: "Medical Officer",        email: "dr.perera@forensic.gov",   phone: "0771234567", password: "Doctor@123" },
  { id: "d2", name: "Dr. Saman Fernando",      role: "doctor", designation: "Senior Medical Officer", email: "dr.fernando@forensic.gov", phone: "0772345678", password: "Doctor@456" },
  { id: "a1", name: "Nimal Silva",             role: "admin",  designation: "Admin Officer",          email: "nimal.silva@forensic.gov", phone: "0773456789", password: "Admin@123"  },
  { id: "a2", name: "Kamani Dissanayake",      role: "admin",  designation: "Police Officer",         email: "kamani.d@forensic.gov",    phone: "0774567890", password: "Admin@456"  },
  { id: "l1", name: "Chaminda Wickramasinghe", role: "lab",    designation: "Lab Technician",         email: "chaminda.w@forensic.gov",  phone: "0775678901", password: "Lab@123"    },
  { id: "l2", name: "Dilini Jayawardena",      role: "lab",    designation: "Senior Lab Technician",  email: "dilini.j@forensic.gov",    phone: "0776789012", password: "Lab@456"    },
  { id: "j1", name: "Dr. Ruwan Perera",        role: "jmo",    designation: "Judicial Medical Officer", email: "dr.ruwan@forensic.gov",   phone: "0777890123", password: "Jmo@123"    },
];

export const INIT_PATIENTS: Patient[] = [
  { id: "P2026-001", name: "Ruwan Kumara",    dob: "1985-03-15", age: 41, sex: "Male",   address: "123 Galle Road, Colombo 03",   nic: "851530423V", email: "ruwan.k@gmail.com", phone: "0711234567", registeredAt: "2026-06-20T08:30:00", registeredBy: "Nimal Silva" },
  { id: "P2026-002", name: "Shamila Perera",  dob: "1992-07-22", age: 33, sex: "Female", address: "45 Kandy Road, Kurunegala",     nic: "927040756V", email: "shamila.p@gmail.com", phone: "0712345678", registeredAt: "2026-06-21T09:15:00", registeredBy: "Kamani Dissanayake" },
  { id: "P2026-003", name: "Ajith Bandara",   dob: "1978-11-08", age: 47, sex: "Male",   address: "78 Negombo Road, Wattala",      nic: "782130589V", email: "ajith.b@gmail.com", phone: "0713456789", registeredAt: "2026-06-21T10:00:00", registeredBy: "Nimal Silva" },
];

export const INIT_MLEF: MLEFForm[] = [{
  id: "MLEF-2026-001", patientId: "P2026-001",
  policeStation: "Colombo Fort", mlefNo: "CF/2026/1234", dateOfIssue: "2026-06-20",
  examineeName: "Ruwan Kumara",
  examineeAddress: "123 Galle Road, Colombo 03",
  examineeAge: "41", examineeSex: "Male",
  reasonForReferring: "Assault causing bodily harm — section 314 of Penal Code",
  officerName: "Nimal Silva", officerRank: "Sub Inspector", officerRegNo: "PS/7890",
  officerPoliceStation: "Colombo Fort",
  partAFilledBy: "Nimal Silva", partAFilledAt: "2026-06-20T08:30:00",
  hospital: "National Hospital Colombo", ward: "Surgical Ward 5", bhtNo: "23181",
  admissionDate: "2026-06-20", examDateTime: "2026-06-20T09:40:00",
  dischargeDate: "", examPlace: "NHC",
  bodyHarmTypes: ["laceration", "contusion", "abrasion"], internalInjuries: "Nil",
  causativeWeapon: ["blunt"], causativeWeaponOther: "", hurtCategory: "non-grievous", endangersLife: "no",
  alcoholExam: "negative", drugsExam: "negative", sexualAssaultSigns: [],
  briefHistory: "Patient states he was attacked by unknown persons at around 8:00 PM on 19/06/2026 near Maradana Junction.",
  examFindings: "Multiple lacerations over scalp (3cm × 0.5cm), contusions on upper arms and back, abrasions on knees.",
  investigations: "X-Ray skull, X-Ray chest", referrals: "Nil",
  otherOpinions: "Injuries are consistent with blunt force trauma.",
  remarks: "Patient cooperative for examination.",
  doctorName: "Dr. Amal Perera", doctorQualifications: "MBBS", slmcRegNo: "SLMC/12345",
  doctorDesignation: "Medical Officer", refNo: "NHC/MLR/2026/001",
  partBFilledBy: "d1", partBFilledAt: "2026-06-20T10:15:00", labRequestId: "",
  status: "complete", createdAt: "2026-06-20T08:30:00", createdBy: "a1",
}];

export const INIT_LAB: LabRequest[] = [{
  id: "LAB-2026-001", patientId: "P2026-002",
  requestedBy: "d2", requestedByName: "Dr. Saman Fernando",
  requestedAt: "2026-06-21T10:30:00", formType: "mlef", formId: "",
  testTypes: ["blood_alcohol", "drug_screen"], urgency: "urgent",
  clinicalHistory: "Patient brought by police. Alleged assault. Suspected alcohol consumption.",
  status: "pending", testResults: "", observations: "", conclusion: "", labTechName: "", completedAt: "",
}];

export const TEST_LABELS: Record<string, string> = {
  blood_alcohol: "Blood Alcohol", drug_screen: "Drug Screen", toxicology: "Toxicology",
  histology: "Histology", blood_group: "Blood Group", dna: "DNA", serology: "Serology",
  urine_analysis: "Urine Analysis", trace_evidence: "Trace Evidence",
};

export const BODY_HARM_OPTIONS = [
  { value: "abrasion",      label: "Abrasion" },
  { value: "contusion",     label: "Contusion" },
  { value: "laceration",    label: "Laceration" },
  { value: "stab",          label: "Stab" },
  { value: "cut",           label: "Cut" },
  { value: "fracture",      label: "Fracture" },
  { value: "bite",          label: "Bite" },
  { value: "dislocation",   label: "Dislocation/Subluxation" },
  { value: "firearms_inj",  label: "Firearm Inj." },
  { value: "burns",         label: "Burns" },
  { value: "explosive_inj", label: "Explosive Inj." },
  { value: "none",          label: "None" },
];

export const WEAPON_OPTIONS = [
  { value: "blunt",     label: "Blunt" },
  { value: "sharp",     label: "Sharp" },
  { value: "grip_teeth",label: "Grip/Teeth" },
  { value: "firearm",   label: "Firearm" },
  { value: "explosive", label: "Explosive Devices" },
  { value: "others",    label: "Others" },
];

export const SEXUAL_ASSAULT_OPTIONS = [
  { value: "vaginal", label: "Signs of vaginal/hymen penetration present" },
  { value: "anal",    label: "Signs of anal penetration present" },
  { value: "labial",  label: "Signs consistent with inter labial penetration present" },
];
