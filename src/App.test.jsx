import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';
import { countryCodeApi, holidaysApi } from './api/axiosConfig';

// Mock Axios for API instances
vi.mock('axios');

// Mock the API instances created by axios.create()
vi.mock('./api/axiosConfig', () => ({
  countryCodeApi: {
    get: vi.fn(),
  },
  holidaysApi: {
    get: vi.fn(),
  },
}));

describe('App Component API tests', () => {
  // Store the original Date.toLocaleDateString function
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock Date.prototype.toLocaleDateString to return a fixed value
    Date.prototype.toLocaleDateString = vi.fn().mockImplementation(() => 'Mocked Date');
  });

  afterEach(() => {
    // Restore the original toLocaleDateString after each test
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
  });

  it('should fetch country and holiday data successfully and display them in the child components', async () => {
    // Mock successful country API response
    countryCodeApi.get.mockResolvedValueOnce({
      data: { countryCode: 'US', countryName: 'United States' },
    });

    // Mock successful available countries API response
    holidaysApi.get.mockResolvedValueOnce({
      data: [
        { name: 'United States', countryCode: 'US' },
        { name: 'Canada', countryCode: 'CA' },
      ],
    });

    // Mock successful holidays API response
    holidaysApi.get.mockResolvedValueOnce({
      data: [
        { name: 'Christmas Day', date: '2024-12-25' },
        { name: 'New Year\'s Day', date: '2025-01-01' },
      ],
    });

    render(<App />);

    // Wait for the loading message to disappear
    await waitFor(() => expect(screen.queryByText(/Loading.../)).not.toBeInTheDocument());

    // Check if holiday data is passed to MainScreen and displayed
    expect(screen.getByText('Christmas Day')).toBeInTheDocument();
    expect(screen.getByText('Mocked Date')).toBeInTheDocument(); // Because of mocked toLocaleDateString

    // Check if country names are available in the dropdown (Bottom component)
    expect(screen.getByLabelText(/change your country here/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('United States')).toBeInTheDocument();
  });

  it('should display error message when country API call fails', async () => {
    // Mock failed country API response
    countryCodeApi.get.mockRejectedValueOnce(new Error('Failed to fetch country data'));

    // Mock successful available countries API response
    holidaysApi.get.mockResolvedValueOnce({
      data: [
        { name: 'United States', countryCode: 'US' },
        { name: 'Canada', countryCode: 'CA' },
      ],
    });

    render(<App />);

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText(/Failed to fetch country data/i)).toBeInTheDocument());

    // Ensure the error message is displayed and no holiday data is shown
    expect(screen.queryByText('Christmas Day')).not.toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch country data/)).toBeInTheDocument();
  });

  it('should display error message when holidays API call fails', async () => {
    // Mock successful country API response
    countryCodeApi.get.mockResolvedValueOnce({
      data: { countryCode: 'US', countryName: 'United States' },
    });

    // Mock successful available countries API response
    holidaysApi.get.mockResolvedValueOnce({
      data: [
        { name: 'United States', countryCode: 'US' },
        { name: 'Canada', countryCode: 'CA' },
      ],
    });

    // Mock failed holidays API response
    holidaysApi.get.mockRejectedValueOnce(new Error('Failed to fetch holidays'));

    render(<App />);

    // Wait for the error message to appear
    await waitFor(() => expect(screen.getByText(/Failed to fetch holidays/i)).toBeInTheDocument());

    // Ensure the error message is displayed and no holiday data is shown
    expect(screen.queryByText('Christmas Day')).not.toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch holidays/)).toBeInTheDocument();
  });

  it('should handle both country and holiday API failures gracefully', async () => {
    // Mock failed country API response
    countryCodeApi.get.mockRejectedValueOnce(new Error('Failed to fetch country data'));

    // Mock failed holidays API response (though it might not be called due to the previous failure)
    holidaysApi.get.mockRejectedValueOnce(new Error('Failed to fetch holidays'));

    render(<App />);

    // Wait for the country error message to appear
    await waitFor(() => expect(screen.getByText(/Failed to fetch country data/i)).toBeInTheDocument());

    // Ensure the country error message is displayed, and holiday data isn't displayed
    expect(screen.queryByText('Christmas Day')).not.toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch country data/)).toBeInTheDocument();
  });
});
