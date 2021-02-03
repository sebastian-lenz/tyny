export function toEnum(enumType, value) {
    if (enumType.hasOwnProperty(value)) {
        return value;
    }
    if (typeof value === 'string') {
        value = value.toLowerCase();
        for (var key in enumType) {
            var enumValue = enumType[key];
            if (typeof enumValue === 'string') {
                if (enumValue.toLowerCase() === value.toLowerCase()) {
                    return parseInt(key);
                }
            }
            else if (value === enumValue) {
                return enumValue;
            }
        }
    }
    return null;
}
