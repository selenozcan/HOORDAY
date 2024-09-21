import { render, screen, fireEvent } from '@testing-library/react';
import Bottom from './Bottom';

describe('Bottom Component', () => {
  const mockSetCountry = vi.fn();
  const mockSetCountryCode = vi.fn();
  const mockCountriesList = [
    { name: 'United States', countryCode: 'US' },
    { name: 'Canada', countryCode: 'CA' },
  ];
  const mockCountryNames = ['United States', 'Canada'];

  it('should display loading message when loading is true', () => {
    render(<Bottom loading={true} allCountryNames={[]} allCountriesList={[]} />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('should display country selection dropdown when loading is false', () => {
    render(
      <Bottom
        country="United States"
        setCountry={mockSetCountry}
        setCountryCode={mockSetCountryCode}
        allCountryNames={mockCountryNames}
        allCountriesList={mockCountriesList}
        loading={false}
      />
    );

    expect(screen.getByLabelText(/change your country here/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('United States')).toBeInTheDocument();
  });

  it('should call setCountry and setCountryCode when a new country is selected', () => {
    render(
      <Bottom
        country="United States"
        setCountry={mockSetCountry}
        setCountryCode={mockSetCountryCode}
        allCountryNames={mockCountryNames}
        allCountriesList={mockCountriesList}
        loading={false}
      />
    );

    const select = screen.getByLabelText(/change your country here/i);
    fireEvent.change(select, { target: { value: 'Canada' } });

    expect(mockSetCountry).toHaveBeenCalledWith('Canada');
    expect(mockSetCountryCode).toHaveBeenCalledWith('CA');
  });
});
