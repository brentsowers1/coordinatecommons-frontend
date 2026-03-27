import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Signup from '../components/Signup';
import CognitoAuth from '../classes/CognitoAuth';

vi.mock('../classes/CognitoAuth', () => ({
  default: { signup: vi.fn(), verify: vi.fn() },
}));

const renderSignup = (props = {}) =>
  render(
    <MemoryRouter initialEntries={['/signup']}>
      <Routes>
        <Route path="/signup" element={<Signup {...props} />} />
        <Route path="/signin" element={<div data-testid="signin-page">Sign In</div>} />
        <Route path="/verify" element={<div data-testid="verify-page">Verify</div>} />
      </Routes>
    </MemoryRouter>
  );

const fillAndSubmitSignupForm = async (container, { username = 'testuser', email = 'test@example.com', location = '', password1, password2 } = {}) => {
  await act(async () => {
    fireEvent.change(container.querySelector('input[name="alias"]'), { target: { value: username } });
    fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: email } });
    if (location) {
      fireEvent.change(container.querySelector('input[name="location"]'), { target: { value: location } });
    }
    fireEvent.change(container.querySelector('input[name="password1"]'), { target: { value: password1 } });
    fireEvent.change(container.querySelector('input[name="password2"]'), { target: { value: password2 } });
    fireEvent.submit(container.querySelector('form'));
  });
};

const fillAndSubmitVerificationForm = async (container, { username = 'testuser', code = '123456' } = {}) => {
  await act(async () => {
    fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: username } });
    fireEvent.change(container.querySelector('input[name="code"]'), { target: { value: code } });
    fireEvent.submit(container.querySelector('form'));
  });
};

describe('SignupForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields', () => {
    const { container } = renderSignup();

    expect(screen.getByText('Username (shown publicly):')).toBeTruthy();
    expect(screen.getByText('Email Address:')).toBeTruthy();
    expect(screen.getByText('Location (optional):')).toBeTruthy();
    expect(screen.getByText('Password:')).toBeTruthy();
    expect(screen.getByText('Confirm Password:')).toBeTruthy();
    expect(container.querySelector('input[name="alias"]')).toBeTruthy();
    expect(container.querySelector('input[name="email"]')).toBeTruthy();
    expect(container.querySelector('input[name="location"]')).toBeTruthy();
    expect(container.querySelector('input[name="password1"]')).toBeTruthy();
    expect(container.querySelector('input[name="password2"]')).toBeTruthy();
    expect(screen.getByDisplayValue('Create Account')).toBeTruthy();
  });

  it('should not show password mismatch error on initial render', () => {
    renderSignup();

    expect(screen.queryByText('Passwords do not match, please correct and submit again')).toBeNull();
  });

  it('should call CognitoAuth.signup with entered values when passwords match', async () => {
    const { container } = renderSignup();

    await fillAndSubmitSignupForm(container, {
      username: 'newuser',
      email: 'new@example.com',
      location: 'Boston',
      password1: 'Password1!',
      password2: 'Password1!',
    });

    expect(CognitoAuth.signup).toHaveBeenCalledWith(
      'newuser',
      'new@example.com',
      'Boston',
      'Password1!',
      expect.any(Function)
    );
  });

  it('should not call CognitoAuth.signup when passwords do not match', async () => {
    const { container } = renderSignup();

    await fillAndSubmitSignupForm(container, {
      password1: 'Password1!',
      password2: 'Different1!',
    });

    expect(CognitoAuth.signup).not.toHaveBeenCalled();
  });

  it('should show a password mismatch error when passwords do not match', async () => {
    const { container } = renderSignup();

    await fillAndSubmitSignupForm(container, {
      password1: 'Password1!',
      password2: 'Different1!',
    });

    expect(screen.getByText('Passwords do not match, please correct and submit again')).toBeTruthy();
  });
});

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the page heading and sign-in link', () => {
    renderSignup();

    expect(screen.getByText('Sign Up For Coordinate Commons')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Sign In Here!' })).toBeTruthy();
  });

  it('should show the signup form initially', () => {
    renderSignup();

    expect(screen.getByDisplayValue('Create Account')).toBeTruthy();
    expect(screen.queryByDisplayValue('Verify')).toBeNull();
  });

  it('should show a link to the verification page when on the signup form', () => {
    renderSignup();

    expect(screen.getByRole('link', { name: 'Enter It Here!' })).toBeTruthy();
  });

  it('should show the verification form when verify prop is true', () => {
    renderSignup({ verify: true });

    expect(screen.getByDisplayValue('Verify')).toBeTruthy();
    expect(screen.queryByDisplayValue('Create Account')).toBeNull();
  });

  it('should hide the verify-link when showing the verification form', () => {
    renderSignup({ verify: true });

    expect(screen.queryByRole('link', { name: 'Enter It Here!' })).toBeNull();
  });

  it('should show the verification form after a successful signup', async () => {
    CognitoAuth.signup.mockImplementation((_u, _e, _l, _p, callback) => {
      callback(null);
    });

    const { container } = renderSignup();

    await fillAndSubmitSignupForm(container, { password1: 'Password1!', password2: 'Password1!' });

    expect(screen.getByDisplayValue('Verify')).toBeTruthy();
    expect(screen.queryByDisplayValue('Create Account')).toBeNull();
  });

  it('should show the registration success message on the verification form after signup', async () => {
    CognitoAuth.signup.mockImplementation((_u, _e, _l, _p, callback) => {
      callback(null);
    });

    const { container } = renderSignup();

    await fillAndSubmitSignupForm(container, { password1: 'Password1!', password2: 'Password1!' });

    expect(screen.getByText(/Registration successful/)).toBeTruthy();
  });

  it('should pre-fill the username on the verification form after signup', async () => {
    CognitoAuth.signup.mockImplementation((_u, _e, _l, _p, callback) => {
      callback(null);
    });

    const { container } = renderSignup();

    await fillAndSubmitSignupForm(container, {
      username: 'newuser',
      password1: 'Password1!',
      password2: 'Password1!',
    });

    expect(container.querySelector('input[name="email"]').value).toBe('newuser');
  });

  it('should show a signup error and stay on the signup form when signup fails', async () => {
    CognitoAuth.signup.mockImplementation((_u, _e, _l, _p, callback) => {
      callback({ message: 'Username already exists.' });
    });

    const { container } = renderSignup();

    await fillAndSubmitSignupForm(container, { password1: 'Password1!', password2: 'Password1!' });

    expect(screen.getByText('Error attempting to create account:')).toBeTruthy();
    expect(screen.getByText('Username already exists.')).toBeTruthy();
    expect(screen.getByDisplayValue('Create Account')).toBeTruthy();
  });

  it('should show the success message and sign-in link after successful verification', async () => {
    CognitoAuth.verify.mockImplementation((_u, _c, callback) => {
      callback(null);
    });

    const { container } = renderSignup({ verify: true });

    await fillAndSubmitVerificationForm(container);

    expect(screen.getByText(/Successfully signed up and verified/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeTruthy();
  });

  it('should show a verification error when verification fails', async () => {
    CognitoAuth.verify.mockImplementation((_u, _c, callback) => {
      callback({ message: 'Invalid verification code.' });
    });

    renderSignup({ verify: true });

    await act(async () => {
      fireEvent.change(document.body.querySelector('input[name="email"]'), { target: { value: 'testuser' } });
      fireEvent.change(document.body.querySelector('input[name="code"]'), { target: { value: 'badcode' } });
      fireEvent.submit(document.body.querySelector('form'));
    });

    expect(screen.getByText('Error attempting to create account:')).toBeTruthy();
    expect(screen.getByText('Invalid verification code.')).toBeTruthy();
    expect(screen.getByDisplayValue('Verify')).toBeTruthy();
  });
});
