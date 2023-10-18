import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  Draggable,
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
  Droppable,
} from "react-beautiful-dnd";
type Props = {
  todo: Todo;
  index: number;
  id: TypeColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

export default function TodoCard({
  id,
  todo,
  index,
  dragHandleProps,
  draggableProps,
  innerRef,
}: Props) {
  const { deleteTask } = useBoardStore((state) => state);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fetchUrl = useCallback(async () => {
    if (todo.image) {
      const url = await getUrl(todo.image);
      if (url) {
        setImageUrl(url.toString());
      }
    }
  }, [todo]);

  useEffect(() => {
    fetchUrl();
  }, [fetchUrl]);
  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button
          onClick={() => deleteTask(index, todo, id)}
          className="text-red-500 hover:text-red-600"
        >
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>

      {imageUrl && (
        <div className="h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
}
