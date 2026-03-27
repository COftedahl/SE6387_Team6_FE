//SVG PATH COMMAND REFERENCE
  //q (control point - relative coords to current pos)  (end point - relative coords to current pos)
  //a (rx, ry)  (rotationAngle)  (1 = large arc, 0 = small arc) (1 = clockwise, 0 = counterclockwise)  (dx, dy - end coords relative to current pos)}

interface SVG_ICON_PROPS {
  width?: number, //for setting absolute size of the svg rendered
  height?: number, //for setting absolute size of the svg rendered
  viewBoxScale?: number, //for adding margins/changing size of icon relative to viewbox

  backgroundColor?: string, 
  strokeColor?: string, 
  strokeWidth?: string, 
  strokeWidthNumber?: number, 
}

interface SVG_ICON_PROPS_DEFINED {
  width: number, 
  height: number, 
  viewBoxScale: number, 

  backgroundColor: string, 
  strokeColor: string, 
  strokeWidth: string, 
  strokeWidthNumber: number, 
}

const SVG_ICON_DEFAULT_WIDTH: number = 100;
const SVG_ICON_DEFAULT_HEIGHT: number = 100;
const SVG_ICON_VIEWBOX: string = "0 0 " + SVG_ICON_DEFAULT_WIDTH + " " + SVG_ICON_DEFAULT_HEIGHT;
const SVG_ICON_VIEWBOX_SCALE: number = 1;

const SVG_ICON_DEFAULT_BACKGROUND = "rgb(255,255,255)";
const SVG_ICON_DEFAULT_STROKE_COLOR = "rgb(0,0,0)";
const SVG_ICON_DEFAULT_STROKE_WIDTH = "4";
const SVG_ICON_DEFAULT_STROKE_WIDTH_NUMBER = 4;

const SVG_ICON_GetIconValues = (props?: SVG_ICON_PROPS): SVG_ICON_PROPS_DEFINED => {
  let parsedStrokeWidthNumber: number = SVG_ICON_DEFAULT_STROKE_WIDTH_NUMBER;
  if (props && props.strokeWidth) {
    try {
      parsedStrokeWidthNumber = Number.parseInt(props?.strokeWidth);
    }
    catch (e) {}
  }
  

  if (props == undefined) {
    return {
      width: SVG_ICON_DEFAULT_WIDTH, 
      height: SVG_ICON_DEFAULT_HEIGHT, 
      viewBoxScale: SVG_ICON_VIEWBOX_SCALE, 
      backgroundColor: SVG_ICON_DEFAULT_BACKGROUND, 
      strokeColor: SVG_ICON_DEFAULT_STROKE_COLOR, 
      strokeWidth: SVG_ICON_DEFAULT_STROKE_WIDTH, 
      strokeWidthNumber: parsedStrokeWidthNumber, 
    }
  }
  return {
    width: props.width ?? SVG_ICON_DEFAULT_WIDTH, 
    height: props.height ?? SVG_ICON_DEFAULT_HEIGHT, 
    viewBoxScale: props.viewBoxScale ?? SVG_ICON_VIEWBOX_SCALE, 
    backgroundColor: props.backgroundColor ?? SVG_ICON_DEFAULT_BACKGROUND, 
    strokeColor: props.strokeColor ?? SVG_ICON_DEFAULT_STROKE_COLOR, 
    strokeWidth: props.strokeWidth ?? SVG_ICON_DEFAULT_STROKE_WIDTH, 
    strokeWidthNumber: props.strokeWidthNumber ?? parsedStrokeWidthNumber, 
  }
}

const pathAttrs = { 
  stroke: SVG_ICON_DEFAULT_STROKE_COLOR, 
  fill: SVG_ICON_DEFAULT_BACKGROUND, 
  strokeWidth: SVG_ICON_DEFAULT_STROKE_WIDTH
};

const ZERO_ZERO_MARKER = () => (<ellipse {...pathAttrs} fillOpacity={"0"} ry="1" rx="1" cx="0" cy="0"/>);

const saveSvgAsPng = (svgElement: SVGElement, fileName: string, options?: {width: number, height: number}) => {
  const defaultWidth: number = 100;
  const defaultHeight: number = 100;

  if (!fileName.includes(".png")) {
    fileName = fileName + ".png";
  }

  let width: number = 0;
  let height: number = 0;

  if (!options) {
    width = defaultWidth;
    height = defaultHeight;
  }
  else {
    width = options.width;
    height = options.height;
  }

  console.log("Saving image as PNG: ", fileName);

  //code from MS Copilot 03/22/2025
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  console.log("URL: ", url);

  const img = new Image();
  
  const executeDownload =  async () => {
    console.log("started executeDownload");
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (context != null) {
      context.drawImage(img, 0, 0);
    }

    const pngData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngData;
    link.download = fileName;
    document.body.appendChild(link);
    await link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  console.log(img);
  // img.src = url;

  if (img.complete) {
    img.src = url;
    executeDownload();
  }
  else {
    img.onload = () =>  executeDownload();
    img.onerror = (e) => console.error("Image error occurred: ", e);
  }
  img.src = url;

  //example use: 
  //  const svgElement = document.querySelector('svg');
  //  saveSvgAsPng(svgElement, 'image.png');
}

const svgRenderingAttribute = {xmlns: "http://www.w3.org/2000/svg"};

export { 
  SVG_ICON_PROPS, 
  SVG_ICON_PROPS_DEFINED, 
  SVG_ICON_VIEWBOX, 
  SVG_ICON_DEFAULT_WIDTH, 
  SVG_ICON_DEFAULT_HEIGHT, 
  SVG_ICON_DEFAULT_BACKGROUND, 
  SVG_ICON_DEFAULT_STROKE_COLOR, 
  SVG_ICON_DEFAULT_STROKE_WIDTH, 
  SVG_ICON_GetIconValues, 
  ZERO_ZERO_MARKER, 
  saveSvgAsPng, 
  svgRenderingAttribute, 
 }