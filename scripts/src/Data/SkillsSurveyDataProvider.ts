import { SkillsSurveyDataElement } from "../Enums/SkillsSurveyDataElement";
import { SkillsSurveyGroupedDataElement } from "../Enums/SkillsSurveyGroupedDataElement";
import { SkillsSurveyQuestionType } from "../Enums/SkillsSurveyQuestionType";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { ISurveyMetaData } from "../Survey/ISurveyMetaData";
import { SurveyMetaData } from "../Survey/SurveyMetaData";
import { AbstractSurveyDataProvider } from "./AbstractSurveyDataProvider";

/**
 * Skills Survey Data Provider
 */
export class SkillsSurveyDataProvider extends AbstractSurveyDataProvider<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {
    // #region constants
    private readonly surveyDataProviderURL: string =
        this.handlerRootPath + "SurveyData";
    private readonly surveyMetaDataURL: string =
        this.handlerRootPath + "SurveyMetaData";
    private readonly surveyPageNoURL: string =
        this.handlerRootPath + "SurveyPageNo";
    // #endregion

    // #region methods
    //TODO add comment header
    public choicesURL(dataElement: SkillsSurveyDataElement): string {
        const cacheOption = "";
        return (
            this.handlerRootPath +
            `AnswerChoices${cacheOption}?dataElement=` +
            dataElement
        );
    }

    //TODO add comment header
    public choicesByGroupURL(
        groupedDataElement: SkillsSurveyGroupedDataElement
    ): string {
        const url =
            this.handlerRootPath +
            "GroupedAnswerChoices?dataElement=" +
            groupedDataElement;
        return url;
    }

    //TODO add comment header
    public groupChoicesURL(
        groupedDataElement: SkillsSurveyGroupedDataElement,
        groupId: string
    ): string {
        const url =
            this.handlerRootPath +
            "AnswerChoicesForGroup?dataElement=" +
            groupedDataElement +
            "&groupId=" +
            groupId;
        return url;
    }

    /**
     * Get user's survey data from the server
     *
     * @param questionTypeFilter Optional collection of question types to specify which data elements are loaded
     * @returns User's survey data
     */
    public getSurveyData(questionTypeFilter?: Set<SkillsSurveyQuestionType>) {
        // Add any filtered question types as a set of URL query parameters
        const urlParamString = this.convertPropertyValuesToURLParameter(
            questionTypeFilter,
            "qFilter"
        );
        const url =
            this.surveyDataProviderURL +
            (urlParamString?.length > 0 ? `?${urlParamString}` : "");

        // Get survey data
        return this.getJSONData(url);
    }

    /**
     * Get user meta-data from server
     *
     * @returns Survey meta-data
     */
    public getSurveyMetaData(): ISurveyMetaData {
        const metaData = this.getJSONData(this.surveyMetaDataURL);
        return new SurveyMetaData(metaData);
    }

    /**
     * Save current session's survey page number back to database
     *
     * @param pageNo Survey page number
     */
    public saveSessionPageNo(pageNo: number): void {
        const jsonData = JSON.stringify(pageNo);
        this.saveJSONData(this.surveyPageNoURL, jsonData);
    }

    /**
     * Send survey data back to database
     *
     * @param survey Survey container
     * @param options Survey event options
     * @param savedQuestionTypes Collection of question types to save
     * @param savedQuestionName Collection of question names to save
     * @param returningPageNo Page number of survey page to display whenever the user returns to the survey
     * @param areSaveMsgsDisplayed Flag that indicates is on-screen save messages are displayed (defaults to FALSE)
     */
    public saveSurveyData(
        survey: ISurveyContainer,
        options: any,
        savedQuestionTypes: Set<string>,
        savedQuestionNames: Set<string>,
        returningPageNo: number
    ): boolean {
        //tslint:disable:object-literal-sort-keys

        let wasDataSaved = false;

        // Show message about "Saving..." the results
        if (options.showDataSaving) {
            options.showDataSaving("Saving Survey Data ..."); //you may pass a text parameter to show your own text
        }

        // Format data object to send to server. Only include updated questions (SKIL-431).
        const filteredData = this.filterSurveyData(
            survey.surveyModel.data,
            savedQuestionNames
        );

        // Format the complete results to send to the server. This consists of the survey data, survey meta-data, and
        // question type filter.
        //
        // The survey meta-data consists of the current page number, and a flag that indicates is user data was
        // changed. The page number is reset page to 0 if the survey is complete. The page number also being saved when
        // the user navigates to a different survey page.
        const results = {
            dataModel: {
                metaData: {
                    currentPageNo: returningPageNo,
                    isUserDataChanged: true,
                },
                data: filteredData,
                // FOR TESTING PURPOSES
                //data: {
                //    "Panel.Education": survey.data["Panel.Education"],
                //    "Panel.Language": survey.data["Panel.Language"]
                //}
            },
            questionTypeFilter: Array.from(savedQuestionTypes),
        };

        // Save survey data back to the database
        const jsonResults = JSON.stringify(results);
        $.post({
            url: this.surveyDataProviderURL,
            // - Send Anti-Forgery Token (otherwise a BAD REQUEST ERROR (400) will be returned)
            headers: {
                "XSRF-TOKEN": $(
                    'input:hidden[name="__RequestVerificationToken"]'
                )
                    .val()
                    .toString(),
            },
            contentType: "application/json; charset=utf-8",
            data: jsonResults,
            success: (data) => {
                wasDataSaved = true;
                if (options.showDataSavingClear) {
                    options.showDataSavingClear();
                }
            },
            async: false,
            error: (err) => {
                console.log(err);
                if (options.showDataSavingError !== null) {
                    options.showDataSavingError(); // you may pass a text parameter to show your own text
                }
            },
        });

        return wasDataSaved;
    }

    // #endregion
}
