const { diffKeys } = require("./diffKeys");
const { filterProperties } = require("./filterProperties");

function mapFields(input, supportedFields) {
    const data = filterProperties(input, supportedFields);
    const rejectedKeys = diffKeys(input, data);
    return {
        data,
        rejectedKeys
    };
}

module.exports.mapFields = mapFields;
