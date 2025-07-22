import { program } from "commander";
import { CmdExtractPrompt,CmdProcessPrompt } from "./Command";

export async function cliRoute() {
    CmdExtractPrompt(program);
    CmdProcessPrompt(program);
    program.parse(process.argv);
}
cliRoute();