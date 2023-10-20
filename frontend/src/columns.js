export const COLUMNS = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Start Date",
    accessor: "startDate",
  },
  {
    Header: "End Date",
    accessor: "endDate",
  },
  {
    Header: "Month, Year",
    accessor: "monthYear",
  },
  {
    Header: "Dates Excluded",
    accessor: "excludeDates",
    Cell: ({ cell }) => cell.value.join(", "),
  },
  {
    Header: "Number of Days",
    accessor: "numDays",
  },
  {
    Header: "Lead Count",
    accessor: "leadCount",
  },
  {
    Header: "Expected DRR",
    accessor: "DRR",
  },
  {
    Header: "Last Updated",
    accessor: "lastUpdated",
  },
];
