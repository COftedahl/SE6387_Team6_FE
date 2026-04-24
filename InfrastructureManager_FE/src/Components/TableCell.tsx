import { ChangeEvent } from "react";

interface TableCellProps {
  className: string, 
  doubleClickHandler: () => void, 
  expanded: boolean, 
  expandedClassName: string, 
  value: string, 
  setValue: React.Dispatch<React.SetStateAction<string>>, 
  clickHandler: (e: React.MouseEvent) => void, 
}

const TableCell: React.FC<TableCellProps> = (props: TableCellProps) => {

  return (
    <>
    {props.expanded ? 
      <td className={props.className} onDoubleClick={props.doubleClickHandler} onClick={props.clickHandler}>
        <input className={props.expandedClassName} value={props.value} onChange={(e: ChangeEvent) => props.setValue((e.target as any).value)}/>
      </td>
      :
      <td className={props.className} onDoubleClick={props.doubleClickHandler}>{props.value}</td>
    }
    </>
  );
}

export default TableCell;