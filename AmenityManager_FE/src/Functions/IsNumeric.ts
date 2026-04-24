const isNumeric = (value: string): boolean => {
  return !("" + value).includes(":") && !("" + value).includes("/") && !isNaN(parseFloat(value));
}

export default isNumeric;