export default (apiInfoMap, key) => {
    const queriedApiInfoMap = {};
    const openedKeys = [];
    for (const tagName in apiInfoMap) {
        let matched = false;
        if (tagName.toUpperCase().indexOf(key) !== -1) {
            matched = true;
        }
        const apiArr = [];
        for (const apiInfo of apiInfoMap[tagName].apiArr) {
            if (-1 !== apiInfo.name.toUpperCase().indexOf(key)) {
                matched = true;
                apiArr.push({
                    key: apiInfo.operationId,
                    name: apiInfo.name,
                    path: apiInfo.path,
                    method: apiInfo.method
                })
            } else if (-1 !== apiInfo.path.toUpperCase().indexOf(key)) {
                matched = true;
                apiArr.push({
                    key: apiInfo.operationId,
                    name: apiInfo.name,
                    path: apiInfo.path,
                    method: apiInfo.method
                })
            }
        }
        if (matched) {
            queriedApiInfoMap[tagName] = {
                key: apiInfoMap[tagName].key,
                description: apiInfoMap[tagName].description,
                apiArr: apiArr
            }
            openedKeys.push(apiInfoMap[tagName].key);
        }
    }
    return { queriedApiInfoMap, openedKeys };
}
