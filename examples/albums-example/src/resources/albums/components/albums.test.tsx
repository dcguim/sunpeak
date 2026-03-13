import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Albums, type AlbumsData } from './albums';

// Mock sunpeak hooks
const mockSetState = vi.fn();
const mockRequestDisplayMode = vi.fn();
let mockToolOutput: AlbumsData = { albums: [] };
let mockDeviceCapabilities: { hover?: boolean; touch?: boolean } = {
  hover: true,
  touch: false,
};
let mockAvailableModes: string[] = ['inline', 'fullscreen'];

const mockUpdateModelContext = vi.fn();

vi.mock('sunpeak', () => ({
  useToolData: () => ({
    output: mockToolOutput,
    input: null,
    inputPartial: null,
    isError: false,
    isLoading: false,
    isCancelled: false,
    cancelReason: null,
  }),
  useDisplayMode: () => 'inline',
  useDeviceCapabilities: () => mockDeviceCapabilities,
  useRequestDisplayMode: () => ({
    requestDisplayMode: mockRequestDisplayMode,
    availableModes: mockAvailableModes,
  }),
  useAppState: () => [{ selectedAlbumId: null }, mockSetState],
  useUpdateModelContext: () => mockUpdateModelContext,
}));

// Mock child components to simplify testing
vi.mock('./fullscreen-viewer', () => ({
  FullscreenViewer: ({ album }: { album: { title: string } }) => (
    <div data-testid="fullscreen-viewer">{album.title}</div>
  ),
}));

vi.mock('./album-carousel', () => ({
  AlbumCarousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel">{children}</div>
  ),
}));

vi.mock('./album-card', () => ({
  AlbumCard: ({
    album,
    onSelect,
    buttonSize,
  }: {
    album: { title: string };
    onSelect: (a: unknown) => void;
    buttonSize?: string;
  }) => (
    <button onClick={() => onSelect(album)} data-button-size={buttonSize}>
      {album.title}
    </button>
  ),
}));

describe('Albums', () => {
  const mockAlbums = [
    {
      id: 'album-1',
      title: 'Summer Vacation',
      cover: 'https://example.com/1.jpg',
      photos: [{ id: 'p1', title: 'Beach', url: 'https://example.com/p1.jpg' }],
    },
    {
      id: 'album-2',
      title: 'City Trip',
      cover: 'https://example.com/2.jpg',
      photos: [{ id: 'p2', title: 'Downtown', url: 'https://example.com/p2.jpg' }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockToolOutput = { albums: mockAlbums };
    mockDeviceCapabilities = { hover: true, touch: false };
    mockAvailableModes = ['inline', 'fullscreen'];
  });

  it('renders Carousel with all albums in default mode', () => {
    render(<Albums />);

    // Should render carousel
    expect(screen.getByTestId('carousel')).toBeInTheDocument();

    // Should render both album titles
    expect(screen.getByText('Summer Vacation')).toBeInTheDocument();
    expect(screen.getByText('City Trip')).toBeInTheDocument();
  });

  it('calls setState and requestDisplayMode when album is selected', () => {
    render(<Albums />);

    // Find and click the first album
    const firstAlbum = screen.getByText('Summer Vacation').closest('button')!;
    fireEvent.click(firstAlbum);

    // Should update state with selected album ID using function updater
    expect(mockSetState).toHaveBeenCalledTimes(1);
    const updateFn = mockSetState.mock.calls[0][0];
    expect(typeof updateFn).toBe('function');
    // Test the updater function
    const result = updateFn({ selectedAlbumId: null });
    expect(result).toEqual({ selectedAlbumId: 'album-1' });

    // Should request fullscreen mode
    expect(mockRequestDisplayMode).toHaveBeenCalledWith('fullscreen');
  });

  it('shows empty state when no albums provided', () => {
    mockToolOutput = { albums: [] };

    render(<Albums />);

    expect(screen.getByText('No albums found')).toBeInTheDocument();
  });

  it('passes larger button size for touch devices', () => {
    mockDeviceCapabilities = { hover: false, touch: true };

    render(<Albums />);

    const albumButtons = screen.getAllByRole('button');
    albumButtons.forEach((button) => {
      expect(button).toHaveAttribute('data-button-size', 'lg');
    });
  });

  it('passes standard button size for non-touch devices', () => {
    mockDeviceCapabilities = { hover: true, touch: false };

    render(<Albums />);

    const albumButtons = screen.getAllByRole('button');
    albumButtons.forEach((button) => {
      expect(button).toHaveAttribute('data-button-size', 'md');
    });
  });
});
