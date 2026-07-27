// Builds local YYYY-MM-DD, not UTC — avoids events shifting a day near midnight
export const toDateKey = (dateInput) => {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const buildMarkedDates = (events, dateField = 'eventDate') => {
  const marked = {};
  events.forEach((event) => {
    const rawDate = event[dateField];
    if (!rawDate) return;
    marked[toDateKey(rawDate)] = {
      customStyles: {
        container: { backgroundColor: '#46a3a4', borderRadius: 16 },
        text: { color: '#ffffff', fontWeight: '600' },
      },
    };
  });
  return marked;
};