import { Heading } from "markdown-it-toc-desc";
import { v4 } from "uuid";
import { config } from "../config";

type UpdatePost = Omit<Post, "id" | "ctime" | "utime">;

export interface PostPreview {
	readonly pid: string;
	readonly ctime: number;
	utime: number;
	author: string;
	tags: string[];
	cover?: string;
	prologue: string;
	hidden: boolean;
	title: string;
}

interface PostEntity {
	content: string;
	toc: Heading[];
}

export interface Post extends PostPreview, PostEntity {}

export class PostModel {
	static make(post: Partial<UpdatePost>): Post {
		const targte: Post = {
			pid: v4(),
			ctime: Date.now(),
			utime: Date.now(),
			author: config.author.name,
			tags: [],
			prologue: "",
			hidden: false,
			title: "",
			content: "",
			toc: [],
		};
		return this.update(targte, post);
	}

	static update(target: Post, post: Partial<UpdatePost>): Post {
		return Object.assign({ utime: Date.now() }, target, post);
	}

	static preview(post: Post): PostPreview {
		const pp: PostPreview & Partial<PostEntity> = Object.assign({}, post);
		delete pp.content;
		delete pp.toc;
		return pp as PostPreview;
	}

	static stringify(target: Post | PostPreview) {
		return JSON.stringify(target);
	}
}
