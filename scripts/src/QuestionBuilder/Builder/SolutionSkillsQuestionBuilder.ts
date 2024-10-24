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
 * Solution Skills Question Builder
 */
export class SolutionSkillsQuestionBuilder extends AbstractGroupedQuestionBuilder<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {
    // Abstract properties
    public readonly collapsibleState: SurveyQuestionCollapsibleState =
        SurveyQuestionCollapsibleState.NotCollapsible;

    // Regular properties
    private skillRecordsByCategory: Record<string, any[]> = {};

    /**
     * Build the Solution Skills question. This question requires a custom build method as the question hierarchy
     * contains three levels (Skill Family, Skill Category, Skill), instead of the default two levels.
     *
     * @param survey Survey container
     */
    public build(
        survey: ISurveyContainer,
        surveyState: ISurveyState<SkillsSurveyQuestionType>
    ): void {
        // Generate the maxtix columns from the valid Skills Proficiency values. Default column value is 'None'.
        const tabChar = String.fromCharCode(9);
        const newColumns: any[] = [
            { value: "-1", text: "None " + tabChar + tabChar },
        ];
        const proficiencyData: any[] = this.dataProvider.getDataItems(
            SkillsSurveyDataElement.SkillProficiency
        );
        const q = survey.surveyModel.getQuestionByName(
            this.questionName
        ) as Survey.QuestionMatrixModel;
        const columns = newColumns.concat(proficiencyData);
        q.columns = columns;

        // Clone the Solution Skills question across all Skill Families and coresponding Skill Categories using the
        // parent base clas build method. Pass in all the skill records as a local property at the beginning of the
        // process to avoid multiple database calls for the same information.
        this.skillRecordsByCategory = this.dataProvider.getDataItemsByGroup(
            SkillsSurveyGroupedDataElement.Skill
        );
        super.build(survey, surveyState);
    }

    /**
     * Clone the Solution Skills question template across each Solution Skill Family and Category
     *
     * @param survey Survey container
     * @param familyIndex Solution Skills Family index (0-based)
     * @param familyId Solution Skills Family id
     * @param familyDescription Solution Skills Family description
     * @param categoryRecords Solution Skills Family Category recrods
     * @param pageIndex Page index to clone question at
     */
    protected cloneQuestionTemplate(
        survey: ISurveyContainer,
        familyIndex: number,
        familyId: string,
        familyDescription: string,
        categoryRecords: any[],
        pageIndex?: number
    ): number {
        const questionNameSuffix = `${survey.elementNameDelim}${familyId}`;
        const surveyModel = survey.surveyModel;

        // Clone question page
        const templatePage = surveyModel.getPageByName(this.questionPageName);
        const page = templatePage.clone() as Survey.PageModel;
        page.name += questionNameSuffix;

        // Set customized page selector property
        this.setPageSelectorTitleProperty(
            survey,
            page,
            `${this.pageSelectorTitle} - ${familyDescription}`
        );

        // Display alternate notification message for CTS (SKIL-501) or DABM family pages (SKIL-478)
        if (familyId === "2501" || familyId === "2509") {
            // Hide default notification message
            const defaultNotificationElement = page.getElementByName(
                "Html.SolutionSkills.Notifications.Default"
            );
            if (defaultNotificationElement)
                defaultNotificationElement.visible = false;

            // Display alternate message that corresponds to selected family page
            let altNotificationElementName;
            if (familyId === "2501") {
                // DABM
                altNotificationElementName =
                    "Html.SolutionSkills.Notifications.DABM";
            } else {
                // CTS
                altNotificationElementName =
                    "Html.SolutionSkills.Notifications.CTS";
            }
            const altNotificationElement = page.getElementByName(
                altNotificationElementName
            );
            if (altNotificationElement) altNotificationElement.visible = true;
        }

        // Update outer panel
        const outerPanel = page.getElementByName(
            this.questionContainerName
        ) as unknown as Survey.PanelModel;
        outerPanel.name += questionNameSuffix;

        // Update html header element
        // -- Question part display code (ex. "6a", "6b", "6c")
        const questionPartCode = String.fromCharCode(
            "a".charCodeAt(0) + familyIndex
        );
        const htmlHeader = outerPanel.getQuestionByName(
            "Html.SolutionSkills.Header"
        ) as Survey.QuestionHtmlModel;
        htmlHeader.name += questionNameSuffix;
        htmlHeader.html = htmlHeader.html.replace("[PART]", questionPartCode);
        htmlHeader.html = htmlHeader.html.replace(
            "[FAMILY NAME]",
            familyDescription
        );

        // Update html instructions element
        const htmlInstructions = outerPanel.getQuestionByName(
            "Html.SolutionSkills.Instructions"
        ) as Survey.QuestionHtmlModel;
        htmlInstructions.name += questionNameSuffix;
        htmlInstructions.html = htmlInstructions.html.replace(
            "[FAMILY NAME]",
            familyDescription
        );

        // Update names on remaining html elements
        const htmlTableHeader = outerPanel.getElementByName(
            "Html.SolutionSkills.ProficiencyTable"
        );
        htmlTableHeader.name += questionNameSuffix;

        // Clone matrix question for each question category
        this.cloneMatrixQuestion(
            outerPanel,
            categoryRecords,
            this.skillRecordsByCategory,
            survey.elementNameDelim
        );

        // If Supply Chain Services page - Record page name for use by Sourcing Cateogory question
        if (familyDescription.toUpperCase().includes("SUPPLY CHAIN")) {
            surveyModel.setPropertyValue(
                SkillsSurveyPropertyName.SupplyChainSVCSPage,
                page.name
            );
        }

        // Add new page to specified position
        if (pageIndex) {
            // Add new page to specified position
            surveyModel.pages.splice(pageIndex, 0, page);
        } else {
            // No specified postion - add new page to end of survey
            surveyModel.addPage(page);
        }

        // Return postion to clone next template (next page number)
        return pageIndex + 1;
    }

    /**
     * Clone the matrix question template across a set of categories
     *
     * @param questionPanel Survey Panel element containing the question template
     * @param categoryRecords Category records - id & description
     * @param skillRecordsByCategory Complete set of skills records index by category
     * @param elementNameDelim Survey element name delimeter
     */
    private cloneMatrixQuestion(
        questionPanel: Survey.PanelModel,
        categoryRecords: SurveyDataRow[],
        skillRecordsByCategory: Record<string, SurveyGroupedDataRow[]>,
        elementNameDelim
    ): void {
        // Get template elements
        const htmlGridHeaderTemplate = questionPanel.getQuestionByName(
            "Html.SolutionSkills.MatrixHeader"
        );
        const htmlBottomSpacerTemplate = questionPanel.getQuestionByName(
            "Html.SolutionSkills.BottomSpacer"
        );
        const matrixQuestionTemplate: Survey.QuestionMatrixModel =
            questionPanel.getQuestionByName(
                this.questionName
            ) as Survey.QuestionMatrixModel;

        // Create a matrix question showing the skills for each category
        for (const categoryRecord of categoryRecords) {
            // Parse category record
            const categoryId: string = categoryRecord.value;
            const categoryDescription: string = categoryRecord.text;
            const questionNameSuffix = `${elementNameDelim}${categoryId}`;

            // Get corresponding skill records
            const skillRecords: any[] = skillRecordsByCategory[categoryId];

            // Continue to next category if no corrsponding skill records could be found
            if (!skillRecords) {
                continue;
            }

            // Clone question header
            const htmlGridHeader =
                htmlGridHeaderTemplate.clone() as Survey.QuestionHtmlModel;
            htmlGridHeader.name += questionNameSuffix;
            htmlGridHeader.html = htmlGridHeader.html.replace(
                "[CATEGORY NAME]",
                categoryDescription
            );
            questionPanel.addElement(htmlGridHeader);

            // Clone matrix question
            const matrixQuestion =
                matrixQuestionTemplate.clone() as Survey.QuestionMatrixModel;
            matrixQuestion.name += questionNameSuffix;
            questionPanel.addElement(matrixQuestion);

            // Clone question bottom spacer
            const htmlBottomSpacer =
                htmlBottomSpacerTemplate.clone() as Survey.Question;
            htmlBottomSpacer.name += questionNameSuffix;
            questionPanel.addElement(htmlBottomSpacer);

            // Update matrix rows to anwer choices for current category  - this simple
            // assignment only works because the field names in skillRecords match the
            // required Matrix Row property names ('value', 'text').
            matrixQuestion.rows = skillRecords;
        }

        // Remove template elements
        questionPanel.removeQuestion(htmlGridHeaderTemplate);
        questionPanel.removeQuestion(matrixQuestionTemplate);
        questionPanel.removeQuestion(htmlBottomSpacerTemplate);
    }

    protected getQuestionGroups(): SurveyDataRow[] {
        const groupRecords = this.dataProvider.getDataItems(
            SkillsSurveyDataElement.SkillFamily
        );
        return groupRecords;
    }

    protected getDetailRecordsByGroup(): Record<
        string,
        SurveyGroupedDataRow[]
    > {
        const choicesByGroup = this.dataProvider.getDataItemsByGroup(
            SkillsSurveyGroupedDataElement.SkillCategory
        );
        return choicesByGroup;
    }

    protected getFirstClonePosition(survey: ISurveyContainer): number {
        return survey.getPageIndex(this.questionPageName);
    }

    protected performPostBuildProcess(survey: ISurveyContainer): void {
        // Remove template page
        survey.removePage(this.questionPageName);
    }
}
