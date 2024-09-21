import MainScreen from './components/mainScreen/MainScreen';
import Bottom from './components/bottom/Bottom';
import { countryCodeApi, holidaysApi } from './api/axiosConfig';
import { useEffect, useState } from 'react';

import './styles.css';

function App() {
  const [countryCode, setCountryCode] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [closestHoliday, setClosestHoliday] = useState({});
  const [country, setCountry] = useState("");
  const [allCountryNames, setAllCountryNames] = useState([]);
  const [allCountriesList, setAllCountriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  // Fetch the list of available countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await holidaysApi.get("/AvailableCountries");
        const countriesList = response.data;

        const countryNames = countriesList.map((country) => country.name).sort();
        countryNames.unshift("No selection");

        setAllCountryNames(countryNames);
        setAllCountriesList(countriesList);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Failed to fetch available countries');
      }
    };

    fetchCountries();
  }, []);

  // Fetch the user's country code and country name based on their location
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await countryCodeApi.get();
        const { countryCode: code, countryName } = response.data;

        setCountryCode(code);
        setCountry(countryName);
      } catch (error) {
        console.error('Error fetching country data:', error);
        setError('Failed to fetch country data');
      }
    };

    fetchCountryData();
  }, []);

  // Fetch the list of upcoming holidays based on the selected country code
  useEffect(() => {
    const fetchHolidays = async () => {
      if (!countryCode) return;

      setLoading(true);
      setError(null); 

      try {
        const response = await holidaysApi.get(`/NextPublicHolidays/${countryCode}`);
        const holidaysData = response.data;
        setHolidays(holidaysData);
        setClosestHoliday(holidaysData[0]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching holidays:', error);
        setError('Failed to fetch holidays');
        setLoading(false);
      }
    };

    if (country) fetchHolidays();
  }, [country, countryCode]);

  return (
    <div className='wrapper'>
      {error ? (
        <div className='error-message'>
          <h3>{error}</h3>
        </div>
      ) : (
        <>
          <MainScreen closestHoliday={closestHoliday} loading={loading} />
          <Bottom
            country={country}
            setCountry={setCountry}
            setCountryCode={setCountryCode}
            allCountryNames={allCountryNames}
            allCountriesList={allCountriesList}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}

export default App;
