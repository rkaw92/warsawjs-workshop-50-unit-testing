module.exports.filterProperties = function filterProperties(input, keys) {
    const keysToKeep = new Set(keys);
    Object.keys(input).forEach(function(key) {
        if (!keysToKeep.has(key)) {
            delete input[key];
        }
    });
    return input;
};
