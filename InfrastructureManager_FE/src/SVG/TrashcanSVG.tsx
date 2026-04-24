import { SVG_ICON_GetIconValues, SVG_ICON_PROPS, SVG_ICON_PROPS_DEFINED, svgRenderingAttribute } from "./SVG_CONSTANTS";

interface TrashcanSVGProps extends SVG_ICON_PROPS {}

const TrashcanSVG: React.FC<TrashcanSVGProps> = (props: TrashcanSVGProps) => {

  const scaleFactor: number = 1;
  const standardSVGSize: number = 6;

  const finalProps: SVG_ICON_PROPS_DEFINED = SVG_ICON_GetIconValues(props);
  const svgAttrs = {
    width: finalProps.width * scaleFactor, 
    height: finalProps.height * scaleFactor,
  }
  const pathAttrs = {
    stroke: finalProps.strokeColor, 
    fill: finalProps.backgroundColor, 
    // strokeWidth: finalProps.strokeWidth, 
    strokeWidth: finalProps.strokeWidthNumber * scaleFactor, 
    strokeLinecap: "round" as "round", 
    strokeLinejoin: "round" as "round", 
  };


  return (
    <>
    {/* <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --> */}
      <svg {...svgRenderingAttribute} viewBox={`0 0 ${standardSVGSize * finalProps.viewBoxScale * scaleFactor} ${standardSVGSize * finalProps.viewBoxScale * scaleFactor}`} {...svgAttrs}>
      <path d="M10 11V17" {...pathAttrs}/>
      <path d="M14 11V17" {...pathAttrs}/>
      <path d="M4 7H20" {...pathAttrs}/>
      <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" {...pathAttrs}/>
      <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" {...pathAttrs}/>
      </svg>
    </>
  );
}

export default TrashcanSVG;