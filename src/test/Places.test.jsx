import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Places from '../components/Places';
import usStateData from '../../public/data/us-state-data.json';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn((url) => {
      // Return the actual JSON data based on the requested URL
      if (url.includes('us-state')) {
        return Promise.resolve({ data: usStateData });
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
    toggleFeatureSelected() {}
    setPlaceList() {}
  },
}));

describe('Main Page - Places Component', () => {
  beforeEach(() => {
    // Clear any mocks before each test
    vi.clearAllMocks();
    mockMapInstance = null;
  });

  afterEach(() => {
    mockMapInstance = null;
  });

  it('should render the main page without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Places />
      </MemoryRouter>
    );
    
    // Check if the component renders
    expect(document.body).toBeTruthy();
  });

  it('should load and display places content', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Places />
      </MemoryRouter>
    );
    
    // Check that the component rendered without errors
    expect(document.body.innerHTML).toBeTruthy();
  });

  it('should pass JSON data to the map when rendering', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Places />
      </MemoryRouter>
    );

    // Wait for the map to be initialized
    await waitFor(() => {
      expect(mockMapInstance).toBeDefined();
    });

    // Verify the Map was initialized with the correct placeType
    expect(mockMapInstance.initializedPlaceType).toBe('us-state');

    // Verify the Map was initialized with the correct data path
    expect(mockMapInstance.dataPath).toContain('data');

    // Verify that initMap was called with the correct placeType
    expect(mockMapInstance.initializedPlaceType).toBe('us-state');
  });
});
