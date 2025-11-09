// Recordable
export const wrapperEnv = (envConf: Recordable): Record<string, any> => {
    const res: any = {};


    for (const envName of Object.keys(envConf)) {
        // 将'//n'转化为'/n'
        let realName = envConf[envName].replace(/\\n/g, '\n');
        realName = realName === 'true' ? true : realName === 'false' ? false : realName;
        res[envName] = realName;

        if (typeof realName === 'string') {
            process.env[envName] = realName;
        } else if (typeof realName === 'object') {
            process.env[envName] = JSON.stringify(realName);
        }
    }
    return res;

}
