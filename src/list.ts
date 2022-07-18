import { OptionValues } from "commander";
import { Octokit } from "octokit";
import ora from "ora";

export async function list(username: string, opts: OptionValues): Promise<void> {
    const octokit = process.env.GITHUB_TOKEN
        ? new Octokit({ auth: process.env.GITHUB_TOKEN })
        : new Octokit();

    const spinner = ora("Fetching repositories...").start();

    const list: Awaited<ReturnType<typeof octokit.rest.repos.listForUser>>["data"] = [];

    for (let i = 1; i <= 100; i++) {
        const { data } = await octokit.rest.repos.listForUser({
            username,
            type: "owner",
            per_page: 100,
            page: i,
            sort: "created",
        });

        list.push(...data);

        spinner.text = `Fetched ${list.length} repositories ...`;

        if (data.length < 100) {
            break;
        }
    }

    spinner.stop();

    console.log(`Fetched ${list.length} repositories.`);
    console.log(
        list
            .map(
                ({ name, description, created_at, license }, idx) =>
                    `${(idx + 1)
                        .toString()
                        .padStart(Math.log10(list.length) + 1)}. \x1b[96m${new Date(created_at || 0)
                        .toLocaleDateString()
                        .padEnd(12)}\x1b[m \x1b[93m${name}\x1b[m \x1b[95m${
                        license?.key?.toUpperCase() || ""
                    }\x1b[m\n    - ${description?.slice(0, 74) || "No description."}`,
            )
            .join("\n"),
    );
}
