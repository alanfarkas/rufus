import { JsonObject } from "survey-jquery";
import { ISurveyState } from "../Controller/ISurveyState";
import { ISurveyDataProvider } from "../Data/ISurveyDataProvider";
import { SkillsSurveyDataElement } from "../Enums/SkillsSurveyDataElement";
import { SkillsSurveyGroupedDataElement } from "../Enums/SkillsSurveyGroupedDataElement";
import { SkillsSurveyQuestionType } from "../Enums/SkillsSurveyQuestionType";
import { SurveyPropertyName } from "../Enums/SurveyPropertyName";
import { SurveyJSThemeName } from "../Enums/SurveyJSThemeName";
import { SkillsPageBuilderFactory } from "../PageBuilder/SkillsPageBuilderFactory";
import { SkillsQuestionBuilderFactory } from "../QuestionBuilder/Factory/SkillsQuestionBuilderFactory";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { SkillsSurveyContainer } from "../Survey/SkillsSurveyContainer";
import { ISurveySpecification } from "../Survey/UI/ISurveySpecification";
import { AbstractSurveyBuilder } from "./AbstractSurveyBuilder";
import { ISurveyMetaData } from "../Survey/ISurveyMetaData";

// #region SkillsSurveyBuilder Class

/**
 *  Skills Survey Builder
 */
export class SkillsSurveyBuilder extends AbstractSurveyBuilder<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {
    //#region properties
    protected pageBuilderFactory: SkillsPageBuilderFactory;
    protected questionBuilderFactory: SkillsQuestionBuilderFactory;
    //#endregion

    //#region constructor
    constructor(
        public readonly dataProvider: ISurveyDataProvider<
            SkillsSurveyQuestionType,
            SkillsSurveyDataElement,
            SkillsSurveyGroupedDataElement
        >
    ) {
        super(dataProvider);
        this.questionBuilderFactory = new SkillsQuestionBuilderFactory(
            dataProvider
        );
        this.pageBuilderFactory = new SkillsPageBuilderFactory(
            this.questionBuilderFactory
        );
    }

    //#endregion

    // #region overwritten methods
    // #endregion

    // #region regular methods
    /**
     * Initialize the survey
     *
     * @param surveySpec SurveyJS specification
     * @param metaData Survey meta-data
     * @param themeName SurveyJS theme name (defaults to theme name specified in the survey specification)
     */
    protected initializeSurvey(
        surveySpec: ISurveySpecification,
        metaData: ISurveyMetaData,
        themeName: SurveyJSThemeName = surveySpec.themeName
    ): ISurveyContainer {
        // Initialize survey
        const survey = new SkillsSurveyContainer(
            surveySpec,
            metaData,
            themeName
        );

        return survey;
    }

    /**
     * Perform pre-data load processing
     *
     * @param survey Survey container
     * @param surveyState Survey state
     */
    //TODO Remove this after Survey Session implementation
    public performPreLoadProcess(
        survey: ISurveyContainer,
        surveyState: ISurveyState<SkillsSurveyQuestionType>
    ): void {
        // Refresh answer choices on questions where the list of available choices can be
        // appended with user-entered "other" value(s). On initial survey load refresh all questions,
        // otherwise only update "dirty" questions.
        const updatedQuestionTypes = surveyState.isInitialLoad
            ? null
            : surveyState.dirtyQuestionTypes;
        this.refreshDynamicQuestions(survey, updatedQuestionTypes);
    }

    /**
     * Perform any necessary processing that's required before survey data is saved
     * back to the database.
     *
     * @param survey Survey container
     * @param surveyState Survey state
     */
    //TODO Remove this (or move to super or calling class) after Survey Session implementation
    public performPreSaveProcess(
        survey: ISurveyContainer,
        surveyState: ISurveyState<SkillsSurveyQuestionType>
    ): void {
        // Combine each group of answers (e.g. 'Question.Industry.100', 'Question.Industry.200') for any grouped
        // question (e.g. 'Industry Experience')  into a single set of values for that question
        // (e.g. 'Question.Industry') (SKIL - 559)
        this.groupedQuestionNames.forEach((name: string) =>
            this.combineGroupedQuestionAnswers(survey.surveyModel, `${name}.`));
     }

    /**
     * Perform any necessary transformations on the downloaded survey data
     *
     * @param survey Survey container
     * @param data Downloaded survey data
     */
    //TODO Remove this after Survey Session implementation
    public transformRawSurveyData(
        survey: ISurveyContainer,
        data: JsonObject
    ): JsonObject {
        // "Split" grouped question data into individual questions
        data = this.splitGroupedQuestions(survey, data);

        return data;
    }

    // #endregion
}
// #endregion

// #region Custom Survey Functions

/*
 * Check if data passes validation
 *
 * @deprecated - not being actively used; only being used as example
 */
function isValidDataFunc(params: any[]): boolean {
    const questionValue: string = params[0];
    const targetValue: string = params[1];
    const dataProvider: ISurveyDataProvider<
        SkillsSurveyQuestionType,
        SkillsSurveyDataElement,
        SkillsSurveyGroupedDataElement
    > = this.survey.getPropertyValue(SurveyPropertyName.DataProvider);
    //const status = dataProvider.isDataCriteriaMet(SkillsSurveyDataValidationType.HasManufacturingData);
    //return status;
    //return true;
    //return questionValue && questionValue.includes(targetValue);
    return;
}

// #endregion
