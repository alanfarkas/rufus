Survey.StylesManager.applyTheme("darkblue");

//Add 'popupdescription' text property into all questions types and into page
Survey.Serializer.addProperty("question", "popupdescription:text");
Survey.Serializer.addProperty("page", "popupdescription:text");

//Add 'popuptitle' text property into all questions types and into page
Survey.Serializer.addProperty("question", "popuptitle:text");
Survey.Serializer.addProperty("page", "popuptitle:text");
function showDescription(element) {
    document.getElementById("questionDescriptionText").innerHTML =
        element.popupdescription;
    var title = element.popuptitle;
    if (typeof title === "undefined") {
        title = "More Info";
    }
    document.getElementById("popupTitle").innerHTML = title;
    $("#questionDescriptionPopup").modal();
}

var json = {
    title: "Software developer survey.",
    pages: [
        {
            title: "What operating system do you use?",
            popupdescription:
                "Select the operating system you are currently using.",
            popuptitle: "OS Definition",
            questions: [
                {
                    type: "checkbox",
                    name: "opSystem",
                    title: "OS",
                    popuptitle: "OS Selection",
                    hasOther: true,
                    isRequired: true,
                    popupdescription:
                        "If you do not use any of the listed operating system, please select 'others' and type your operating system name.",
                    choices: ["Windows", "Linux", "Macintosh OSX"],
                },
            ],
        },
        {
            title: "What language(s) are you currently using?",
            popuptitle: "Language Selection",
            popupdescription:
                "Select all programming languages you have been using for the last six months.",
            questions: [
                {
                    type: "checkbox",
                    name: "langs",
                    title: "Please select from the list",
                    popupdescription:
                        "Select all programming languages you have been using for the last six months.",
                    popuptitle: "Language Selection",
                    colCount: 4,
                    isRequired: true,
                    choices: [
                        "Javascript",
                        "Java",
                        "Python",
                        "CSS",
                        "PHP",
                        "Ruby",
                        "C++",
                        "C",
                        "Shell",
                        "C#",
                        "Objective-C",
                        "R",
                        "VimL",
                        "Go",
                        "Perl",
                        "CoffeeScript",
                        "TeX",
                        "Swift",
                        "Scala",
                        "Emacs Lisp",
                        "Haskell",
                        "Lua",
                        "Clojure",
                        "Matlab",
                        "Arduino",
                        "Makefile",
                        "Groovy",
                        "Puppet",
                        "Rust",
                        "PowerShell",
                    ],
                },
            ],
        },
        {
            title: "Please enter your name and e-mail",
            popupdescription:
                "We will not share this information with any third-party organization.",
            popuptitle: "Email Disclaimer",
            questions: [
                {
                    type: "text",
                    name: "name",
                    title: "Name:",
                    popupdescription:
                        "Please, type your name as 'Given Name' 'Family Name'.",
                },
                {
                    type: "text",
                    name: "email",
                    title: "Your e-mail",
                    popupdescription:
                        "Please, make sure you do not misspell your e-mail.",
                },
            ],
        },
    ],
};

window.surveyModel = new Survey.Model(json);

surveyModel.onComplete.add(function (result) {
    document.querySelector("#surveyResult").textContent =
        "Result JSON:\n" + JSON.stringify(result.data, null, 3);
});

surveyModel.onAfterRenderQuestion.add(function (survey, options) {
    //Return if there is no description to show in popup
    if (!options.question.popupdescription) return;

    //Add a button;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-info btn-xs";
    btn.innerHTML = "More Info";
    var question = options.question;
    btn.onclick = function () {
        showDescription(question);
    };
    var header = options.htmlElement.querySelector("h5");
    var span = document.createElement("span");
    span.innerHTML = "  ";
    header.appendChild(span);
    header.appendChild(btn);
});

surveyModel.onAfterRenderPage.add(function (survey, options) {
    //Return if there is no description to show in popup
    if (!options.page.popupdescription) return;

    //Add a button;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-info btn-xs";
    btn.innerHTML = "More Info";
    btn.onclick = function () {
        showDescription(survey.currentPage);
    };
    var header = options.htmlElement.querySelector("h4");
    var span = document.createElement("span");
    span.innerHTML = "  ";
    header.appendChild(span);
    header.appendChild(btn);
});
$("#surveyElement").Survey({ model: surveyModel });
