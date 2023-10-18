import { PlusCircleIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
type Props = {
  id: TypeColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypeColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};
export default function Column({ id, todos, index }: Props) {
  const { searchString, setNewTaskType } = useBoardStore((state) => state);
  const { openModal } = useModalStore();
  const handleAddTodo = () => {
    setNewTaskType(id);
    openModal();
  };
  return (
    <Draggable draggableId={id} index={index}>
      {(provider) => (
        <div
          {...provider.draggableProps}
          {...provider.dragHandleProps}
          ref={provider.innerRef}
        >
          <Droppable droppableId={index.toString()} type="card">
            {(provider, snapshot) => (
              <div
                {...provider.droppableProps}
                ref={provider.innerRef}
                className={classNames("p-2 rounded-2xl shadow-sm", {
                  "bg-green-200": snapshot.isDraggingOver,
                  "bg-white/50": !snapshot.isDraggingOver,
                })}
              >
                <h2 className="flex items-center justify-between font-bold text-xl p-2">
                  {idToColumnText[id]}{" "}
                  <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal">
                    {!searchString
                      ? todos.length
                      : todos.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                        ).length}
                  </span>
                </h2>

                <div className="space-y-2">
                  {todos.map((todo, index) => {
                    if (
                      searchString &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    ) {
                      return null;
                    }
                    return (
                      <Draggable
                        key={todo.$id}
                        draggableId={todo.$id}
                        index={index}
                      >
                        {(provider) => (
                          <TodoCard
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provider.innerRef}
                            draggableProps={provider.draggableProps}
                            dragHandleProps={provider.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {provider.placeholder}
                  <div className="flex items-end justify-end p-2">
                    <button
                      onClick={handleAddTodo}
                      className="text-green-500 hover:text-green-600"
                    >
                      <PlusCircleIcon className="h-6 w-6 " />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
