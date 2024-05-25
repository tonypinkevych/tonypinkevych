import * as React from "react";

type Unsubscribe = () => void;
type UpdateFn = () => void;
type AsyncResource<Json> = {
  get: () => Promise<Json>;
  onUpdate: (callback: UpdateFn) => Unsubscribe;
};

type PokemonJson = {
  id: string;
  name: string;
};

type Pokemon = {
  get: () => Promise<PokemonJson>;
  update: (payload: Partial<PokemonJson>) => Promise<void>;
  delete: () => Promise<void>;
};

class NetworkPokemon implements Pokemon, AsyncResource<PokemonJson> {
  private readonly updateCallbacks = new Set<UpdateFn>();

  constructor(private readonly id: string) {}

  get: Pokemon["get"] = async () => ({
    id: this.id,
    name: this.id.toUpperCase(),
  });

  update: Pokemon["update"] = async () => {};

  delete: Pokemon["delete"] = async () => {};

  onUpdate: AsyncResource<PokemonJson>["onUpdate"] = (callback) => {
    this.updateCallbacks.add(callback);
    return () => {
      this.updateCallbacks.delete(callback);
    };
  };
}

function useAsyncResource<T, Resource extends AsyncResource<T>>(
  resource: Resource
):
  | { isLoading: true; cache: undefined; resource: Resource }
  | { isLoading: false; cache: T; resource: Resource } {
  const [isLoading, setIsLoading] = React.useState(true);
  const [cache, setCache] = React.useState<T>();

  React.useEffect(() => {
    resource
      .get()
      .then((json) => setCache(json))
      .finally(() => setIsLoading(false));

    return resource.onUpdate(async () => {
      setIsLoading(true);
      const json = await resource.get();
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

export const PokemonsDeckOop: React.FC = () => {
  const { isLoading, cache, resource } = useAsyncResource<
    PokemonJson,
    NetworkPokemon
  >(new NetworkPokemon("pickachu"));

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <p className="p-0 !m-0">{cache.id}</p>
      <p className="p-0 !m-0">{cache.name}</p>
    </div>
  );
};
