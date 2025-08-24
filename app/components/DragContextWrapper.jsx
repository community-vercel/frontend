'use client';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function DragContextWrapper({ children, onDragEnd }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const sourceDroppableId = active.data.current?.sortable?.containerId || active.data.current?.droppableId;
    const destinationDroppableId = over.data.current?.sortable?.containerId || over.data.current?.droppableId || over.id;
    const sourceIndex = active.data.current?.sortable?.index;
    const destinationIndex = over.data.current?.sortable?.index;

    console.log('Drag End Event:', {
      activeId: active.id,
      overId: over.id,
      sourceDroppableId,
      destinationDroppableId,
      sourceIndex,
      destinationIndex
    });

    if (['short', 'long'].includes(over.id)) {
      onDragEnd({
        destination: { 
          droppableId: over.id, 
          index: 0 
        },
        source: { 
          droppableId: sourceDroppableId, 
          index: sourceIndex 
        },
        draggableId: active.id
      });
      return;
    }

    if (active.id !== over.id && sourceDroppableId && destinationDroppableId) {
      onDragEnd({
        destination: { 
          droppableId: destinationDroppableId, 
          index: destinationIndex !== undefined ? destinationIndex : 0
        },
        source: { 
          droppableId: sourceDroppableId, 
          index: sourceIndex 
        },
        draggableId: active.id
      });
    }
  };

  const handleDragStart = (event) => {
    console.log('Drag Started:', event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (over) {
      console.log('Drag Over:', { activeId: active.id, overId: over.id });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
}