import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NavHeader from '../components/NavHeader';
import MyPage from '../components/MyPage';
import ApiClient from '../classes/ApiClient';
import { useIsLoggedIn, useUsername, useToken } from '../sharedState/LoggedInUser';

vi.mock('../classes/ApiClient', () => ({
  default: { getVisitedPlaces: vi.fn() },
}));

// ── Shared-state control ──────────────────────────────────────────────────────
let setIsLoggedIn = () => {};
let setUsername = () => {};
let setToken = () => {};

const StateControl = () => {
  const [, _setIsLoggedIn] = useIsLoggedIn();
  const [, _setUsername] = useUsername();
  const [, _setToken] = useToken();
  setIsLoggedIn = _setIsLoggedIn;
  setUsername = _setUsername;
  setToken = _setToken;
  return null;
};

beforeAll(async () => {
  const { unmount } = render(<MemoryRouter><StateControl /></MemoryRouter>);
  unmount();
});

beforeEach(() => {
  vi.clearAllMocks();
  act(() => {
    setIsLoggedIn(false);
    setUsername(null);
    setToken(null);
  });
});

// Render NavHeader + MyPage together at /mypage/my, mirroring the real app layout.
const renderFullPage = () =>
  render(
    <MemoryRouter initialEntries={['/mypage/my']}>
      <StateControl />
      <NavHeader />
      <Routes>
        <Route path="/mypage/:username" element={<MyPage />} />
        <Route path="/signin" element={<div data-testid="signin-page">Sign In</div>} />
        <Route path="/logout" element={<div data-testid="logout-page">Logged Out</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('NavHeader + MyPage — logged-in happy path', () => {
  it('should show a complete page for a logged-in user with their places loaded', async () => {
    // Set up a logged-in user before rendering
    act(() => {
      setIsLoggedIn(true);
      setUsername('alice');
      setToken('alice-token');
    });

    // Capture the API callback so we can fire it after the render settles
    let capturedCallback;
    ApiClient.getVisitedPlaces.mockImplementation((_t, _pt, _s, cb) => {
      capturedCallback = cb;
    });

    renderFullPage();

    // ── Nav: logged-in state ─────────────────────────────────────────────────
    expect(screen.getByRole('link', { name: 'Coordinate Commons' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'About' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'My Page' })).toBeTruthy();
    expect(screen.getByText(/Welcome alice!/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Log Out' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Sign In' })).toBeNull();

    // ── Page body: loading state ─────────────────────────────────────────────
    await waitFor(() => expect(capturedCallback).toBeDefined());
    expect(screen.getByText('Fetching places visited...')).toBeTruthy();

    // ── Page body: places loaded ─────────────────────────────────────────────
    await act(async () => {
      capturedCallback({
        places: [
          { PlaceType: 'us-state', PlacesVisited: ['AL', 'CA'] },
          { PlaceType: 'canada-state', PlacesVisited: ['ON'] },
          { PlaceType: 'country', PlacesVisited: [] },
        ],
      });
    });

    expect(screen.getByRole('table')).toBeTruthy();
    expect(screen.getByText('US States')).toBeTruthy();
    expect(screen.getByText('Canadian Provinces')).toBeTruthy();
    expect(screen.getByText('Countries')).toBeTruthy();

    // Visit counts
    const cells = screen.getAllByRole('cell').map(c => c.textContent.trim());
    expect(cells).toContain('2'); // us-state
    expect(cells).toContain('1'); // canada-state
    expect(cells).toContain('0'); // country

    // Share links use the logged-in username
    const hrefs = screen.getAllByRole('link').map(l => l.getAttribute('href'));
    expect(hrefs).toContain('/places/alice/us-state');
  });
});
