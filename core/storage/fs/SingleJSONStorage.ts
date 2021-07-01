import { ensureFile, readFile, writeFile } from "fs-extra";

export class SingleJSONStorage<T extends Record<string, unknown>> {
	constructor(private file: string) {}

	async set(data: Partial<T>) {
		const old = await this.load();
		const json = Object.assign(old, data);
		await this.write(json);
	}

	async delete(key: string) {
		const json = await this.load();
		delete json[key];
		await this.write(json);
	}

	private async write(data: Partial<T>) {
		await ensureFile(this.file);
		await writeFile(this.file, JSON.stringify(data), { flag: "w+", encoding: "utf-8" });
	}

	async get<S = unknown>(key: string): Promise<S | undefined> {
		const json = await this.load();
		return json[key] as S;
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
			return (JSON.parse(await readFile(this.file, "utf-8")) as Partial<T>) || {};
		} catch (e) {
			return {} as Partial<T>;
		}
	}
}
