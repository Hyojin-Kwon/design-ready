import type { ComponentChildren } from "preact";

interface Props {
  illustration: ComponentChildren;
  title: string;
  description: ComponentChildren;
  illustWidth?: number;
  illustHeight?: number;
}

export function EmptyState({ illustration, title, description, illustWidth, illustHeight }: Props) {
  const style =
    illustWidth || illustHeight ? { width: illustWidth, height: illustHeight } : undefined;
  return (
    <div class="empty-state">
      <div class="empty-state-illust" style={style}>
        {illustration}
      </div>
      <div class="empty-state-title">{title}</div>
      <p class="empty-state-desc">{description}</p>
    </div>
  );
}
