import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MyPage from '../components/MyPage';
import ApiClient from '../classes/ApiClient';
import { useIsLoggedIn, useUsername, useToken } from '../sharedState/LoggedInUser';

vi.mock('../classes/ApiClient', () => ({
  default: { getVisitedPlaces: vi.fn() },
}));

// ── Shared-state control ──────────────────────────────────────────────────────
// Capture setters from real hooks so tests can control logged-in state without
// mocking the entire module (same pattern used in Places.test.jsx).
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

// ── Render helpers ────────────────────────────────────────────────────────────
const renderMyPage = () =>
  render(
    <MemoryRouter initialEntries={['/my']}>
      <StateControl />
      <Routes>
        <Route path="/my" element={<MyPage />} />
        <Route path="/signin" element={<div data-testid="signin-page">Sign In</div>} />
        <Route path="/signup" element={<div data-testid="signup-page">Sign Up</div>} />
      </Routes>
    </MemoryRouter>
  );

const renderUserPage = (username) =>
  render(
    <MemoryRouter initialEntries={[`/page/${username}`]}>
      <StateControl />
      <Routes>
        <Route path="/page/:username" element={<MyPage />} />
      </Routes>
    </MemoryRouter>
  );

// The component sets isFetchingPlaces=true AFTER calling getVisitedPlaces, so
// a synchronous mock callback would be overwritten by that final setState.
// This helper captures the callback and returns a function to invoke it later,
// correctly simulating the real async API behaviour.
const deferredPlacesCallback = () => {
  let captured;
  ApiClient.getVisitedPlaces.mockImplementation((_t, _pt, _s, cb) => {
    captured = cb;
  });
  return async (response) => {
    await waitFor(() => expect(captured).toBeDefined());
    await act(async () => { captured(response); });
  };
};

// Sample API response with varied visit data
const makePlacesResponse = () => ({
  places: [
    { PlaceType: 'us-state', PlacesVisited: ['AL', 'CA', 'TX'] },
    { PlaceType: 'canada-state', PlacesVisited: ['ON'] },
    { PlaceType: 'country', PlacesVisited: [] },
  ],
});

beforeEach(() => {
  vi.clearAllMocks();
  act(() => {
    setIsLoggedIn(false);
    setUsername(null);
    setToken(null);
  });
});

// ── Unauthenticated "my" page ─────────────────────────────────────────────────
describe('MyPage — unauthenticated', () => {
  it('should show sign-in/sign-up prompt when not logged in', () => {
    renderMyPage();

    expect(screen.getByRole('link', { name: 'Sign In' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeTruthy();
  });

  it('should not call ApiClient when not logged in on the my page', () => {
    renderMyPage();

    expect(ApiClient.getVisitedPlaces).not.toHaveBeenCalled();
  });

  it('should not show the places table when not logged in', () => {
    renderMyPage();

    expect(screen.queryByRole('table')).toBeNull();
  });
});

// ── Authenticated "my" page ───────────────────────────────────────────────────
describe('MyPage — authenticated own page', () => {
  beforeEach(() => {
    act(() => {
      setIsLoggedIn(true);
      setUsername('testuser');
      setToken('test-token');
    });
  });

  it('should show "Fetching places visited..." while the API call is in progress', async () => {
    ApiClient.getVisitedPlaces.mockImplementation(() => {});

    renderMyPage();

    await waitFor(() => {
      expect(screen.getByText('Fetching places visited...')).toBeTruthy();
    });
  });

  it('should call ApiClient.getVisitedPlaces with the token', async () => {
    ApiClient.getVisitedPlaces.mockImplementation(() => {});

    renderMyPage();

    await waitFor(() => {
      expect(ApiClient.getVisitedPlaces).toHaveBeenCalledWith(
        'test-token', null, null, expect.any(Function)
      );
    });
  });

  it('should show the places table after loading', async () => {
    const resolve = deferredPlacesCallback();

    renderMyPage();
    await resolve(makePlacesResponse());

    expect(screen.getByRole('table')).toBeTruthy();
  });

  it('should show Edit Link and Share Link column headers for own page', async () => {
    const resolve = deferredPlacesCallback();

    renderMyPage();
    await resolve(makePlacesResponse());

    expect(screen.getByText('Edit Link')).toBeTruthy();
    expect(screen.getByText('Share Link')).toBeTruthy();
    expect(screen.queryByText('View')).toBeNull();
  });

  it('should show a row for each place type', async () => {
    const resolve = deferredPlacesCallback();

    renderMyPage();
    await resolve(makePlacesResponse());

    expect(screen.getByText('US States')).toBeTruthy();
    expect(screen.getByText('Canadian Provinces')).toBeTruthy();
    expect(screen.getByText('Countries')).toBeTruthy();
  });

  it('should display the correct visit counts from the API response', async () => {
    const resolve = deferredPlacesCallback();

    renderMyPage();
    await resolve(makePlacesResponse());

    const cells = screen.getAllByRole('cell');
    const cellTexts = cells.map(c => c.textContent.trim());
    expect(cellTexts).toContain('3'); // us-state
    expect(cellTexts).toContain('1'); // canada-state
    expect(cellTexts).toContain('0'); // country
  });

  it('should show edit links pointing to /places/my/[type]', async () => {
    const resolve = deferredPlacesCallback();

    renderMyPage();
    await resolve(makePlacesResponse());

    const hrefs = screen.getAllByRole('link').map(l => l.getAttribute('href'));
    expect(hrefs).toContain('/places/my/us-state');
    expect(hrefs).toContain('/places/my/canada-state');
    expect(hrefs).toContain('/places/my/country');
  });

  it('should show share links pointing to /places/[loggedInUsername]/[type]', async () => {
    const resolve = deferredPlacesCallback();

    renderMyPage();
    await resolve(makePlacesResponse());

    const hrefs = screen.getAllByRole('link').map(l => l.getAttribute('href'));
    expect(hrefs).toContain('/places/testuser/us-state');
    expect(hrefs).toContain('/places/testuser/canada-state');
    expect(hrefs).toContain('/places/testuser/country');
  });

  it('should show edit links even for place types with 0 visits', async () => {
    const resolve = deferredPlacesCallback();

    renderMyPage();
    await resolve({ places: [{ PlaceType: 'us-state', PlacesVisited: [] }] });

    const hrefs = screen.getAllByRole('link').map(l => l.getAttribute('href'));
    expect(hrefs).toContain('/places/my/us-state');
  });

  it('should show an empty table when the API returns no places property', async () => {
    const resolve = deferredPlacesCallback();

    renderMyPage();
    await resolve({}); // no `places` key → component falls back to []

    expect(screen.getByRole('table')).toBeTruthy();
    const counts = screen.getAllByRole('cell').filter(c => c.textContent.trim() === '0');
    expect(counts.length).toBe(3);
  });
});

// ── Another user's page ───────────────────────────────────────────────────────
describe("MyPage — another user's page", () => {
  beforeEach(() => {
    act(() => {
      setIsLoggedIn(true);
      setUsername('viewer');
      setToken('viewer-token');
    });
  });

  it("should not show sign-in prompt for another user's page even when not logged in", () => {
    act(() => {
      setIsLoggedIn(false);
      setUsername(null);
      setToken(null);
    });

    ApiClient.getVisitedPlaces.mockImplementation(() => {});

    renderUserPage('alice');

    expect(screen.queryByRole('link', { name: 'Sign In' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Sign Up' })).toBeNull();
  });

  it('should show the View column header (not Edit/Share) for another user', async () => {
    const resolve = deferredPlacesCallback();

    renderUserPage('alice');
    await resolve(makePlacesResponse());

    expect(screen.getByText('View')).toBeTruthy();
    expect(screen.queryByText('Edit Link')).toBeNull();
    expect(screen.queryByText('Share Link')).toBeNull();
  });

  it('should not show a view link for place types with 0 visits', async () => {
    const resolve = deferredPlacesCallback();

    renderUserPage('alice');
    await resolve({ places: [{ PlaceType: 'country', PlacesVisited: [] }] });

    expect(screen.getByRole('table')).toBeTruthy();
    const hrefs = screen.queryAllByRole('link').map(l => l.getAttribute('href'));
    expect(hrefs).not.toContain('/places/alice/country');
  });

  it('should show a view link for place types that have visits', async () => {
    const resolve = deferredPlacesCallback();

    renderUserPage('alice');
    await resolve({ places: [{ PlaceType: 'us-state', PlacesVisited: ['AL', 'TX'] }] });

    const hrefs = screen.getAllByRole('link').map(l => l.getAttribute('href'));
    expect(hrefs).toContain('/places/alice/us-state');
  });

  it("should use the route username in view links, not the logged-in username", async () => {
    const resolve = deferredPlacesCallback();

    renderUserPage('alice');
    await resolve({ places: [{ PlaceType: 'us-state', PlacesVisited: ['AL'] }] });

    const hrefs = screen.getAllByRole('link').map(l => l.getAttribute('href'));
    expect(hrefs).toContain('/places/alice/us-state');
    expect(hrefs).not.toContain('/places/viewer/us-state');
  });
});
