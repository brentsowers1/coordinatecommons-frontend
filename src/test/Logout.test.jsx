import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Logout from '../components/Logout';
import CognitoAuth from '../classes/CognitoAuth';

// vi.hoisted() evaluates before module imports, so these values are available
// inside the vi.mock factory (which is also hoisted above imports).
const mockState = vi.hoisted(() => ({
  isLoggedIn: false,
  username: null,
  setIsLoggedIn: vi.fn(),
}));

vi.mock('../sharedState/LoggedInUser', () => ({
  useIsLoggedIn: () => [mockState.isLoggedIn, mockState.setIsLoggedIn],
  useUsername: () => [mockState.username, vi.fn()],
}));

vi.mock('../classes/CognitoAuth', () => ({
  default: { logout: vi.fn() },
}));

// Wrap Logout in a router that maps the route it navigates to ('/') so we can
// observe the navigation as a DOM change.
const renderLogout = () =>
  render(
    <MemoryRouter initialEntries={['/logout']}>
      <Routes>
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<div data-testid="home-page">Home</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('Logout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.isLoggedIn = false;
    mockState.username = null;
  });

  it('should navigate to the home page when not logged in', async () => {
    renderLogout();

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeTruthy();
    });
  });

  it('should not call CognitoAuth.logout when not logged in', async () => {
    renderLogout();

    await waitFor(() => { screen.getByTestId('home-page'); });

    expect(CognitoAuth.logout).not.toHaveBeenCalled();
  });

  it('should not set isLoggedIn when not logged in', async () => {
    renderLogout();

    await waitFor(() => { screen.getByTestId('home-page'); });

    expect(mockState.setIsLoggedIn).not.toHaveBeenCalled();
  });

  it('should navigate to the home page after a successful logout', async () => {
    mockState.isLoggedIn = true;
    mockState.username = 'testuser';

    renderLogout();

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeTruthy();
    });
  });

  it('should call CognitoAuth.logout with the username when logged in', async () => {
    mockState.isLoggedIn = true;
    mockState.username = 'testuser';

    renderLogout();

    await waitFor(() => { screen.getByTestId('home-page'); });

    expect(CognitoAuth.logout).toHaveBeenCalledWith('testuser');
    expect(CognitoAuth.logout).toHaveBeenCalledTimes(1);
  });

  it('should set isLoggedIn to false when logged in', async () => {
    mockState.isLoggedIn = true;
    mockState.username = 'testuser';

    renderLogout();

    await waitFor(() => { screen.getByTestId('home-page'); });

    expect(mockState.setIsLoggedIn).toHaveBeenCalledWith(false);
    expect(mockState.setIsLoggedIn).toHaveBeenCalledTimes(1);
  });

  it('should call CognitoAuth.logout before setting isLoggedIn to false', async () => {
    const callOrder = [];
    CognitoAuth.logout.mockImplementation(() => callOrder.push('logout'));
    mockState.setIsLoggedIn.mockImplementation(() => callOrder.push('setIsLoggedIn'));

    mockState.isLoggedIn = true;
    mockState.username = 'testuser';

    renderLogout();

    await waitFor(() => { screen.getByTestId('home-page'); });

    expect(callOrder).toEqual(['logout', 'setIsLoggedIn']);
  });
});
