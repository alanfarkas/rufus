import { SkillsSurveyDataElement } from "../../Enums/SkillsSurveyDataElement";
import { SkillsSurveyGroupedDataElement } from "../../Enums/SkillsSurveyGroupedDataElement";
import { SkillsSurveyQuestionType } from "../../Enums/SkillsSurveyQuestionType";
import { AbstractQuestionBuilder } from "../Base/AbstractQuestionBuilder";

/**
 * Skills Survey Simple Question Builder
 *
 * This question builder can be used for any survey question not requiring any complex run-time customizations.
 */
export class SimpleQuestionBuilder extends AbstractQuestionBuilder<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {}
