import type { Status } from "../types/incident";

type Props = {
  status: Status;
};

function statusBadgeClass(status: Status): string {
  const base = "status-badge ";
  switch (status) {
    case "OPEN":
      return base + "status-badge--open";
    case "MITIGATED":
      return base + "status-badge--mitigated";
    case "RESOLVED":
      return base + "status-badge--resolved";
    default:
      return base + "status-badge--open";
  }
}

export default function StatusBadge({ status }: Props) {
  return <span className={statusBadgeClass(status)}>{status}</span>;
}

export { statusBadgeClass };
