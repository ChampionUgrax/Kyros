import Nav from '../components/Nav.jsx';
import { EXT_STEPS, EXT_PERKS, BRAND } from '../config/content.js';
const URL_ = import.meta.env.VITE_EXTENSION_URL;
export default function Extension() {
  return (
    <div className="page"><Nav />
      <section className="glass-main-frame ext">
        <h1>{BRAND.name} focus extension</h1>
        <p className="lead">Keep short-form video and doomscrolling out of your study time, without the guilt.</p>
        <a className={`btn ${URL_ ? '' : 'disabled'}`} href={URL_ || undefined} target="_blank" rel="noreferrer" aria-disabled={!URL_}>
          {URL_ ? 'Download extension' : 'Download link coming soon'}</a>
        <div className="cols">
          <div><h3>What you get</h3><ul>{EXT_PERKS.map((p) => <li key={p}>{p}</li>)}</ul></div>
          <div><h3>How to install</h3><ol>{EXT_STEPS.map((s) => <li key={s}>{s}</li>)}</ol></div>
        </div>
      </section>
    </div>
  );
}
