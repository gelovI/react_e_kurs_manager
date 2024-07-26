import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

const CourseItem = ({
  id,
  image,
  text,
  java,
  containerId,
  index,
  addSection,
  chapterId,
  deleteSection,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [setContent] = useState(text);

  const imageName = image ? image.split("/").pop() : "";
  const textName =
    text && typeof text === "string" ? text.split("/").pop() : "";
  const javaName =
    java && typeof java === "string" ? java.split("/").pop() : "";

  function HandleContentChange(event) {
    setContent(event.currentTarget.textContent);
  }

  return (
    <div className="course-section">
      <div className="course-element">
        <div className="relative flex items-center w-4/5 h-auto mx-auto bg-white border border-black section-wrapper border-1">
          <section className="course-chapter">
            {image && (
              <p
                className="p-2 text-xs bg-transparent image-input focus:ring-2 focus:ring-red-500 highlight"
                contentEditable
                suppressContentEditableWarning={true}
                onInput={HandleContentChange}
              >
                {imageName}
              </p>
            )}
            <hr className="absolute w-full h-1 border-black" />
            {(text || java) && (
              <p
                className="p-2 text-xs bg-transparent text-input focus:ring-2 focus:ring-red-500 highlight"
                contentEditable
                suppressContentEditableWarning={true}
                onInput={HandleContentChange}
              >
                {textName || javaName}
              </p>
            )}
            <div className="absolute top-0 right-0 flex items-center p-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteSection(containerId, chapterId);
                }}
                data-tooltip-id="deleteSection-btn"
                title="Delete section"
                className="delete-button"
              >
                <img
                  src="./images/delete.png"
                  className="h-3 mr-1 delete-image"
                  alt="delete"
                />
              </button>
              <Tooltip id="deleteSection-btn" content="Delete section" border="1px solid black" />
            </div>
          </section>
        </div>
        <div className="placeholder-wrapper">
          <section
            className={`placeholder relative flex items-center mx-auto h-0 ${
              isHovering ? "h-4" : "opacity-0"
            } w-4/5 bg-transparent three-sides-border-dashed`}
          >
            <button
              className="absolute left-0 -translate-x-1/2 add-btn"
              onClick={() => addSection(containerId, index)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="top-0 h-4 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  fill="#FFFFFF"
                />
              </svg>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
