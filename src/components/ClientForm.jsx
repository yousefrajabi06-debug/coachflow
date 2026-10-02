import { useState } from "react";

export default function ClientForm({ client, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: client.name || "",
    email: client.email || "",
    goal: client.goal || "",
    status: client.status || "Active",
    workout: client.workout || "",
    nutrition: client.nutrition || "",
    progress: client.progress ?? 0,
  });
  const [error, setError] = useState("");
  const change = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.goal.trim()) {
      setError("Please enter a name and a coaching goal.");
      return;
    }
    onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      goal: form.goal.trim(),
      workout: form.workout.trim(),
      nutrition: form.nutrition.trim(),
      progress: Number(form.progress),
    });
  }
  return (
    <form className="editor-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Client name
          <input
            autoFocus
            name="name"
            required
            maxLength={80}
            value={form.name}
            onChange={change}
            placeholder="e.g. Alex Morgan"
          />
        </label>
        <label>
          Email (optional)
          <input
            name="email"
            type="email"
            maxLength={160}
            value={form.email}
            onChange={change}
            placeholder="alex@example.com"
          />
        </label>
      </div>
      <label>
        Coaching goal
        <input
          name="goal"
          required
          maxLength={160}
          value={form.goal}
          onChange={change}
          placeholder="e.g. Build a consistent movement routine"
        />
      </label>
      <div className="form-row">
        <label>
          Status
          <select name="status" value={form.status} onChange={change}>
            <option>Active</option>
            <option>Paused</option>
          </select>
        </label>
        <label>
          Goal progress (%)
          <input
            name="progress"
            type="number"
            min="0"
            max="100"
            step="1"
            required
            value={form.progress}
            onChange={change}
          />
        </label>
      </div>
      <label>
        Workout plan
        <textarea
          name="workout"
          rows={3}
          maxLength={2000}
          value={form.workout}
          onChange={change}
          placeholder="Record the client's agreed plan…"
        />
      </label>
      <label>
        Nutrition notes
        <textarea
          name="nutrition"
          rows={3}
          maxLength={2000}
          value={form.nutrition}
          onChange={change}
          placeholder="Record notes for the next check-in…"
        />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary">
          Save client
        </button>
      </div>
    </form>
  );
}
