import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Signin from '../components/Signin';
import CognitoAuth from '../classes/CognitoAuth';
import ApiClient from '../classes/ApiClient';

vi.mock('../classes/CognitoAuth', () => ({
  default: { signin: vi.fn() },
}));

vi.mock('../classes/ApiClient', () => ({
  default: { saveUserAttributes: vi.fn() },
}));

// Render Signin within a router that also maps the destinations it navigates to,
// so navigation side-effects are observable in the test.
const renderSignin = () =>
  render(
    <MemoryRouter initialEntries={['/signin']}>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<div data-testid="home-page">Home</div>} />
        <Route path="/signup" element={<div data-testid="signup-page">Sign Up</div>} />
      </Routes>
    </MemoryRouter>
  );

// Fill in form fields and submit, all inside a single act so React batches the updates.
const submitForm = async (container, { username, password } = {}) => {
  await act(async () => {
    if (username !== undefined) {
      fireEvent.change(container.querySelector('input[name="username"]'), {
        target: { value: username },
      });
    }
    if (password !== undefined) {
      fireEvent.change(container.querySelector('input[type="password"]'), {
        target: { value: password },
      });
    }
    fireEvent.submit(container.querySelector('form'));
  });
};

describe('Signin Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the sign-in form with all expected elements', () => {
    const { container } = renderSignin();

    expect(screen.getByText('Sign In To Coordinate Commons')).toBeTruthy();
    expect(screen.getByText('Username:')).toBeTruthy();
    expect(screen.getByText('Password:')).toBeTruthy();
    expect(container.querySelector('input[name="username"]')).toBeTruthy();
    expect(container.querySelector('input[type="password"]')).toBeTruthy();
    expect(screen.getByDisplayValue('Log in')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Sign Up Here!' })).toBeTruthy();
  });

  it('should not show an error message on initial render', () => {
    renderSignin();

    expect(screen.queryByText('Error attempting to log in:')).toBeNull();
  });

  it('should call CognitoAuth.signin with the entered credentials on form submit', async () => {
    const { container } = renderSignin();

    await submitForm(container, { username: 'testuser', password: 'testpass' });

    expect(CognitoAuth.signin).toHaveBeenCalledWith(
      'testuser',
      'testpass',
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('should navigate to the home page after a successful login', async () => {
    CognitoAuth.signin.mockImplementation((_u, _p, successCallback) => {
      successCallback('test-token', 'testuser', 'test@example.com', 'Boston', 'sub-123');
    });

    const { container } = renderSignin();

    await submitForm(container, { username: 'testuser', password: 'testpass' });

    expect(screen.getByTestId('home-page')).toBeTruthy();
    expect(screen.queryByText('Sign In To Coordinate Commons')).toBeNull();
  });

  it('should call ApiClient.saveUserAttributes with the token after a successful login', async () => {
    CognitoAuth.signin.mockImplementation((_u, _p, successCallback) => {
      successCallback('test-token', 'testuser', 'test@example.com', 'Boston', 'sub-123');
    });

    const { container } = renderSignin();

    await submitForm(container, { username: 'testuser', password: 'testpass' });

    expect(ApiClient.saveUserAttributes).toHaveBeenCalledWith(
      'test-token',
      expect.objectContaining({ LastLogin: expect.any(String) })
    );
  });

  it('should show an error message after a failed login', async () => {
    CognitoAuth.signin.mockImplementation((_u, _p, _success, failureCallback) => {
      failureCallback({ message: 'Incorrect username or password.' });
    });

    const { container } = renderSignin();

    await submitForm(container, { username: 'testuser', password: 'wrongpass' });

    expect(screen.getByText('Error attempting to log in:')).toBeTruthy();
    expect(screen.getByText('Incorrect username or password.')).toBeTruthy();
  });

  it('should remain on the sign-in page after a failed login', async () => {
    CognitoAuth.signin.mockImplementation((_u, _p, _success, failureCallback) => {
      failureCallback({ message: 'Some error' });
    });

    const { container } = renderSignin();

    await submitForm(container, { username: 'testuser', password: 'wrongpass' });

    expect(screen.queryByTestId('home-page')).toBeNull();
    expect(screen.getByText('Sign In To Coordinate Commons')).toBeTruthy();
  });

  it('should not call ApiClient.saveUserAttributes after a failed login', async () => {
    CognitoAuth.signin.mockImplementation((_u, _p, _success, failureCallback) => {
      failureCallback({ message: 'Auth failed' });
    });

    const { container } = renderSignin();

    await submitForm(container, { username: 'testuser', password: 'wrongpass' });

    expect(ApiClient.saveUserAttributes).not.toHaveBeenCalled();
  });

  it('should navigate to the home page on a successful login after a failed attempt', async () => {
    CognitoAuth.signin
      .mockImplementationOnce((_u, _p, _success, failureCallback) => {
        failureCallback({ message: 'Wrong password' });
      })
      .mockImplementationOnce((_u, _p, successCallback) => {
        successCallback('test-token', 'testuser', 'test@example.com', 'Boston', 'sub-123');
      });

    const { container } = renderSignin();

    // First attempt — failure
    await submitForm(container, { username: 'testuser', password: 'wrongpass' });
    expect(screen.getByText('Wrong password')).toBeTruthy();

    // Second attempt — success
    await submitForm(container, { password: 'correctpass' });
    expect(screen.getByTestId('home-page')).toBeTruthy();
  });

  it('should navigate to the sign-up page when the sign-up link is clicked', async () => {
    renderSignin();

    await act(async () => {
      fireEvent.click(screen.getByRole('link', { name: 'Sign Up Here!' }));
    });

    expect(screen.getByTestId('signup-page')).toBeTruthy();
  });
});
