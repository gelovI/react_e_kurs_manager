import React, { useState, useEffect, useContext } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DraggableChapter from "./DraggableChapter.js";
import { GenerateUniqueId } from "./Utils.js";
import { ContainerContext } from "./Context.js";
import { Tooltip } from "react-tooltip";

const CourseContainer = ({ data }) => {
  const { containers, setContainers } = useContext(ContainerContext);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    setContainers(data);
  }, [data, setContainers]);

  // Funktion zum Ändern der Hintergrundfarbe des Containers
  function HandleColorChange(e, id) {
    const newColor = e.target.value;
    const updatedContainers = containers.map((container) =>
      container.id === id ? { ...container, color: newColor } : container
    );
    setContainers(updatedContainers);
  }

  // Funktion zum Löschen eines Kapitels
  function DeleteSection(containerId, chapterId) {
    const isConfirmed = window.confirm(
      "Bist du sicher, dass du dieses Kapitel löschen möchtest?"
    );
    if (isConfirmed) {
      const updatedContainers = containers.map((container) => {
        if (container.id === containerId) {
          const filteredChapters = container.chapters.filter(
            (chapter) => chapter.id !== chapterId
          );
          return { ...container, chapters: filteredChapters };
        }
        return container;
      });
      setContainers(updatedContainers);
    }
  }

  // Funktion zum Löschen eines Containers
  function DeleteContainer(id) {
    const isConfirmed = window.confirm(
      "Bist du sicher, dass du diesen Container löschen möchtest?"
    );
    if (isConfirmed) {
      const updatedContainers = containers.filter(
        (container) => container.id !== id
      );
      setContainers(updatedContainers);
    }
  }

  function AddContainerAtPosition(index) {
    const newContainer = {
      id: GenerateUniqueId(),
      color: "#ffffff",
      header: "New Container",
      chapters: [
        {
          id: GenerateUniqueId(),
          image: "Placeholder",
          text: "Placeholder",
          java: "",
        },
      ],
    };

    const updatedContainers = [
      ...containers.slice(0, index + 1),
      newContainer,
      ...containers.slice(index + 1),
    ];
    setContainers(updatedContainers);
  }

  // Behandlung der Reihenfolgeänderung nach dem Drag-and-Drop
  function OnDragEnd(result) {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceContainerIndex = containers.findIndex(
      (container) => container.id === source.droppableId
    );
    const destContainerIndex = containers.findIndex(
      (container) => container.id === destination.droppableId
    );

    if (sourceContainerIndex === destContainerIndex) {
      const items = Array.from(containers[sourceContainerIndex].chapters);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const newContainers = Array.from(containers);
      newContainers[sourceContainerIndex].chapters = items;
      setContainers(newContainers);
    } else {
      const sourceItems = Array.from(containers[sourceContainerIndex].chapters);
      const [removedItem] = sourceItems.splice(source.index, 1);

      const destinationItems = Array.from(
        containers[destContainerIndex].chapters
      );
      destinationItems.splice(destination.index, 0, removedItem);

      const newContainers = Array.from(containers);
      newContainers[sourceContainerIndex].chapters = sourceItems;
      newContainers[destContainerIndex].chapters = destinationItems;

      setContainers(newContainers);
    }
  }

  function AddSection(containerId, atIndex) {
    const newContainers = containers.map((container) => {
      if (container.id === containerId) {
        const newChapter = {
          id: GenerateUniqueId(),
          image: "Placeholder",
          text: "Placeholder",
          java: "",
        };
        const newChapters = [...container.chapters];
        newChapters.splice(atIndex + 1, 0, newChapter);
        return { ...container, chapters: newChapters };
      }
      return container;
    });
    setContainers(newContainers);
  }

  function MoveContainerUp(index) {
    if (index === 0) return;
    const newContainers = [...containers];
    [newContainers[index], newContainers[index - 1]] = [
      newContainers[index - 1],
      newContainers[index],
    ];
    setContainers(newContainers);
  }

  function MoveContainerDown(index) {
    if (index === containers.length - 1) return;
    const newContainers = [...containers];
    [newContainers[index], newContainers[index + 1]] = [
      newContainers[index + 1],
      newContainers[index],
    ];
    setContainers(newContainers);
  }

  return (
    <DragDropContext onDragEnd={OnDragEnd}>
      {containers.map((container, index) => (
        <React.Fragment key={container.id}>
          <Droppable droppableId={container.id} key={container.id} type="item">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`course-container w-2/3 bg-gray-200 mx-auto mt-10 rounded-md border-2 border-black my-2 chapter`}
                style={{ backgroundColor: container.color }}
              >
                <div className="flex justify-between items-center w-full">
                  <input
                    className="header-input flex-grow bg-transparent text-xs p-2 chapter-header"
                    placeholder="Header name here..."
                    value={container.header}
                    onChange={(e) =>
                      setContainers(
                        containers.map((c) =>
                          c.id === container.id
                            ? { ...c, header: e.target.value }
                            : c
                        )
                      )
                    }
                  />
                  <button
                    style={{
                      position: "relative",
                      width: "40px",
                      height: "40px",
                      border: "none",
                      padding: "0",
                      background: "none",
                    }}
                    data-tooltip-id="changeColor-btn"
                  >
                    <img
                      src="./images/color-picker.png"
                      className="h-6 w-6 ml-3"
                      alt="Change color"
                    />
                    <input
                      type="color"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      onChange={(e) => HandleColorChange(e, container.id)}
                      value={container.color || "#ffffff"}
                    />
                  </button>
                  <Tooltip id="changeColor-btn" content="Change background color" border="1px solid black" />
                </div>
                <div className="chapters w-full chapter-content">
                  {container.chapters.map((chapter, index) => (
                    <DraggableChapter
                      key={chapter.id}
                      chapter={chapter}
                      index={index}
                      containerId={container.id}
                      addSection={AddSection}
                      deleteSection={DeleteSection}
                    />
                  ))}
                  {provided.placeholder}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex">
                    <button
                      onClick={() => MoveContainerUp(index)}
                      data-tooltip-id="containerUp-btn"
                    >
                      <svg
                        className="h-6 w-6"
                        viewBox="-3 0 32 32"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="icomoon-ignore"></g>
                        <circle cx="13" cy="16" r="12" fill="white" />
                        <path
                          d="M26.221 16c0-7.243-5.871-13.113-13.113-13.113s-13.113 5.87-13.113 13.113c0 7.242 5.871 13.113 13.113 13.113s13.113-5.871 13.113-13.113zM1.045 16c0-6.652 5.412-12.064 12.064-12.064s12.064 5.412 12.064 12.064c0 6.652-5.411 12.064-12.064 12.064-6.652 0-12.064-5.412-12.064-12.064z"
                          fill="black"
                        ></path>
                        <path
                          d="M18.746 15.204l0.742-0.742-6.379-6.379-6.378 6.379 0.742 0.742 5.112-5.112v12.727h1.049v-12.727z"
                          fill="black"
                        ></path>
                      </svg>
                    </button>
                    <Tooltip id="containerUp-btn" content="Container move up" border="1px solid black" />
                    <button
                      onClick={() => MoveContainerDown(index)}
                      data-tooltip-id="containerDown-btn"
                    >
                      <svg
                        className="h-6 w-6"
                        viewBox="-3 0 32 32"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                        transform="rotate(180)"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <g id="icomoon-ignore"> </g>{" "}
                          <circle cx="13" cy="16" r="12" fill="white" />{" "}
                          <path
                            d="M26.221 16c0-7.243-5.871-13.113-13.113-13.113s-13.113 5.87-13.113 13.113c0 7.242 5.871 13.113 13.113 13.113s13.113-5.871 13.113-13.113zM1.045 16c0-6.652 5.412-12.064 12.064-12.064s12.064 5.412 12.064 12.064c0 6.652-5.411 12.064-12.064 12.064-6.652 0-12.064-5.412-12.064-12.064z"
                            fill="#000000"
                          >
                            {" "}
                          </path>{" "}
                          <path
                            d="M18.746 15.204l0.742-0.742-6.379-6.379-6.378 6.379 0.742 0.742 5.112-5.112v12.727h1.049v-12.727z"
                            fill="#000000"
                          >
                            {" "}
                          </path>{" "}
                        </g>
                      </svg>
                    </button>
                    <Tooltip id="containerDown-btn" content="Container move down" border="1px solid black" />
                  </div>
                  <button
                    className="mr-2 mb-px"
                    onClick={() => DeleteContainer(container.id)}
                    data-tooltip-id="deleteContainer-btn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="red"
                      className="h-6 w-6"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="black"
                        strokeWidth="1.5"
                        fill="white"
                      />
                      <line
                        x1="8"
                        y1="8"
                        x2="16"
                        y2="16"
                        stroke="red"
                        strokeWidth="2"
                      />
                      <line
                        x1="16"
                        y1="8"
                        x2="8"
                        y2="16"
                        stroke="red"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                  <Tooltip id="deleteContainer-btn" content="Delete container" border="1px solid black" />
                </div>
              </div>
            )}
          </Droppable>
          <div
            className="add-section-button"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            style={{
              textAlign: "center",
              opacity: hoverIndex === index ? 1 : 0,
              transition: "opacity 0.5s",
              cursor: "pointer",
            }}
          >
            <button
              onClick={() => AddContainerAtPosition(index)}
              style={{ margin: "10px auto", visibility: "visible" }}
            >
              Add New Section Here
            </button>
          </div>
        </React.Fragment>
      ))}
    </DragDropContext>
  );
};

export default CourseContainer;
