import * as rollup from "rollup";
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import sveltePreprocess from "svelte-preprocess";
import { CompileOptions } from "svelte/types/compiler/interfaces";
import fs from "fs-extra";
import path from "path";
import postcss from "postcss";
import postcssplugin from "rollup-plugin-postcss";
//@ts-ignore
import css from "rollup-plugin-css-only";
import autoprefixer from "autoprefixer";
//@ts-ignore
import precss from "precss";
import { RollupBuild } from "rollup";

type SvelteServerSideComponent = {
	render(
		props?: Record<string, unknown>,
		option?: { context: Map<string, unknown> }
	): {
		html: string;
		css: {
			code: string;
		};
		head: string;
	};
};

interface SvelteHydrationResult {
	js: string;
	css: string;
}

const resolvePlugin = resolve({ browser: true });

function useRollupSveltePlugin(emitCss: boolean, compilerOptions: CompileOptions) {
	return svelte({ preprocess: sveltePreprocess(), emitCss, compilerOptions });
}

/**
 * Generate client side hydration render js bundle and css bundle. used with ssg/ssr
 */
export async function hydrate(input: string): Promise<SvelteHydrationResult> {
	const hydrationRollupSveltePlugin = useRollupSveltePlugin(true, { generate: "dom", hydratable: true, css: false });
	let styles: string = "";
	function output(css: string) {
		styles = css;
	}
	const cssplugin = css({ output });
	const bundle = await rollup.rollup({ input, plugins: [hydrationRollupSveltePlugin, cssplugin, resolvePlugin] });
	const result = await bundle.generate({ format: "iife", name: "my_hydration_app_bundle" });
	return {
		js: result.output[0].code,
		css: styles,
	};
}

/**
 * Generate a Svelte Component that is js object which has a render method
 */
export async function ssr(input: string): Promise<SvelteServerSideComponent> {
	const ssrRollupSveltePlugin = useRollupSveltePlugin(false, { generate: "ssr", hydratable: true, format: "esm" });
	const bundle = await rollup.rollup({ input, plugins: [ssrRollupSveltePlugin, resolvePlugin] });
	const result = await bundle.generate({ format: "esm" });
	const js_code = result.output[0].code;
	const temp_file = path.resolve(__dirname, ".temp.ts");
	await fs.ensureFile(temp_file);
	await fs.writeFile(temp_file, "// @ts-nocheck \n" + js_code, "utf-8");
	const module = await import(temp_file);
	await fs.rm(temp_file);
	return module.default;
}

/**
 * Generate a Client Side Render js bundle and css bundle.
 */
export async function csr(input: string) {
	const hydrationRollupSveltePlugin = useRollupSveltePlugin(true, { generate: "dom", hydratable: false, css: false });
	let styles: string = "";
	function output(css: string) {
		styles = css;
	}
	const cssplugin = css({ output });
	const bundle = await rollup.rollup({ input, plugins: [hydrationRollupSveltePlugin, cssplugin, resolvePlugin] });
	const result = await bundle.generate({ format: "iife", name: "my_csr_app_bundle" });
	return {
		js: result.output[0].code,
		css: styles,
	};
}

export const sveltebundler = {
	ssr,
	csr,
	hydrate,
};
