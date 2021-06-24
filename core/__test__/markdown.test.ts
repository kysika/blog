import { strictEqual } from "assert";
import { render } from "../markdown";

describe("markdown-render", () => {
	const content = `---\ntitle: hello world\nprologue: some prologue\ntags: [javascript, mocha]\n---\n# hello world`;

	const result = render(content);

	it("title should be hello wrold", () => {
		strictEqual(result.meta.title, "hello world");
	});

	it("prologue should be some prologue", () => {
		strictEqual(result.meta.prologue, "some prologue");
	});

	it("first tag should be javascript", () => {
		strictEqual((result.meta.tags as Array<string>)[0], "javascript");
	});

	it("second tag should be mocha", () => {
		strictEqual((result.meta.tags as Array<string>)[1], "mocha");
	});
});
