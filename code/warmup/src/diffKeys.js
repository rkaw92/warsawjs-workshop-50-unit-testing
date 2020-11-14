module.exports.diffKeys = function diffKeys(a, b) {
    const bKeys = new Set(Object.keys(b));
    const remainder = Object.keys(a).filter((key) => !bKeys.has(key));
    return remainder;
};
