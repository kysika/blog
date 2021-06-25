import postcss from "postcss";
// no @types/precss can use
//@ts-ignore
import precss from "precss";
import autoprefixer from "autoprefixer";
import { minify } from "terser";

function createProcessor() {
	return {
		postcss(css: string) {
			return postcss([precss, autoprefixer]).process(css, { from: undefined, to: undefined });
		},

		terser(code: string) {
			return minify(code, { sourceMap: false, format: { comments: false } });
		},
	};
}

export const processor = createProcessor();
