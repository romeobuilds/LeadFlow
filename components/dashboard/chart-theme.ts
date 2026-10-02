export const CHART_HEIGHT = "h-56";

export const AXIS_TICK = {
  fill: "var(--muted-foreground)",
  fontSize: 11,
} as const;

export const AXIS_PROPS = {
  axisLine: false,
  tickLine: false,
  tick: AXIS_TICK,
} as const;

export const BASELINE_PROPS = {
  stroke: "var(--border)",
  strokeWidth: 1,
} as const;

export const CATEGORY_MARGIN = {
  top: 8,
  right: 8,
  bottom: 0,
  left: -20,
} as const;

export const BAR_CURSOR = {
  fill: "var(--muted)",
  fillOpacity: 0.7,
} as const;

export const LINE_CURSOR = {
  stroke: "var(--border)",
  strokeWidth: 1,
} as const;

export const TOOLTIP_STYLE = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  boxShadow:
    "0 4px 12px -2px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.06)",
  color: "var(--popover-foreground)",
  fontSize: 12,
  padding: "4px 8px",
} as const;

export const TOOLTIP_ITEM_STYLE = {
  color: "var(--muted-foreground)",
  padding: 0,
} as const;

export const TOOLTIP_LABEL_STYLE = {
  color: "var(--popover-foreground)",
  fontWeight: 500,
  marginBottom: 2,
} as const;
