import * as React from "react";
import { getTodos, postTodo } from "../my-api";

type Unsubscribe = () => void;
type AsyncResource<Json> = {
  onUpdate: (callback: (json: Json) => void) => Unsubscribe;
};

type Todo = {
  id: number;
  title: string;
};

type Todos = {
  list: () => Promise<Todo[]>;
  create: (data: Todo) => Promise<void>;
};

class ApiTodos implements Todos {
  constructor(private readonly uid: string) {}

  list: Todos["list"] = () => getTodos();

  create: Todos["create"] = (data) => postTodo(data);
}

class CachedTodos implements Todos {
  private cache: Todo[] | undefined = undefined;

  constructor(private readonly origin: Todos) {}

  list: Todos["list"] = async () => {
    if (this.cache == null) {
      this.cache = await this.origin.list();
    }
    return this.cache!;
  };

  create: Todos["create"] = async (data) => {
    await this.origin.create(data);
    this.cache = undefined;
  };
}

class AsyncResourceTodos implements Todos, AsyncResource<Todo[]> {
  constructor(private readonly origin: Todos) {}

  list: Todos["list"] = async () => this.origin.list();

  create: Todos["create"] = async (data) => this.origin.create(data);

  onUpdate: AsyncResource<Todo[]>["onUpdate"] = (callback) => {
    return () => {};
  };
}

function useAsyncResource<Json, Resource extends AsyncResource<Json>>(
  resource: Resource
):
  | { isLoading: true; cache: undefined; resource: Resource }
  | { isLoading: false; cache: Json; resource: Resource } {
  const [isLoading, setIsLoading] = React.useState(true);
  const [cache, setCache] = React.useState<Json>();

  React.useEffect(() => {
    return resource.onUpdate((json) => {
      setIsLoading(true);
      setCache(json);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return {
      isLoading: true,
      cache: undefined,
      resource,
    };
  }

  return {
    isLoading: false,
    cache: cache!,
    resource,
  };
}

function App() {
  return <TodosComponent />;
}

const todosObj = new CachedTodos(new ApiTodos("my-user"));
function TodosComponent() {
  const [todos, setTodos] = React.useState<Todo[] | undefined>();

  React.useEffect(() => {
    todosObj.list().then((_todos) => setTodos(_todos));
  }, []);

  return (
    <div>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          todosObj.create({
            id: Date.now(),
            title: "Do Laundry",
          });
        }}
      >
        Add Todo
      </button>
    </div>
  );
}

function TodosComponent2() {
  const { cache, resource } = useAsyncResource(
    new AsyncResourceTodos(new CachedTodos(new ApiTodos("my-user")))
  );

  return (
    <div>
      <ul>
        {cache?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          resource.create({
            id: Date.now(),
            title: "Do Laundry",
          });
        }}
      >
        Add Todo
      </button>
    </div>
  );
}

render(<App />, document.getElementById("root"));
