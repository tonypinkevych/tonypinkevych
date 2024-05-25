import * as React from "react";

abstract class AsyncResource {}

type File = {
  name: () => Promise<string>;
  updateContent: (content: string) => Promise<void>;
  save: () => Promise<void>;
};

class NetworkFile implements File {
  constructor(private readonly id: string) {}

  name: File["name"] = async () => {
    return networkRequest(this.id);
  };

  updateContent: File["updateContent"] = async (content) => {
    await networkRequest(content);
  };

  save: File["save"] = async () => {
    await networkRequest(content);
  };
}

class FileAsyncResource extends AsyncResource implements File {
  constructor(private readonly origin: File) {
    super();
  }

  @Query()
  name: File["name"] = async () => {
    return this.origin.name();
  };

  @Mutation()
  updateContent: File["updateContent"] = async (content) => {
    await this.origin.updateContent(content);
  };

  @Mutation()
  save: File["save"] = async () => {
    await this.origin.save();
  };
}

function useAsyncResource<T extends AsyncResource>(
  resource: T
): { isLoading: boolean; cache: unknown; resource: T } {
  return {
    isLoading: true,
    cache: undefined,
    resource,
  };
}

export const FileEditor: React.FC<{ fileId: string }> = ({ fileId }) => {
  const {
    isLoading,
    cache,
    resource: file,
  } = useAsyncResource(new FileAsyncResource(new NetworkFile(fileId)));

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <p className="p-0 !m-0">{cache.name}</p>
      <textarea onChange={(e) => file.updateContent(e.target.value)} />
      <button onClick={() => file.save()}>Save</button>
    </div>
  );
};
