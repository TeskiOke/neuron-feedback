export const ACCENT_COLORS = [
  { id: 'blue', name: 'Синий', hex: '#3b82f6', light: 'rgba(59, 130, 246, 0.16)', ring: 'rgba(59, 130, 246, 0.32)' },
  { id: 'emerald', name: 'Изумруд', hex: '#10b981', light: 'rgba(16, 185, 129, 0.16)', ring: 'rgba(16, 185, 129, 0.32)' },
  { id: 'violet', name: 'Фиолетовый', hex: '#8b5cf6', light: 'rgba(139, 92, 246, 0.16)', ring: 'rgba(139, 92, 246, 0.32)' },
  { id: 'orange', name: 'Оранжевый', hex: '#f97316', light: 'rgba(249, 115, 22, 0.16)', ring: 'rgba(249, 115, 22, 0.32)' },
  { id: 'rose', name: 'Коралловый', hex: '#f43f5e', light: 'rgba(244, 63, 94, 0.16)', ring: 'rgba(244, 63, 94, 0.32)' },
  { id: 'magenta', name: 'Маджента', hex: '#ec4899', light: 'rgba(236, 72, 153, 0.16)', ring: 'rgba(236, 72, 153, 0.32)' },
  { id: 'cyan', name: 'Бирюзовый', hex: '#06b6d4', light: 'rgba(6, 182, 212, 0.16)', ring: 'rgba(6, 182, 212, 0.32)' },
  { id: 'lime', name: 'Лайм', hex: '#84cc16', light: 'rgba(132, 204, 22, 0.16)', ring: 'rgba(132, 204, 22, 0.32)' },
  { id: 'amber', name: 'Янтарь', hex: '#f59e0b', light: 'rgba(245, 158, 11, 0.16)', ring: 'rgba(245, 158, 11, 0.32)' }
];

export const PROFANITY_ALERT_COLOR = {
  id: 'danger-red',
  name: 'Красный (Предупреждение)',
  hex: '#ef4444',
  hover: '#f87171',
  light: 'rgba(239, 68, 68, 0.18)',
  ring: 'rgba(239, 68, 68, 0.42)'
};

export function applyAccentColor(color) {
  if (!color) return;
  const root = document.documentElement;
  root.style.setProperty('--primary', color.hex);
  root.style.setProperty('--primary-hover', color.hover || color.hex);
  root.style.setProperty('--primary-light', color.light);
  root.style.setProperty('--primary-text', color.hex);
  root.style.setProperty('--accent-ring', color.ring);
  root.style.setProperty('--border-focus', color.hex);
}
