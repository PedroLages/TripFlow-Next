import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlacePhoto } from '../PlacePhoto'

describe('PlacePhoto', () => {
  it('renders image with direct src', () => {
    render(<PlacePhoto src="/images/itinerary/bund-800.webp" alt="The Bund" />)
    const img = screen.getByRole('img', { name: 'The Bund' })
    expect(img).toBeInTheDocument()
  })

  it('renders fallback when no src', () => {
    render(<PlacePhoto alt="Unknown Place" citySlug="tokyo" />)
    expect(screen.getByLabelText('Unknown Place')).toBeInTheDocument()
  })

  it('shows attribution when provided', () => {
    render(
      <PlacePhoto
        src="/test.webp"
        alt="Test"
        attribution={{ photographer: 'Jane', source: 'unsplash', sourceUrl: 'https://unsplash.com' }}
      />
    )
    expect(screen.getByText(/Jane/)).toBeInTheDocument()
  })
})
