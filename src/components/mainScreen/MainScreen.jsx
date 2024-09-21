const MainScreen = ({ closestHoliday, loading }) => {
  // Helper function to format the date
  const formatDate = (date) => {
    if (!date) return "Loading...";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Helper function to get the day of the week
  const getDayName = (date) => {
    if (!date) return "Loading...";
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[new Date(date).getDay()];
  };

  // Helper function to check if the holiday falls on a weekend
  const checkIsWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  };
  
  const { date: holidayDate, name: holidayName } = closestHoliday || {};

  // Derived values
  const formattedDate = formatDate(holidayDate);
  const dayName = getDayName(holidayDate);
  const isWeekend = holidayDate ? checkIsWeekend(holidayDate) : null;

  if (loading) {
    return (
      <div className='p-5 main-div'>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className='p-5 main-div'>
      <div className='shadow p-3 blur'>
        <h1 className='display-1 text-danger fw-bold'>Hooray!</h1>
        <h1 className='colorized d-none d-sm-block'>An off day is around the corner!</h1>
        <h1 className='colorized d-block d-sm-none'>New off date</h1>
        <h4 className='more-colorized h4 fw-light'>
          It is <span className='fw-bold fst-italic'>{holidayName || "Loading..."}</span>
        </h4>
        <h4 className='more-colorized h4 fw-light'>
          and on <span>{formattedDate}</span>
        </h4>
        <h5 className='h5 fw-light'>
          will be a {dayName}, {isWeekend ? "sadly" : "luckily"} a{' '}
          <span>{isWeekend ? "weekend :(" : "weekday :)"}</span>
        </h5>
      </div>
    </div>
  );
};

export default MainScreen;
