/**
 * Survey Page Custom Properties Interface
 */
export interface IPageProperties<TQuestionType> {
    readonly pageName: string;
    readonly pageSelectorTitle: string;
    readonly pageQuestionTypes: TQuestionType[];
}
