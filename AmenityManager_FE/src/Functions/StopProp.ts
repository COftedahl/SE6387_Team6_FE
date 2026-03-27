const stopProp = (e: React.MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
}

export default stopProp;