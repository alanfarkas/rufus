import { ISurveyDataProvider } from "../../Data/ISurveyDataProvider";
import { IPageProperties } from "../../PageBuilder/IPageProperties";
import { QuestionSelectionRefreshSpec } from "./QuestionSelectionRefreshSpec";

/**
 * Question Builder Initialization Object
 */
export class QuestionBuilderSettings<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> {
    //#region properties
    public dataProvider: ISurveyDataProvider<
        TQuestionType,
        TDataElement,
        TGroupedDataElement
    >;
    public pageProperties: IPageProperties<TQuestionType>;
    public propertyBag: Record<string, any>;
    public questionContainerName: string;
    public questionName: string;
    public questionType: TQuestionType;
    public readonly selectionRefreshSpecs: Array<
        QuestionSelectionRefreshSpec<TDataElement>
    > = [];
    //#endregion

    //#region constructor
    public constructor(
        questionType?: TQuestionType,
        dataProvider?: ISurveyDataProvider<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >,
        pageProperties?: IPageProperties<TQuestionType>
    );
    public constructor(
        questionType: TQuestionType,
        dataProvider: ISurveyDataProvider<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >,
        pageProperties: IPageProperties<TQuestionType>,
        questionName: string,
        questionContainerName: string,
        refreshItems?: QuestionSelectionRefreshSpec<TDataElement>[],
        propertyBag?: Record<string, any>
    );
    public constructor(...myarray: any[]) {
        if (myarray.length > 0) {
            // QuestionBuilderInit(questionType)
            this.questionType = myarray[0];
        }
        if (myarray.length > 1) {
            // QuestionBuilderInit(questionType, dataProvider)
            this.dataProvider = myarray[1];
        }
        if (myarray.length > 2) {
            // QuestionBuilderInit(questionType, dataProvider, pageProperties)
            this.pageProperties = myarray[2];
        }
        if (myarray.length > 3) {
            // QuestionBuilderInit(questionType, dataProvider, pageProperties, questionName, questionContainerName)
            this.questionName = myarray[3];
            this.questionContainerName = myarray[4];
        }
        if (myarray.length > 5) {
            // QuestionBuilderInit(questionType, dataProvider, pageProperties, questionName, questionContainerName,
            //     refreshSpecs)
            this.selectionRefreshSpecs = myarray[5] || [];
        }
        if (myarray.length > 6) {
            // QuestionBuilderInit(questionType, dataProvider, pageProperties, questionName, questionContainerName,
            //     refreshItems, propertyBag)
            this.propertyBag = myarray[6];
        }
    }
    //#endregion

    //#region methods
    /**
     * Add a new question selection refresh specification.
     *
     * @param dataElement Data element contained in selection list
     * @param questionName Name of survey question (defaults to 'questionName' property). Used when a survey question
     * is broken out into multiple sub-questions.
     * @param questionContainerName Name of question container object (defaults to 'questionContainerName' property).
     * Used when a survey question is broken out into multiple sub-questions.
     */
    public addSelectionRefreshSpec(
        dataElement: TDataElement,
        questionName: string = this.questionName,
        questionContainerName: string = this.questionContainerName
    ): void {
        this.selectionRefreshSpecs.push(
            new QuestionSelectionRefreshSpec(
                questionName,
                questionContainerName,
                dataElement
            )
        );
    }
    //#endregion
}
