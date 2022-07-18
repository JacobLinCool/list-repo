import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entry: ["src/index.ts"],
    outDir: "dist",
    target: "node16",
    format: ["esm"],
    clean: true,
    splitting: false,
    shims: true,
    minify: !options.watch,
    dts: options.watch ? false : { resolve: true },
}));
