﻿import { ISurveyController } from "../Controller/ISurveyController";
import { SkillsSurveyDataElement } from "../Enums/SkillsSurveyDataElement";
import { SkillsSurveyGroupedDataElement } from "../Enums/SkillsSurveyGroupedDataElement";
import { SkillsSurveyQuestionType } from "../Enums/SkillsSurveyQuestionType";
import { SkillsQuestionBuilderFactory } from "../QuestionBuilder/Factory/SkillsQuestionBuilderFactory";
import { BaseSurveyEventHandler } from "./BaseSurveyEventHandler";

/**
 * Skills Survey Event Handler
 */
export class SkillsBaseSurveyEventHandler extends BaseSurveyEventHandler<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {
    private certificationQuestionChangeCount = 0; // SKIL-389

    //#region overwritten methods

    /**
     * Custom event handlers
     *
     * NOTE: Only new event handlers should be defined here. Overrides to existing
     *       event handlers should be specified as a method override.
     *
     * @param controller Survey controller
     */
    protected addCustomEvents(
        controller: ISurveyController<
            SkillsSurveyQuestionType,
            SkillsSurveyDataElement,
            SkillsSurveyGroupedDataElement
        >
    ): void {
        const surveyModel = controller.surveyModel;

        // ADD CUSTOM EVENTS HERE
    }

    /**
     * Add question value change event
     *
     * @param controller Survey controller
     */
    protected addValueChangeEventHandler(
        controller: ISurveyController<
            SkillsSurveyQuestionType,
            SkillsSurveyDataElement,
            SkillsSurveyGroupedDataElement
        >
    ): void {
        const surveyModel = controller.surveyModel;

        surveyModel.onValueChanged.add((sender, options) => {
            // Reset survey timer to avoid conflicts when user is actively editing the survey.
            controller.resetSurveyTimer();

            // Resolve issue where initial display of Certification question registers as a
            // data change. This is a hack fix but was the only fix available. (SKIL-389)
            const certificationBuilder = new SkillsQuestionBuilderFactory(
                controller.dataProvider
            ).getQuestionBuilder(SkillsSurveyQuestionType.Certification);
            if (options.name === certificationBuilder.questionContainerName) {
                // Ignore first registered data change as this is generated by the application, not a bonafide
                // user-initiated data change.
                if (++this.certificationQuestionChangeCount < 2) {
                    return;
                }
            }

            // Add the associated question type of the changed value to the survey state
            controller.trackUpdatedQuestions(options.question);
        });
    }

    //#endregion
}
