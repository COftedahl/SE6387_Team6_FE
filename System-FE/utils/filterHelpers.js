// Maps UI filter values to API request format
export const buildFiltersAndSort = (filters, amenityType) => {
  const filterList = [];
  const sortMethodMap = {
    "Best Route":        "BEST_ROUTE",
    "Least Walking":     "LEAST_WALKING",
    "Least Waiting Time":"LEAST_WAITING",
  };

  // type filter always included from category
  filterList.push({ filterKey: "type", value: amenityType });

  // restroom type — only add if set
  if (filters.restroom) {
    filterList.push({
      filterKey: "amenityInformation",
      value: filters.restroom.toLowerCase(), // "Male" → "male"
    });
  }

  // // accessibility — only add if set
  // if (filters.accessible === "Yes") {
  //   filterList.push({ filterKey: "accessibilityClass", value: "ACCESSIBLE" });
  // } else if (filters.accessible === "No") {
  //   filterList.push({ filterKey: "accessibilityClass", value: "INACCESSIBLE" });
  // }

  // sort method — always present, defaults to BEST_ROUTE
  const sortMethod = sortMethodMap[filters.sort] || "BEST_ROUTE";

  return { filterList, sortMethod };
};