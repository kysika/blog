import * as rollup from "rollup";
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import sveltePreprocess from "svelte-preprocess";
import { CompileOptions } from "svelte/types/compiler/interfaces";
import fs from "fs-extra";
import path from "path";

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

async function _bundle(input: string, compilerOptions: CompileOptions, outputOption: rollup.OutputOptions) {
	const plugins = [svelte({ preprocess: sveltePreprocess(), emitCss: false, compilerOptions }), resolve({ browser: true })];
	const bundle = await rollup.rollup({ input, plugins });
	return bundle.generate(outputOption);
}

export function hydrate(input: string) {
	return _bundle(input, { generate: "dom", hydratable: true, css: false }, { format: "iife", name: "mybundle" });
}

export async function ssr(input: string): Promise<SvelteServerSideComponent> {
	const bundle = await _bundle(input, { generate: "ssr", hydratable: true, format: "esm" }, { format: "esm" });
	const js_code = bundle.output[0].code;
	const temp_file = path.resolve(__dirname, ".temp.ts");
	await fs.ensureFile(temp_file);
	await fs.writeFile(temp_file, "// @ts-nocheck \n" + js_code, "utf-8");
	const module = await import(temp_file);
	await fs.rm(temp_file);
	return module.default;
}

export function csr(input: string) {
	return _bundle(input, { generate: "dom", hydratable: false, format: "esm" }, { format: "iife", name: "bundle" });
}

export const sveltebundler = {
	ssr,
	csr,
	hydrate,
};
