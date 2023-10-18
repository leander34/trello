import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardStats: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypeColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;

  addTask: (todo: string, columnId: TypeColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypeColumn) => void;

  newTaskInput: string;
  setNewTaskInput: (input: string) => void;

  newTaskType: TypeColumn;
  setNewTaskType: (newTaskType: TypeColumn) => void;

  image: File | null;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypeColumn, Column>(),
  },
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
  newTaskInput: "",
  setNewTaskInput: (newTaskInput) => set({ newTaskInput }),
  newTaskType: "todo",
  setNewTaskType: (newTaskType) => set({ newTaskType }),
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({
      board,
    });
  },
  setBoardStats: (board) => set({ board }),
  image: null,
  setImage: (image) => set({ image }),
  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  addTask: async (todo, columnId, image) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);

      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: "" });

    const newColumns = new Map(get().board.columns);
    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        status: columnId,
        title: todo,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      return {
        board: { columns: newColumns },
      };
    });
  },
  deleteTask: async (taskIndex, todo, id) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({
      board: { columns: newColumns },
    });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },
}));
