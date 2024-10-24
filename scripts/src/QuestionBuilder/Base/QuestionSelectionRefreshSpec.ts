/**
 * Question Selection Refresh Item - Provides the information needed to dynamically refresh the selections on a given
 * survey question.
 *
 * The questionName and questionContainerName fields are typically used when a survey question is broken out into
 * multiple sub-questions.
 */
export class QuestionSelectionRefreshSpec<TDataElement> {
    constructor(
        public readonly questionName: string,
        public readonly questionContainerName: string,
        public readonly dataElement: TDataElement
    ) {}
}
