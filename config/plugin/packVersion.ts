import { exec } from "child_process"
import fsp from "fs/promises"
import { dependencies } from "../../package.json"


const execAsync = (cmd: string) => new Promise<string>((resolve, rejects) => {
    exec(cmd, (error: any, stdout: any, stderr: any) => {
        if (stdout) resolve(stdout);
        else if (error) rejects(error);
        else console.warn(`命令${cmd}执行错误：`, error, "\n结果：\n", stdout);
    });
})

export default function configPackVersion() {
    Promise.all([
        execAsync("npm outdated -json"),
        execAsync("npm list -json")
    ]).then(async (result: [string, string]) => {
        const packName = Object.keys(dependencies);
        const [odf, plist]: any[] = result.map((s: string) => JSON.parse(s));
        const versionInfo: any = {};
        packName.forEach(key => {
            versionInfo[key] = Object.assign({}, plist?.dependencies[key], odf[key])
        });

        await fsp.writeFile("./public/version.json", JSON.stringify(versionInfo, null, 2));
    });
    return {} as any;//不影响后续的生成
}