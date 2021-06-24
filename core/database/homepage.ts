import { PostPreview } from "../models/post";
import { SingleArrayStorage } from "./base/SingleArrayStorage";

export class Homepage extends SingleArrayStorage<PostPreview> {
	constructor(path: string) {
		super(path);
	}

	async removeById(id: string) {
		return this._remove((item) => item.pid !== id);
	}
}
