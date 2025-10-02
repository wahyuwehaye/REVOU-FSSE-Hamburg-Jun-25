export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: string; // ISO string
}

export type CreateTodoDto = {
  title: string;
};

export type UpdateTodoDto = Partial<Pick<Todo, "title" | "done">>;
