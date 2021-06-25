import { ensureFile, readFile, writeFile } from "fs-extra";

export class SingleJSONStorage {
	constructor(private file: string) {}

	async set(data: Record<string, unknown>) {
		const old = await this.load();
		const json = Object.assign(old, data);
		await this.write(json);
	}

	async delete(key: string) {
		const json = await this.load();
		delete json[key];
		await this.write(json);
	}

	private async write(data: Record<string, unknown>) {
		await ensureFile(this.file);
		await writeFile(this.file, JSON.stringify(data), { flag: "w+", encoding: "utf-8" });
	}

	async get<T = unknown>(key: string) {
		const json = await this.load();
		return json[key] as T;
	}

	async __dangerous__clean(force: "-force-") {
		if (force !== "-force-") {
			console.log("if you wanna delete all things, use -force- as params");
			return false;
		}
		console.warn("you are delete all things, this will not rollback!");
		await this.write({});
		return true;
	}

	async load() {
		await ensureFile(this.file);
		try {
			return (JSON.parse(await readFile(this.file, "utf-8")) as Record<string, unknown>) || {};
		} catch (e) {
			return {};
		}
	}
}
