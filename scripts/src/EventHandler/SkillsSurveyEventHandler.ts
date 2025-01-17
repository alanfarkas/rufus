﻿import { SkillsSurveyQuestionType } from "../Enums/SkillsSurveyQuestionType";
import { ISurveySession } from "../SurveySession/ISurveySession";
import { SurveyEventHandler } from "./SurveyEventHandler";

/**
 * Skills Survey Event Handler
 */
export class SkillsSurveyEventHandler extends SurveyEventHandler<SkillsSurveyQuestionType> {
    private certificationQuestionChangeCount = 0; // SKIL-389

    //#region overwritten methods

    /**
     * Custom event handlers
     *
     * NOTE: Only new event handlers should be defined here. Overrides to existing
     *       event handlers should be specified as a method override.
     *
     * @param session Survey session
     */
    protected addCustomEvents(
        session: ISurveySession<SkillsSurveyQuestionType>
    ): void {
        // ADD CUSTOM EVENTS HERE
    }

    /**
     * Add question value change event
     *
     * @param session Survey session
     */
    protected addValueChangeEventHandler(
        session: ISurveySession<SkillsSurveyQuestionType>
    ): void {
        const surveyModel = session.surveyModel;

        surveyModel.onValueChanged.add((sender, options) => {
            // Reset survey timer to avoid conflicts when user is actively editing the survey.
            session.resetSurveyTimer();

            // Resolve issue where initial display of Certification question registers as a
            // data change. This is a hack fix but was the only fix available. (SKIL-389)
            const certificationBuilder =
                session.surveyManager.surveyBuilder.getQuestionBuilder(
                    SkillsSurveyQuestionType.Certification
                );
            if (options.name === certificationBuilder.questionContainerName) {
                // Ignore first registered data change as this is generated by the application, not a bonafide
                // user-initiated data change.
                if (++this.certificationQuestionChangeCount < 2) {
                    return;
                }
            }

            // Set the changed flag whenever the user modifies the survey.
            //session.isDataDirty = true;

            // Add the associate question type to survey state
            session.surveyManager.trackUpdatedQuestions(options.question);
        });
    }

    //#endregion
}
