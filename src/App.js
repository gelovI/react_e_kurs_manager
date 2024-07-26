import React, { useState } from "react";
import "./tailwind.css";
import "./fonts.css";
import "./App.css";
import { ContainerProvider } from "./Context.js";
import { GenerateUniqueId } from "./Utils.js";
import CourseContainer from "./CourseContainer";
import CourseControlPanel from "./CourseControlPanel.js";

function App() {
  const [coursesData, setCoursesData] = useState([]);
  const [fileLoaded, setFileLoaded] = useState(false);

  function HandleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let jsonData = JSON.parse(e.target.result);
          jsonData = jsonData.map((container) => ({
            ...container,
            id: container.id || GenerateUniqueId(),
            chapters: container.chapters.map((chapter) => ({
              ...chapter,
              id: chapter.id || GenerateUniqueId(),
            })),
          }));
          setCoursesData(jsonData);
          setFileLoaded(true);
        } catch (error) {
          console.error("Fehler beim Parsen der JSON-Datei:", error);
          alert(
            "Fehler beim Parsen der JSON-Datei. Überprüfen Sie das Dateiformat."
          );
        }
      };
      reader.onerror = () => {
        alert("Fehler beim Lesen der Datei.");
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      className="bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/images/linien_hintergrund.jpg')" }}
    >
      {!fileLoaded && (
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 course-title-container top-1/4 left-1/2">
          <h1 className="course-title md:text-2xl lg:text-4xl xl:text-6xl 2xl:text-8xl">
            <span className="inline-block font-title1 rotate-counterClockwise">
              e
            </span>
            <span className="font-title2"> Course</span>
            <span className="font-title1"> Manager</span>
          </h1>
        </div>
      )}

      {!fileLoaded && (
        <div className="flex items-center justify-center h-screen">
          <button
            className="load-course"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Load file
          </button>
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            accept=".json"
            onChange={HandleFileChange}
          />
        </div>
      )}

      {fileLoaded && (
        <ContainerProvider>
          <CourseControlPanel data={coursesData} />
          <CourseContainer data={coursesData} />
        </ContainerProvider>
      )}
    </div>
  );
}

export default App;
