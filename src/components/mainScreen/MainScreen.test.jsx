import { render, screen } from '@testing-library/react';
import MainScreen from './MainScreen';

const mockHoliday1 = {
  name: 'Christmas Day',
  date: '2024-12-25'
};

const mockHoliday2 = {
    name: 'New Year\'s Day',
    date: '2022-01-01'
};

describe('MainScreen Component', () => {
  it('should display loading when data is being fetched', () => {
    render(<MainScreen closestHoliday={null} loading={true} />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('should format and display the holiday name and date correctly', () => {
    // Mock Date.prototype.toLocaleDateString to return a fixed value
    const originalToLocaleDateString = Date.prototype.toLocaleDateString;
    Date.prototype.toLocaleDateString = vi.fn().mockReturnValue('December 25, 2024');
    
    render(<MainScreen closestHoliday={mockHoliday1} loading={false} />);

    // Check if the holiday name and mocked date are displayed
    expect(screen.getByText('Christmas Day')).toBeInTheDocument();
    expect(screen.getByText('December 25, 2024')).toBeInTheDocument();

    // Get the correct day name for December 25, 2024 (Wednesday)
    expect(screen.getByText('will be a Wednesday, luckily a')).toBeInTheDocument();

    // Since this is not a weekend, "weekday :)" should be displayed
    expect(screen.getByText('weekday :)')).toBeInTheDocument();

    // Restore the original implementation
    Date.prototype.toLocaleDateString = originalToLocaleDateString;
  });

  it('should render the correct day name and indicate it is a weekend', () => {
    render(<MainScreen closestHoliday={mockHoliday2} loading={false} />);

    // Check if the holiday name is rendered
    expect(screen.getByText('New Year\'s Day')).toBeInTheDocument();

    // Get the correct day name for January 1, 2022 (Saturday)
    expect(screen.getByText('will be a Saturday, unfortunately a')).toBeInTheDocument();

    // Since this is a weekend, "weekend :(" should be displayed
    expect(screen.getByText('weekend :(')).toBeInTheDocument();
  });
});