import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function EditableText({ value, contentKey, onSaved, as: Tag = "span", className = "", inputClassName = "", type = "text", placeholder = "" }) {
  const { isOwner } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  const save = async () => {
    setEditing(false);
    if (draft === value) return;
    try {
      const payload = type === "number" ? Number(draft) : draft;
      if (contentKey) await api.put(`/api/content/${contentKey}`, { value: payload });
      onSaved?.(payload);
      toast.success("Updated");
    } catch (e) { toast.error(e.response?.data?.message || "Update failed"); setDraft(value || ""); }
  };
  if (!isOwner || !editing) return <Tag className={`${className} ${isOwner ? "owner-editable" : ""}`} onDoubleClick={() => isOwner && setEditing(true)}>{value || placeholder}</Tag>;
  return <input autoFocus className={`rounded-lg border-2 border-saffron bg-white px-2 py-1 text-ink ${inputClassName}`} value={draft} type={type} onChange={(e) => setDraft(e.target.value)} onBlur={save} onKeyDown={(e) => e.key === "Enter" && save()} />;
}
