import { SingleArrayStorage } from "./base/SingleArrayStorage";

export class Tags extends SingleArrayStorage<string> {
	constructor(path: string) {
		super(path);
	}

	async remove(tag: string) {
		return this._remove((_tag) => _tag !== tag);
	}
}
