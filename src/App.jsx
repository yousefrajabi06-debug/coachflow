import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import Modal from "./components/Modal";
import ClientForm from "./components/ClientForm";
import ClientCard, { Initials } from "./components/ClientCard";

const validClients = (value) =>
  Array.isArray(value) &&
  value.every(
    (client) =>
      client &&
      ["id", "name", "email", "goal", "workout", "nutrition"].every(
        (key) => typeof client[key] === "string",
      ) &&
      ["Active", "Paused"].includes(client.status) &&
      Number.isFinite(client.progress) &&
      client.progress >= 0 &&
      client.progress <= 100 &&
      (!client.updatedAt || !Number.isNaN(Date.parse(client.updatedAt))),
  );
const demoClients = [
  {
    id: "demo-1",
    name: "Alex Morgan",
    email: "alex@example.com",
    goal: "Build a consistent movement routine",
    status: "Active",
    progress: 65,
    workout: "Example note: review the weekly movement log together.",
    nutrition: "Example note: discuss meal planning at the next check-in.",
  },
  {
    id: "demo-2",
    name: "Sam Taylor",
    email: "sam@example.com",
    goal: "Prepare for a first community run",
    status: "Active",
    progress: 40,
    workout: "Example note: discuss the next training milestone.",
    nutrition: "Example note: track questions for a qualified professional.",
  },
  {
    id: "demo-3",
    name: "Jordan Lee",
    email: "jordan@example.com",
    goal: "Return to a regular weekly schedule",
    status: "Paused",
    progress: 25,
    workout: "Example note: schedule a check-in before restarting.",
    nutrition: "",
  },
];

export default function App() {
  const [clients, saveClients, storageError] = useLocalStorage(
    "coachflow.clients.v1",
    [],
    validClients,
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All clients");
  const [editing, setEditing] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState("");
  const selected = clients.find((client) => client.id === selectedId);
  const active = clients.filter((client) => client.status === "Active").length;
  const average = clients.length
    ? Math.round(
        clients.reduce((sum, client) => sum + client.progress, 0) /
          clients.length,
      )
    : 0;
  const visible = clients.filter(
    (client) =>
      (filter === "All clients" || client.status === filter) &&
      `${client.name} ${client.goal} ${client.email}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  function saveClient(fields) {
    const updatedAt = new Date().toISOString();
    if (editing.id)
      saveClients(
        clients.map((client) =>
          client.id === editing.id
            ? { ...client, ...fields, updatedAt }
            : client,
        ),
      );
    else
      saveClients([
        ...clients,
        { ...fields, id: crypto.randomUUID(), updatedAt },
      ]);
    setNotice(editing.id ? "Client updated." : "Client added.");
    setEditing(null);
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#">
          <span className="brand-mark">c</span>CoachFlow
          <span className="brand-dot">.</span>
        </a>
        <p className="eyebrow sidebar-label">COACHING WORKSPACE</p>
        <nav aria-label="Client views">
          {["All clients", "Active", "Paused"].map((name, i) => (
            <button
              key={name}
              className={`nav-button ${filter === name ? "selected" : ""}`}
              aria-current={filter === name ? "page" : undefined}
              onClick={() => {
                setFilter(name);
                setSelectedId(null);
              }}
            >
              <span aria-hidden="true">{["▦", "◉", "Ⅱ"][i]}</span>
              {name}
              <small>
                {name === "All clients"
                  ? clients.length
                  : name === "Active"
                    ? active
                    : clients.length - active}
              </small>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="tiny-dot" /> Local demo workspace
          <p>
            Use fictional client data only.
            <br />
            Records stay in this browser.
          </p>
        </div>
        <a
          className="author"
          href="https://github.com/yousefrajabi06-debug/coachflow"
        >
          YR{" "}
          <span>
            Yousef Rajabi<small>Portfolio project ↗</small>
          </span>
        </a>
      </aside>
      <main>
        <header className="topbar">
          <span>
            Workspace{" "}
            <span className="muted">
              / {selected ? selected.name : "Clients"}
            </span>
          </span>
          <span className="pill">Portfolio demo</span>
        </header>
        <div className="page-content">
          <p className="sr-only" role="status">
            {notice}
          </p>
          {storageError && (
            <p className="error" role="alert">
              {storageError}
            </p>
          )}
          {selected ? (
            <>
              <button
                className="back-button"
                onClick={() => setSelectedId(null)}
              >
                ← Back to clients
              </button>
              <section className="client-detail-heading">
                <Initials name={selected.name} />
                <div>
                  <p className="eyebrow">CLIENT OVERVIEW</p>
                  <h1>{selected.name}</h1>
                  <p className="subtitle">{selected.goal}</p>
                </div>
                <button
                  className="primary"
                  onClick={() => setEditing(selected)}
                >
                  Edit client
                </button>
              </section>
              <div className="client-detail-grid">
                <section className="detail-panel">
                  <h2>At a glance</h2>
                  <dl>
                    <dt>Status</dt>
                    <dd>{selected.status}</dd>
                    <dt>Email</dt>
                    <dd>{selected.email || "Not added"}</dd>
                    <dt>Goal progress</dt>
                    <dd>{selected.progress}%</dd>
                  </dl>
                  <progress
                    max="100"
                    value={selected.progress}
                    aria-label="Goal progress"
                  />
                  <p className="muted small-note">
                    Progress is entered manually by the coach.
                  </p>
                </section>
                <section className="detail-panel">
                  <p className="eyebrow">TRAINING</p>
                  <h2>Workout plan</h2>
                  <p className="plan-text">
                    {selected.workout ||
                      "No plan yet. Edit this client to add one."}
                  </p>
                </section>
                <section className="detail-panel">
                  <p className="eyebrow">DAILY HABITS</p>
                  <h2>Nutrition notes</h2>
                  <p className="plan-text">
                    {selected.nutrition || "No nutrition notes yet."}
                  </p>
                </section>
              </div>
              <button
                className="text-button delete-link"
                onClick={() => setDeleting(selected)}
              >
                Delete client
              </button>
            </>
          ) : (
            <>
              <section className="page-heading">
                <div>
                  <p className="eyebrow">
                    A LITTLE STRUCTURE. A LOT OF PROGRESS.
                  </p>
                  <h1>Good coaching starts with care.</h1>
                  <p className="subtitle">
                    Your clients, their goals, and the next step — all in one
                    place.
                  </p>
                </div>
                <button className="primary" onClick={() => setEditing({})}>
                  ＋ Add client
                </button>
              </section>
              <section className="stats-grid" aria-label="Client summary">
                <div className="stat-card">
                  <span>Total clients</span>
                  <strong>{clients.length.toString().padStart(2, "0")}</strong>
                  <small>Your coaching community</small>
                </div>
                <div className="stat-card">
                  <span>Active clients</span>
                  <strong>{active.toString().padStart(2, "0")}</strong>
                  <small>Working toward their goals</small>
                </div>
                <div className="stat-card accent">
                  <span>Average goal progress</span>
                  <strong>
                    {average}
                    <em>%</em>
                  </strong>
                  <small>Based on your manual updates</small>
                </div>
              </section>
              <div className="section-heading">
                <h2>
                  {filter} <span className="count">{visible.length}</span>
                </h2>
                <label className="search">
                  <span aria-hidden="true">⌕</span>
                  <input
                    type="search"
                    aria-label="Search clients"
                    placeholder="Search clients or goals…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
              </div>
              {visible.length ? (
                <div className="client-grid">
                  {visible.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onOpen={() => setSelectedId(client.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">◎</span>
                  <h3>
                    {clients.length
                      ? "No clients match this view."
                      : "Meet your next chapter."}
                  </h3>
                  <p>
                    {clients.length
                      ? "Try a different name, goal, or filter."
                      : "Add a fictional client, or explore the dashboard with sample data."}
                  </p>
                  {!clients.length && (
                    <button
                      className="secondary"
                      onClick={() => {
                        saveClients(
                          demoClients.map((client) => ({
                            ...client,
                            updatedAt: new Date().toISOString(),
                          })),
                        );
                        setNotice("Three fictional sample clients loaded.");
                      }}
                    >
                      Load sample clients
                    </button>
                  )}
                </div>
              )}
            </>
          )}
          <footer>
            Demo workspace · Use fictional client information.
            <span>React · Local storage</span>
          </footer>
        </div>
      </main>
      {editing && (
        <Modal
          title={editing.id ? "Edit client" : "Add a client"}
          onClose={() => setEditing(null)}
        >
          <ClientForm
            client={editing}
            onSave={saveClient}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
      {deleting && (
        <Modal title="Delete client?" onClose={() => setDeleting(null)}>
          <p>
            “{deleting.name}” and their saved notes will be removed from this
            device.
          </p>
          <div className="form-actions">
            <button className="secondary" onClick={() => setDeleting(null)}>
              Keep client
            </button>
            <button
              className="danger"
              onClick={() => {
                saveClients(
                  clients.filter((client) => client.id !== deleting.id),
                );
                setSelectedId(null);
                setDeleting(null);
                setNotice("Client deleted.");
              }}
            >
              Delete client
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
