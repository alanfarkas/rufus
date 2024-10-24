import { SkillsSurveyDataElement } from "../Enums/SkillsSurveyDataElement";
import { SkillsSurveyGroupedDataElement } from "../Enums/SkillsSurveyGroupedDataElement";
import { SkillsSurveyPageName } from "../Enums/SkillsSurveyPageName";
import { SkillsSurveyQuestionType } from "../Enums/SkillsSurveyQuestionType";
import { AbstractPageBuilderFactory } from "./AbstractPageBuilderFactory";
import { IPageBuilder } from "./IPageBuilder";
import { PageBuilder } from "./PageBuilder";

/**
 * Skills Survey Page Builder Factory - Each page builder can contain any number of question builders
 */
export class SkillsPageBuilderFactory extends AbstractPageBuilderFactory<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {
    public createPageBuilder(
        surveyPageName: SkillsSurveyPageName
    ): IPageBuilder<SkillsSurveyQuestionType> {
        let questionTypes: SkillsSurveyQuestionType[] = [];
        let pageSelectorTitle: string;

        // Match on lower case spelling of survey page name. Items in case statements must match the
        // actual survey page names as defined in the surveyJS specification.
        switch (surveyPageName) {
            case SkillsSurveyPageName.AdditionalInfo: {
                questionTypes = [SkillsSurveyQuestionType.AdditionalInfo];
                pageSelectorTitle = "Additional Info";
                break;
            }
            case SkillsSurveyPageName.Certification: {
                questionTypes = [SkillsSurveyQuestionType.Certification];
                pageSelectorTitle = "Professional Industry Certifications";
                break;
            }
            case SkillsSurveyPageName.DIJurisdiction: {
                questionTypes = [SkillsSurveyQuestionType.DIJurisdiction];
                pageSelectorTitle = "DI Jurisdiction Experience";
                break;
            }
            case SkillsSurveyPageName.Education: {
                questionTypes = [SkillsSurveyQuestionType.Education];
                pageSelectorTitle = "Education";
                break;
            }
            case SkillsSurveyPageName.IndustryExperience: {
                questionTypes = [SkillsSurveyQuestionType.IndustryExperience];
                pageSelectorTitle = "Industry Experience";
                break;
            }
            case SkillsSurveyPageName.IndustryManufacturing: {
                questionTypes = [
                    SkillsSurveyQuestionType.IndustryManufacturing,
                ];
                pageSelectorTitle = "Industry Manufacturing Experience";
                break;
            }
            case SkillsSurveyPageName.InterimMgmt: {
                questionTypes = [SkillsSurveyQuestionType.InterimMgmt];
                pageSelectorTitle =
                    "Interim Management Executive Advisory Roles";
                break;
            }
            case SkillsSurveyPageName.Language: {
                questionTypes = [SkillsSurveyQuestionType.Language];
                pageSelectorTitle = "Languages";
                break;
            }
            case SkillsSurveyPageName.Manufacturing: {
                questionTypes = [SkillsSurveyQuestionType.Manufacturing];
                pageSelectorTitle = "Manufacturing Experience";
                break;
            }
            case SkillsSurveyPageName.NACR: {
                questionTypes = [SkillsSurveyQuestionType.EngagementRole];
                pageSelectorTitle = "Engagement Roles";
                break;
            }
            case SkillsSurveyPageName.SecurityClearance: {
                questionTypes = [SkillsSurveyQuestionType.SecurityClearance];
                pageSelectorTitle = "Active Government Security Clearances";
                break;
            }
            case SkillsSurveyPageName.SoftwareTool: {
                questionTypes = [SkillsSurveyQuestionType.SoftwareTool];
                pageSelectorTitle = "Software & Tools Experience";
                break;
            }
            case SkillsSurveyPageName.SolutionIndustry: {
                questionTypes = [SkillsSurveyQuestionType.SolutionIndustry];
                pageSelectorTitle = "ACE Solution/Industry Preference";
                break;
            }
            case SkillsSurveyPageName.SolutionSkills: {
                questionTypes = [SkillsSurveyQuestionType.SolutionSkills];
                pageSelectorTitle = "Skills";
                break;
            }
            case SkillsSurveyPageName.Sourcing: {
                questionTypes = [SkillsSurveyQuestionType.Sourcing];
                pageSelectorTitle = "Sourcing Category";
                break;
            }
            case SkillsSurveyPageName.WorkExperience: {
                questionTypes = [SkillsSurveyQuestionType.WorkExperience];
                pageSelectorTitle = "Previous Work Experience";
                break;
            }
            default: {
                /* tslint:disable:max-line-length */
                throw new Error(
                    `Undefined survey page name: [${surveyPageName}] passed to: SkillsPageBuilderFactory`
                );
            }
        }

        return new PageBuilder<
            SkillsSurveyQuestionType,
            SkillsSurveyDataElement,
            SkillsSurveyGroupedDataElement
        >(
            this.questionBuilderFactory,
            surveyPageName,
            pageSelectorTitle,
            questionTypes
        );
    }
}
