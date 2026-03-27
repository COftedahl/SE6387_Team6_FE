import { useEffect, useState } from "react";
import AmenityTable from "./Components/AmenityTable";
import IAmenityDetails from "./Types/IAmenityDetails";
import './Utility/universalstyles_3.css';

interface AppProps {

}

const App: React.FC<AppProps> = (props: AppProps) => {

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

  const handleSetAmenities: React.Dispatch<React.SetStateAction<IAmenityDetails[]>> = (value: IAmenityDetails[] | ((oldVal: IAmenityDetails[]) => IAmenityDetails[])) => {
    let newVal: IAmenityDetails[] = [];
    if (typeof value === 'function') {
      newVal = (value(amenities));
    }
    else {
      newVal = (value);
    }
    setAmenities(newVal);

    fetch(AMENITIES_BACKEND_URL + SET_DETAILS_ENDPOINT, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json", 
      }, 
      body: JSON.stringify({
        data: newVal, 
      })
    })
  }

  useEffect(() => {
    retrieveData();
  }, []);

  return (
    <div className="App flexColumn fullWidth spaceEvenlyJustify centerAlign">
      <AmenityTable data={amenities} setData={handleSetAmenities}/>
    </div>
  )
}

export default App
