import { useState } from "react";
import { ArrowRight, BookOpen, BrainCircuit, Lightbulb, Sparkles } from "lucide-react";

const SUGGESTIONS = ["Explain a concept simply", "Help me make a study plan", "Give me a practice question"];

export default function AIAssistant({ onNavigate = () => {} }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const ask = (prompt = question) => {
    const clean = prompt.trim();
    if (!clean) return;
    setQuestion(clean);
    setAnswer(`Let's break “${clean}” into smaller steps. Start by writing down what you already know, then connect it to one example from your current course. You can review related notes in My Materials or practise the topic in Revision.`);
  };

  return (
    <div className="student-page-stack">
      <section className="student-page-intro student-assistant-intro">
        <span className="student-page-kicker"><Sparkles size={16} /> STUDY SUPPORT</span>
        <h2>AI Learning Assistant</h2>
        <p>Ask a study question, get a clear starting point, and choose what to do next.</p>
      </section>

      <section className="student-assistant-panel" aria-label="Ask your learning assistant">
        <div className="student-assistant-welcome"><div className="student-assistant-avatar"><BrainCircuit size={23} /></div><div><strong>Your study companion</strong><p>Frontend demo mode · responses are examples for your workspace</p></div></div>
        {!answer ? (
          <div className="student-assistant-empty"><Lightbulb size={25} /><h3>What would you like help with?</h3><p>Choose a prompt or type a question below.</p><div className="student-prompt-list">{SUGGESTIONS.map((item) => <button type="button" key={item} onClick={() => ask(item)}>{item}<ArrowRight size={15} /></button>)}</div></div>
        ) : (
          <div className="student-assistant-answer"><div className="student-assistant-question"><span>You asked</span><p>{question}</p></div><div className="student-assistant-response"><span><Sparkles size={15} /> A helpful starting point</span><p>{answer}</p><div className="student-assistant-actions"><button type="button" onClick={() => onNavigate("materials")}><BookOpen size={15} /> Open materials</button><button type="button" onClick={() => onNavigate("revision")}>Go to revision <ArrowRight size={15} /></button></div></div></div>
        )}
        <form className="student-assistant-form" onSubmit={(event) => { event.preventDefault(); ask(); }}><label className="sr-only" htmlFor="student-question">Your question</label><input id="student-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a topic you are studying…" /><button className="student-page-button" type="submit" disabled={!question.trim()}>Ask <ArrowRight size={16} /></button></form>
      </section>
      <p className="student-page-note">Use the response as a study prompt and check important details against your course materials.</p>
    </div>
  );
}
