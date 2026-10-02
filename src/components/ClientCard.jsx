export function Initials({ name }) {
  return (
    <span className="avatar" aria-hidden="true">
      {name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()}
    </span>
  );
}
export default function ClientCard({ client, onOpen }) {
  return (
    <article className="client-card">
      <div className="client-card-top">
        <Initials name={client.name} />
        <span className={`client-status ${client.status.toLowerCase()}`}>
          <span /> {client.status}
        </span>
      </div>
      <h3>{client.name}</h3>
      <p className="client-goal">{client.goal}</p>
      <div className="progress-label">
        <span>Goal progress</span>
        <strong>{client.progress}%</strong>
      </div>
      <progress
        max="100"
        value={client.progress}
        aria-label={`${client.name} goal progress`}
      />
      <div className="client-card-bottom">
        <span>
          {client.updatedAt
            ? `Updated ${new Date(client.updatedAt).toLocaleDateString("en", { month: "short", day: "numeric" })}`
            : "New client"}
        </span>
        <button
          className="text-button"
          onClick={onOpen}
          aria-label={`View ${client.name}`}
        >
          View client →
        </button>
      </div>
    </article>
  );
}
