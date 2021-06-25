import fs from "fs-extra";

export class SingleArrayStorage<T> {
	constructor(protected path: string) {}

	async list() {
		await fs.ensureFile(this.path);
		try {
			const content = await fs.readFile(this.path, "utf-8");
			return JSON.parse(content) as T[];
		} catch (e) {
			return [];
		}
	}

	async remove(cb: (item: T, index: number) => boolean) {
		const list = (await this.list()).filter((item, index) => !cb(item, index));
		await this.write(list);
		return list;
	}

	async update(cb: (item: T, index: number) => T) {
		const list = (await this.list()).map(cb);
		await this.write(list);
		return list;
	}

	async find(cb: (item: T, index: number) => boolean) {
		return (await this.list()).find(cb);
	}

	async create(ps: T) {
		const list = await this.list();
		list.push(ps);
		await this.write(list);
		return list;
	}

	protected async write(ps: T[]) {
		await fs.ensureFile(this.path);
		return fs.writeFile(this.path, JSON.stringify(ps), "utf-8");
	}

	async __dangerour__clean(force: "-force-") {
		if (force !== "-force-") {
			console.log("if you wanna delete all things, use -force- as params");
			return false;
		}
		console.warn("you are delete all things, this will not rollback!");
		await this.write([]);
		return true;
	}
}
