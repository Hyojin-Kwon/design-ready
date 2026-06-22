import type { ComponentChildren } from "preact";

interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  rightSlot?: ComponentChildren;
}

export function Tabs({ tabs, active, onChange, rightSlot }: Props) {
  return (
    <nav class="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          class={`tab ${active === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
      {rightSlot}
    </nav>
  );
}
