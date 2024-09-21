const Bottom = ({ country, setCountry, setCountryCode, allCountryNames, allCountriesList, loading }) => {
  // Helper function to find the country code by name
  const findCountryCodeByCountryName = (countryName) => {
    const country = allCountriesList.find(country => country.name === countryName);
    return country ? country.countryCode : null;
  };

  // Map country names to options
  const countriesOptions = allCountryNames.map((country, index) => (
    <option key={index} value={country}>{country}</option>
  ));

  // Handle country change
  const handleCountryChange = (event) => {
    const newCountry = event.target.value;
    const newCountryCode = findCountryCodeByCountryName(newCountry);

    setCountry(newCountry);
    setCountryCode(newCountryCode);
  };

  if (loading) {
    return (
      <div className='text-light change-country-div text-center'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='text-light change-country-div text-center'>
      <label htmlFor="countries">Change your country here:</label>
      <select
        value={country}
        onChange={handleCountryChange}
        className='rounded border m-2'
        name="countries"
        id="countries"
      >
        {countriesOptions}
      </select>
    </div>
  );
};

export default Bottom;
