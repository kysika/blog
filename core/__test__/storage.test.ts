import { deepStrictEqual, strictEqual, rejects } from "assert";
import { rmdir } from "fs-extra";
import { StoragePaths } from "../config";
import { createStorage } from "../database";
import { PostModel, PostPreview } from "../models/post";

const base = "core/__test__/__data__/";

const StoragePaths: StoragePaths = {
	homepage: base + "home.json",
	tags: base + "tags.json",
	posts: base + "posts",
};

const storage = createStorage(StoragePaths);

describe("Storage", () => {
	describe("Homepage Storage (include SingleArrayStorage)", () => {
		const homepage = storage.homepage;

		const p1 = PostModel.preview(PostModel.make({ title: "p1" }));

		const p2 = PostModel.preview(PostModel.make({ title: "p2" }));

		it("list is empty", async () => {
			const list = await homepage.list();
			strictEqual(list.length, 0);
		});

		it("list has one item and [0] is p1", async () => {
			await homepage.add(p1);

			const list = await homepage.list();
			strictEqual(list.length, 1);
			deepStrictEqual(p1, list[0]);
		});

		it("list has two items, and [1] is p2", async () => {
			await homepage.add(p2);
			const list = await homepage.list();
			strictEqual(list.length, 2);
			deepStrictEqual(p2, list[1]);
		});

		it("list has one item p1 when remove p2", async () => {
			await homepage.removeById(p2.pid);
			const list = await homepage.list();
			strictEqual(list.length, 1);
			deepStrictEqual(p1, list[0]);
		});

		it("list is empty when remove p1", async () => {
			await homepage.removeById(p1.pid);
			const list = await homepage.list();
			strictEqual(list.length, 0);
		});

		it("list is empty when clean all", async () => {
			await homepage.add(p1);
			await homepage.add(p2);

			await homepage.__dangerour__clean("-force-");
			const list = await homepage.list();
			strictEqual(list.length, 0);
		});
	});

	describe("Tags Storage (exclude SingleArrayStorage)", () => {
		const tag = storage.tag;

		it("list should be empty when remove one tag", async () => {
			await tag.add("hello");
			let list = await tag.list();

			strictEqual(list.length, 1);
			strictEqual(list[0], "hello");

			await tag.remove("hello");
			list = await tag.list();
			strictEqual(list.length, 0);
		});
	});

	describe("Posts Storage (include FolderStorage)", () => {
		const post = storage.post;

		const p1 = PostModel.make({ title: "p1" });
		const p2 = PostModel.make({ title: "p2" });

		it("posts is empty when no data", async () => {
			const list = await post.list();
			strictEqual(list.length, 0);
		});

		it("post has one item && item has pi.pid + .json", async () => {
			await post.create(p1.pid, p1);
			const list = await post.list();
			strictEqual(list.length, 1);
			strictEqual(true, list.includes(p1.pid + ".json"));
		});

		it("post.get(filenam) will return p1", async () => {
			const sp1 = await post.get(p1.pid);
			deepStrictEqual(p1, sp1);
		});

		it("list has two item when insert p2, list include p2.pid", async () => {
			await post.create(p2.pid, p2);
			const list = await post.list();

			strictEqual(list.length, 2);
			strictEqual(true, list.includes(p2.pid + ".json"));
			strictEqual(true, list.includes(p1.pid + ".json"));
		});

		it("p2 get & p1 get", async () => {
			const sp1 = await post.get(p1.pid);
			const sp2 = await post.get(p2.pid);
			deepStrictEqual(sp1, p1);
			deepStrictEqual(sp2, p2);
		});

		it("will get an error when create p1 twice", async () => {
			rejects(() => post.create(p1.pid, p1));
		});

		it("will be empty when remove all", async () => {
			await post.__dangerour__clean("-force-");
			const list = await post.list();
			strictEqual(0, list.length);
		});
	});

	after(async () => {
		await rmdir(base, { recursive: true });
	});
});
