import * as Survey from "survey-jquery";
import { SurveyDataRow } from "../../Data/SurveyDataRow";
import { SurveyGroupedDataRow } from "../../Data/SurveyGroupedDataRow";
import { SkillsSurveyDataElement } from "../../Enums/SkillsSurveyDataElement";
import { SkillsSurveyGroupedDataElement } from "../../Enums/SkillsSurveyGroupedDataElement";
import { SkillsSurveyPropertyName } from "../../Enums/SkillsSurveyPropertyName";
import { SkillsSurveyQuestionType } from "../../Enums/SkillsSurveyQuestionType";
import { SurveyQuestionCollapsibleState } from "../../Enums/SurveyQuestionCollapsibleState";
import { ISurveyContainer } from "../../Survey/ISurveyContainer";
import { AbstractGroupedQuestionBuilder } from "../Base/AbstractGroupedQuestionBuilder";

/**
 * Manufacturing Experience Question Builder
 */
export class ManufacturingQuestionBuilder extends AbstractGroupedQuestionBuilder<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {
    // Abstract properties
    public readonly collapsibleState: SurveyQuestionCollapsibleState =
        SurveyQuestionCollapsibleState.Expanded;

    // Regular properties
    private readonly questionFooterTemplateName =
        "Html.ManufacturingExperience.Footer";

    /**
     * Clone Manufacturing Experience question template across a set of groups
     *
     * @param survey Survey container
     * @param groupIndex Group index (0-based) (UNUSED)
     * @param groupId Group id
     * @param groupDescription Group description
     * @param choices Answer choices
     * @param position Position within the question template's container (page or panel) to clone the question
     *                 template to (default is last postion in container) (UNUSED).
     */
    protected cloneQuestionTemplate(
        survey: ISurveyContainer,
        groupIndex: number,
        groupId: string,
        groupDescription: string,
        choices: any[],
        position?: number
    ): number {
        const questionNameSuffix = `${survey.elementNameDelim}${groupId}`;
        const surveyModel = survey.surveyModel;

        // Clone manufacturing experience question
        let question = surveyModel.getQuestionByName(
            this.questionName
        ) as Survey.QuestionCheckbox;
        question = question.clone() as Survey.QuestionCheckbox;
        question.name += questionNameSuffix;

        // Set question title
        question.title = groupDescription.toUpperCase();

        // Set question answer choices
        question.choices = choices;

        // Only show "Select All" option if there are multiple selections (SKIL-432)
        question.hasSelectAll = choices?.length > 1 ? true : false;

        // Add new question to question panel
        const panel = surveyModel.getPanelByName(
            this.questionContainerName
        ) as Survey.PanelModel;
        panel.addQuestion(question);

        // Clone question footer
        const htmlQuestionFooter = panel
            .getQuestionByName(this.questionFooterTemplateName)
            .clone() as Survey.Question;
        htmlQuestionFooter.name += questionNameSuffix;
        panel.addElement(htmlQuestionFooter);

        // Return dummy value
        return 0;
    }

    protected getQuestionGroups(): SurveyDataRow[] {
        const manufacturingGroups = this.dataProvider.getDataItems(
            SkillsSurveyDataElement.ManufacturingExperienceGroups
        );
        return manufacturingGroups;
    }

    protected getDetailRecordsByGroup(): Record<
        string,
        SurveyGroupedDataRow[]
    > {
        const manufacturingExperiencesByGroup =
            this.dataProvider.getDataItemsByGroup(
                SkillsSurveyGroupedDataElement.ManufacturingExperience
            );
        return manufacturingExperiencesByGroup;
    }

    protected getFirstClonePosition(survey: ISurveyContainer): number {
        return 0;
    }

    protected performPostBuildProcess(survey: ISurveyContainer) {
        // Remove question template
        const surveyModel = survey.surveyModel;
        const panel = surveyModel.getPanelByName(
            this.questionContainerName
        ) as Survey.PanelModel;
        const question = surveyModel.getQuestionByName(this.questionName);
        panel.removeQuestion(question);
        const footer = surveyModel.getQuestionByName(
            this.questionFooterTemplateName
        );
        panel.removeQuestion(footer);

        // Update the page's visibleIf expression based on the "Manufacturing" skill ids and category id
        const page = surveyModel.getPageByName(this.questionPageName);
        const manufacturingDataRows = this.dataProvider.getSingleGroupDataRows(
            SkillsSurveyGroupedDataElement.ManufacturingSkillKeys
        );
        if (manufacturingDataRows && manufacturingDataRows.length > 0) {
            const groupId = manufacturingDataRows[0].groupId;
            const skillIDs: string[] = [];
            for (const dataRow of manufacturingDataRows) {
                skillIDs.push(dataRow.value);
            }
            page.visibleIf = page.visibleIf.replace("[GROUPID]", groupId);
            page.visibleIf = page.visibleIf.replace(
                "[SKILLID]",
                skillIDs.toString()
            );
        }

        // Move question page to desired position within Solution Skills question
        const scLastPageName = surveyModel.getPropertyValue(
            SkillsSurveyPropertyName.SourcingCategoryLastPage
        );
        const pageIndex = survey.getPageIndex(scLastPageName) + 1;
        survey.movePage(this.questionPageName, pageIndex);
    }
}
