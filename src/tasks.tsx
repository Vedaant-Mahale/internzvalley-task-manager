import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Tasks() {
  const location = useLocation();
  const username = location.state?.username || "Guest";
  const [date, setDate] = useState("");
  const [task, setTask] = useState("");
  const [taskset, setTaskSet] = useState<{ name: string; task: string; date: string }[]>([]);
  const [filter, setFilter] = useState("all");

  const createTask = async () => {
    if (!task.trim()) {
      alert("Please enter a task.");
      return;
    }
    if (!date) {
      alert("Please select a date.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/create", { 
        name: username, 
        task, 
        date 
      });
      console.log("Success:", response.data);
      setTaskSet((prev) => [...prev, { name: username, task, date }]); // Update state with new task
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deletetask = async (taskName: string) => {
    try {
      await axios.delete("http://localhost:3000/delete", {
        data: { task: taskName }, 
      });

      alert("Task deleted successfully!");
      setTaskSet((prevTasks) => prevTasks.filter((t) => t.task !== taskName));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    }
  };

  useEffect(() => {
    console.log(username);
    const gettask = async () => {
      const response = await axios.get("http://localhost:3000/task", { params: { name: username } });
      console.log(response.data.allTasks);
      setTaskSet(response.data.allTasks);
    };
    gettask();
  }, []);

  const filteredTasks = taskset.filter((task) => {
    const taskDate = new Date(task.date);
    const currDate = new Date();
  
    console.log("Processing Task:", task.task, "| Date:", task.date); // Debugging print
    console.log("Parsed Task Date:", taskDate.toString()); // Debugging print
  
    if (isNaN(taskDate.getTime())) {
      console.error("Invalid date format for task:", task.task, "Raw date:", task.date);
      return false; // Skip invalid dates
    }
  
    const diffInDays = Math.floor((taskDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
    console.log("Difference in Days:", diffInDays); // Debugging print
  
    switch (filter) {
      case "recent":
        console.log("Filter: Recent (<= 30 days)");
        return diffInDays <= 30; // Last 1 month
      case "popular":
        console.log("Filter: Popular (<= 7 days)");
        return diffInDays <= 7; // Last 1 week
      case "oldest":
        console.log("Filter: Oldest (<= 1 day)");
        return diffInDays <= 1; // Last 1 day
      default:
        console.log("Filter: All (Showing all tasks)");
        return true; // Show all tasks
    }
  });
  

  return (
    <>
      <div className="w-screen h-20 bg-blue-400 flex justify-between">
        <div className="w-1/2 m-auto flex">
          <input
            className="w-1/2 h-10 p-5 ml-28 mr-4 border-none outline-none rounded-full"
            onChange={(e) => setTask(e.target.value)}
          />
          <input
            type="date"
            className="outline-none p-2 rounded-3xl"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="rounded-full w-10 h-10 bg-white m-auto text-3xl text-center" onClick={createTask}>+</button>
        </div>
        <select
          className="w-52 h-10 mt-5 mr-10 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="recent">&lt;1 Month</option>
          <option value="popular">&lt;1 Week</option>
          <option value="oldest">&lt;1 Day</option>
        </select>
      </div>

      <div className="w-screen h-[80vh]">
        {filteredTasks.map((task, index) => (
          <div
            key={index}
            className="m-auto mt-10 p-4 bg-blue-400 rounded-3xl text-white w-1/2 flex justify-between items-center font-bold shadow-lg"
          >
            <div>
              <p className="text-lg">📌 Task: {task.task}</p>
              <p className="text-sm opacity-80">📅 Date: {task.date}</p>
            </div>

            <div
              className="m-auto mr-4 ml-0 cursor-pointer text-lg p-3 border-2 rounded-full border-white transition-all hover:bg-white hover:text-blue-400"
              onClick={() => deletetask(task.task)}
            >
              ❌
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Tasks;
