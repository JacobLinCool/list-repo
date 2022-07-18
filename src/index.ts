#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { program } from "commander";
import { list } from "./list";

const package_json = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"),
);

program.version(`${package_json.name} ${package_json.version}`);
program.argument("<username>", "Github username").action(list);
program.parse(process.argv);
