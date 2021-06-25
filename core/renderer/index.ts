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
		return s.type === "block" ? `${current}\n<script src="${s.content}"></script>` : `${current}\n<script>${s.content}</script>`;
	}
	return scripts.reduce(reducer, "");
}

const placeholder = {
	content: "<!-- content -->",
	scirpts: "<!-- scripts -->",
	title: "<!-- title -->",
	heads: "<!-- heads -->",
};

// replace content use html comment
async function render(options: RenderOption) {
	const template = await fs.readFile(options.template, "utf-8");
	template.replace(/<script.*type="module".*>.*<\/script>/, "");
	template.replace(placeholder.content, options.content);
	template.replace(placeholder.heads, createHeadTag(options.heads || []));
	template.replace(placeholder.title, options.title);
	template.replace(placeholder.scirpts, createScriptTag(options.scripts || []));
	await fs.ensureFile(options.output);
	await fs.writeFile(options.output, template, { flag: "w+", encoding: "utf-8" });
}

export const renderer = {
	render,
};
