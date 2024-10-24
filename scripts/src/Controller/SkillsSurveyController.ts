import { ISurveyDataProvider } from "../Data/ISurveyDataProvider";
import { SkillsSurveyDataProvider } from "../Data/SkillsSurveyDataProvider";
import { SkillsSurveyDataElement } from "../Enums/SkillsSurveyDataElement";
import { SkillsSurveyGroupedDataElement } from "../Enums/SkillsSurveyGroupedDataElement";
import { SkillsSurveyQuestionType } from "../Enums/SkillsSurveyQuestionType";
import { IBaseSurveyEventHandler } from "../EventHandler/IBaseSurveyEventHandler";
import { SkillsBaseSurveyEventHandler } from "../EventHandler/SkillsBaseSurveyEventHandler";
import { ISurveyMetaData } from "../Survey/ISurveyMetaData";
import { ISurveySpecification } from "../Survey/UI/ISurveySpecification";
import { SkillsSurveySpec } from "../Survey/UI/SkillsSurveySpec";
import { ISurveyBuilder } from "../SurveyBuilder/ISurveyBuilder";
import { SkillsSurveyBuilder } from "../SurveyBuilder/SkillsSurveyBuilder";
import { AbstractSurveyController } from "./AbstractSurveyController";

/**
 * Skills Survey Controller - Manages and coordinates all survey processes
 */
export class SkillsSurveyController extends AbstractSurveyController<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {
    //#region properties
    public readonly dataProvider: ISurveyDataProvider<
        SkillsSurveyQuestionType,
        SkillsSurveyDataElement,
        SkillsSurveyGroupedDataElement
    > = new SkillsSurveyDataProvider("/Survey/SkillsSurvey/");
    protected readonly eventHandler: IBaseSurveyEventHandler<
        SkillsSurveyQuestionType,
        SkillsSurveyDataElement,
        SkillsSurveyGroupedDataElement
    > = new SkillsBaseSurveyEventHandler();
    protected readonly surveyBuilder: ISurveyBuilder<SkillsSurveyQuestionType> =
        new SkillsSurveyBuilder(this.dataProvider);
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

    //#endregion
}
