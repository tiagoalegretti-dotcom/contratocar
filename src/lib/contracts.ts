import { emptyContract, type ContractData } from "@/lib/types";
import { getDb } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

export type SavedContract = {
  id: string;
  data: ContractData;
  paid: boolean;
  paymentId?: string;
  updatedAt: string;
};

function localKey(uid: string) {
  return `contratocar-contracts-${uid}`;
}

function readLocal(uid: string): SavedContract[] {
  try {
    const raw = localStorage.getItem(localKey(uid));
    if (!raw) return [];
    return JSON.parse(raw) as SavedContract[];
  } catch {
    return [];
  }
}

function writeLocal(uid: string, rows: SavedContract[]) {
  localStorage.setItem(localKey(uid), JSON.stringify(rows));
}

export function contractLabel(row: SavedContract) {
  const d = { ...emptyContract(), ...row.data };
  const vehicle = [d.brand, d.model, d.plate].filter(Boolean).join(" ").trim();
  return vehicle || "Contrato em rascunho";
}

export async function listContracts(uid: string): Promise<SavedContract[]> {
  const local = readLocal(uid);
  const db = getDb();
  if (!db) return local.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  try {
    const snap = await getDocs(
      query(collection(db, "users", uid, "contracts"), orderBy("updatedAt", "desc")),
    );
    const remote = snap.docs.map((d) => d.data() as SavedContract);
    writeLocal(uid, remote);
    return remote;
  } catch {
    return local.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

export async function getContract(uid: string, id: string) {
  const local = readLocal(uid).find((r) => r.id === id);
  const db = getDb();
  if (!db) return local ?? null;
  try {
    const snap = await getDoc(doc(db, "users", uid, "contracts", id));
    return snap.exists() ? (snap.data() as SavedContract) : local ?? null;
  } catch {
    return local ?? null;
  }
}

export async function saveContract(
  uid: string,
  row: Omit<SavedContract, "updatedAt"> & { updatedAt?: string },
) {
  const next: SavedContract = {
    ...row,
    data: { ...emptyContract(), ...row.data },
    updatedAt: row.updatedAt || new Date().toISOString(),
  };
  const rows = readLocal(uid).filter((r) => r.id !== next.id);
  writeLocal(uid, [next, ...rows]);
  const db = getDb();
  if (!db) return next;
  try {
    await setDoc(doc(db, "users", uid, "contracts", next.id), next);
  } catch {
    /* local copy still saved */
  }
  return next;
}
