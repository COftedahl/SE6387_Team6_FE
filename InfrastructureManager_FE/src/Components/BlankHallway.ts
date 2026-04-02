import CROWD_LEVEL from "../Types/CrowdLevel";
import IHallway from "../Types/IHallway";
import INFRASTRUCTURE_STATUS from "../Types/InfrastructureStatus";

const BLANK_HALLWAY: IHallway = {
  id: "", 
  name: "", 
  status: INFRASTRUCTURE_STATUS.OPEN, 
  crowdLevel: CROWD_LEVEL.EMPTY, 
  start: {x: "", y: ""},
  end: {x: "", y: ""},
  lastUpdated: "",
}

export default BLANK_HALLWAY;