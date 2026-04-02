import { useState } from "react";
import IHallway from "../Types/IHallway";
import TableCell from "./TableCell";
import formatter from "../Utility/Formatter";
import { accessObjectField, setObjectField } from "../Functions/ObjectHandlers";
import stopProp from "../Functions/StopProp";
import isNumeric from "../Functions/IsNumeric";
import validateUpdatedHallwayDetails from "../Functions/ValidateNewHallwayDetails";

interface HallwayTableProps {
  data: IHallway[], 
  // setData: React.Dispatch<React.SetStateAction<IHallway[]>>, 
  setCrowd: (id: string, newVal: string | ((oldVal: string) => string)) => void, 
  setStatus: (id: string, newVal: string | ((oldVal: string) => string)) => void, 
  setOrdering: (newOrderingIndices: number[]) => void, 
}

const HallwayTable: React.FC<HallwayTableProps> = (props: HallwayTableProps) => {

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
    const sorted: IHallway[] = JSON.parse(JSON.stringify(props.data)).sort((a: IHallway, b: IHallway) => {
      // console.log("a: ", a, "; b: ", b, " - a[", sortBy, "] < b[", sortBy, "]: ", ((a as any)[sortBy]) > ((b as any)[sortBy]));
      let aVal: string | number = accessObjectField(a, sortBy);
      let bVal: string | number = accessObjectField(b, sortBy);
      if (isNumeric(aVal as string) && isNumeric(bVal as string)) {
        aVal = Number.parseFloat(aVal as string);
        bVal = Number.parseFloat(bVal as string);
      }
      
      return (
      (aVal > bVal ? 1 * valueMultiplier : 
        (aVal === bVal ? 
          (Number.parseFloat(a.id) > Number.parseFloat(b.id) ? 1 * valueMultiplier : -1 * valueMultiplier)
        : -1 * valueMultiplier)))
    });
    props.setOrdering(sorted.map((hallway: IHallway) => props.data.findIndex((sortedHallway: IHallway) => sortedHallway.id === hallway.id)));
  }

  const saveModifyingValue = () => {
    if (expandedCell !== null) {
      const updatedHallway: IHallway = {
        ...props.data[expandedCell.index]
      }
      const oldCrowdLevel: string = updatedHallway.crowdLevel;
      const oldStatus: string = updatedHallway.status;
      setObjectField(updatedHallway, expandedCell.field, modifyingFieldValue);
      setObjectField(updatedHallway, ["lastUpdated"], formatter.format(Date.now()));

      try {
        validateUpdatedHallwayDetails(updatedHallway, allModifiableFields.map(
          (field: {fields: string[], setFunc: (id: string, newVal: string | ((oldVal: string) => string)) => void}) => field.fields
        ));
        if (oldCrowdLevel !== updatedHallway.crowdLevel) {
          props.setCrowd(props.data[expandedCell.index].id, updatedHallway.crowdLevel)
        }
        if (oldStatus !== updatedHallway.status) {
          props.setStatus(props.data[expandedCell.index].id, updatedHallway.status)
        }
      }
      catch (e) {
        console.error((e as Error).message);
      }
    }
  }

  const handleCellDoubleClicked = (hallwayIndex: number, field: string[]) => {
    if (expandedCell !== null) {
      saveModifyingValue();
    }
    if (expandedCell !== null && expandedCell.field.join(".") === field.join(".") && expandedCell.index === hallwayIndex) {
      setExpandedCell(() => null);
    }
    else {
      setModifyingFieldValue(accessObjectField(props.data[hallwayIndex], field));
      setExpandedCell(() => {return {index: hallwayIndex, field: field}});
    }
  }

  const handleTableClicked = () => {
    saveModifyingValue();
    setExpandedCell(() => null);
  }

  // const handleDeleteClicked = (index: number) => {
  //   props.data.splice(index, 1), 
  //   props.setData(() => [...props.data])
  // }

  const allDisplayFields: {property: string[], display: string}[] = [
    {property: ["id"], display: "ID"}, 
    {property: ["name"], display: "Name"}, 
    {property: ["start", "x"], display: "Start Longitude"}, 
    {property: ["start", "y"], display: "Start Latitude"}, 
    {property: ["end", "x"], display: "End Longitude"}, 
    {property: ["end", "y"], display: "End Latitude"}, 
    {property: ["crowdLevel"], display: "Crowd Level"}, 
    {property: ["status"], display: "Status"}, 
    {property: ["lastUpdated"], display: "Last Updated"}, 
  ]

  const allModifiableFields: {fields: string[], setFunc: (id: string, newVal: string | ((oldVal: string) => string)) => void}[] = [
    {fields: ["crowdLevel"], setFunc: props.setCrowd}, 
    {fields: ["status"], setFunc: props.setStatus}, 
  ]

  return (
    <>
      <p>
        Sorted By: {currSortingMethod.join(".") + (isReverseSorted ? " Reversed" : "")}
      </p>
      <table className="HallwayTable table fullWidth fullHeight" onClick={handleTableClicked}>
        <thead className="HallwayTable_Head fullWidth positionSticky top">
          <tr>
            <th scope="col" className="HallwayTable_Head_Cell">Index</th>
            {allDisplayFields.map(({property, display}: {property: string[], display: string}, index: number) => {
              return (
                <th scope="col" key={index} className="HallwayTable_Head_Cell" onClick={() => (handleHeaderCellClicked(property))}>{display}</th>
              )
            })}
            {/* <th scope="col" className="HallwayTable_Head_Cell">Delete</th> */}
          </tr>
        </thead>
        <tbody className="HallwayTable_Body fullWidth">
          {props.data.map((hallway: IHallway, index: number) => {
            // console.log("hallway: ", hallway, "; location.*: ", (hallway as any)["location.longitude"], " - ", (hallway as any)["location.latitude"]);
            return (
              <tr key={index} className="HallwayTable_Body_Row">
                <td className="HallwayTable_Body_Cell">{index}</td>
                <td className="HallwayTable_Body_Cell">{hallway.id}</td>
                <td className="HallwayTable_Body_Cell">{hallway.name}</td>
                <td className="HallwayTable_Body_Cell">{hallway.start.x}</td>
                <td className="HallwayTable_Body_Cell">{hallway.start.y}</td>
                <td className="HallwayTable_Body_Cell">{hallway.end.x}</td>
                <td className="HallwayTable_Body_Cell">{hallway.end.y}</td>
                {allModifiableFields.map((field: {fields: string[], setFunc: (id: string, newVal: string | ((oldVal: string) => string)) => void}, innerIndex: number) => {
                  return (
                    <TableCell 
                      key={innerIndex}
                      className={"HallwayTable_Body_Cell"} 
                      doubleClickHandler={() => handleCellDoubleClicked(index, field.fields)} 
                      expanded={(expandedCell !== null && expandedCell.index === index && expandedCell.field.join(".") === field.fields.join("."))} 
                      expandedClassName={"HallwayTable_Body_Cell_Input input"} 
                      value={(expandedCell !== null && expandedCell.index === index && expandedCell.field.join(".") === field.fields.join(".") ? modifyingFieldValue : accessObjectField(hallway, field.fields))} 
                      setValue={setModifyingFieldValue} 
                      clickHandler={stopProp}
                    />
                  )
                })}
                <td className="HallwayTable_Body_Cell">{hallway.lastUpdated}</td>
                {/* <td className="HallwayTable_Body_Cell">
                  <button className="HallwayTable_Body_Cell_DeleteButton HallwayTable_Body_Cell_Button button" onClick={() => handleDeleteClicked(index)}>
                    <TrashcanSVG width={20} height={20} strokeWidth="3" viewBoxScale={4} strokeColor="red"/>
                  </button>
                </td> */}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  );
}

export default HallwayTable;