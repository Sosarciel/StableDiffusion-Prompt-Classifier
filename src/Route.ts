import { program } from "commander";
import { CmdExtractPrompt, CmdFormatPrompt, CmdFormatStyleFile, CmdProcessPrompt } from "./Command";

export async function cliRoute() {
    CmdExtractPrompt(program);
    CmdProcessPrompt(program);
    CmdFormatPrompt(program);
    CmdFormatStyleFile(program);
    program.parse(process.argv);
}
cliRoute();