import { SurveyClientSettings } from "../Data/SurveyClientSettings";
import { ISurveyMetaData } from "./ISurveyMetaData";

/**
 * Survey session Meta Data
 */
export class SurveyMetaData implements ISurveyMetaData {
    public readonly ADUserID: string;
    public readonly assignedQuestionTypes: string[];
    public readonly clientSettings: SurveyClientSettings;

    public readonly startPageNo: number;
    public readonly contactName: string;
    public readonly contactEmailAddress: string;

    constructor(metaData: any) {
        this.ADUserID = metaData.ADUserID;
        // TODO Convert string question types to actual question types
        this.assignedQuestionTypes = metaData.assignedQuestionTypes || [];
        this.clientSettings = metaData.clientSettings;
        this.contactEmailAddress = metaData.contactEmailAddress;
        this.contactName = metaData.contactName;
        this.startPageNo = metaData.currentPageNo;
    }
}
