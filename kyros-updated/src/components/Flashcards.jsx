import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useFetch } from '../services/hooks.js';
import { State } from './Panels.jsx';

const RATINGS = [['again', 'Again'], ['hard', 'Hard'], ['good', 'Good'], ['easy', 'Easy']];

export function Card({ front, back, flipped, onFlip, tone = 'idle' }) {
  return (
    <div className={`fc tone-${tone}`} onClick={onFlip} role="button" tabIndex={0}
      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), onFlip())} aria-label="Flip card">
      <div className={`fc-inner ${flipped ? 'is-flipped' : ''}`}>
        <div className="fc-face"><small>Question</small><p>{front}</p><em>Tap to flip</em></div>
        <div className="fc-face fc-back"><small>Answer</small><p>{back}</p></div>
      </div>
    </div>
  );
}

function Session({ deckId, onExit }) {
  const { data: cards, loading, error } = useFetch(`/student/decks/${deckId}/cards`);
  const [i, setI] = useState(0), [flipped, setFlipped] = useState(false), [tone, setTone] = useState('idle'), [leaving, setLeaving] = useState(false);
  useEffect(() => { setI(0); }, [deckId]);
  if (loading || error || !cards?.length) return <State loading={loading} error={error} empty="No cards due in this deck." />;
  if (i >= cards.length) return <div className="center"><h3>Deck complete 🎉</h3><button className="btn" onClick={onExit}>Back to decks</button></div>;
  const c = cards[i];
  const rate = (r) => {
    api.post(`/student/cards/${c.id}/review`, { rating: r }).catch(() => {});
    setTone(r); setLeaving(true);
    setTimeout(() => { setI((n) => n + 1); setFlipped(false); setTone('idle'); setLeaving(false); }, 450);
  };
  return (
    <div className="fc-wrap">
      <div className="bar"><span style={{ width: `${(i / cards.length) * 100}%` }} /></div>
      <small className="muted">{i + 1} of {cards.length}</small>
      <div className={leaving ? 'fc-leave' : 'fc-enter'} key={c.id}>
        <Card front={c.front} back={c.back} flipped={flipped} onFlip={() => setFlipped((f) => !f)} tone={tone} />
      </div>
      <div className={`rate ${flipped ? 'show' : ''}`}>
        {RATINGS.map(([k, l]) => <button key={k} className={`btn r-${k}`} onClick={() => rate(k)}>{l}</button>)}
      </div>
      <button className="link" onClick={onExit}>End session</button>
    </div>
  );
}

export default function Flashcards() {
  const { data, loading, error } = useFetch('/student/decks');
  const [deck, setDeck] = useState(null);
  if (deck) return <Session deckId={deck} onExit={() => setDeck(null)} />;
  if (loading || error || !data?.length) return <State loading={loading} error={error} empty="No decks yet. Upload notes to generate your first deck." />;
  return <div className="grid">{data.map((d) => (
    <button key={d.id} className="glass-card deck" onClick={() => setDeck(d.id)}>
      <h4>{d.title}</h4><span className="pill">{d.dueCount} due</span>
    </button>))}</div>;
}
