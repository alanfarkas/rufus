import { SkillsSurveyDataElement } from "../../Enums/SkillsSurveyDataElement";
import { SkillsSurveyGroupedDataElement } from "../../Enums/SkillsSurveyGroupedDataElement";
import { SkillsSurveyQuestionType } from "../../Enums/SkillsSurveyQuestionType";
import { IPageProperties } from "../../PageBuilder/IPageProperties";
import { IQuestionBuilder } from "../Base/IQuestionBuilder";
import { QuestionBuilderSettings } from "../Base/QuestionBuilderSettings";
import { DIJurisdictionQuestionBuilder } from "../Builder/DIJurisdictionQuestionBuilder";
import { IndustryExperienceQuestionBuilder } from "../Builder/IndustryExperienceQuestionBuilder";
import { ManufacturingQuestionBuilder } from "../Builder/ManufacturingQuestionBuilder";
import { SimpleQuestionBuilder } from "../Builder/SimpleQuestionBuilder";
import { SolutionSkillsQuestionBuilder } from "../Builder/SolutionSkillsQuestionBuilder";
import { SourcingQuestionBuilder } from "../Builder/SourcingQuestionBuilder";
import { AbstractQuestionBuilderFactory } from "./AbstractQuestionBuilderFactory";

/**
 * Skills Survey Question Builder Factory - test
 */
export class SkillsQuestionBuilderFactory extends AbstractQuestionBuilderFactory<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {
    /**
     * Create question builder
     *
     * @param questionType Skills survey question type
     * @param pageProperties Survey page custom properties
     */
    public getQuestionBuilder(
        questionType: SkillsSurveyQuestionType,
        pageProperties?: IPageProperties<SkillsSurveyQuestionType>
    ): IQuestionBuilder<SkillsSurveyQuestionType> {
        const settings = new QuestionBuilderSettings<
            SkillsSurveyQuestionType,
            SkillsSurveyDataElement,
            SkillsSurveyGroupedDataElement
        >(questionType, this.dataProvider, pageProperties);

        // Questions without any customized build process can fall through this Switch statement and use
        // the 'SimpleQuestionBuilder' class to specify the minimum required Question Builder properties:
        //
        // Question Name - The name of the main question corresponding to the Question Type (must be a valid question
        //                 name!).
        //
        // Question Container Name - The name of the direct parent of the question. Should be a panel, dynamic panel or
        //                           matrix panel.
        //
        // Selection Refresh Spec - Optional. Used to specify which data selection lists to refresh from the database
        //                          whenever a user updates a survey question. This parameter would typically be used
        //                          on any question that allows the user to enter 'other' values.
        //
        switch (questionType) {
            case SkillsSurveyQuestionType.AdditionalInfo: {
                settings.questionContainerName = "Container.AdditionalInfo";
                settings.questionName = "Question.AdditionalInfo";
                break;
            }
            case SkillsSurveyQuestionType.Certification: {
                settings.questionContainerName = "Container.Certification";
                settings.questionName = "Question.Certification";
                settings.addSelectionRefreshSpec(
                    SkillsSurveyDataElement.Certification
                );
                break;
            }
            case SkillsSurveyQuestionType.DIJurisdiction: {
                settings.questionContainerName = "Container.DIJurisdiction";
                settings.questionName = "Question.DIJurisdiction";
                return new DIJurisdictionQuestionBuilder(settings);
            }
            case SkillsSurveyQuestionType.Education: {
                settings.questionContainerName = "Container.Education";
                settings.questionName = "Question.School";
                settings.addSelectionRefreshSpec(
                    SkillsSurveyDataElement.EducationSchool,
                    "Question.School"
                );
                settings.addSelectionRefreshSpec(
                    SkillsSurveyDataElement.EducationMajor,
                    "Question.Major"
                );
                break;
            }
            case SkillsSurveyQuestionType.EngagementRole: {
                settings.questionContainerName = "Container.EngagementRole";
                settings.questionName = "Question.EngagementRole";
                break;
            }
            case SkillsSurveyQuestionType.IndustryExperience: {
                settings.questionContainerName = "Container.IndustryExperience";
                settings.questionName = "Question.IndustryExperience";
                return new IndustryExperienceQuestionBuilder(settings);
            }
            case SkillsSurveyQuestionType.IndustryManufacturing: {
                settings.questionContainerName =
                    "Container.IndustryManufacturingExperience";
                settings.questionName =
                    "Question.IndustryManufacturingExperience";
                break;
            }
            case SkillsSurveyQuestionType.InterimMgmt: {
                settings.questionContainerName = "Container.InterimMgmt";
                settings.questionName = "Question.InterimMgmt";
                settings.addSelectionRefreshSpec(
                    SkillsSurveyDataElement.InterimMgmt
                );
                break;
            }
            case SkillsSurveyQuestionType.Language: {
                settings.questionContainerName = "Container.Language";
                settings.questionName = "Question.Language";
                break;
            }
            case SkillsSurveyQuestionType.Manufacturing: {
                settings.questionContainerName =
                    "Container.ManufacturingExperience";
                settings.questionName = "Question.ManufacturingExperience";
                return new ManufacturingQuestionBuilder(settings);
            }
            case SkillsSurveyQuestionType.SecurityClearance: {
                settings.questionContainerName = "Container.SecurityClearance";
                settings.questionName = "Question.SecurityClearance";
                break;
            }
            case SkillsSurveyQuestionType.SoftwareTool: {
                settings.questionContainerName = "Container.SoftwareTool";
                settings.questionName = "Question.SoftwareTool";
                settings.addSelectionRefreshSpec(
                    SkillsSurveyDataElement.SoftwareTool
                );
                break;
            }
            case SkillsSurveyQuestionType.SolutionIndustry: {
                settings.questionContainerName = "Container.SolutionIndustry";
                settings.questionName = "Question.SolutionIndustry";
                break;
            }
            case SkillsSurveyQuestionType.SolutionSkills: {
                settings.questionContainerName = "Container.SolutionSkills";
                settings.questionName = "Question.SolutionSkills";
                return new SolutionSkillsQuestionBuilder(settings);
            }
            case SkillsSurveyQuestionType.Sourcing: {
                settings.questionContainerName = "Container.SourcingCategory";
                settings.questionName = "Question.SourcingCategory";
                return new SourcingQuestionBuilder(settings);
            }
            case SkillsSurveyQuestionType.WorkExperience: {
                settings.questionContainerName = "Container.WorkExperience";
                settings.questionName = "Question.Company";
                settings.addSelectionRefreshSpec(
                    SkillsSurveyDataElement.ExperienceCompany,
                    "Question.Company"
                );
                settings.addSelectionRefreshSpec(
                    SkillsSurveyDataElement.ExperienceJobTitle,
                    "Question.JobTitle"
                );
                break;
            }
            default: {
                throw new Error(
                    `Invalid question type: [${questionType}] passed to: QuestionBuilderFactory`
                );
            }
        }

        return new SimpleQuestionBuilder(settings);
    }
}
