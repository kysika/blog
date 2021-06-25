const output = "public/";
const storage = output + "__data__/";
const data = {
	homepage: storage + "home.json",
	posts: storage + "posts/",
	tags: storage + "tags.json",
};
const baseThemePath = "theme/";

const svelte = {
	template: baseThemePath + "index.html",
	entry: baseThemePath + "app.svelte",
};

const author: Author = {
	name: "kysika",
	email: "kysika@foxmail.com",
	github: "https://github.com/kysika",
};

export const config: Config = {
	path: {
		theme: { svelte },
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
		theme: {
			svelte: {
				template: string;
				entry: string;
			};
		};
		output: string;
		storage: StoragePaths;
	};
	author: Author;
}
