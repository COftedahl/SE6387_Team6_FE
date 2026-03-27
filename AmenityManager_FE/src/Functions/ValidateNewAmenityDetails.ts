import ACCESSIBILITY_CLASS from "../Types/AccessibilityClass";
import AMENITY_STATUS from "../Types/AmenityStatus";
import AMENITY_TYPE from "../Types/AmenityType";
import IAmenityDetails from "../Types/IAmenityDetails";
import isNumeric from "./IsNumeric";
import { accessObjectField } from "./ObjectHandlers";


const validateUpdatedAmenityDetails = (newDetails: IAmenityDetails, fieldsToCheck: string[][]): boolean => {
  for (let field of fieldsToCheck) {
    const fieldStr: string = field.join(".");
    switch (fieldStr) {
      case "type": 
        if (!((Object.values(AMENITY_TYPE) as string[]).includes(accessObjectField(newDetails, field)))) {
          throw new Error("Invalid " + fieldStr);
        }
        break;
      case "accessibilityClass": 
        if (!((Object.values(ACCESSIBILITY_CLASS) as string[]).includes(accessObjectField(newDetails, field)))) {
          throw new Error("Invalid " + fieldStr);
        }
        break;
      case "status": 
        if (!((Object.values(AMENITY_STATUS) as string[]).includes(accessObjectField(newDetails, field)))) {
          throw new Error("Invalid " + fieldStr);
        }
        break;
      case "location.x": 
      case "location.y": 
      case "currentOccupancy": 
      case "currentAvailableSlots": 
      case "capacity": 
        if (!isNumeric(accessObjectField(newDetails, field))) {
          throw new Error("Invalid " + fieldStr);
        }
        break;
      default: 
        if (accessObjectField(newDetails, field).length < 1) {
          throw new Error("Empty " + fieldStr);
        }
        break;
    }
  }
  return true;
}

export default validateUpdatedAmenityDetails;