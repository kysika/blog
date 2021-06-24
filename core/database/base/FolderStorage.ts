import fs from "fs-extra";
import path from "path";

export class FolderStorage<T> {
	constructor(protected dir: string) {}

	async list() {
		await fs.ensureDir(this.dir);
		return fs.readdir(this.dir, "utf-8");
	}

	async create(filename: string, item: T, force = false) {
		const filepath = this.filepath(filename);
		await fs.ensureFile(filepath);
		const content = await fs.readFile(filepath, "utf-8");
		if (content !== "" && !force) {
			throw new Error("CreateError: File: " + filepath + ", is not empty, change an other file or use true as the third argument");
		}
		await fs.writeFile(filepath, JSON.stringify(item), "utf-8");
	}

	async remove(filename: string) {
		const filepath = this.filepath(filename);
		return fs.rm(filepath).catch(() => {});
	}

	async get(filename: string) {
		const filepath = this.filepath(filename);
		try {
			await fs.access(filepath);
			const content = await fs.readFile(filepath, "utf-8");
			return JSON.parse(content) as T;
		} catch (e) {
			return Promise.resolve(null);
		}
	}

	protected filepath(filename: string) {
		return path.resolve(this.dir, filename + ".json");
	}

	async __dangerour__clean(force: "-force-") {
		if (force !== "-force-") {
			console.log("if you wanna delete all things, use -force- as params");
			return false;
		}
		console.warn("you are delete all things, this will not rollback!");
		await fs.rmdir(this.dir, { recursive: true });
		return true;
	}
}
