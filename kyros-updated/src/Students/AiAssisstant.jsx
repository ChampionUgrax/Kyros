import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, Lightbulb, MessageSquareText, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { checkDemoAnswer, getDemoQuiz, getDemoStudyPlan, getDemoTopics } from "../services/aiDemo.js";
import { api, USE_MOCK_API } from "../services/api.js";

const SUGGESTIONS = ["Explain a concept simply", "Help me make a study plan", "Give me a practice question"];

export default function AIAssistant({ onNavigate = () => {} }) {
  const [mode, setMode] = useState(USE_MOCK_API ? "ask" : "quiz");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const topics = getDemoTopics();
  const [topicId, setTopicId] = useState(topics[0]?.id || "");
  const [quiz, setQuiz] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [studyPlan, setStudyPlan] = useState(() => USE_MOCK_API ? getDemoStudyPlan() : { next_topic: null, topics: [] });
  const [notesFile, setNotesFile] = useState(null);
  const [quizBusy, setQuizBusy] = useState(false);
  const [quizError, setQuizError] = useState("");

  useEffect(() => {
    if (USE_MOCK_API) return;
    api.get("/ai/study-plan").then(setStudyPlan).catch((error) => setQuizError(error.message));
  }, []);

  const ask = (prompt = question) => {
    const clean = prompt.trim();
    if (!clean) return;
    setQuestion(clean);
    setAnswer(`Let's break “${clean}” into smaller steps. Start by writing down what you already know, then connect it to one example from your current course. You can review related notes in My Materials or practise the topic in Revision.`);
  };

  const startQuiz = async () => {
    setQuizError("");
    setQuizBusy(true);
    try {
      if (USE_MOCK_API) {
        setQuiz(getDemoQuiz(topicId));
      } else {
        if (!notesFile) throw new Error("Upload a PDF or TXT file with your study notes first.");
        const topicName = notesFile.name.replace(/\.[^.]+$/, "").slice(0, 120) || "Study notes";
        const formData = new FormData();
        formData.append("file", notesFile);
        formData.append("topicId", topicName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "study-notes");
        formData.append("topicName", topicName);
        setQuiz(await api.post("/ai/quizzes", formData));
      }
      setSelectedIndex(null);
      setFeedback(null);
    } catch (error) {
      setQuizError(error.message || "Unable to create a practice question.");
    } finally {
      setQuizBusy(false);
    }
  };

  const submitAnswer = async () => {
    if (!quiz || selectedIndex === null) return;
    setQuizError("");
    try {
      const result = USE_MOCK_API
        ? checkDemoAnswer(quiz, selectedIndex)
        : await api.post(`/ai/quizzes/${encodeURIComponent(quiz.quiz_id)}/answer`, { selectedIndex });
      setFeedback(result);
      if (result.studyPlan) setStudyPlan(result.studyPlan);
    } catch (error) {
      setQuizError(error.message || "Unable to check your answer.");
    }
  };

  return (
    <div className="student-page-stack">
      <section className="student-page-intro student-assistant-intro">
        <span className="student-page-kicker"><Sparkles size={16} /> STUDY SUPPORT</span>
        <h2>AI Learning Assistant</h2>
        <p>Ask a study question or practise a topic with hints and feedback.</p>
      </section>

      <div className="student-ai-tabs" role="tablist" aria-label="Assistant tools">
        {USE_MOCK_API && <button type="button" role="tab" aria-selected={mode === "ask"} className={mode === "ask" ? "active" : ""} onClick={() => setMode("ask")}><MessageSquareText size={16} /> Ask assistant</button>}
        <button type="button" role="tab" aria-selected={mode === "quiz"} className={mode === "quiz" ? "active" : ""} onClick={() => setMode("quiz")}><BrainCircuit size={16} /> Practice quiz</button>
      </div>

      {mode === "ask" ? <section className="student-assistant-panel" aria-label="Ask your learning assistant">
        <div className="student-assistant-welcome"><div className="student-assistant-avatar"><BrainCircuit size={23} /></div><div><strong>Your study companion</strong><p>Frontend demo mode · responses are examples for your workspace</p></div></div>
        {!answer ? (
          <div className="student-assistant-empty"><Lightbulb size={25} /><h3>What would you like help with?</h3><p>Choose a prompt or type a question below.</p><div className="student-prompt-list">{SUGGESTIONS.map((item) => <button type="button" key={item} onClick={() => ask(item)}>{item}<ArrowRight size={15} /></button>)}</div></div>
        ) : (
          <div className="student-assistant-answer"><div className="student-assistant-question"><span>You asked</span><p>{question}</p></div><div className="student-assistant-response"><span><Sparkles size={15} /> A helpful starting point</span><p>{answer}</p><div className="student-assistant-actions"><button type="button" onClick={() => onNavigate("materials")}><BookOpen size={15} /> Open materials</button><button type="button" onClick={() => onNavigate("revision")}>Go to revision <ArrowRight size={15} /></button></div></div></div>
        )}
        <form className="student-assistant-form" onSubmit={(event) => { event.preventDefault(); ask(); }}><label className="sr-only" htmlFor="student-question">Your question</label><input id="student-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a topic you are studying…" /><button className="student-page-button" type="submit" disabled={!question.trim()}>Ask <ArrowRight size={16} /></button></form>
      </section> : <div className="student-ai-quiz-layout">
        <section className="student-assistant-panel student-ai-quiz-panel">
          <div className="student-assistant-welcome"><div className="student-assistant-avatar"><BrainCircuit size={23} /></div><div><strong>{USE_MOCK_API ? "Sample practice preview" : "AI practice from your notes"}</strong><p>{USE_MOCK_API ? "Sample question bank · scores saved on this device" : "PDF and TXT supported · answers checked privately by the server"}</p></div></div>
          {USE_MOCK_API && <label className="student-ai-topic-select"><span>Choose a sample topic</span><select value={topicId} onChange={(event) => { setTopicId(event.target.value); setQuiz(null); setFeedback(null); }}><option value="os_lru">LRU Page Replacement</option><option value="os_deadlock">Deadlocks</option></select></label>}
          {!USE_MOCK_API && !quiz && <label className="student-ai-file-picker"><span>Study notes</span><input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={(event) => { setNotesFile(event.target.files?.[0] || null); setQuizError(""); }} /><small>{notesFile ? notesFile.name : "Choose a PDF or TXT file (maximum 10 MB)"}</small></label>}
          {!quiz ? <div className="student-ai-quiz-start"><div className="student-ai-quiz-art"><BrainCircuit size={34} /></div><h3>{USE_MOCK_API ? "Check what you know" : "Generate a question from your notes"}</h3><p>{USE_MOCK_API ? "Answer a short question, then use the hint or explanation to guide your next review." : "Your notes stay on the server for processing and are not sent to the browser as an answer key."}</p><button type="button" className="student-page-button" disabled={quizBusy || (!USE_MOCK_API && !notesFile)} onClick={startQuiz}>{quizBusy ? "Creating question…" : "Start practice"} <ArrowRight size={16} /></button></div> : <div className="student-ai-question"><span className="student-ai-question-topic">{quiz.topic_name} <span>·</span> Practice question</span><h3>{quiz.question}</h3><div className="student-ai-options">{quiz.options.map((option, index) => <button type="button" key={option} disabled={Boolean(feedback)} className={`${selectedIndex === index ? "selected" : ""} ${feedback && index === (feedback.correctIndex ?? quiz.correct_index) ? "correct" : ""} ${feedback && selectedIndex === index && !feedback.correct ? "incorrect" : ""}`} onClick={() => setSelectedIndex(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
            {feedback && <div className={`student-ai-feedback ${feedback.correct ? "correct" : "incorrect"}`}>{feedback.correct ? <CheckCircle2 size={18} /> : <XCircle size={18} />}<div><strong>{feedback.correct ? "Correct — nice work." : "Not quite. Use this hint to think it through."}</strong><p>{feedback.correct ? feedback.explanation : (feedback.hint || feedback.socratic_hint)}</p>{!feedback.correct && feedback.correctIndex !== undefined && <small>Answer: {quiz.options[feedback.correctIndex]}</small>}</div></div>}
            <div className="student-ai-quiz-actions">{!feedback ? <button type="button" className="student-page-button" disabled={selectedIndex === null || quizBusy} onClick={submitAnswer}>Check answer <CheckCircle2 size={16} /></button> : <button type="button" className="student-page-button" disabled={quizBusy} onClick={startQuiz}><RotateCcw size={16} /> Try another question</button>}</div>
          </div>}
          {quizError && <p className="student-ai-error" role="alert">{quizError}</p>}
        </section>
        <aside className="student-ai-mastery"><span className="student-page-kicker"><Lightbulb size={15} /> STUDY RECOMMENDATION</span><h3>Your next steps</h3><p className="student-ai-mastery-intro">Recommendations are based on your saved quiz attempts.</p>{studyPlan.topics.map((topic) => { const count = topic.total_questions ?? topic.attempts ?? 0; return <div className="student-ai-topic-row" key={topic.topic_id || topic.id}><div><strong>{topic.topic_name || topic.name}</strong><small>{topic.accuracy === null ? "Not checked yet" : `${topic.accuracy}% accuracy · ${count} question${count === 1 ? "" : "s"}`}</small></div><span className={`student-ai-status ${(topic.status || "UNASSESSED").toLowerCase()}`}>{topic.status === "CRITICAL" ? "Review first" : topic.status === "UNASSESSED" ? "New" : topic.status === "MASTERED" ? "Strong" : "Practise"}</span><p>{topic.recommendation}</p></div>; })}{!studyPlan.topics.length&&<p>No recommendations yet. Complete a practice question to build your study plan.</p>}<button type="button" className="student-ai-link" onClick={() => onNavigate("weak")}>Open Weak Topics <ArrowRight size={15} /></button></aside>
      </div>}
      <p className="student-page-note">{USE_MOCK_API ? "Frontend preview uses sample quiz questions." : "AI generation is handled by the private backend; the Gemini key is never sent to the browser."}</p>
    </div>
  );
}
