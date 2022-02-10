export const makeQueryParams = (filter: any) => {
  if (!filter) return '';
  let firstTime = true;
  return Object.keys(filter)
    .map((key) => {
      if (filter[key] !== undefined && String(filter[key]) !== '') {
        const result = `${firstTime ? '?' : '&'}${key}=${filter[key]}`;
        firstTime = false;
        return result;
      } else {
        return undefined;
      }
    })
    .filter((item) => !!item)
    .join('');
};
