/**
 * 文件大小转换
 * @param fileSize 原始文件大小，默认大小
 * @returns 
 */
export function formatFileSize(fileSize: number, defUnit: "B" | "KB" | "MB" | "GB" | "TB" = "B") {
    let size = defUnit as string;
    let units = ["KB", "MB", "GB", "TB"];
    units = units.slice(units.indexOf(size) + 1);

    while (fileSize > 1024 && units.length >= 1) {
        fileSize /= 1024;
        size = units.shift() || "Unknow";
    }

    return {
        fileSize: fileSize,
        unit: size
    };
}