import { config, StoragePaths } from "../config";
import { Homepage } from "./homepage";
import { Posts } from "./posts";
import { Tags } from "./tags";

//  test-used
export function createStorage(paths: StoragePaths) {
	return {
		homepage: new Homepage(paths.homepage),
		post: new Posts(paths.posts),
		tag: new Tags(paths.tags),
	};
}

export const storage = createStorage(config.path.storage);
