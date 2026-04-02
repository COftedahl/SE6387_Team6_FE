import { ChangeEvent, useState } from "react";
import IHallway from "../Types/IHallway";
import BLANK_HALLWAY_DETAILS from "./BlankHallway";
import { accessObjectField, setObjectField } from "../Functions/ObjectHandlers";
import stopProp from "../Functions/StopProp";
import validateUpdatedHallwayDetails from "../Functions/ValidateNewHallwayDetails";

interface newHallwayButtonProps {
  saveHallway: (newHallway: IHallway) => void, 
}

const NewAHallwayButton: React.FC<newHallwayButtonProps> = (props: newHallwayButtonProps) => {

  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [newHallway, setNewHallway] = useState<IHallway>(JSON.parse(JSON.stringify(BLANK_HALLWAY_DETAILS)));
  const [errorText, setErrorText] = useState<string>("");

  const allDisplayFields: {property: string[], display: string}[] = [
    {property: ["id"], display: "ID"}, 
    {property: ["name"], display: "Room"}, 
    {property: ["start", "x"], display: "Start Longitude"}, 
    {property: ["start", "y"], display: "Start Latitude"}, 
    {property: ["end", "x"], display: "End Longitude"}, 
    {property: ["end", "y"], display: "End Latitude"}, 
    {property: ["crowdLevel"], display: "Crowd Level"}, 
    {property: ["status"], display: "Status"}, 
    {property: ["lastUpdated"], display: "Last Updated"}, 
  ]

  const handleInputChanged = (e: ChangeEvent, field: string[]) => {
    const newVal: string = (e.target as any).value;
    setObjectField(newHallway, field, newVal);
    setNewHallway((newHallway) => {return {...newHallway}})
  }

  const handleSaveClicked = () => {
    try {
      setErrorText("");
      //input validation
      validateUpdatedHallwayDetails(newHallway, allDisplayFields.map(({property, display}: {property: string[], display: string}) => property))
      
      //update data
      props.saveHallway(newHallway);
      handleBackgroundClicked();
    }
    catch (e) {
      setErrorText((e as Error).message)
    }
  }

  const handleShowPopup = () => {
    setDisplayModal(true);
  }

  const handleBackgroundClicked = () => {
    setDisplayModal(false);
    setTimeout(() => {
      setNewHallway(() => JSON.parse(JSON.stringify(BLANK_HALLWAY_DETAILS)));
    }, (document.documentElement.style.getPropertyValue("--transitionDuration") ? 2000 * Number.parseFloat(document.documentElement.style.getPropertyValue("--standardBoxShadow").replace("s","")) : 250));
  }

  return (
    <div className="newHallwayDiv padding1 margin1 flexRow rightJustify centerAlign borderBox">
      <button className="newHallwayButton positionAbsolute top right button" onClick={handleShowPopup}>
        New Hallway
      </button>
      <div className={"newHallway_ModalDiv modalBackground" + (displayModal ? "" : " modalBackground-hidden")} onClick={handleBackgroundClicked}>
        <div className="newHallway_Model_Card card" onClick={stopProp}>
          <p className="newHallway_Modal_Card_Header headerText">
            New Hallway
          </p>
          {allDisplayFields.map(({property, display}: {property: string[], display: string}, index: number) => {
            return (
              <label key={index} className="newHallway_Modal_Card_Label label">
                {display}
                <input value={accessObjectField(newHallway, property)} onChange={(e) => handleInputChanged(e, property)} type="text" className="newHallway_Modal_Card_Input input"/>
              </label>
            )
          })}
          <button className="newHallway_Modal_Card_SaveButton newHallway_Modal_Card_Button button" onClick={handleSaveClicked}>
            Save
          </button>
          <p className="newHallway_Modal_Card_ErrorPar">
            {errorText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewAHallwayButton;