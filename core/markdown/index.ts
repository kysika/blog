import MarkdownIt from "markdown-it";
import yaml from "js-yaml";
import mdAnchor from "markdown-it-anchor";
import mdFrontmatter from "markdown-it-front-matter";
import { Heading, MarkdownItTocDesc } from "markdown-it-toc-desc";

export interface MarkdownRenderResult {
	html: string;
	toc: Heading[];
	meta: Record<string, unknown>;
}

export function render(content: string): MarkdownRenderResult {
	const md = new MarkdownIt();
	const slugify = (s: string) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-"));
	const level = [1, 2, 3];
	let toc: Heading[] = [];
	let front = "";

	md.use(MarkdownItTocDesc, { includeLevel: level, slugify, getTocTree: (s: Heading[]) => (toc = s) });
	md.use(mdAnchor, { slugify, level });
	md.use(mdFrontmatter, (data) => (front = data));

	const html = md.render(content);
	const doc = yaml.load(front);

	const meta = (typeof doc === "object" ? doc : {}) as Record<string, unknown>;

	return {
		html,
		toc,
		meta,
	};
}
