import { Post } from "../models/post";
import { FolderStorage } from "./base/FolderStorage";

export class Posts extends FolderStorage<Post> {
	constructor(dir: string) {
		super(dir);
	}
}
