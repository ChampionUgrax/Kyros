
import { Sparkles } from "lucide-react";

export default function StudentPlaceholder({
  title,
  description,
}) {
  return (
    <section className="student-placeholder glass-card">
      <div className="student-placeholder-icon">
        <Sparkles size={25} />
      </div>

      <h2>{title}</h2>
      <p>{description}</p>

      <span>
        This section is being prepared for your learning workspace.
      </span>
    </section>
  );
}
