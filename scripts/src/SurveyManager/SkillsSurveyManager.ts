import { SkillsSurveyDataProvider } from "../Data/SkillsSurveyDataProvider";
import { SkillsSurveyDataElement } from "../Enums/SkillsSurveyDataElement";
import { SkillsSurveyGroupedDataElement } from "../Enums/SkillsSurveyGroupedDataElement";
import { SkillsSurveyQuestionType } from "../Enums/SkillsSurveyQuestionType";
import { ISurveyMetaData } from "../Survey/ISurveyMetaData";
import { ISurveySpecification } from "../Survey/UI/ISurveySpecification";
import { SkillsSurveySpec } from "../Survey/UI/SkillsSurveySpec";
import { SkillsSurveyBuilder } from "../SurveyBuilder/SkillsSurveyBuilder";
import { SurveyManager } from "./SurveyManager";

/**
 * Skills Survey Manager - Manages the assembly, loading, and saving of the skills survey
 */
export class SkillsSurveyManager extends SurveyManager<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {
    //#region properties
    protected readonly dataProvider = new SkillsSurveyDataProvider(
        "/Survey/SkillsSurvey/"
    );
    public readonly surveyBuilder = new SkillsSurveyBuilder(this.dataProvider);
    //#endregion

    //#region methods

    /**
     * Return a survey specification instance
     *
     * @param metaData Survey meta data
     */
    protected getSurveySpecInstance(
        metaData: ISurveyMetaData
    ): ISurveySpecification {
        return new SkillsSurveySpec(this.dataProvider, metaData);
    }

    /**
     * Perform post-save processing
     */
    protected performPostSaveProcess(): void {
        return;
    }

    /**
     * Perform pre-save processing
     */
    protected performPreSaveProcess(): void {
        //TODO Add code to dynamically run this process for any Grouped Question (ie. implements Group Question Builder)
        // Combine grouped question answers for each data element into single question
        const builder = this.surveyBuilder;
        builder.combineGroupedQuestionAnswers(
            this.surveyModel,
            "Question.IndustryExperience."
        );
        builder.combineGroupedQuestionAnswers(
            this.surveyModel,
            "Question.ManufacturingExperience."
        );
        builder.combineGroupedQuestionAnswers(
            this.surveyModel,
            "Question.SolutionSkills."
        );
        builder.combineGroupedQuestionAnswers(
            this.surveyModel,
            "Question.SourcingCategory."
        );
    }

    //#endregion
}
