import { ArrowDownLeft, Plus } from "lucide-react";

interface EmptyStateProps {
  text: string;
  action: string;
  onClick: () => void;
}

export function EmptyState({ text, action, onClick }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <ArrowDownLeft size={19} />
      </span>
      <strong>{text}</strong>
      <button className="text-button" onClick={onClick}>
        {action} <Plus size={14} />
      </button>
    </div>
  );
}
