import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { render, waitFor, act, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Places from '../components/Places';
import usStateData from '../../public/data/us-state-data.json';
import ApiClient from '../classes/ApiClient';
import { useIsLoggedIn, useToken } from '../sharedState/LoggedInUser';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn((url) => {
      // Return fresh copies so mutations in one test don't affect another
      if (url.includes('us-state')) {
        return Promise.resolve({ data: JSON.parse(JSON.stringify(usStateData)) });
      }
      return Promise.resolve({ data: [] });
    }),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

// Mock the ApiClient
vi.mock('../classes/ApiClient', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    getVisitedPlaces: vi.fn(),
    getUserAttributes: vi.fn(),
    saveVisit: vi.fn(),
  },
}));

// Mock the CognitoAuth
vi.mock('../classes/CognitoAuth', () => ({
  default: {
    isAuthenticated: vi.fn(() => false),
    getUsername: vi.fn(() => null),
  },
}));

// Mock the Map class
let mockMapInstance;
vi.mock('../classes/Map', () => ({
  default: class MockMap {
    constructor(containerId, dataPath, placeType, callbacks) {
      this.containerId = containerId;
      this.dataPath = dataPath;
      this.placeType = placeType;
      this.callbacks = callbacks;
      mockMapInstance = this;
      this.toggleFeatureSelected = vi.fn();
    }
    loadMap() {}
    initMap(placeType) {
      this.initializedPlaceType = placeType;
    }
    updateCallbacks(callbacks) {
      this.callbacks = callbacks;
    }
    destroy() {}
    setHighlight() {}
    toggleHighlight() {}
    setPlaceList() {}
  },
}));

const renderPlaces = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Places />
    </MemoryRouter>
  );

const renderPlacesWithParams = (username, placeType) =>
  render(
    <MemoryRouter initialEntries={[`/places/${username}/${placeType}`]}>
      <Routes>
        <Route path="/places/:username/:placeType" element={<Places />} />
      </Routes>
    </MemoryRouter>
  );

describe('Main Page - Places Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMapInstance = null;
  });

  it('should render the main page without crashing', () => {
    renderPlaces();
    expect(document.body).toBeTruthy();
  });

  it('should load and display places content', async () => {
    renderPlaces();
    expect(document.body.innerHTML).toBeTruthy();
  });

  it('should pass JSON data to the map when rendering', async () => {
    renderPlaces();

    await waitFor(() => {
      expect(mockMapInstance).toBeDefined();
    });

    expect(mockMapInstance.initializedPlaceType).toBe('us-state');
    expect(mockMapInstance.dataPath).toContain('data');
  });

  it('should load getVisitedPlaces for default case when not logged in', async () => {
    const { getByTestId } = renderPlaces();

    await waitFor(() => {
      const heading = getByTestId('places-visited-summary');
      expect(heading).toBeTruthy();
      expect(heading.textContent).toContain(`0 out of ${usStateData.length}`);
    });

    const axiosModule = await import('axios');
    expect(axiosModule.default.get).toHaveBeenCalledWith(
      expect.stringContaining('us-state-data.json')
    );
  });

  it('should populate unvisited states list after loading data', async () => {
    const { getAllByTestId } = renderPlaces();

    await waitFor(() => {
      expect(getAllByTestId('unvisited-place-item').length).toBe(usStateData.length);
    });

    const unvisitedItems = getAllByTestId('unvisited-place-item');
    const renderedStateNames = unvisitedItems.map(item => item.textContent.trim());

    usStateData.forEach(state => {
      expect(renderedStateNames).toContain(state.name);
    });
  });

  it('should show no visited places initially', async () => {
    const { queryAllByTestId } = renderPlaces();

    await waitFor(() => {
      expect(queryAllByTestId('unvisited-place-item').length).toBe(usStateData.length);
    });

    expect(queryAllByTestId('visited-place-item').length).toBe(0);
  });

  it('should display the place type label and percentage in the summary', async () => {
    const { getByTestId } = renderPlaces();

    await waitFor(() => {
      const summary = getByTestId('places-visited-summary').textContent;
      expect(summary).toContain('US states');
      expect(summary).toContain('0.00%');
    });
  });

  it('should show click instructions when viewing own places as a guest', async () => {
    const { getByText } = renderPlaces();

    await waitFor(() => {
      expect(getByText(/Click on the map/)).toBeTruthy();
    });
  });

  it('should move a place to the visited list when its map polygon is clicked', async () => {
    const { queryAllByTestId } = renderPlaces();

    await waitFor(() => {
      expect(queryAllByTestId('unvisited-place-item').length).toBe(usStateData.length);
    });

    await act(async () => {
      mockMapInstance.callbacks.onClick('AL');
    });

    expect(queryAllByTestId('visited-place-item').length).toBe(1);
    expect(queryAllByTestId('visited-place-item')[0].textContent).toBe('Alabama');
    expect(queryAllByTestId('unvisited-place-item').length).toBe(usStateData.length - 1);
  });

  it('should move a place back to unvisited when its map polygon is clicked again', async () => {
    const { queryAllByTestId } = renderPlaces();

    await waitFor(() => {
      expect(queryAllByTestId('unvisited-place-item').length).toBe(usStateData.length);
    });

    await act(async () => { mockMapInstance.callbacks.onClick('AL'); });
    expect(queryAllByTestId('visited-place-item').length).toBe(1);

    await act(async () => { mockMapInstance.callbacks.onClick('AL'); });
    expect(queryAllByTestId('visited-place-item').length).toBe(0);
    expect(queryAllByTestId('unvisited-place-item').length).toBe(usStateData.length);
  });

  it('should show "Canadian provinces" in the summary for the canada-state place type', async () => {
    const { getByTestId } = renderPlacesWithParams('my', 'canada-state');

    await waitFor(() => {
      expect(getByTestId('places-visited-summary').textContent).toContain('Canadian provinces');
    });
  });

  it('should show the username in the summary when viewing another user\'s places', async () => {
    const { getByTestId } = renderPlacesWithParams('alice', 'us-state');

    await waitFor(() => {
      expect(getByTestId('places-visited-summary').textContent).toContain('alice has');
    });
  });
});

describe('E2E: Full Login / Visit / Logout Flow', () => {
  // Capture shared-state setters so we can reset between tests.
  // make-shared-state-hook stores state in a module-level closure; the setter
  // it returns is a plain function (not a React hook), so it's safe to call
  // from outside a component after the listener has been removed by RTL cleanup.
  let capturedSetIsLoggedIn = () => {};
  let capturedSetToken = () => {};

  // LoginControl renders inside the same tree as Places so that setting shared
  // state here is seen by the Places component on the same render cycle.
  const LoginControl = () => {
    const [, setIsLoggedIn] = useIsLoggedIn();
    const [, setToken] = useToken();
    capturedSetIsLoggedIn = setIsLoggedIn;
    capturedSetToken = setToken;
    return (
      <>
        <button
          data-testid="e2e-login-btn"
          onClick={() => { setIsLoggedIn(true); setToken('test-token'); }}
        >Login</button>
        <button
          data-testid="e2e-logout-btn"
          onClick={() => { setIsLoggedIn(false); setToken(null); }}
        >Logout</button>
      </>
    );
  };

  // Render LoginControl once before any tests run so we have real setters
  // available for the very first beforeEach reset call.
  beforeAll(async () => {
    const { unmount } = render(<MemoryRouter><LoginControl /></MemoryRouter>);
    unmount();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockMapInstance = null;
    capturedSetIsLoggedIn(false);
    capturedSetToken(null);
  });

  const renderE2E = () =>
    render(
      <MemoryRouter initialEntries={['/']}>
        <LoginControl />
        <Places />
      </MemoryRouter>
    );

  it('should handle the complete login → visit → logout → re-login flow', async () => {
    const { getByTestId, queryAllByTestId } = renderE2E();

    // ── Step 1: Initial state — all places unvisited ──────────────────────────
    await waitFor(() => {
      expect(queryAllByTestId('unvisited-place-item').length).toBe(usStateData.length);
    });
    expect(queryAllByTestId('visited-place-item').length).toBe(0);

    // ── Step 2: Log in — getVisitedPlaces called, returns empty ───────────────
    ApiClient.getVisitedPlaces.mockImplementationOnce((_token, _placeType, _userSub, successCallback) => {
      successCallback({ placesVisited: [] });
    });

    await act(async () => { fireEvent.click(getByTestId('e2e-login-btn')); });

    expect(ApiClient.getVisitedPlaces).toHaveBeenCalledWith(
      'test-token', 'us-state', null, expect.any(Function)
    );
    expect(queryAllByTestId('visited-place-item').length).toBe(0);

    // ── Step 3: Click Alabama to save it ─────────────────────────────────────
    await act(async () => { mockMapInstance.callbacks.onClick('AL'); });

    expect(queryAllByTestId('visited-place-item').length).toBe(1);
    expect(queryAllByTestId('visited-place-item')[0].textContent).toBe('Alabama');
    expect(ApiClient.saveVisit).toHaveBeenCalledWith(
      'test-token', 'AL', true, 'us-state', expect.any(Function), expect.any(Function)
    );

    // ── Step 4: Click Alabama again to unsave it ──────────────────────────────
    await act(async () => { mockMapInstance.callbacks.onClick('AL'); });

    expect(queryAllByTestId('visited-place-item').length).toBe(0);
    expect(ApiClient.saveVisit).toHaveBeenCalledWith(
      'test-token', 'AL', false, 'us-state', expect.any(Function), expect.any(Function)
    );

    // ── Step 5: Save Texas and California ─────────────────────────────────────
    await act(async () => { mockMapInstance.callbacks.onClick('TX'); });
    await act(async () => { mockMapInstance.callbacks.onClick('CA'); });

    expect(queryAllByTestId('visited-place-item').length).toBe(2);
    const visitedAfterSave = queryAllByTestId('visited-place-item').map(el => el.textContent);
    expect(visitedAfterSave).toContain('Texas');
    expect(visitedAfterSave).toContain('California');
    expect(ApiClient.saveVisit).toHaveBeenCalledWith(
      'test-token', 'TX', true, 'us-state', expect.any(Function), expect.any(Function)
    );
    expect(ApiClient.saveVisit).toHaveBeenCalledWith(
      'test-token', 'CA', true, 'us-state', expect.any(Function), expect.any(Function)
    );

    // ── Step 6: Log out — visited list must be cleared ────────────────────────
    await act(async () => { fireEvent.click(getByTestId('e2e-logout-btn')); });

    expect(queryAllByTestId('visited-place-item').length).toBe(0);
    expect(queryAllByTestId('unvisited-place-item').length).toBe(usStateData.length);

    // ── Step 7: Log back in — API returns TX and CA; both should appear ───────
    ApiClient.getVisitedPlaces.mockImplementationOnce((_token, _placeType, _userSub, successCallback) => {
      successCallback({ placesVisited: [{ Id: 'TX' }, { Id: 'CA' }] });
    });

    await act(async () => { fireEvent.click(getByTestId('e2e-login-btn')); });

    expect(queryAllByTestId('visited-place-item').length).toBe(2);
    const visitedAfterRelogin = queryAllByTestId('visited-place-item').map(el => el.textContent);
    expect(visitedAfterRelogin).toContain('Texas');
    expect(visitedAfterRelogin).toContain('California');

    // Verify the map was told to highlight the restored visited places
    expect(mockMapInstance.toggleFeatureSelected).toHaveBeenCalledWith('TX', true);
    expect(mockMapInstance.toggleFeatureSelected).toHaveBeenCalledWith('CA', true);
  });
});
