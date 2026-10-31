import { Upload } from "../components/Panels.jsx";

export default function MyMaterials() {
  return (
    <section className="student-section">
      <div className="student-section-heading">
        <div>
          <h2>My Materials</h2>
          <p>Upload your notes and study resources.</p>
        </div>
      </div>

      <Upload />
    </section>
  );
}