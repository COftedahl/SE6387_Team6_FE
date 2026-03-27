import { useState } from "react";
import IAmenityDetails from "../Types/IAmenityDetails";
import TableCell from "./TableCell";

interface AmenityTableProps {
  data: IAmenityDetails[], 
  setData: React.Dispatch<React.SetStateAction<IAmenityDetails[]>>, 
}

const AmenityTable: React.FC<AmenityTableProps> = (props: AmenityTableProps) => {

  const isNumeric = (value: string): boolean => {
    return !("" + value).includes(":") && !("" + value).includes("/") && !isNaN(parseFloat(value));
  }

  const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
    hour12: false, 
    year: "2-digit", 
    month: "2-digit", 
    day: "2-digit", 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit", 
  });

  const [currSortingMethod, setCurrSortingMethod] = useState<string[]>(["id"]);
  const [isReverseSorted, setIsReverseSorted] = useState<boolean>(false);
  const [expandedCell, setExpandedCell] = useState<null | {index: number, field: string[]}>(null);
  const [modifyingFieldValue, setModifyingFieldValue] = useState<string>("");

  const handleHeaderCellClicked = (sortBy: string[]) => {
    // console.log("CurrSortingMethod: ", currSortingMethod, " isReversed: ", isReverseSorted)
    let valueMultiplier: number = 1;
    if (sortBy.join(".") === currSortingMethod.join(".")) {
      valueMultiplier = (isReverseSorted ? 1 : -1);
      setIsReverseSorted(!isReverseSorted);
    }
    else {
      setCurrSortingMethod(sortBy);
      setIsReverseSorted(false);
    }
    // console.log("After processing, ValueMultiplier = ", valueMultiplier, " currSortingMethod = ", currSortingMethod, ", isReversed = ", isReverseSorted);
    const sorted: IAmenityDetails[] = props.data.sort((a: IAmenityDetails, b: IAmenityDetails) => {
      // console.log("a: ", a, "; b: ", b, " - a[", sortBy, "] < b[", sortBy, "]: ", ((a as any)[sortBy]) > ((b as any)[sortBy]));
      let aVal: string | number = accessObjectField(a, sortBy);
      let bVal: string | number = accessObjectField(b, sortBy);
      if (isNumeric(aVal as string) && isNumeric(bVal as string)) {
        aVal = Number.parseFloat(aVal as string);
        bVal = Number.parseFloat(bVal as string);
      }
      
      // console.log("A: ", aVal, "B: ", bVal, " aVal > bVal: ", aVal > bVal);
      return (
      (aVal > bVal ? 1 * valueMultiplier : 
        (aVal === bVal ? 
          (Number.parseFloat(a.id) > Number.parseFloat(b.id) ? 1 * valueMultiplier : -1 * valueMultiplier)
        : -1 * valueMultiplier)))
    });
    props.setData(() => [...sorted]);
  }

  const saveModifyingValue = () => {
    if (expandedCell !== null) {
      const updatedAmenity: IAmenityDetails = {
        ...props.data[expandedCell.index]
      }
      setObjectField(updatedAmenity, expandedCell.field, modifyingFieldValue);
      setObjectField(updatedAmenity, ["lastUpdated"], formatter.format(Date.now()));
      props.data.splice(expandedCell.index, 1, updatedAmenity), 
      props.setData(() => [...props.data])
    }
  }

  const handleCellDoubleClicked = (amenityIndex: number, field: string[]) => {
    if (expandedCell !== null) {
      saveModifyingValue();
    }
    if (expandedCell !== null && expandedCell.field.join(".") === field.join(".") && expandedCell.index === amenityIndex) {
      setExpandedCell(() => null);
    }
    else {
      setModifyingFieldValue(accessObjectField(props.data[amenityIndex], field));
      setExpandedCell(() => {return {index: amenityIndex, field: field}});
    }
  }

  const handleTableClicked = () => {
    saveModifyingValue();
    setExpandedCell(() => null);
  }

  const stopProp = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }

  const accessObjectField = (object: IAmenityDetails, fields: string[]): string => {
    let currObj: any = object;
    for (let field of fields) {
      currObj = currObj[field];
    }
    return currObj;
  }

  const setObjectField = (object: IAmenityDetails, fields: string[], newValue: any) => {
    let currObj: any = object;
    while (fields.length > 1) {
      currObj = currObj[fields.shift() ?? ""];
    }
    currObj[fields[0]] = newValue;
  }

  const allDisplayFields: {property: string[], display: string}[] = [
    {property: ["id"], display: "ID"}, 
    {property: ["location", "x"], display: "Longitude"}, 
    {property: ["location", "y"], display: "Latitude"}, 
    {property: ["type"], display: "Type"}, 
    {property: ["accessibilityClass"], display: "Accessibility Class"}, 
    {property: ["currentOccupancy"], display: "Current Occupancy"}, 
    {property: ["currentAvailableSlots"], display: "Current Available Slots"}, 
    {property: ["capacity"], display: "Capacity"}, 
    {property: ["status"], display: "Status"}, 
    {property: ["lastUpdated"], display: "Last Updated"}, 
  ]

  const allModifiableFields: string[][] = [
    ["location", "x"], 
    ["location", "y"],  
    ["type"], 
    ["accessibilityClass"], 
    ["currentOccupancy"], 
    ["currentAvailableSlots"], 
    ["capacity"], 
    ["status"], 
  ]

  return (
    <>
      <p>
        Sorted By: {currSortingMethod.join(".") + (isReverseSorted ? " Reversed" : "")}
      </p>
      <table className="AmenityTable table fullWidth fullHeight" onClick={handleTableClicked}>
        <thead className="AmenityTable_Head fullWidth positionSticky top">
          <tr>
            <th scope="col" className="AmenityTable_Head_Cell">Index</th>
            {allDisplayFields.map(({property, display}: {property: string[], display: string}, index: number) => {
              return (
                <th scope="col" key={index} className="AmenityTable_Head_Cell" onClick={() => (handleHeaderCellClicked(property))}>{display}</th>
              )
            })}
          </tr>
        </thead>
        <tbody className="AmenityTable_Body fullWidth">
          {props.data.map((amenity: IAmenityDetails, index: number) => {
            // console.log("Amenity: ", amenity, "; location.*: ", (amenity as any)["location.longitude"], " - ", (amenity as any)["location.latitude"]);
            return (
              <tr key={index} className="AmenityTable_Body_Row">
                <td className="AmenityTable_Body_Cell">{index}</td>
                <td className="AmenityTable_Body_Cell">{amenity.id}</td>
                {allModifiableFields.map((field: string[], innerIndex: number) => {
                  return (
                    <TableCell 
                      key={innerIndex}
                      className={"AmenityTable_Body_Cell"} 
                      doubleClickHandler={() => handleCellDoubleClicked(index, field)} 
                      expanded={(expandedCell !== null && expandedCell.index === index && expandedCell.field.join(".") === field.join("."))} 
                      expandedClassName={"AmenityTable_Body_Cell_Input input"} 
                      value={(expandedCell !== null && expandedCell.index === index && expandedCell.field.join(".") === field.join(".") ? modifyingFieldValue : accessObjectField(amenity, field))} 
                      setValue={setModifyingFieldValue} 
                      clickHandler={stopProp}
                    />
                  )
                })}
                <td className="AmenityTable_Body_Cell">{amenity.lastUpdated}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  );
}

export default AmenityTable;