import { strictEqual } from "assert";
import { createHeadTag, createScriptTag, HTMLHeadMeta, HTMLScriptMeta, renderer } from "../renderer";

describe("create tag", () => {
	const heads: HTMLHeadMeta[] = [
		{
			type: "link",
			attr: {
				href: "./index.css",
				rel: "stylesheet",
			},
			content: "",
		},
		{
			type: "style",
			content: `html{margin:0;}`,
		},
	];

	it("get correct heads", () => {
		const result = createHeadTag(heads);
		const str = `<link href="./index.css" rel="stylesheet" ></link>\n<style >html{margin:0;}</style>\n`;

		strictEqual(str, result);
	});

	const scripts: HTMLScriptMeta[] = [
		{
			type: "block",
			content: "function run() {}",
		},
		{
			type: "url",
			content: "./index.js",
		},
	];

	it("get correct scripts", () => {
		const result = createScriptTag(scripts);
		const str = `<script>function run() {}</script src="./index.js">\<script></script>`;
	});
});
