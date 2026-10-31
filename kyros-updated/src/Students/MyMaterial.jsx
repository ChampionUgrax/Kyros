import { useState } from "react";
import { FileText, FolderOpen, UploadCloud } from "lucide-react";
import { api } from "../services/api.js";
import { useFetch } from "../services/hooks.js";
import { State } from "../components/Panels.jsx";

export default function MyMaterials() {
  const { data, loading, error, reload } = useFetch("/student/materials");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const upload = async (event) => {
    event.preventDefault(); if (!file) return;
    setBusy(true); setMessage("");
    try { const body = new FormData(); body.append("file", file); await api.post("/student/materials", body); setFile(null); setMessage("Your material was uploaded and saved."); reload(); }
    catch (err) { setMessage(err.message || "The file could not be uploaded."); }
    finally { setBusy(false); }
  };
  const materials = Array.isArray(data) ? data : [];
  return (
    <section className="student-page-stack">
      <div className="student-section-heading">
        <div>
          <h2>My Materials</h2>
          <p>Upload your notes to build a personal library and create AI practice quizzes.</p>
        </div>
      </div>
      <form className="student-page-section" onSubmit={upload}>
        <label className="student-page-kicker" htmlFor="material-file"><UploadCloud size={16}/> ADD A STUDY RESOURCE</label>
        <p>PDF or TXT, up to 10 MB.</p>
        <input id="material-file" type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={(event)=>setFile(event.target.files?.[0]||null)} required />
        <button className="student-page-button" disabled={!file||busy} type="submit">{busy?"Uploading…":"Upload material"}</button>
        {message && <p role="status">{message}</p>}
      </form>
      <section className="student-page-section"><div className="student-page-section-heading"><div><h3><FolderOpen size={18}/> Your library</h3><p>Private materials saved to your learner account.</p></div></div>
        {loading||error||!materials.length ? <State loading={loading} error={error} empty="Your uploaded notes and resources will appear here."/> : <div className="student-topic-list">{materials.map((item)=><article className="student-topic-card" key={item.id}><div className="student-topic-main"><FileText size={22}/><div className="student-topic-copy"><h4>{item.filename}</h4><p>{item.fileType?.toUpperCase()} · {item.pages ? `${item.pages} pages · ` : ""}{Number(item.characters||0).toLocaleString()} characters</p></div></div><time>{item.createdAt?new Date(item.createdAt).toLocaleDateString():""}</time></article>)}</div>}
      </section>
    </section>
  );
}
