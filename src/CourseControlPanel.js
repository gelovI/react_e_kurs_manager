import React, { useState, useEffect, useContext, useCallback } from "react";
import { ContainerContext } from "./Context.js";

function CourseControlPanel({ data }) {
  const [searchMode, setSearchMode] = useState("chapter");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { containers } = useContext(ContainerContext);

  function PrepareTextForSearch(text) {
    if (!text) return "";
    return text
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[0-9.,\-#!$%^&*;:{}=\-_`~()]+/g, " ")
      .toLowerCase()
      .trim();
  }

  const highlightResults = useCallback(() => {
    document.querySelectorAll(".highlight").forEach((el) => {
      el.classList.remove("highlight");
    });

    if (!searchTerm) return;

    document.querySelectorAll(".chapters").forEach((el) => {
      if (el.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
        el.classList.add("highlight");
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }, [searchTerm]);

  const searchContent = useCallback(
    (keyword) => {
      const preparedKeyword = PrepareTextForSearch(keyword);

      const newFilteredData = data.reduce((acc, chapter) => {
        // Vorbereitung des Kapiteltitels
        const preparedChapterTitle = PrepareTextForSearch(chapter.header);
        if (searchMode === "chapter") {
          if (preparedChapterTitle.includes(preparedKeyword)) {
            acc.push(chapter);
          }
        } else if (searchMode === "content" && chapter.chapters) {
          const matchingSubItems = chapter.chapters.filter((item) => {
            const itemContent = [item.text, item.image, item.movie]
              .filter(Boolean)
              .map((text) => PrepareTextForSearch(text))
              .join(" ");
            return itemContent.includes(preparedKeyword);
          });

          if (matchingSubItems.length > 0) {
            acc.push({ ...chapter, chapters: matchingSubItems });
          }
        }

        return acc;
      }, []);

      setFilteredData(newFilteredData);
      highlightResults(newFilteredData, preparedKeyword);
    },
    [data, searchMode, highlightResults]
  );

  useEffect(() => {
    if (searchTerm) {
      searchContent(searchTerm);
    } else {
      setFilteredData([]);
    }
  }, [searchTerm, searchMode, data, searchContent]);

  useEffect(() => {
    highlightResults();
  }, [filteredData, highlightResults]);

  function HandleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  function ToggleSearchMode() {
    setSearchMode((prevMode) =>
      prevMode === "chapter" ? "content" : "chapter"
    );
  }

  function SaveData() {
    if (!containers.length) {
      alert("Keine Daten zum Speichern vorhanden.");
      return;
    }

    try {
      const dataToSave = containers.map((container) => ({
        header: container.header,
        color: container.color,
        chapters: container.chapters.map((chapter) => ({
          text: chapter.text,
          image: chapter.image,
          java: chapter.java,
        })),
      }));

      const blob = new Blob([JSON.stringify(dataToSave)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const dlAnchorElem = document.createElement("a");
      dlAnchorElem.setAttribute("href", url);
      dlAnchorElem.setAttribute("download", "courseData.json");
      document.body.appendChild(dlAnchorElem);
      dlAnchorElem.click();
      document.body.removeChild(dlAnchorElem);
      URL.revokeObjectURL(url);

      alert("Daten erfolgreich gespeichert!");
    } catch (error) {
      console.error("Fehler beim Speichern der Daten:", error);
      alert("Fehler beim Speichern der Daten. Siehe Konsole für Details.");
    }
  }

  return (
    <header className="header h-8 flex justify-between items-center p-4 fixed top-0 w-full z-10 bg-opacity-50 bg-gray-800 backdrop-filter backdrop-blur-md">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Quick search..."
          className="search-field h-5 px-4 text-sm rounded-l-xl bg-gray-200 outline-none"
          value={searchTerm}
          onChange={HandleSearchChange}
        />
        <button
          className="search-icon px-3 bg-yellow-400 rounded-r-xl h-5 text-white text-sm cursor-pointer"
          onClick={ToggleSearchMode}
        >
          {searchMode === "chapter" ? "Chapter" : "Content"}
        </button>
      </div>
      <button
        className="text-white bg-blue-500 px-4 rounded-xl text-xs h-5"
        onClick={SaveData}
      >
        Save
      </button>
    </header>
  );
}

export default CourseControlPanel;
