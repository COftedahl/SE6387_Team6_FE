import { useEffect, useState } from "react";
import AmenityTable from "./Components/AmenityTable";
import IAmenityDetails from "./Types/IAmenityDetails";
import './Utility/universalstyles_3.css';
import NewAmenityButton from "./Components/NewAmenityButton";
import formatter from "./Utility/Formatter";

interface AppProps {

}

const App: React.FC<AppProps> = (props: AppProps) => {

  document.documentElement.style.setProperty("--transitionDuration", "0.25s");

  const AMENITIES_BACKEND_URL: string = "http://localhost:5001";
  const RETRIEVE_DETAILS_ENDPOINT: string = "/amenities/details";
  const SET_DETAILS_ENDPOINT: string = "/amenities/setdetails";

  const [amenities, setAmenities] = useState<IAmenityDetails[]>([]);

  const retrieveData = async () => {
    const result = await fetch(AMENITIES_BACKEND_URL + RETRIEVE_DETAILS_ENDPOINT, {
      method: "GET", 
    })
    let data: any = null;
    if (result.status === 200) {
      data = await result.json();
    }
    if (data) {
      setAmenities(data);
    }
  }

  const handleSetAmenities: React.Dispatch<React.SetStateAction<IAmenityDetails[]>> = async (value: IAmenityDetails[] | ((oldVal: IAmenityDetails[]) => IAmenityDetails[])) => {
    let newVal: IAmenityDetails[] = [];
    if (typeof value === 'function') {
      newVal = (value(amenities));
    }
    else {
      newVal = (value);
    }
    setAmenities(newVal);

    const result = await fetch(AMENITIES_BACKEND_URL + SET_DETAILS_ENDPOINT, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      }, 
      body: JSON.stringify({
        data: newVal, 
      })
    })
    console.log(result);
    console.log(await result.text());
  }

  const handleAddNewAmenity = async (newAmenity: IAmenityDetails) => {
    
    amenities.unshift({
      ...newAmenity, 
      lastUpdated: formatter.format(Date.now()),
    })
    handleSetAmenities(() => [...amenities]);
  }

  useEffect(() => {
    retrieveData();
  }, []);

  return (
    <div className="App flexColumn fullWidth spaceEvenlyJustify centerAlign">
      <NewAmenityButton saveAmenity={handleAddNewAmenity}/>
      {amenities.length > 0 ? 
        <AmenityTable data={amenities} setData={handleSetAmenities}/>
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
