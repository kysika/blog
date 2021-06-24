const output = "public/";
const storage = output + "__data__/";
const data = {
	homepage: storage + "home.json",
	posts: storage + "posts/",
	tags: storage + "tags.json",
};
const theme = "theme/";

const author: Author = {
	name: "kysika",
	email: "kysika@foxmail.com",
	github: "https://github.com/kysika",
};

export const config: Config = {
	path: {
		theme,
		output,
		storage: data,
	},
	author,
};

interface Author {
	name: string;
	email: string;
	github: string;
}

export interface StoragePaths {
	homepage: string;
	posts: string;
	tags: string;
}
interface Config {
	path: {
		theme: string;
		output: string;
		storage: StoragePaths;
	};
	author: Author;
}
