import ACCESSIBILITY_CLASS from "../Types/AccessibilityClass";
import AMENITY_STATUS from "../Types/AmenityStatus";
import AMENITY_TYPE from "../Types/AmenityType";
import IAmenityDetails from "../Types/IAmenityDetails";

const BLANK_AMENITY_DETAILS: IAmenityDetails = {
  id: "", 
  type: AMENITY_TYPE.RESTROOM, 
  room: "", 
  location: {x: "", y: ""}, 
  accessibilityClass: ACCESSIBILITY_CLASS.ACCESSIBLE, 
  currentOccupancy: 0, 
  currentAvailableSlots: 0, 
  capacity: 0, 
  status: AMENITY_STATUS.OPEN, 
  lastUpdated: "", 
}

export default BLANK_AMENITY_DETAILS;