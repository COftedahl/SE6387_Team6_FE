import INFRASTRUCTURE_STATUS from "../Types/InfrastructureStatus";
import CROWD_LEVEL from "../Types/CrowdLevel";
import IHallway from "../Types/IHallway";
import { accessObjectField } from "./ObjectHandlers";


const validateUpdatedHallwayDetails = (newDetails: IHallway, fieldsToCheck: string[][]): boolean => {
  for (let field of fieldsToCheck) {
    const fieldStr: string = field.join(".");
    switch (fieldStr) {
      case "crowdLevel": 
        if (!((Object.values(CROWD_LEVEL) as string[]).includes(accessObjectField(newDetails, field)))) {
          throw new Error("Invalid " + fieldStr);
        }
        break;
      case "status": 
        if (!((Object.values(INFRASTRUCTURE_STATUS) as string[]).includes(accessObjectField(newDetails, field)))) {
          throw new Error("Invalid " + fieldStr);
        }
        break;
      case "id": 
      case "name": 
      case "start.x": 
      case "start.y": 
      case "end.x": 
      case "end.y": 
      case "lastUpdated": 
      default: 
        if (accessObjectField(newDetails, field).length < 1) {
          throw new Error("Empty " + fieldStr);
        }
        break;
    }
  }
  return true;
}

export default validateUpdatedHallwayDetails;