import IAmenityDetails from "../Types/IAmenityDetails";

export const accessObjectField = (object: IAmenityDetails, fields: string[]): string => {
  let currObj: any = object;
  for (let field of fields) {
    currObj = currObj[field];
  }
  return currObj;
}

export const setObjectField = (object: IAmenityDetails, fields: string[], newValue: any) => {
  let currObj: any = object;
  while (fields.length > 1) {
    currObj = currObj[fields.shift() ?? ""];
  }
  currObj[fields[0]] = newValue;
}