/**
 * General Survey Utilities
 */
export class SurveyUtils {
    /**
     * Returns the members of the specified Enum type
     *
     * This code comes from: https://www.petermorlion.com/iterating-a-typescript-enum/
     *
     * @param enumType Enum type
     */
    public static enumKeys<O extends object, K extends keyof O = keyof O>(
        enumType: O
    ): K[] {
        return Object.keys(enumType).filter((k) => Number.isNaN(+k)) as K[];
    }

    /**
     * Returns the values of the specified Enum type
     *
     * This code comes from: https://www.petermorlion.com/iterating-a-typescript-enum/
     *
     * @param enumType Enum type
     */
    public static enumValues<O extends object, K extends keyof O = keyof O>(
        enumType: O
    ): K[] {
        return Object.values(enumType).filter((k) => Number.isNaN(+k)) as K[];
    }

    /**
     * Perform a case-insensitive comparison between two strings
     *
     * @param string1 First string to compare
     * @param string2 Second string to compare
     *
     * @returns True if the two strings are equal to each other, ignoring case
     */
    public static equalsIgnoreCase(string1: string, string2: string): boolean {
        return string1.toUpperCase() === string2.toUpperCase();
    }

    public static getEnumKeyByEnumValue(myEnum, enumValue) {
        const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
        return keys.length > 0 ? keys[0] : null;
    }

    public static getEnumFromString<T>(string: string, type: T): T[keyof T] {
        const enumKey = string as keyof T;
        return type[enumKey];
    }

    /**
     * Remove any "split" suffix from the supplied survey element name
     *
     * @param elementName Survey element name
     * @param suffixDelimString Suffix delimeter string (defaults to '.')
     */
    public static getSurveyElementRootName(
        elementName: string,
        suffixDelimString = "."
    ): string {
        const splitQuestionName = elementName.split(suffixDelimString);
        const questionNameSuffix =
            splitQuestionName[splitQuestionName.length - 1];
        if (isNaN(+questionNameSuffix)) {
            // Not a "split" question - question name suffix is not a number
            return elementName;
        } else {
            // "Split" question - truncate the question name suffix
            return elementName.substr(
                0,
                elementName.lastIndexOf(suffixDelimString)
            );
        }
    }

    /**
     * Returns true if the two arrays have any common elements
     *
     * @param arr1
     * @param arr2
     */
    public static hasCommonElements(arr1, arr2) {
        // Iterate through each element in the first array and if some of them
        // include the elements in the second array then return true.
        if (arr1 && arr2) {
            return arr1.some((item) => arr2.includes(item));
        } else {
            // At least one array is null or undefined
            return false;
        }
    }

    /**
     * Determines if the current survey element name is a "split" name, meaning that is
     * has a numeric suffix.
     *
     * @param surveyElementName Element name to check
     * @param elementNameDelim Element name delimeter (defaults to '.')
     *
     * @returns True if "split" element name
     */
    public static isSplitElementName(
        surveyElementName: string,
        elementNameDelim = "."
    ): boolean {
        const splitElementName = surveyElementName.split(elementNameDelim);
        const questionNameSuffix =
            splitElementName[splitElementName.length - 1];
        if (isNaN(+questionNameSuffix)) {
            // Not a "split" element - element name suffix is not a number
            return false;
        } else {
            return true;
        }
    }

    /**
     * Provides functionaly simlar to "nameof" operator in c#; ensures property name references are type-safe
     *
     * This code comes from: https://www.meziantou.net/typescript-nameof-operator-equivalent.htm
     *
     * @param key Property name
     * @param instance Instance of an object that contains the property (required if Type parameter isn't specified)
     */
    public static nameof<T>(key: keyof T, instance?: T): keyof T {
        return key;
    }

    /**
     * Remove set of entries from an existing map
     *
     * @param map Map to reduce
     * @param keys Keys of map entries to remove
     */
    public static removeFromMap(map: Map<any, any>, keys: Set<any>): void {
        if (map && keys) {
            [...keys].forEach((v) => {
                map.delete(v);
            });
        }
    }

    /**
     * Remove set of values from an existing set
     *
     * @param originalSet
     * @param toBeRemovedSet
     */
    public static removeFromSet(
        originalSet: Set<any>,
        toBeRemovedSet: Set<any>
    ): void {
        if (originalSet && toBeRemovedSet) {
            [...toBeRemovedSet].forEach((v) => {
                originalSet.delete(v);
            });
        }
    }
}
