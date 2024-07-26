import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import CourseItem from './CourseItem.js';


const DraggableChapter = ({ chapter, index, containerId, addSection, deleteSection }) => (
  <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="w-full flex flex-col"
      >
        <CourseItem
          image={chapter.image}
          text={chapter.text}
          java={chapter.java}
          containerId={containerId}
          index={index}
          addSection={addSection}
          chapterId={chapter.id}
          deleteSection={deleteSection}
        />
      </div>
    )}
  </Draggable>
);

export default DraggableChapter;
