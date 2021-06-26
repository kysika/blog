import fs from "fs-extra";

export interface HTMLHeadMeta {
	type: string;
	attr?: Record<string, string>;
	content?: string;
}

export interface HTMLScriptMeta {
	type: "block" | "url";
	content: string;
}

export interface RenderOption {
	template: string;
	output: string;
	content: string;
	heads?: HTMLHeadMeta[];
	scripts?: HTMLScriptMeta[];
	title: string;
}

export function createHeadTag(heads: HTMLHeadMeta[]) {
	function reducer(tags: string, h: HTMLHeadMeta) {
		function attrReducer(attrs: string, key: string) {
			const attr = `${key}="${h.attr![key]}" `;
			return `${attrs}${attr}`;
		}
		const attrs = h.attr ? Object.keys(h.attr).reduce(attrReducer, "") : "";
		return `${tags}<${h.type} ${attrs}>${h.content || ""}</${h.type}>\n`;
	}
	return heads.reduce(reducer, "");
}

export function createScriptTag(scripts: HTMLScriptMeta[]) {
	function reducer(current: string, s: HTMLScriptMeta) {
		return s.type === "url" ? `${current}\n<script src="${s.content}"></script>` : `${current}\n<script>${s.content}</script>`;
	}
	return scripts.reduce(reducer, "");
}

const placeholder = {
	content: /<!-- content -->/g,
	scirpts: /<!-- scripts -->/g,
	title: /<!-- title -->/g,
	heads: /<!-- heads -->/g,
};

// replace content use html comment
async function render(options: RenderOption) {
	const template = await fs.readFile(options.template, "utf-8");
	const result = template
		.replace(/<script.*type="module".*>.*<\/script>/, "")
		.replace(placeholder.content, options.content)
		.replace(placeholder.heads, createHeadTag(options.heads || []))
		.replace(placeholder.title, options.title)
		.replace(placeholder.scirpts, createScriptTag(options.scripts || []));
	await fs.ensureFile(options.output);
	await fs.writeFile(options.output, result, { flag: "w+", encoding: "utf-8" });
}

export const renderer = {
	render,
};
