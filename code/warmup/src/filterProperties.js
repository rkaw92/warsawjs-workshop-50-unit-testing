module.exports.filterProperties = function filterProperties(input, keys) {
    const keysToKeep = new Set(keys);
    const output = Object.assign({}, input);
    Object.keys(output).forEach(function(key) {
        if (!keysToKeep.has(key)) {
            delete output[key];
        }
    });
    return output;
};
