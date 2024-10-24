import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { ISurveyMetaData } from "../Survey/ISurveyMetaData";
import { SurveyDataRow } from "./SurveyDataRow";
import { SurveyGroupedDataRow } from "./SurveyGroupedDataRow";

/**
 * Survey Data Provider
 */
export interface ISurveyDataProvider<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> {
    // Properties

    // Methods
    choicesURL(dataElement: TDataElement): string;
    choicesByGroupURL(groupeDataElement: TGroupedDataElement): string;
    getDataItems(dataElement: TDataElement): SurveyDataRow[];
    getDataItemsByGroup(
        groupedDataElement: TGroupedDataElement
    ): Record<string, SurveyGroupedDataRow[]>;
    getGroupDataItems(
        groupedDataElement: TGroupedDataElement,
        groupId: string
    ): SurveyDataRow[];
    getSingleGroupDataRows(
        groupedDataElement: TGroupedDataElement
    ): SurveyGroupedDataRow[];
    getSingleGroupedDataRow(
        groupedDataElement: TGroupedDataElement
    ): SurveyGroupedDataRow;
    getSurveyData(questionTypeFilter?: Set<TQuestionType>): any;
    getSurveyMetaData(): ISurveyMetaData;
    groupChoicesURL(
        groupedDataElement: TGroupedDataElement,
        groupId: string
    ): string;
    saveSessionPageNo(pageNo: number): void;
    saveSurveyData(
        survey: ISurveyContainer,
        options: any,
        savedQuestionTypes: Set<string>,
        savedQuestionNames: Set<string>,
        returningPageNo: number
    ): boolean;
}
