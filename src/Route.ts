import { program } from "commander";
import { CmdExtractPrompt,CmdFormatPrompt,CmdProcessPrompt } from "./Command";

export async function cliRoute() {
    CmdExtractPrompt(program);
    CmdProcessPrompt(program);
    CmdFormatPrompt(program);
    program.parse(process.argv);
}
cliRoute();