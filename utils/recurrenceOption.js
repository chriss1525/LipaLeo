const recurrenceOptions = (reccurence) => {
  switch (reccurence) {
    case "1":
      return `CON Select the time of day to send the reminder:
			1. Morning
			2. Afternoon
			3. Evening
			`;
    case "2":
      return `CON Select the day of the week to send the reminder:
			1. Monday
			2. Tuesday
			3. Wednesday
			4. Thursday
			5. Friday
			6. Saturday
			7. Sunday
			`;
    case "3":
      return `CON Select the day of the month to send the reminder:
			e.g. 1, 2, 3, 4, 5, 6, 7, 8, 9, 10;
			Day:`;
    case "4":
      return `CON Select the date of the year to send the reminder:
			e.g. DD/MM;
			Date:`;
    default:
      return "END Invalid input. Please try again.";
  }
};

module.exports = recurrenceOptions;
