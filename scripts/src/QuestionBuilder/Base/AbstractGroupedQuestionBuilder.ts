import * as Survey from "survey-jquery";
import { SurveyUtils as Utils } from "../../Base/SurveyUtils";
import { ISurveyState } from "../../Controller/ISurveyState";
import { SurveyDataRow } from "../../Data/SurveyDataRow";
import { SurveyGroupedDataRow } from "../../Data/SurveyGroupedDataRow";
import { SurveyPropertyName } from "../../Enums/SurveyPropertyName";
import { SurveyQuestionCollapsibleState } from "../../Enums/SurveyQuestionCollapsibleState";
import { ISurveyContainer } from "../../Survey/ISurveyContainer";
import { AbstractQuestionBuilder } from "./AbstractQuestionBuilder";

/**
 * Abstract Grouped Question Builder - Handles the process of automating the cloning of a question across
 * related groups (ex. 'Industry Groups', 'Tool Groups').
 */
export abstract class AbstractGroupedQuestionBuilder<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> extends AbstractQuestionBuilder<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> {
    // #region properties
    // TODO Update collapsible logic to use questionName property, or an override to list of collapsible questions
    public readonly collapsibleQuestionPrefix = "Question.";

    // Even though 'collapsibleState' is already included in the parent class, listing it again here as an Abstract
    // property forces any sub-classes to explicitly declare it, and specify the initial collapsible state.
    public abstract readonly collapsibleState: SurveyQuestionCollapsibleState;
    // #endregion

    // #region abstract methods
    /**
     * Clone a question template of one or more question elements to the specified group
     *
     * @param survey Survey container
     * @param groupIndex Arbitrary 0-based index corresponding to the processed group
     * @param groupId Group Id
     * @param groupDescription Group description
     * @param detailRecords An array of details records (usually answer choices) under the specified group
     * @param position Position within the question template's container (page or panel) to clone the question
     *                 template to (default is last position in container).
     *
     * @returns Position to clone next template to (optional use)
     */
    protected abstract cloneQuestionTemplate(
        survey: ISurveyContainer,
        groupIndex: number,
        groupId: string,
        groupDescription: string,
        detailRecords: SurveyGroupedDataRow[],
        position?: number
    ): number;

    /**
     * Return the group records to iterate
     *
     * @returns The group records
     */
    protected abstract getQuestionGroups(): SurveyDataRow[];

    /**
     * Return the details records (usually answer choices) by group
     *
     * @returns The detail records
     */
    protected abstract getDetailRecordsByGroup(): Record<
        string,
        SurveyGroupedDataRow[]
    >;

    /**
     * Returns the desired page/panel position of the first cloned question template
     *
     * @param survey Survey container
     */
    protected abstract getFirstClonePosition(survey: ISurveyContainer): number;

    /**
     * Perform any processing that's required after all the other build steps
     * have completed.
     *
     * @param survey Survey container
     */
    protected abstract performPostBuildProcess(survey: ISurveyContainer): void;
    // #endregion

    // #region implemented methods
    /**
     * Build the grouped question
     *
     * @param survey Survey container
     * @returns Updated survey model
     */
    public build(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ): void {
        // Initialization
        const questionGroups = this.getQuestionGroups();
        const detailRecordsByGroup = this.getDetailRecordsByGroup();
        let position = this.getFirstClonePosition(survey);

        // Set question properties
        this.setQuestionProperties(survey, surveyState);

        // Set question collapsible state and custom page properties
        if (
            this.collapsibleState &&
            this.collapsibleState !==
                SurveyQuestionCollapsibleState.NotCollapsible
        ) {
            const page = survey.getPage(this.questionPageName);
            this.setCustomPageProperties(survey, page);
            for (const question of page.questions) {
                if (question.name.startsWith(this.collapsibleQuestionPrefix)) {
                    question.state = this.collapsibleState;
                }
            }
        }

        // Loop through all the selected groups
        let i = 0;
        for (const groupRecord of questionGroups) {
            // Parse group's record
            // const groupRecord: any = questionGroups[i];
            const groupId: string = groupRecord.value;
            const groupDescription: string = groupRecord.text;

            // Get the group's detail records (usually answer choices)
            const detailRecords = detailRecordsByGroup[groupId];

            // Clone question template - a block of one or more question elements. Skip
            // any empty groups other than "Other".
            if (
                detailRecords ||
                groupDescription.toUpperCase() === "Other".toUpperCase()
            ) {
                position = this.cloneQuestionTemplate(
                    survey,
                    i++,
                    groupId,
                    groupDescription,
                    detailRecords,
                    position
                );
            } else {
                console.error(
                    `Group: ${groupDescription} / ${groupId} is empty`
                );
            }
        }

        // Execute post clone process (remove question template, etc.)
        this.performPostBuildProcess(survey);
    }

    /**
     * Search a collection of question groups to find the group id corresponding
     * to the supplied group name.
     *
     * @param questionGroups Question groups to search
     * @param groupName Group name to search for
     */
    protected findGroupId(
        questionGroups: SurveyDataRow[],
        groupName: string
    ): string {
        for (const questionGroup of questionGroups) {
            if (Utils.equalsIgnoreCase(questionGroup.text, groupName)) {
                return questionGroup.value;
            }
        }

        return null;
    }

    /**
     * Set the custom page/question collapsible properties
     *
     * @param survey Survey container
     * @param surveyComponent Survey component (page, question, etc.)
     */
    protected setCollapsiblePageProperties(
        survey: ISurveyContainer,
        surveyComponent: Survey.PageModel
    ): void {
        // TODO move this logic to question level
        if (surveyComponent) {
            survey.setSurveyProperty(
                SurveyPropertyName.PageCollapsibleState,
                this.collapsibleState ??
                    SurveyQuestionCollapsibleState.NotCollapsible,
                surveyComponent.name
            );
            survey.setSurveyProperty(
                SurveyPropertyName.CollapsibleQuestionPrefix,
                this.collapsibleQuestionPrefix,
                surveyComponent.name
            );
        }
    }

    /**
     * Set custom page properties. This method overrides and adds to the custom page propeties set in the ancestor
     * class.
     *
     * @param survey Survey container
     * @param page Survey page (Optional, defaults to template page)
     */
    protected setCustomPageProperties(
        survey: ISurveyContainer,
        page: Survey.PageModel
    ): void {
        //TODO move this logic to 'AbstractQuestionBuilder' and set property on question instead of page
        // Set collapsible page properties
        this.setCollapsiblePageProperties(survey, page);
    }
    // #endregion
}
