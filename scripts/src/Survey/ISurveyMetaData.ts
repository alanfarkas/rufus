import { SurveyClientSettings } from "../Data/SurveyClientSettings";

/**
 * Survey session meta-data
 */
export interface ISurveyMetaData {
    readonly ADUserID: string;
    readonly assignedQuestionTypes: string[];
    readonly startPageNo: number;
    readonly clientSettings: SurveyClientSettings;
    readonly contactName: string;
    readonly contactEmailAddress: string;
}
