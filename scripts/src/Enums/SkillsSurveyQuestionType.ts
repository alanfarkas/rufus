/**
 * Skills Survey Question Type - Each element represents a unique Survey question
 */
export enum SkillsSurveyQuestionType {
    // All new entries should be added in alphabetical order. The enum element name is irrelevant, however the value
    // must match the corresponding 'SurveyQuestionType' member in the Skills Tracker Web application.
    //
    // When adding a new Skills Survey Question Type also:
    //
    //  1) Create a corresponding 'QuestionBuilder'
    //  2) Add a corresponding 'case' statement in the 'SkillsQuestionBuilderFactory' class.

    // Format: [SurveySurveyQuestionType] = [Value] (Value must match SurveyQuestionType member in SkillsTracker app)
    AdditionalInfo = "AdditionalInfo",
    Certification = "Certification",
    DIJurisdiction = "DIJurisdiction",
    Education = "Education",
    EngagementRole = "EngagementRole",
    IndustryExperience = "IndustryExperience",
    IndustryManufacturing = "IndustryManufacturingExperience",
    InterimMgmt = "InterimMgmt",
    Language = "Language",
    Manufacturing = "ManufacturingExperience",
    SecurityClearance = "SecurityClearance",
    SoftwareTool = "SoftwareTool",
    SolutionIndustry = "SolutionIndustry",
    SolutionSkills = "SolutionSkills",
    Sourcing = "SourcingCategory",
    WorkExperience = "WorkExperience",
}
