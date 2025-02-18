import React from "react";
import styles from "../styles/displaySection.module.css";
// import data from "../utils/constants.js";
import PieChart from "../components/pie.jsx";
import LineChart from "../components/line.jsx";
import TaskTable from "../components/table.jsx";
import { useQuery } from "../context/QueryContext.jsx";

const DisplaySection = () => {
  const { query } = useQuery();
  const [priorityCounts, setPriorityCounts] = React.useState({
    critical: 0,
    high: 0,
    low: 0,
    moderate: 0
  });

  const [taskTypeCounts, setTaskTypeCounts] = React.useState({
    emergency: 0,
    planned: 0,
    incidental: 0,
  });

  const [taskStatusCounts, setTaskStatusCounts] = React.useState({
    completed: 0,
    yetToBeAssigned: 0,
    pending: 0,
    underReview: 0,
  });

  React.useEffect(() => {
    const updateTaskCount = async () => {
      try {
        const response = await fetch('https://progresstracker-api.onrender.com/api/tasks');
        const data = await response.json();
        
        const counts = {
          critical: 0,
          high: 0,
          low: 0,
          moderate: 0
        };

        const taskTypeCounts = {
          emergency: 0,
          planned: 0,
          incidental: 0,
        };

        data.forEach(task => {
          if (task.priority === 'Critical') counts.critical++;
          if (task.priority === 'High') counts.high++;
          if (task.priority === 'Low') counts.low++;
          if (task.priority === 'Moderate') counts.moderate++;
        });

        data.forEach(task => {
          if (task.type === 'Emergency') taskTypeCounts.emergency++;
          if (task.type === 'Planned') taskTypeCounts.planned++;
          if (task.type === 'Incidental') taskTypeCounts.incidental++;
        });

        data.forEach(task => {
          if (task.status === 'Completed') taskStatusCounts.completed++;
          if (task.status === 'Yet to be assigned') taskStatusCounts.yetToBeAssigned++;
          if (task.status === 'Pending') taskStatusCounts.pending++;
          if (task.status === 'Under review') taskStatusCounts.underReview++;
        });

        setPriorityCounts(counts);
        setTaskTypeCounts(taskTypeCounts);
        setTaskStatusCounts(taskStatusCounts);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    updateTaskCount();
  }, []); // Empty dependency array means this runs once on mount

  const firstChartData = {
    labels: ['Critical', 'High', 'Low', 'Moderate'],
    values: [
      priorityCounts.critical,
      priorityCounts.high,
      priorityCounts.low,
      priorityCounts.moderate
    ],
  };
  
  const secondChartData = {
    labels: ["Emergency", "Planned", "Incidental"],
    values: [taskTypeCounts.emergency, taskTypeCounts.planned, taskTypeCounts.incidental],
  };

  const lineChartData = {
    labels: ["Completed", "Yet to be assigned", "Pending", "Under review"],
    values: [taskStatusCounts.completed, taskStatusCounts.yetToBeAssigned, taskStatusCounts.pending, taskStatusCounts.underReview],
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.chartContainer}>
          <PieChart data={firstChartData} title="Tasks by Priority" />
          <PieChart data={secondChartData} title="Tasks by Type" />
        </div>
        <div className={styles.graphContainer}>
          <LineChart data={lineChartData} />
        </div>
      </div>
      
      {query && (
        <div className={styles.queryContainer}>
          <div className={styles.tableContainer}>
            {/* <TaskTable data={data} /> */}
          </div>
        </div>
      )}
    </>
  );
};  

export default DisplaySection;
