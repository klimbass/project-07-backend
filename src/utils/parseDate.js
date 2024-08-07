
const getCurrentDate = (query, last, regex) => {
    if (!query.date||!query.date.match(regex)){
    const now = new Date();
    // Приведення дати до рядка у форматі 'YYYY-MM-DD'}
    return now.toISOString().slice(0, last);
  }
  return query.date;
};

export default getCurrentDate;