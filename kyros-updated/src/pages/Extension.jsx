import Nav from '../components/Nav.jsx';
import { EXT_STEPS, EXT_PERKS, BRAND } from '../config/content.js';
export default function Extension() {
  return (
    <div className="page"><Nav />
      <section className="glass-main-frame ext">
        <h1>{BRAND.name} focus extension</h1>
        <p className="lead">Keep short-form video and doomscrolling out of your study time, without the guilt.</p>
        <p className="lead">Install Kyros Focus in Google Chrome. Choose Instagram and/or YouTube in the timer; those sites stay blocked until your session ends.</p>
        <p className="ext-browser-note">Chrome extensions do not run inside the Codex or other in-app browser previews. Open this local address in Google Chrome to use blocking.</p>
        <a className="btn ext-download" href={`${import.meta.env.BASE_URL}kyros-focus-extension.zip`} download="kyros-focus-extension.zip">Download Chrome extension</a>
        <div className="cols">
          <div><h3>What you get</h3><ul>{EXT_PERKS.map((p) => <li key={p}>{p}</li>)}</ul></div>
          <div><h3>How to install</h3><ol>{EXT_STEPS.map((s) => <li key={s}>{s}</li>)}</ol></div>
        </div>
      </section>
    </div>
  );
}
