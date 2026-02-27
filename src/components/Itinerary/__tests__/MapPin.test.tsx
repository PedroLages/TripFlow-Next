import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapPin } from '../MapPin';

const defaultProps = {
  activity: {
    id: 'act-1',
    title: 'Fushimi Inari',
    type: 'activity' as const,
    time: '09:00 AM',
    duration: 120,
    votes: { up: 5, down: 0 },
    comments: [],
  },
  color: '#3B82F6',
  orderIndex: 1,
  isSelected: false,
  isHovered: false,
  onClick: vi.fn(),
  onMouseEnter: vi.fn(),
  onMouseLeave: vi.fn(),
};

describe('MapPin', () => {
  it('renders with visit order number', () => {
    render(<MapPin {...defaultProps} />);
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('renders the activity type icon', () => {
    render(<MapPin {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Fushimi Inari/ })).toBeTruthy();
  });

  it('scales up when selected', () => {
    const { container } = render(<MapPin {...defaultProps} isSelected />);
    const pin = container.firstElementChild as HTMLElement;
    expect(pin.style.transform).toContain('1.3');
  });

  it('calls onClick handler', () => {
    const onClick = vi.fn();
    render(<MapPin {...defaultProps} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
