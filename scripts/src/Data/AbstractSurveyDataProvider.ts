/* tslint:disable:object-literal-sort-keys */

import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { ISurveyMetaData } from "../Survey/ISurveyMetaData";
import { ISurveyDataProvider } from "./ISurveyDataProvider";
import { SurveyDataRow } from "./SurveyDataRow";
import { SurveyGroupedDataRow } from "./SurveyGroupedDataRow";

/**
 * Base Survey Data Provider
 */
export abstract class AbstractSurveyDataProvider<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> implements
        ISurveyDataProvider<TQuestionType, TDataElement, TGroupedDataElement>
{
    // Abstract Methods
    public abstract choicesURL(dataElement: TDataElement): string;
    public abstract choicesByGroupURL(
        groupedDataElement: TGroupedDataElement
    ): string;
    public abstract getSurveyData(questionTypeFilter?: Set<TQuestionType>): any;
    public abstract getSurveyMetaData(): ISurveyMetaData;
    public abstract groupChoicesURL(
        groupedDataElement: TGroupedDataElement,
        groupId: string
    ): string;
    public abstract saveSessionPageNo(pageNo: number): void;
    public abstract saveSurveyData(
        survey: ISurveyContainer,
        options: any,
        savedQuestionTypes: Set<string>,
        savedQuestionNames: Set<string>,
        returningPageNo: number
    ): boolean;
    constructor(public readonly handlerRootPath: string) {}

    /**
     * Converts the named collection of property values to a valid URL parameter string
     *
     * @param propertyValues Collection of property values
     * @param propertyName Property name
     * @param paramPrefix Optional URL parameter prefix string
     *
     * @returns URL parameter string
     */
    protected convertPropertyValuesToURLParameter(
        propertyValues: string[] | Set<string>,
        propertyName: string,
        paramPrefix?: string
    ): string {
        // Convert property name-value pair to valid URL parameter string
        let URLParam = paramPrefix;
        if (propertyName && propertyValues) {
            for (const propertyValue of propertyValues) {
                URLParam = this.convertPropertyValueToURLParameter(
                    propertyValue,
                    propertyName,
                    URLParam
                );
            }
        }

        // Return URL parameter
        return URLParam;
    }

    /**
     * Converts the named property value to a valid URL parameter string
     *
     * @param propertyValues Collection of property values
     * @param propertyName Property name
     * @param paramPrefix Optional URL parameter prefix string (defaults to "")
     *
     * @returns URL parameter string
     */
    protected convertPropertyValueToURLParameter(
        propertyValue: string,
        propertyName: string,
        paramPrefix = ""
    ): string {
        let URLParm = paramPrefix;

        // Add append symbol as long as initial parm string is not empty.
        if (paramPrefix) {
            URLParm += "&";
        }

        // Convert property name-value pair to valid URL parameter string and append to initial
        // URL parameter string.
        URLParm += `${propertyName}=`;
        if (propertyValue) {
            URLParm += encodeURIComponent(propertyValue);
        }

        // Return URL Parameter
        return URLParm;
    }

    /**
     * Filter saved survey data to specified question name(s)
     *
     * @param surveyData Survey data object
     * @param questionNameFilter Collection containing names of questions to include in filtered data set
     *
     * @returns Filtered data
     */
    protected filterSurveyData(
        surveyData: {},
        questionNameFilter: [string] | Set<string>
    ): {} {
        const filteredData = {};

        for (const questionName of questionNameFilter) {
            // Only include survey elements that already exist in the survey data
            if (surveyData[questionName]) {
                filteredData[questionName] = surveyData[questionName];
            }
        }

        return filteredData;
    }

    //TODO Add comment header
    public getDataItems(dataElement: TDataElement): SurveyDataRow[] {
        const choices = this.getJSONData(this.choicesURL(dataElement));
        return choices;
    }

    //TODO Add comment header
    public getDataItemsByGroup(
        groupedDataElement: TGroupedDataElement
    ): Record<string, SurveyGroupedDataRow[]> {
        const choices = this.getJSONData(
            this.choicesByGroupURL(groupedDataElement)
        );
        return choices;
    }

    //TODO Add comment header
    public getGroupDataItems(
        groupedDataElement: TGroupedDataElement,
        groupId: string
    ): SurveyDataRow[] {
        const choices = this.getJSONData(
            this.groupChoicesURL(groupedDataElement, groupId)
        );
        return choices;
    }

    /**
     * Get JSON data from the server
     *
     * @param url URL to which the request is sent
     * @param jsonString Valid JSON string (optional)
     */
    public getJSONData(url: string, jsonString?: any) {
        const res = $.getJSON({
            url,
            data: jsonString,
            success(data) {
                /**/
            },
            async: false,
            //cache: false,
            error(err) {
                const error = new Error(err);
                throw error;
            },
        } as unknown as string).responseJSON;
        return res;
    }

    /**
     * Return the grouped data row itmes for a single group
     *
     * @param groupedDataElement Grouped Data Element type
     * @returns Array of SurveyGroupedDataRow
     */
    public getSingleGroupDataRows(
        groupedDataElement: TGroupedDataElement
    ): SurveyGroupedDataRow[] {
        let dataRows: SurveyGroupedDataRow[] = [];

        const dataItemsByGroup = this.getDataItemsByGroup(groupedDataElement);
        if (dataItemsByGroup) {
            const firstKey = Object.keys(dataItemsByGroup)[0];
            dataRows = dataItemsByGroup[firstKey];
        }

        return dataRows;
    }

    /**
     * Return a grouped data item that consists of a single row
     *
     * @param groupedDataElement Grouped Data Element type
     * @returns SurveyGroupedDataRow
     */
    public getSingleGroupedDataRow(
        groupedDataElement: TGroupedDataElement
    ): SurveyGroupedDataRow {
        let dataRow: SurveyGroupedDataRow;

        const dataItemsByGroup = this.getDataItemsByGroup(groupedDataElement);
        if (dataItemsByGroup) {
            const firstKey = Object.keys(dataItemsByGroup)[0];
            dataRow = dataItemsByGroup[firstKey][0];
        }

        return dataRow;
    }

    /**
     * Save JSON data to the server
     *
     * @param url URL to which the request is sent
     * @param jsonString Valid JSON string
     */
    public saveJSONData(url: string, jsonString: string) {
        // Save JSON data back to the database
        $.post({
            url,
            // - Send Anti-Forgery Token (otherwise a BAD REQUEST ERROR (400) will be returned)
            headers: {
                "XSRF-TOKEN": $(
                    'input:hidden[name="__RequestVerificationToken"]'
                )
                    .val()
                    .toString(),
            },
            contentType: "application/json; charset=utf-8",
            data: jsonString,
            success(data) {
                /**/
            },
            //async: false,
            error(err) {
                const error = new Error(err.responseText);
                throw error;
            },
        });
    }
}
