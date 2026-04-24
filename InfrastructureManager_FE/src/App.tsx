import { useEffect, useState } from "react";
import HallwayTable from "./Components/HallwayTable";
import './Utility/universalstyles_3.css';
import IHallway from "./Types/IHallway";
import INFRASTRUCTURE_STATUS from "./Types/InfrastructureStatus";
import CROWD_LEVEL from "./Types/CrowdLevel";

interface AppProps {

}

const App: React.FC<AppProps> = (props: AppProps) => {

  document.documentElement.style.setProperty("--transitionDuration", "0.25s");

  const INFRASTRUCTURE_BACKEND_URL: string = "http://localhost:5005";
  const RETRIEVE_DETAILS_ENDPOINT: string = "/hallways/";
  const SET_CROWD_ENDPOINT: string = "/hallways/updatecrowd";
  const SET_STATUS_ENDPOINT: string = "/hallways/updatestatus";

  const [hallways, setHallways] = useState<IHallway[]>([]);

  const retrieveData = async () => {
    const result = await fetch(INFRASTRUCTURE_BACKEND_URL + RETRIEVE_DETAILS_ENDPOINT, {
      method: "GET", 
    })
    let data: any = null;
    if (result.status === 200) {
      data = await result.json();
    }
    if (data) {
      setHallways(data);
    }
  }

  const handleSetCrowd = async (id: string, newVal: string | ((oldVal: string) => string)) => {
  // const handleSetCrowd: React.Dispatch<React.SetStateAction<{id: string, value: string}>> = (value: {id: string, value: string} | ((oldVal: {id: string, value: string}) => {id: string, value: string})) => {
    
    const updatingHallwayIndex: number = hallways.findIndex((hallway: IHallway) => hallway.id === id)
    if (typeof newVal === 'function') {
      newVal = (newVal(hallways[updatingHallwayIndex].crowdLevel));
    }
    hallways[updatingHallwayIndex].crowdLevel = newVal as CROWD_LEVEL;
    setHallways(() => hallways);

    const result = await fetch(INFRASTRUCTURE_BACKEND_URL + SET_CROWD_ENDPOINT, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      }, 
      body: JSON.stringify({
        id: id, 
        crowdLevel: newVal,
      })
    })
    console.log(result);
    console.log(await result.text());
  }

  const handleSetStatus = async (id: string, newVal: string | ((oldVal: string) => string)) => {
  // const handleSetStatus: React.Dispatch<React.SetStateAction<{id: string, value: string}>> = (value: {id: string, value: string} | ((oldVal: {id: string, value: string}) => {id: string, value: string})) => {
    
    const updatingHallwayIndex: number = hallways.findIndex((hallway: IHallway) => hallway.id === id)
    if (typeof newVal === 'function') {
      newVal = (newVal(hallways[updatingHallwayIndex].status));
    }
    hallways[updatingHallwayIndex].status = newVal as INFRASTRUCTURE_STATUS;
    setHallways(() => hallways);

    const result = await fetch(INFRASTRUCTURE_BACKEND_URL + SET_STATUS_ENDPOINT, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      }, 
      body: JSON.stringify({
        id: id, 
        status: newVal,
      })
    })
    console.log(result);
    console.log(await result.text());
  }

  const handleSetOrdering = (newOrderingIndices: number[]) => {
    const newOrdering: IHallway[] = [];
    for (let el of newOrderingIndices) {
      newOrdering.push(hallways[el]);
    }
    setHallways(() => newOrdering);
  }

  // const handleAddNewHallway = async (newHallway: IHallway) => {
    
  //   hallways.unshift({
  //     ...newHallway, 
  //     lastUpdated: formatter.format(Date.now()),
  //   })
  //   handleSetAmenities(() => [...hallways]);
  // }

  useEffect(() => {
    retrieveData();
  }, []);

  return (
    <div className="App flexColumn fullWidth spaceEvenlyJustify centerAlign">
      {/* <NewHallwayButton saveHallway={handleAddNewHallway}/> */}
      {hallways.length > 0 ? 
        <HallwayTable data={hallways} setCrowd={handleSetCrowd} setStatus={handleSetStatus} setOrdering={handleSetOrdering}/>
      :
        <div className="ErrorDiv flexColumn centerJustify centerAlign padding1 borderBox">
          <p className="ErrorPar headerText">
            No data found
          </p>
          <button className="ErrorButton button" onClick={retrieveData}>
            Retry fetching data
          </button>
        </div>
      }
    </div>
  )
}

export default App
