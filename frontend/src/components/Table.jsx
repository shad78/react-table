import React, { useMemo, useState, useEffect } from "react";
import { useTable } from "react-table";
import { COLUMNS } from "../columns";
import "./Table.css";
import axios from "axios";

const Table = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios
      .get("https://react-table-wnda.onrender.com/api/data")
      .then((res) => {
        setTableData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const columns = useMemo(() => COLUMNS, []);

  const tableInstance = useTable({
    columns,
    data: tableData,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const [formData, setFormData] = useState({
    id: 0,
    startDate: "",
    endDate: "",
    monthYear: "",
    excludeDates: [],
    numDays: 0,
    leadCount: 0,
    DRR: 0,
    lastUpdated: "",
  });

  const [maxStartDate, setMaxStartDate] = useState("");
  const [minEndDate, setMinEndDate] = useState("");

  const [id, setId] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [excludeDates, setExcludeDates] = useState([]);
  const [numDays, setNumDays] = useState(0);
  const [leadCount, setLeadCount] = useState(0);
  const [DRR, setDRR] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMaxStartDate(today);
    const year = today.split("-")[0];
    const month = today.split("-")[1];
    const newMonthYear = `${month}, ${year}`;
    setMonthYear(newMonthYear);
    const newId = tableData.length + 1;
    setId(newId);
    setFormData({ ...formData, id: newId, monthYear: newMonthYear });
  }, [formData, tableData]);

  const handleStartDate = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    setMinEndDate(newStartDate);
    setEndDate("");
    setExcludeDates([]);
    setFormData({
      ...formData,
      startDate: newStartDate,
      endDate: "",
      excludeDates: [],
    });
    setStartDateMessage("");
  };

  const handleEndDate = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    setExcludeDates([]);
    setFormData({ ...formData, endDate: newEndDate, excludeDates: [] });
    setEndDateMessage("");
  };

  const handleExcludeDates = (e) => {
    const date = e.target.value;
    const newExcludeDates = [...excludeDates, date];
    setExcludeDates(newExcludeDates);
    setFormData({ ...formData, excludeDates: newExcludeDates });
  };

  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      const daysDifference =
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
      const days = daysDifference - excludeDates.length;
      setNumDays(days);
      setFormData({ ...formData, numDays: days });
    }
  }, [formData, startDate, endDate, excludeDates]);

  const handleLeadCount = (e) => {
    const newLeadCount = parseInt(e.target.value);
    setLeadCount(newLeadCount);
    setFormData({ ...formData, leadCount: newLeadCount });
  };

  useEffect(() => {
    if (numDays && leadCount) {
      const newDRR = parseFloat((leadCount / numDays).toFixed(2));
      setDRR(newDRR);
      setFormData({ ...formData, DRR: newDRR });
    } else {
      setDRR(0);
    }
  }, [formData, numDays, leadCount]);

  const [startDateMessage, setStartDateMessage] = useState("");
  const [endDateMessage, setEndDateMessage] = useState("");
  const validateForm = () => {
    if (!startDate) setStartDateMessage("start date is required");
    if (!endDate) setEndDateMessage("end date is required");
    if (!startDate || !endDate) return false;
    else return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const newLastUpdated = `${new Date().toISOString().split("T")[0]} ${
      new Date().toISOString().split("T")[1].split(".")[0]
    }`;
    setLastUpdated(newLastUpdated);
    setFormData({ ...formData, lastUpdated: newLastUpdated });
    const newFormData = { ...formData, lastUpdated: newLastUpdated };
    axios
      .post("https://react-table-wnda.onrender.com/api/data", newFormData)
      .then((res) => {
        console.log("Data added successfully");
        console.log(formData);
        setTableData((prevData) => [...prevData, res.data.data]);
      })
      .catch((error) => {
        console.error("Error adding data:", error);
      });
  };

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          <tr>
            <td>id n/a</td>
            <td>
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={handleStartDate}
                max={maxStartDate}
                required
              />
              {startDateMessage && (
                <div className="error-msg">{startDateMessage}</div>
              )}
            </td>
            <td>
              <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={handleEndDate}
                min={minEndDate}
                max={maxStartDate}
                required
              />
              {endDateMessage && (
                <div className="error-msg">{endDateMessage}</div>
              )}
            </td>
            <td>{monthYear}</td>
            <td>
              <input
                type="text"
                value={excludeDates.join(", ")}
                name="selectedDates"
              />
              <input
                type="date"
                onChange={handleExcludeDates}
                min={startDate}
                max={endDate ? endDate : maxStartDate}
              />
            </td>
            <td>{numDays}</td>
            <td>
              <input
                type="number"
                name="leadCount"
                value={leadCount}
                onChange={handleLeadCount}
              />
            </td>
            <td>{DRR.toFixed(2)}</td>
            <td>
              <button onClick={handleSubmit}>Submit</button>
            </td>
          </tr>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
