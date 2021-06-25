import { deepStrictEqual, strictEqual, rejects } from "assert";
import { rmdir } from "fs-extra";
import { Stream } from "stream";
import { SingleArrayStorage } from "../storage/fs/SingleArrayStorage";
import { SingleJSONStorage } from "../storage/fs/SingleJSONStorage";

const base = "core/__test__/__data__/";

const sp = {
	sas: base + "sas.json",
	sjs: base + "tags.json",
	fs: base + "posts",
};

describe("Storage Test", () => {
	describe("SingleArrayStorage", () => {
		const storage = new SingleArrayStorage<string>(sp.sas);

		beforeEach(async () => {
			await storage.__dangerour__clean("-force-");
		});

		const p1 = "kyiska";
		const p2 = "kysika2";
		const p3 = "kysika3";

		// create
		it("create 2 item, length is 2, first is p1 second is p2", async () => {
			await storage.create(p1);
			await storage.create(p2);
			const list = await storage.list();
			strictEqual(list.length, 2);
			strictEqual(p1, list[0]);
			strictEqual(p2, list[1]);
		});

		// update
		it("[0] is p3 when update", async () => {
			await storage.create(p1);
			let list = await storage.list();
			strictEqual(list[0], p1);
			list = await storage.update((item, index) => (index === 0 ? p3 : item));
			strictEqual(list[0], p3);
		});

		// remove
		it("remove p3 len is 1, remove p2, len is 0", async () => {
			function remove(value: string) {
				return storage.remove((item) => item === value);
			}
			await storage.create(p3);
			await storage.create(p2);
			let list = await remove(p3);
			strictEqual(1, list.length);
			strictEqual(p2, list[0]);
			list = await remove(p2);
			strictEqual(list.length, 0);
		});

		// clean
		it("list is empty when clean all", async () => {
			await storage.create(p1);
			await storage.create(p2);

			await storage.__dangerour__clean("-force-");
			const list = await storage.list();
			strictEqual(list.length, 0);
		});
	});

	describe("SingleJSONStorage", () => {
		const storage = new SingleJSONStorage(sp.sjs);

		// append & get
		it("append two key-value and get then", async () => {
			await storage.set({ name: "s1" });
			await storage.set({ age: 12 });

			const name = await storage.get("name");
			const json = await storage.load();

			strictEqual(name, "s1");
			strictEqual(12, json.age);
			deepStrictEqual({ name: "s1", age: 12 }, json);

			await storage.set({ name: "new name" });
			const newname = await storage.get("name");
			const newJson = await storage.load();
			strictEqual(newname, "new name");
			strictEqual(newJson.name, "new name");
			strictEqual(12, newJson.age);
			deepStrictEqual({ age: 12, name: "new name" }, newJson);
		});

		// delete
		it("delete name then get it", async () => {
			await storage.delete("name");
			const name = await storage.get("name");
			const age = await storage.get("age");
			const json = await storage.load();
			strictEqual(12, age);
			strictEqual(undefined, name);
			deepStrictEqual({ age: 12 }, json);
		});

		//clean
		it("clean all", async () => {
			await storage.__dangerous__clean("-force-");
			const json = await storage.load();
			deepStrictEqual(json, {});
		});
	});

	describe("Folder Storage", () => {});

	after(async () => {
		console.log("all done, clean test folder");
		await rmdir(base, { recursive: true });
	});
});
