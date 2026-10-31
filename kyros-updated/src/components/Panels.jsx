  import { useRef, useState } from 'react';
  import { useFetch } from '../services/hooks.js';
  import { api } from '../services/api.js';

  export function State({ loading, error, empty }) {
    if (loading) return <div className="center muted"><span className="spinner" />Loading…</div>;
    if (error) return <div className="center err">Couldn’t load this: {error}</div>;
    return <div className="center muted">{empty}</div>;
  }
  const Stats = ({ data }) => <div className="grid">{data.map((s) => (
    <div key={s.label} className="glass-card stat"><small>{s.label}</small><strong>{s.value}</strong>{s.hint && <span>{s.hint}</span>}</div>))}</div>;
  const List = ({ data }) => <div className="list">{data.map((r) => (
    <div key={r.id} className="glass-card row"><div><h4>{r.title}</h4>{r.subtitle && <p>{r.subtitle}</p>}</div>{r.meta && <span className="pill">{r.meta}</span>}</div>))}</div>;
  const Heatmap = ({ data }) => <div className="heat">{data.map((t) => (
    <div key={t.topic} className="cell" title={`${t.score}%`} style={{ '--h': Math.round(t.score * 1.3) }}><b>{t.topic}</b><span>{t.score}%</span></div>))}</div>;
  const Board = ({ data }) => <div className="list">{data.map((r) => (
    <div key={r.id} className="glass-card row"><div className="rank">{r.rank}</div><h4 style={{ flex: 1 }}>{r.name}</h4><span className="pill">{r.value}</span></div>))}</div>;
  const TYPES = { stats: Stats, list: List, heatmap: Heatmap, leaderboard: Board };

  export function Panel({ title, endpoint, type, empty = 'Nothing here yet.' }) {
    const { data, loading, error } = useFetch(endpoint);
    const View = TYPES[type];
    return (
      <section className="panel">
        {title && <h3>{title}</h3>}
        {loading || error || !data?.length ? <State loading={loading} error={error} empty={empty} /> : <View data={data} />}
      </section>
    );
  }

  export function Upload() {
    const ref = useRef(); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false); const [over, setOver] = useState(false);
    const send = async (file) => {
      if (!file) return; setBusy(true); setMsg('');
      const fd = new FormData(); fd.append('file', file);
      try { setMsg((await api.post('/student/materials', fd))?.message || 'Uploaded. Your deck is being built.'); }
      catch (e) { setMsg(e.message); } finally { setBusy(false); }
    };
    return (
      <div className={`glass-card drop ${over ? 'over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); send(e.dataTransfer.files[0]); }}>
        <div className="big">📄</div><h3>Drop notes or a syllabus</h3><p className="muted">PDF, DOCX or TXT</p>
        <input ref={ref} type="file" hidden accept=".pdf,.doc,.docx,.txt" onChange={(e) => send(e.target.files[0])} />
        <button className="btn" disabled={busy} onClick={() => ref.current.click()}>{busy ? 'Uploading…' : 'Choose file'}</button>
        {msg && <p role="status">{msg}</p>}
      </div>
    );
  }
