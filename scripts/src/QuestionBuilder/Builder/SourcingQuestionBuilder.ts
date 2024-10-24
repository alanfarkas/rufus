import * as Survey from "survey-jquery";
import { ISurveyState } from "../../Controller/ISurveyState";
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
 * Sourcing Category Question Builder
 */
export class SourcingQuestionBuilder extends AbstractGroupedQuestionBuilder<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {
    // Abstract properties
    public readonly collapsibleState: SurveyQuestionCollapsibleState =
        SurveyQuestionCollapsibleState.Expanded;

    // Regular properties
    private readonly questionFooterTemplateName =
        "Html.SourcingCategory.Footer";
    private sourcingCategoryRecordsByGroup: Record<string, any[]> = {};

    /**
     * Build the Sourcing Category question. This question requires a custom build method as the question hierarchy
     * contains three levels (Sourcing Type, Sourcing Group, Sourcing Category), instead of the default two levels.
     *
     * @param survey Survey Model
     */
    public build(
        survey: ISurveyContainer,
        surveyState: ISurveyState<SkillsSurveyQuestionType>
    ): void {
        // TODO Consider extending the AbstractGroupedQuestionBuilder to AbstractBiLevelGroupedQuestionBuilder
        // Clone the Sourcing Category question across all Sourcing Category Type and coresponding Sourcing Category
        // Group using the parent base class build method. Pass in all the Sourcing records as a local property at the
        // beginning of the process to avoid multiple database calls for the same information.
        this.sourcingCategoryRecordsByGroup =
            this.dataProvider.getDataItemsByGroup(
                SkillsSurveyGroupedDataElement.SourcingCategory
            );
        super.build(survey, surveyState);
    }

    /**
     * Clone the Source Category question template across each Source Category Type
     *
     * @param survey Survey container
     * @param typeIndex Source Category Type index (0-based) (UNUSED)
     * @param typeId Source Category Type id
     * @param typeDescription Source Category Type description
     * @param categoryGroupRecords Source Category Group recrods
     * @param pageIndex Page index to clone question at
     */
    protected cloneQuestionTemplate(
        survey: ISurveyContainer,
        typeIndex: number,
        typeId: string,
        typeDescription: string,
        categoryGroupRecords: any[],
        pageIndex?: number
    ): number {
        const elementNameDelim = survey.elementNameDelim;
        const questionNameSuffix = `${elementNameDelim}${typeId}`;
        const surveyModel = survey.surveyModel;

        // Clone question page
        const templatePage = surveyModel.getPageByName(this.questionPageName);
        const page = templatePage.clone() as Survey.PageModel;
        page.name += questionNameSuffix;

        // Set customized page selector property
        this.setPageSelectorTitleProperty(
            survey,
            page,
            `${this.pageSelectorTitle} (${typeDescription})`
        );

        // Update question panel
        const panel = page.getElementByName(
            this.questionContainerName
        ) as unknown as Survey.PanelModel;
        panel.name += questionNameSuffix;

        // Update html header elements
        const htmlHeader = panel.getQuestionByName(
            "Html.SourcingCategory.Header"
        ) as Survey.QuestionHtmlModel;
        htmlHeader.name += questionNameSuffix;
        htmlHeader.html = htmlHeader.html.replace(
            "[TYPE NAME]",
            typeDescription
        );

        const htmlHeader1 = panel.getQuestionByName(
            "Html.SourcingCategory.Instructions.1"
        ) as Survey.QuestionHtmlModel;
        htmlHeader1.name += questionNameSuffix;
        htmlHeader1.html = htmlHeader1.html.replace(
            "[TYPE NAME]",
            typeDescription
        );

        const htmlHeader2 = panel.getQuestionByName(
            "Html.SourcingCategory.Instructions.2"
        ) as Survey.QuestionHtmlModel;
        htmlHeader2.name += questionNameSuffix;

        // Clone Sourcing Category question across each Sourcing Category Group
        this.cloneSourcingCategoryQuestion(
            panel,
            categoryGroupRecords,
            this.sourcingCategoryRecordsByGroup,
            elementNameDelim
        );

        // Update the page's visibleIf expression based on the "Sourcing" skill's id and category id
        const sourcingSkillKeys = this.dataProvider.getSingleGroupedDataRow(
            SkillsSurveyGroupedDataElement.SourcingSkillKeys
        );
        if (sourcingSkillKeys) {
            page.visibleIf = page.visibleIf.replace(
                "[GROUPID]",
                sourcingSkillKeys.groupId
            );
            page.visibleIf = page.visibleIf.replace(
                "[SKILLID]",
                sourcingSkillKeys.value
            );
        }

        // Record last occurence of page name for use by Manufacturing Experience question
        surveyModel.setPropertyValue(
            SkillsSurveyPropertyName.SourcingCategoryLastPage,
            page.name
        );

        // Add new page for current Sourcing Category Type (Direct / Indirect) to survey
        if (pageIndex) {
            // Add new page to specified position
            surveyModel.pages.splice(pageIndex, 0, page);
        } else {
            // No specified postion - add new page to end of survey
            surveyModel.addPage(page);
            pageIndex = surveyModel.pages.length - 1;
        }

        // Return postion to clone next template (next page position)
        return pageIndex + 1;
    }

    /**
     * Clone the matrix question template across a set of categories
     *
     * @param survey Survey model
     * @param questionPanel Survey Panel element containing the question template
     * @param categoryGroupRecords Sourcing Category Group records - id & description
     * @param categoryRecordsByGroup  Complete set of Sourcing Category records indexed by group
     * @param elementNameDelim Survey element name delimeter
     */
    private cloneSourcingCategoryQuestion(
        questionPanel: Survey.PanelModel,
        categoryGroupRecords: SurveyDataRow[],
        categoryRecordsByGroup: Record<string, SurveyGroupedDataRow[]>,
        elementNameDelim: string
    ): void {
        // Get question template elements
        const htmlQuestionFooterTemplate = questionPanel.getQuestionByName(
            this.questionFooterTemplateName
        );
        const sourcingCategoryQuestionTemplate: Survey.QuestionCheckbox =
            questionPanel.getQuestionByName(
                this.questionName
            ) as Survey.QuestionCheckbox;

        // Create a matrix question showing the skills  for each category
        for (const categoryGroupRecord of categoryGroupRecords) {
            // Parse Category Group record
            const categoryGroupId: string = categoryGroupRecord.value;
            const categoryGroupDescription: string = categoryGroupRecord.text;
            const questionNameSuffix = `${elementNameDelim}${categoryGroupId}`;

            // Get corresponding skill records
            const sourcingCategoryRecords: any[] =
                categoryRecordsByGroup[categoryGroupId];

            // Continue to next Sourcing Category Group if no corrsponding Sourcing Category records could be found
            if (!sourcingCategoryRecords) {
                continue;
            }

            // Clone Sourcing Category question
            const question =
                sourcingCategoryQuestionTemplate.clone() as Survey.QuestionCheckbox;
            question.name += questionNameSuffix;

            // Set question title to Sourcing Category Group descirption
            question.title = categoryGroupDescription.toUpperCase();

            // Set question answer choices - this simple assignment only works because the field names in
            // 'sourcingCategoryRecords' match the required Checkbox row property names ('value', 'text').
            question.choices = sourcingCategoryRecords;

            // Only show "Select All" option if there are multiple selections (SKIL-432)
            //TODO Find a way to abstract this out so that's it's the default behavior (that could be overwritten by
            //TODO a property setting)
            question.hasSelectAll = sourcingCategoryRecords?.length > 1;

            // Add new question to question panel
            questionPanel.addQuestion(question);

            // Clone question footer
            const htmlQuestionFooter =
                htmlQuestionFooterTemplate.clone() as Survey.Question;
            htmlQuestionFooter.name += questionNameSuffix;
            questionPanel.addElement(htmlQuestionFooter);
        }

        // Remove template elements
        questionPanel.removeQuestion(sourcingCategoryQuestionTemplate);
        questionPanel.removeQuestion(htmlQuestionFooterTemplate);
    }

    protected getQuestionGroups(): SurveyDataRow[] {
        const groupRecords = this.dataProvider.getDataItems(
            SkillsSurveyDataElement.SourcingCategoryType
        );
        return groupRecords;
    }

    protected getDetailRecordsByGroup(): Record<
        string,
        SurveyGroupedDataRow[]
    > {
        const choicesByGroup = this.dataProvider.getDataItemsByGroup(
            SkillsSurveyGroupedDataElement.SourcingCategoryGroup
        );
        return choicesByGroup;
    }

    protected getFirstClonePosition(survey: ISurveyContainer): number {
        // Get Supply Chain Services page name from custom survey property
        const scServicesPageName = survey.surveyModel.getPropertyValue(
            SkillsSurveyPropertyName.SupplyChainSVCSPage
        );

        // First clone position is the next page after the Supply Chain Service page
        return survey.getPageIndex(scServicesPageName) + 1;
    }

    protected performPostBuildProcess(survey: ISurveyContainer): void {
        // Remove template page
        survey.removePage(this.questionPageName);
    }
}
