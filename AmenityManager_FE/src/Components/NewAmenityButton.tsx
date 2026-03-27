import { ChangeEvent, useState } from "react";
import IAmenityDetails from "../Types/IAmenityDetails";
import BLANK_AMENITY_DETAILS from "./BlankAmenityDetails";
import { accessObjectField, setObjectField } from "../Functions/ObjectHandlers";
import stopProp from "../Functions/StopProp";
import validateUpdatedAmenityDetails from "../Functions/ValidateNewAmenityDetails";

interface NewAmenityButtonProps {
  saveAmenity: (newAmenity: IAmenityDetails) => void, 
}

const NewAmenityButton: React.FC<NewAmenityButtonProps> = (props: NewAmenityButtonProps) => {

  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [newAmenity, setNewAmenity] = useState<IAmenityDetails>(JSON.parse(JSON.stringify(BLANK_AMENITY_DETAILS)));
  const [errorText, setErrorText] = useState<string>("");

  const allDisplayFields: {property: string[], display: string}[] = [
    {property: ["id"], display: "ID"}, 
    {property: ["location", "x"], display: "Longitude"}, 
    {property: ["location", "y"], display: "Latitude"}, 
    {property: ["room"], display: "Room"}, 
    {property: ["type"], display: "Type"}, 
    {property: ["accessibilityClass"], display: "Accessibility Class"}, 
    {property: ["currentOccupancy"], display: "Current Occupancy"}, 
    {property: ["currentAvailableSlots"], display: "Current Available Slots"}, 
    {property: ["capacity"], display: "Capacity"}, 
    {property: ["status"], display: "Status"}, 
  ]

  const handleInputChanged = (e: ChangeEvent, field: string[]) => {
    const newVal: string = (e.target as any).value;
    setObjectField(newAmenity, field, newVal);
    setNewAmenity((newAmenity) => {return {...newAmenity}})
  }

  const handleSaveClicked = () => {
    try {
      setErrorText("");
      //input validation
      validateUpdatedAmenityDetails(newAmenity, allDisplayFields.map(({property, display}: {property: string[], display: string}) => property))
      
      //update data
      props.saveAmenity(newAmenity);
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
      setNewAmenity(() => JSON.parse(JSON.stringify(BLANK_AMENITY_DETAILS)));
    }, (document.documentElement.style.getPropertyValue("--transitionDuration") ? 2000 * Number.parseFloat(document.documentElement.style.getPropertyValue("--standardBoxShadow").replace("s","")) : 250));
  }

  return (
    <div className="NewAmenityDiv padding1 margin1 flexRow rightJustify centerAlign borderBox">
      <button className="NewAmenityButton positionAbsolute top right button" onClick={handleShowPopup}>
        New Amenity
      </button>
      <div className={"NewAmenity_ModalDiv modalBackground" + (displayModal ? "" : " modalBackground-hidden")} onClick={handleBackgroundClicked}>
        <div className="NewAmenity_Model_Card card" onClick={stopProp}>
          <p className="NewAmenity_Modal_Card_Header headerText">
            New Amenity
          </p>
          {allDisplayFields.map(({property, display}: {property: string[], display: string}, index: number) => {
            return (
              <label key={index} className="NewAmenity_Modal_Card_Label label">
                {display}
                <input value={accessObjectField(newAmenity, property)} onChange={(e) => handleInputChanged(e, property)} type="text" className="NewAmenity_Modal_Card_Input input"/>
              </label>
            )
          })}
          <button className="NewAmenity_Modal_Card_SaveButton NewAmenity_Modal_Card_Button button" onClick={handleSaveClicked}>
            Save
          </button>
          <p className="NewAmenity_Modal_Card_ErrorPar">
            {errorText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewAmenityButton;