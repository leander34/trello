"use client";

import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

export default function Board() {
  const { getBoard, board, setBoardStats, updateTodoInDB } = useBoardStore(
    (state) => state
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);

      setBoardStats({
        ...board,
        columns: rearrangedColumns,
      });
    } else {
      const columns = Array.from(board.columns);
      const startColIndex = columns[Number(source.droppableId)];
      const finishColIndex = columns[Number(destination.droppableId)];

      const startCol: Column = {
        id: startColIndex[0],
        todos: startColIndex[1].todos,
      };

      const finishCol: Column = {
        id: finishColIndex[0],
        todos: finishColIndex[1].todos,
      };

      if (!startCol || !finishCol) return;

      if (source.index === destination.index && startCol === finishCol) return;

      const newTodos = [...startCol.todos];
      const [todoMoved] = newTodos.splice(source.index, 1);

      if (startCol.id === finishCol.id) {
        newTodos.splice(destination.index, 0, todoMoved);

        const newCol = {
          id: startCol.id,
          todos: newTodos,
        };

        const newColumns = new Map(board.columns);
        newColumns.set(newCol.id, newCol);

        setBoardStats({
          ...board,
          columns: newColumns,
        });
      } else {
        const finishTodos = [...finishCol.todos];
        finishTodos.splice(destination.index, 0, todoMoved);

        const newCol = {
          id: startCol.id,
          todos: newTodos,
        };

        const newfinishedCol = {
          id: finishCol.id,
          todos: finishTodos,
        };

        const newColumns = new Map(board.columns);
        newColumns.set(newCol.id, newCol);
        newColumns.set(newfinishedCol.id, newfinishedCol);

        updateTodoInDB(todoMoved, finishCol.id);
        setBoardStats({
          ...board,
          columns: newColumns,
        });
      }
    }
  };
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provider) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provider.droppableProps}
            ref={provider.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => {
              return (
                <Column key={id} id={id} todos={column.todos} index={index} />
              );
            })}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
