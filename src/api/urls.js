
// const PREFIX = 'https://neoapi.devrayan.ir/api'

// export default {
//   // احراز هویت
//   authentication: {
//     login: `${PREFIX}/auth`,
//     logout: `${PREFIX}/Authentication/sign-out`,        // نمونه
//     signUp: `${PREFIX}/Authentication/sign-up`,          // نمونه

//   },

//   // Acceptedones
//   acceptedone: {
//     getAll: `${PREFIX}/acceptedone/acceptedones`,
//     create: `${PREFIX}/acceptedone`,
//     getById: (id) => `${PREFIX}/acceptedone/${id}`,
//     updateById: (id) => `${PREFIX}/acceptedone/${id}`,
//     deleteById: (id) => `${PREFIX}/acceptedone/${id}`,
//     properties: `${PREFIX}/acceptedone/properties`,
//     count: `${PREFIX}/acceptedone/count`
//   },

//   // Acceptedonesgroups
//   acceptedonesgroup: {
//     getAll: `${PREFIX}/acceptedonesgroup/acceptedonesgroups`,
//     create: `${PREFIX}/acceptedonesgroup`,
//     getById: (id) => `${PREFIX}/acceptedonesgroup/${id}`,
//     updateById: (id) => `${PREFIX}/acceptedonesgroup/${id}`,
//     deleteById: (id) => `${PREFIX}/acceptedonesgroup/${id}`,
//     properties: `${PREFIX}/acceptedonesgroup/properties`,
//     count: `${PREFIX}/acceptedonesgroup/count`
//   },

//   // Analyzeacceptedlists
//   analyzeacceptedlist: {
//     getAll: `${PREFIX}/analyzeacceptedlist/analyzeacceptedlists`,
//     create: `${PREFIX}/analyzeacceptedlist`,
//     getById: (id) => `${PREFIX}/analyzeacceptedlist/${id}`,
//     updateById: (id) => `${PREFIX}/analyzeacceptedlist/${id}`,
//     deleteById: (id) => `${PREFIX}/analyzeacceptedlist/${id}`,
//     properties: `${PREFIX}/analyzeacceptedlist/properties`,
//     count: `${PREFIX}/analyzeacceptedlist/count`
//   },

//   // Analyzecompetences
//   analyzecompetence: {
//     getAll: `${PREFIX}/analyzecompetence/analyzecompetences`,
//     create: `${PREFIX}/analyzecompetence`,
//     getById: (id) => `${PREFIX}/analyzecompetence/${id}`,
//     updateById: (id) => `${PREFIX}/analyzecompetence/${id}`,
//     deleteById: (id) => `${PREFIX}/analyzecompetence/${id}`,
//     properties: `${PREFIX}/analyzecompetence/properties`,
//     count: `${PREFIX}/analyzecompetence/count`
//   },

//   // Analyzecontents
//   analyzecontent: {
//     getAll: `${PREFIX}/analyzecontent/analyzecontents`,
//     create: `${PREFIX}/analyzecontent`,
//     getById: (id) => `${PREFIX}/analyzecontent/${id}`,
//     updateById: (id) => `${PREFIX}/analyzecontent/${id}`,
//     deleteById: (id) => `${PREFIX}/analyzecontent/${id}`,
//     properties: `${PREFIX}/analyzecontent/properties`,
//     count: `${PREFIX}/analyzecontent/count`
//   },

//   // Analyzedetails
//   analyzedetail: {
//     getAll: `${PREFIX}/analyzedetail/analyzedetails`,
//     create: `${PREFIX}/analyzedetail`,
//     getById: (id) => `${PREFIX}/analyzedetail/${id}`,
//     updateById: (id) => `${PREFIX}/analyzedetail/${id}`,
//     deleteById: (id) => `${PREFIX}/analyzedetail/${id}`,
//     properties: `${PREFIX}/analyzedetail/properties`,
//     count: `${PREFIX}/analyzedetail/count`
//   },
//    analyzematerial: {
//     getAll: `${PREFIX}/analyzematerial/analyzematerials`,
//     create: `${PREFIX}/analyzematerial`,
//     getById: (id) => `${PREFIX}/analyzematerial/${id}`,
//     updateById: (id) => `${PREFIX}/analyzematerial/${id}`,
//     deleteById: (id) => `${PREFIX}/analyzematerial/${id}`,
//     properties: `${PREFIX}/analyzematerial/properties`,
//     count: `${PREFIX}/analyzematerial/count`
//   },

//   analyzeorganizerassign: {
//     getAll: `${PREFIX}/analyzeorganizerassign/analyzeorganizerassigns`,
//     create: `${PREFIX}/analyzeorganizerassign`,
//     getById: (id) => `${PREFIX}/analyzeorganizerassign/${id}`,
//     updateById: (id) => `${PREFIX}/analyzeorganizerassign/${id}`,
//     deleteById: (id) => `${PREFIX}/analyzeorganizerassign/${id}`,
//     properties: `${PREFIX}/analyzeorganizerassign/properties`,
//     count: `${PREFIX}/analyzeorganizerassign/count`
//   },

//   analyzeorganizer: {
//     getAll: `${PREFIX}/analyzeorganizer/analyzeorganizers`,
//     create: `${PREFIX}/analyzeorganizer`,
//     getById: (id) => `${PREFIX}/analyzeorganizer/${id}`,
//     updateById: (id) => `${PREFIX}/analyzeorganizer/${id}`,
//     deleteById: (id) => `${PREFIX}/analyzeorganizer/${id}`,
//     properties: `${PREFIX}/analyzeorganizer/properties`,
//     count: `${PREFIX}/analyzeorganizer/count`
//   },

//   analyzepivot: {
//     getAll: `${PREFIX}/analyzepivot/analyzepivots`,
//     create: `${PREFIX}/analyzepivot`,
//     getById: (id) => `${PREFIX}/analyzepivot/${id}`,
//     updateById: (id) => `${PREFIX}/analyzepivot/${id}`,
//     deleteById: (id) => `${PREFIX}/analyzepivot/${id}`,
//     properties: `${PREFIX}/analyzepivot/properties`,
//     count: `${PREFIX}/analyzepivot/count`
//   },

//   analyzeresult: {
//     getAll: `${PREFIX}/analyzeresult/analyzeresults`,
//     create: `${PREFIX}/analyzeresult`,
//     getById: (id) => `${PREFIX}/analyzeresult/${id}`,
//     updateById: (id) => `${PREFIX}/analyzeresult/${id}`,
//     deleteById: (id) => `${PREFIX}/analyzeresult/${id}`,
//     properties: `${PREFIX}/analyzeresult/properties`,
//     count: `${PREFIX}/analyzeresult/count`
//   },

//   analyze: {
//     getAll: `${PREFIX}/analyze/analyzes`,
//     create: `${PREFIX}/analyze`,
//     getById: (id) => `${PREFIX}/analyze/${id}`,
//     updateById: (id) => `${PREFIX}/analyze/${id}`,
//     deleteById: (id) => `${PREFIX}/analyze/${id}`,
//     properties: `${PREFIX}/analyze/properties`,
//     count: `${PREFIX}/analyze/count`
//   },

//   analyzetool: {
//     getAll: `${PREFIX}/analyzetool/analyzetools`,
//     create: `${PREFIX}/analyzetool`,
//     getById: (id) => `${PREFIX}/analyzetool/${id}`,
//     updateById: (id) => `${PREFIX}/analyzetool/${id}`,
//     deleteById: (id) => `${PREFIX}/analyzetool/${id}`,
//     properties: `${PREFIX}/analyzetool/properties`,
//     count: `${PREFIX}/analyzetool/count`
//   },

//   applicant: {
//     getAll: `${PREFIX}/applicant/applicants`,
//     create: `${PREFIX}/applicant`,
//     getById: (id) => `${PREFIX}/applicant/${id}`,
//     updateById: (id) => `${PREFIX}/applicant/${id}`,
//     deleteById: (id) => `${PREFIX}/applicant/${id}`,
//     properties: `${PREFIX}/applicant/properties`,
//     count: `${PREFIX}/applicant/count`
//   },

//   authgenderquota: {
//     getAll: `${PREFIX}/authgenderquota/authgenderquotas`,
//     create: `${PREFIX}/authgenderquota`,
//     getById: (id) => `${PREFIX}/authgenderquota/${id}`,
//     updateById: (id) => `${PREFIX}/authgenderquota/${id}`,
//     deleteById: (id) => `${PREFIX}/authgenderquota/${id}`,
//     properties: `${PREFIX}/authgenderquota/properties`,
//     count: `${PREFIX}/authgenderquota/count`
//   },

//   authjob: {
//     getAll: `${PREFIX}/authjob/authjobs`,
//     create: `${PREFIX}/authjob`,
//     getById: (id) => `${PREFIX}/authjob/${id}`,
//     updateById: (id) => `${PREFIX}/authjob/${id}`,
//     deleteById: (id) => `${PREFIX}/authjob/${id}`,
//     properties: `${PREFIX}/authjob/properties`,
//     count: `${PREFIX}/authjob/count`
//   },

//   authqg: {
//     getAll: `${PREFIX}/authqg/authqgs`,
//     create: `${PREFIX}/authqg`,
//     getById: (id) => `${PREFIX}/authqg/${id}`,
//     updateById: (id) => `${PREFIX}/authqg/${id}`,
//     deleteById: (id) => `${PREFIX}/authqg/${id}`,
//     properties: `${PREFIX}/authqg/properties`,
//     count: `${PREFIX}/authqg/count`
//   },

//   child: {
//     getAll: `${PREFIX}/child/childrens`,
//     create: `${PREFIX}/child`,
//     getById: (id) => `${PREFIX}/child/${id}`,
//     updateById: (id) => `${PREFIX}/child/${id}`,
//     deleteById: (id) => `${PREFIX}/child/${id}`,
//     properties: `${PREFIX}/child/properties`,
//     count: `${PREFIX}/child/count`
//   },
//     choice: {
//     getAll: "/choice/choices",
//     create: "/choice",
//     getById: (id) => `/choice/${id}`,
//     updateById: (id) => `/choice/${id}`,
//     deleteById: (id) => `/choice/${id}`,
//     properties: "/choice/properties",
//     count: "/choice/count"
//   },

//   contact: {
//     getAll: "/contact/contacts",
//     create: "/contact",
//     getById: (id) => `/contact/${id}`,
//     updateById: (id) => `/contact/${id}`,
//     deleteById: (id) => `/contact/${id}`,
//     properties: "/contact/properties",
//     count: "/contact/count"
//   },

//   documentreview: {
//     getAll: "/documentreview/documentreviews",
//     create: "/documentreview",
//     getById: (id) => `/documentreview/${id}`,
//     updateById: (id) => `/documentreview/${id}`,
//     deleteById: (id) => `/documentreview/${id}`,
//     properties: "/documentreview/properties",
//     count: "/documentreview/count"
//   },

//   document: {
//     getAll: "/document/documents",
//     create: "/document",
//     getById: (id) => `/document/${id}`,
//     updateById: (id) => `/document/${id}`,
//     deleteById: (id) => `/document/${id}`,
//     properties: "/document/properties",
//     count: "/document/count"
//   },

//   documenttype: {
//     getAll: "/documenttype/documenttypes",
//     create: "/documenttype",
//     getById: (id) => `/documenttype/${id}`,
//     updateById: (id) => `/documenttype/${id}`,
//     deleteById: (id) => `/documenttype/${id}`,
//     properties: "/documenttype/properties",
//     count: "/documenttype/count"
//   },

//   dutystatus: {
//     getAll: "/dutystatus/dutystatuses",
//     create: "/dutystatus",
//     getById: (id) => `/dutystatus/${id}`,
//     updateById: (id) => `/dutystatus/${id}`,
//     deleteById: (id) => `/dutystatus/${id}`,
//     properties: "/dutystatus/properties",
//     count: "/dutystatus/count"
//   },

//   educational: {
//     getAll: "/educational/educationals",
//     create: "/educational",
//     getById: (id) => `/educational/${id}`,
//     updateById: (id) => `/educational/${id}`,
//     deleteById: (id) => `/educational/${id}`,
//     properties: "/educational/properties",
//     count: "/educational/count"
//   },

//   evaluation: {
//     getAll: "/evaluation/evaluations",
//     create: "/evaluation",
//     getById: (id) => `/evaluation/${id}`,
//     updateById: (id) => `/evaluation/${id}`,
//     deleteById: (id) => `/evaluation/${id}`,
//     properties: "/evaluation/properties",
//     count: "/evaluation/count"
//   },

//   evaluatorgroup: {
//     getAll: "/evaluatorgroup/evaluatorgroups",
//     create: "/evaluatorgroup",
//     getById: (id) => `/evaluatorgroup/${id}`,
//     updateById: (id) => `/evaluatorgroup/${id}`,
//     deleteById: (id) => `/evaluatorgroup/${id}`,
//     properties: "/evaluatorgroup/properties",
//     count: "/evaluatorgroup/count"
//   },

//   evaluator: {
//     getAll: "/evaluator/evaluators",
//     create: "/evaluator",
//     getById: (id) => `/evaluator/${id}`,
//     updateById: (id) => `/evaluator/${id}`,
//     deleteById: (id) => `/evaluator/${id}`,
//     properties: "/evaluator/properties",
//     count: "/evaluator/count"
//   },

//   event: {
//     getAll: "/event/events",
//     create: "/event",
//     getById: (id) => `/event/${id}`,
//     updateById: (id) => `/event/${id}`,
//     deleteById: (id) => `/event/${id}`,
//     properties: "/event/properties",
//     count: "/event/count"
//   },

//   examlesson: {
//     getAll: "/examlesson/examlessons",
//     create: "/examlesson",
//     getById: (id) => `/examlesson/${id}`,
//     updateById: (id) => `/examlesson/${id}`,
//     deleteById: (id) => `/examlesson/${id}`,
//     properties: "/examlesson/properties",
//     count: "/examlesson/count"
//   },

//   examlessontype: {
//     getAll: "/examlessontype/examlessontypes",
//     create: "/examlessontype",
//     getById: (id) => `/examlessontype/${id}`,
//     updateById: (id) => `/examlessontype/${id}`,
//     deleteById: (id) => `/examlessontype/${id}`,
//     properties: "/examlessontype/properties",
//     count: "/examlessontype/count"
//   },

//   examorganizer: {
//     getAll: "/examorganizer/examorganizers",
//     create: "/examorganizer",
//     getById: (id) => `/examorganizer/${id}`,
//     updateById: (id) => `/examorganizer/${id}`,
//     deleteById: (id) => `/examorganizer/${id}`,
//     properties: "/examorganizer/properties",
//     count: "/examorganizer/count"
//   },

//   examresultfile: {
//     getAll: "/examresultfile/examresultfiles",
//     create: "/examresultfile",
//     getById: (id) => `/examresultfile/${id}`,
//     updateById: (id) => `/examresultfile/${id}`,
//     deleteById: (id) => `/examresultfile/${id}`,
//     properties: "/examresultfile/properties",
//     count: "/examresultfile/count"
//   },

//   exam: {
//     getAll: "/exam/exams",
//     create: "/exam",
//     getById: (id) => `/exam/${id}`,
//     updateById: (id) => `/exam/${id}`,
//     deleteById: (id) => `/exam/${id}`,
//     properties: "/exam/properties",
//     count: "/exam/count"
//   },

//   examstatus: {
//     getAll: "/examstatus/examstatuses",
//     create: "/examstatus",
//     getById: (id) => `/examstatus/${id}`,
//     updateById: (id) => `/examstatus/${id}`,
//     deleteById: (id) => `/examstatus/${id}`,
//     properties: "/examstatus/properties",
//     count: "/examstatus/count"
//   },

//   examtype: {
//     getAll: "/examtype/examtypes",
//     create: "/examtype",
//     getById: (id) => `/examtype/${id}`,
//     updateById: (id) => `/examtype/${id}`,
//     deleteById: (id) => `/examtype/${id}`,
//     properties: "/examtype/properties",
//     count: "/examtype/count"
//   },

//   examzone: {
//     getAll: "/examzone/examzones",
//     create: "/examzone",
//     getById: (id) => `/examzone/${id}`,
//     updateById: (id) => `/examzone/${id}`,
//     deleteById: (id) => `/examzone/${id}`,
//     properties: "/examzone/properties",
//     count: "/examzone/count"
//   },

//   executeanalyze: {
//     getAll: "/executeanalyze/executeanalyzes",
//     create: "/executeanalyze",
//     getById: (id) => `/executeanalyze/${id}`,
//     updateById: (id) => `/executeanalyze/${id}`,
//     deleteById: (id) => `/executeanalyze/${id}`,
//     properties: "/executeanalyze/properties",
//     count: "/executeanalyze/count"
//   },

//   executeevaluation: {
//     getAll: "/executeevaluation/executeevaluations",
//     create: "/executeevaluation",
//     getById: (id) => `/executeevaluation/${id}`,
//     updateById: (id) => `/executeevaluation/${id}`,
//     deleteById: (id) => `/executeevaluation/${id}`,
//     properties: "/executeevaluation/properties",
//     count: "/executeevaluation/count"
//   },

//   executivebody: {
//     getAll: "/executivebody/executivebodies",
//     create: "/executivebody",
//     getById: (id) => `/executivebody/${id}`,
//     updateById: (id) => `/executivebody/${id}`,
//     deleteById: (id) => `/executivebody/${id}`,
//     properties: "/executivebody/properties",
//     count: "/executivebody/count"
//   },

//   fielddetail: {
//     getAll: "/fielddetail/fielddetails",
//     create: "/fielddetail",
//     getById: (id) => `/fielddetail/${id}`,
//     updateById: (id) => `/fielddetail/${id}`,
//     deleteById: (id) => `/fielddetail/${id}`,
//     properties: "/fielddetail/properties",
//     count: "/fielddetail/count"
//   },

//   field: {
//     getAll: "/field/fields",
//     create: "/field",
//     getById: (id) => `/field/${id}`,
//     updateById: (id) => `/field/${id}`,
//     deleteById: (id) => `/field/${id}`,
//     properties: "/field/properties",
//     count: "/field/count"
//   },

//   file: {
//     getAll: "/file/files",
//     create: "/file",
//     getById: (id) => `/file/${id}`,
//     updateById: (id) => `/file/${id}`,
//     deleteById: (id) => `/file/${id}`,
//     properties: "/file/properties",
//     count: "/file/count"
//   },

//   gender: {
//     getAll: "/gender/genders",
//     create: "/gender",
//     getById: (id) => `/gender/${id}`,
//     updateById: (id) => `/gender/${id}`,
//     deleteById: (id) => `/gender/${id}`,
//     properties: "/gender/properties",
//     count: "/gender/count"
//   },

//   geography: {
//     getAll: "/geography/geographies",
//     create: "/geography",
//     getById: (id) => `/geography/${id}`,
//     updateById: (id) => `/geography/${id}`,
//     deleteById: (id) => `/geography/${id}`,
//     properties: "/geography/properties",
//     count: "/geography/count"
//   },
//     grades: {
//     getAll: "/grade/grades",
//     create: "/grade",
//     getById: (id) => `/grade/${id}`,
//     updateById: (id) => `/grade/${id}`,
//     deleteById: (id) => `/grade/${id}`,
//     properties: "/grade/properties",
//     count: "/grade/count",
//   },
//   hiretypes: {
//     getAll: "/hiretype/hiretypes",
//     create: "/hiretype",
//     getById: (id) => `/hiretype/${id}`,
//     updateById: (id) => `/hiretype/${id}`,
//     deleteById: (id) => `/hiretype/${id}`,
//     properties: "/hiretype/properties",
//     count: "/hiretype/count",
//   },
//   jobduties: {
//     getAll: "/jobduty/jobduties",
//     create: "/jobduty",
//     getById: (id) => `/jobduty/${id}`,
//     updateById: (id) => `/jobduty/${id}`,
//     deleteById: (id) => `/jobduty/${id}`,
//     properties: "/jobduty/properties",
//     count: "/jobduty/count",
//   },
//   joblessons: {
//     getAll: "/joblesson/joblessons",
//     create: "/joblesson",
//     getById: (id) => `/joblesson/${id}`,
//     updateById: (id) => `/joblesson/${id}`,
//     deleteById: (id) => `/joblesson/${id}`,
//     properties: "/joblesson/properties",
//     count: "/joblesson/count",
//   },
//   joblocations: {
//     getAll: "/joblocation/joblocations",
//     create: "/joblocation",
//     getById: (id) => `/joblocation/${id}`,
//     updateById: (id) => `/joblocation/${id}`,
//     deleteById: (id) => `/joblocation/${id}`,
//     properties: "/joblocation/properties",
//     count: "/joblocation/count",
//   },
//   jobs: {
//     getAll: "/job/jobs",
//     create: "/job",
//     getById: (id) => `/job/${id}`,
//     updateById: (id) => `/job/${id}`,
//     deleteById: (id) => `/job/${id}`,
//     properties: "/job/properties",
//     count: "/job/count",
//   },
//   lessons: {
//     getAll: "/lesson/lessons",
//     create: "/lesson",
//     getById: (id) => `/lesson/${id}`,
//     updateById: (id) => `/lesson/${id}`,
//     deleteById: (id) => `/lesson/${id}`,
//     properties: "/lesson/properties",
//     count: "/lesson/count",
//   },
//   lessontypes: {
//     getAll: "/lessontype/lessontypes",
//     create: "/lessontype",
//     getById: (id) => `/lessontype/${id}`,
//     updateById: (id) => `/lessontype/${id}`,
//     deleteById: (id) => `/lessontype/${id}`,
//     properties: "/lessontype/properties",
//     count: "/lessontype/count",
//   },
//   marriages: {
//     getAll: "/marriage/marriages",
//     create: "/marriage",
//     getById: (id) => `/marriage/${id}`,
//     updateById: (id) => `/marriage/${id}`,
//     deleteById: (id) => `/marriage/${id}`,
//     properties: "/marriage/properties",
//     count: "/marriage/count",
//   },
//   masterlessons: {
//     getAll: "/masterlesson/masterlessons",
//     create: "/masterlesson",
//     getById: (id) => `/masterlesson/${id}`,
//     updateById: (id) => `/masterlesson/${id}`,
//     deleteById: (id) => `/masterlesson/${id}`,
//     properties: "/masterlesson/properties",
//     count: "/masterlesson/count",
//   },
//   masters: {
//     getAll: "/master/masters",
//     create: "/master",
//     getById: (id) => `/master/${id}`,
//     updateById: (id) => `/master/${id}`,
//     deleteById: (id) => `/master/${id}`,
//     properties: "/master/properties",
//     count: "/master/count",
//   },
//   menuItems: {
//     getAll: "/MenuItem/MenuItems",
//     create: "/MenuItem",
//     getById: (id) => `/MenuItem/${id}`,
//     updateById: (id) => `/MenuItem/${id}`,
//     deleteById: (id) => `/MenuItem/${id}`,
//     properties: "/MenuItem/properties",
//     count: "/MenuItem/count",
//   },
//   messages: {
//     getAll: "/message/messages",
//     create: "/message",
//     getById: (id) => `/message/${id}`,
//     updateById: (id) => `/message/${id}`,
//     deleteById: (id) => `/message/${id}`,
//     properties: "/message/properties",
//     count: "/message/count",
//   },
//   organizeevaluations: {
//     getAll: "/organizeevaluation/organizeevaluations",
//     create: "/organizeevaluation",
//     getById: (id) => `/organizeevaluation/${id}`,
//     updateById: (id) => `/organizeevaluation/${id}`,
//     deleteById: (id) => `/organizeevaluation/${id}`,
//     properties: "/organizeevaluation/properties",
//     count: "/organizeevaluation/count",
//   },
//   organizeroperators: {
//     getAll: "/organizeroperator/organizeroperators",
//     create: "/organizeroperator",
//     getById: (id) => `/organizeroperator/${id}`,
//     updateById: (id) => `/organizeroperator/${id}`,
//     deleteById: (id) => `/organizeroperator/${id}`,
//     properties: "/organizeroperator/properties",
//     count: "/organizeroperator/count",
//   },
//   organizeroperatortypes: {
//     getAll: "/organizeroperatortype/organizeroperatortypes",
//     create: "/organizeroperatortype",
//     getById: (id) => `/organizeroperatortype/${id}`,
//     updateById: (id) => `/organizeroperatortype/${id}`,
//     deleteById: (id) => `/organizeroperatortype/${id}`,
//     properties: "/organizeroperatortype/properties",
//     count: "/organizeroperatortype/count",
//   },
//   organizers: {
//     getAll: "/organizer/organizers",
//     create: "/organizer",
//     getById: (id) => `/organizer/${id}`,
//     updateById: (id) => `/organizer/${id}`,
//     deleteById: (id) => `/organizer/${id}`,
//     properties: "/organizer/properties",
//     count: "/organizer/count",
//   },
//   organizerzones: {
//     getAll: "/organizerzone/organizerzones",
//     create: "/organizerzone",
//     getById: (id) => `/organizerzone/${id}`,
//     updateById: (id) => `/organizerzone/${id}`,
//     deleteById: (id) => `/organizerzone/${id}`,
//     properties: "/organizerzone/properties",
//     count: "/organizerzone/count",
//   },
//   organizingassessments: {
//     getAll: "/organizingassessment/organizingassessments",
//     create: "/organizingassessment",
//     getById: (id) => `/organizingassessment/${id}`,
//     updateById: (id) => `/organizingassessment/${id}`,
//     deleteById: (id) => `/organizingassessment/${id}`,
//     properties: "/organizingassessment/properties",
//     count: "/organizingassessment/count",
//   },
//     organizingselections: {
//     getAll: "/organizingselection/organizingselections",
//     create: "/organizingselection",
//     getById: (id) => `/organizingselection/${id}`,
//     updateById: (id) => `/organizingselection/${id}`,
//     deleteById: (id) => `/organizingselection/${id}`,
//     properties: "/organizingselection/properties",
//     count: "/organizingselection/count",
//   },
//   performancelevels: {
//     getAll: "/performancelevel/performancelevels",
//     create: "/performancelevel",
//     getById: (id) => `/performancelevel/${id}`,
//     updateById: (id) => `/performancelevel/${id}`,
//     deleteById: (id) => `/performancelevel/${id}`,
//     properties: "/performancelevel/properties",
//     count: "/performancelevel/count",
//   },
//   permissionexams: {
//     getAll: "/permissionexam/permissionexams",
//     create: "/permissionexam",
//     getById: (id) => `/permissionexam/${id}`,
//     updateById: (id) => `/permissionexam/${id}`,
//     deleteById: (id) => `/permissionexam/${id}`,
//     properties: "/permissionexam/properties",
//     count: "/permissionexam/count",
//   },
//   permissions: {
//     getAll: "/permission/permissions",
//     create: "/permission",
//     getById: (id) => `/permission/${id}`,
//     updateById: (id) => `/permission/${id}`,
//     deleteById: (id) => `/permission/${id}`,
//     properties: "/permission/properties",
//     count: "/permission/count",
//   },
//   posts: {
//     getAll: "/post/posts",
//     create: "/post",
//     getById: (id) => `/post/${id}`,
//     updateById: (id) => `/post/${id}`,
//     deleteById: (id) => `/post/${id}`,
//     properties: "/post/properties",
//     count: "/post/count",
//   },
//   pregisterdocuments: {
//     getAll: "/pregisterdocument/pregisterdocuments",
//     create: "/pregisterdocument",
//     getById: (id) => `/pregisterdocument/${id}`,
//     updateById: (id) => `/pregisterdocument/${id}`,
//     deleteById: (id) => `/pregisterdocument/${id}`,
//     properties: "/pregisterdocument/properties",
//     count: "/pregisterdocument/count",
//   },
//   preregisters: {
//     getAll: "/preregister/preregisters",
//     create: "/preregister",
//     getById: (id) => `/preregister/${id}`,
//     updateById: (id) => `/preregister/${id}`,
//     deleteById: (id) => `/preregister/${id}`,
//     properties: "/preregister/properties",
//     count: "/preregister/count",
//   },
//   profiles: {
//     getAll: "/profile/profiles",
//     create: "/profile",
//     getById: (id) => `/profile/${id}`,
//     updateById: (id) => `/profile/${id}`,
//     deleteById: (id) => `/profile/${id}`,
//     properties: "/profile/properties",
//     count: "/profile/count",
//   },
//   qualificationprofessionalorganizeroperators: {
//     getAll: "/qualificationprofessionalorganizeroperator/qualificationprofessionalorganizeroperators",
//     create: "/qualificationprofessionalorganizeroperator",
//     getById: (id) => `/qualificationprofessionalorganizeroperator/${id}`,
//     updateById: (id) => `/qualificationprofessionalorganizeroperator/${id}`,
//     deleteById: (id) => `/qualificationprofessionalorganizeroperator/${id}`,
//     properties: "/qualificationprofessionalorganizeroperator/properties",
//     count: "/qualificationprofessionalorganizeroperator/count",
//   },
//   qualificationprofessionalorganizers: {
//     getAll: "/qualificationprofessionalorganizer/qualificationprofessionalorganizers",
//     create: "/qualificationprofessionalorganizer",
//     getById: (id) => `/qualificationprofessionalorganizer/${id}`,
//     updateById: (id) => `/qualificationprofessionalorganizer/${id}`,
//     deleteById: (id) => `/qualificationprofessionalorganizer/${id}`,
//     properties: "/qualificationprofessionalorganizer/properties",
//     count: "/qualificationprofessionalorganizer/count",
//   },
//   questions: {
//     getAll: "/question/questions",
//     create: "/question",
//     getById: (id) => `/question/${id}`,
//     updateById: (id) => `/question/${id}`,
//     deleteById: (id) => `/question/${id}`,
//     properties: "/question/properties",
//     count: "/question/count",
//   },
//   quotas: {
//     getAll: "/quota/quotas",
//     create: "/quota",
//     getById: (id) => `/quota/${id}`,
//     updateById: (id) => `/quota/${id}`,
//     deleteById: (id) => `/quota/${id}`,
//     properties: "/quota/properties",
//     count: "/quota/count",
//   },
//   records: {
//     getAll: "/record/records",
//     create: "/record",
//     getById: (id) => `/record/${id}`,
//     updateById: (id) => `/record/${id}`,
//     deleteById: (id) => `/record/${id}`,
//     properties: "/record/properties",
//     count: "/record/count",
//   },
//   religions: {
//     getAll: "/religion/religions",
//     create: "/religion",
//     getById: (id) => `/religion/${id}`,
//     updateById: (id) => `/religion/${id}`,
//     deleteById: (id) => `/religion/${id}`,
//     properties: "/religion/properties",
//     count: "/religion/count",
//   },
//     requests: {
//     getAll: () => '/request/requests',
//     create: () => '/request',
//     getById: (id) => `/request/${id}`,
//     update: (id) => `/request/${id}`,
//     delete: (id) => `/request/${id}`,
//     getProperties: () => '/request/properties',
//     getCount: () => '/request/count',
//   },

//   requeststatuses: {
//     getAll: () => '/requeststatus/requeststatuses',
//     create: () => '/requeststatus',
//     getById: (id) => `/requeststatus/${id}`,
//     update: (id) => `/requeststatus/${id}`,
//     delete: (id) => `/requeststatus/${id}`,
//     getProperties: () => '/requeststatus/properties',
//     getCount: () => '/requeststatus/count',
//   },

//   resultanalyzedetails: {
//     getAll: () => '/resultanalyzedetail/resultanalyzedetails',
//     create: () => '/resultanalyzedetail',
//     getById: (id) => `/resultanalyzedetail/${id}`,
//     update: (id) => `/resultanalyzedetail/${id}`,
//     delete: (id) => `/resultanalyzedetail/${id}`,
//     getProperties: () => '/resultanalyzedetail/properties',
//     getCount: () => '/resultanalyzedetail/count',
//   },

//   resultanalyzes: {
//     getAll: () => '/resultanalyze/resultanalyzes',
//     create: () => '/resultanalyze',
//     getById: (id) => `/resultanalyze/${id}`,
//     update: (id) => `/resultanalyze/${id}`,
//     delete: (id) => `/resultanalyze/${id}`,
//     getProperties: () => '/resultanalyze/properties',
//     getCount: () => '/resultanalyze/count',
//   },

//   resultexams: {
//     getAll: () => '/resultexam/resultexams',
//     create: () => '/resultexam',
//     getById: (id) => `/resultexam/${id}`,
//     update: (id) => `/resultexam/${id}`,
//     delete: (id) => `/resultexam/${id}`,
//     getProperties: () => '/resultexam/properties',
//     getCount: () => '/resultexam/count',
//   },

//   resultexamstatuses: {
//     getAll: () => '/resultexamstatus/resultexamstatuses',
//     create: () => '/resultexamstatus',
//     getById: (id) => `/resultexamstatus/${id}`,
//     update: (id) => `/resultexamstatus/${id}`,
//     delete: (id) => `/resultexamstatus/${id}`,
//     getProperties: () => '/resultexamstatus/properties',
//     getCount: () => '/resultexamstatus/count',
//   },

//   resultselections: {
//     getAll: () => '/resultselection/resultselections',
//     create: () => '/resultselection',
//     getById: (id) => `/resultselection/${id}`,
//     update: (id) => `/resultselection/${id}`,
//     delete: (id) => `/resultselection/${id}`,
//     getProperties: () => '/resultselection/properties',
//     getCount: () => '/resultselection/count',
//   },

//   resultselectionstatuses: {
//     getAll: () => '/resultselectionstatus/resultselectionstatuses',
//     create: () => '/resultselectionstatus',
//     getById: (id) => `/resultselectionstatus/${id}`,
//     update: (id) => `/resultselectionstatus/${id}`,
//     delete: (id) => `/resultselectionstatus/${id}`,
//     getProperties: () => '/resultselectionstatus/properties',
//     getCount: () => '/resultselectionstatus/count',
//   },

//   reviewdocuments: {
//     getAll: () => '/reviewdocument/reviewdocuments',
//     create: () => '/reviewdocument',
//     getById: (id) => `/reviewdocument/${id}`,
//     update: (id) => `/reviewdocument/${id}`,
//     delete: (id) => `/reviewdocument/${id}`,
//     getProperties: () => '/reviewdocument/properties',
//     getCount: () => '/reviewdocument/count',
//   },

//   roles: {
//     getAll: () => '/role/roles',
//     create: () => '/role',
//     getById: (id) => `/role/${id}`,
//     update: (id) => `/role/${id}`,
//     delete: (id) => `/role/${id}`,
//     getProperties: () => '/role/properties',
//     getCount: () => '/role/count',
//   },

//   selectionlists: {
//     getAll: () => '/selectionlist/selectionlists',
//     create: () => '/selectionlist',
//     getById: (id) => `/selectionlist/${id}`,
//     update: (id) => `/selectionlist/${id}`,
//     delete: (id) => `/selectionlist/${id}`,
//     getProperties: () => '/selectionlist/properties',
//     getCount: () => '/selectionlist/count',
//   },

//   selectionresults: {
//     getAll: () => '/selectionresult/selectionresults',
//     create: () => '/selectionresult',
//     getById: (id) => `/selectionresult/${id}`,
//     update: (id) => `/selectionresult/${id}`,
//     delete: (id) => `/selectionresult/${id}`,
//     getProperties: () => '/selectionresult/properties',
//     getCount: () => '/selectionresult/count',
//   },

//   selectionstatuses: {
//     getAll: () => '/selectionstatus/selectionstatuses',
//     create: () => '/selectionstatus',
//     getById: (id) => `/selectionstatus/${id}`,
//     update: (id) => `/selectionstatus/${id}`,
//     delete: (id) => `/selectionstatus/${id}`,
//     getProperties: () => '/selectionstatus/properties',
//     getCount: () => '/selectionstatus/count',
//   },

//   subrequests: {
//     getAll: () => '/subrequest/subrequests',
//     create: () => '/subrequest',
//     getById: (id) => `/subrequest/${id}`,
//     update: (id) => `/subrequest/${id}`,
//     delete: (id) => `/subrequest/${id}`,
//     getProperties: () => '/subrequest/properties',
//     getCount: () => '/subrequest/count',
//   },

//   universities: {
//     getAll: () => '/university/universities',
//     create: () => '/university',
//     getById: (id) => `/university/${id}`,
//     update: (id) => `/university/${id}`,
//     delete: (id) => `/university/${id}`,
//     getProperties: () => '/university/properties',
//     getCount: () => '/university/count',
//   },

//   universitytypes: {
//     getAll: () => '/universitytype/universitytypes',
//     create: () => '/universitytype',
//     getById: (id) => `/universitytype/${id}`,
//     update: (id) => `/universitytype/${id}`,
//     delete: (id) => `/universitytype/${id}`,
//     getProperties: () => '/universitytype/properties',
//     getCount: () => '/universitytype/count',
//   },

//   uploadevaluations: {
//     getAll: () => '/uploadevaluation/uploadevaluations',
//     create: () => '/uploadevaluation',
//     getById: (id) => `/uploadevaluation/${id}`,
//     update: (id) => `/uploadevaluation/${id}`,
//     delete: (id) => `/uploadevaluation/${id}`,
//     getProperties: () => '/uploadevaluation/properties',
//     getCount: () => '/uploadevaluation/count',
//   },

//   uploads: {
//     getAll: () => '/upload/uploads',
//     create: () => '/upload',
//     getById: (id) => `/upload/${id}`,
//     update: (id) => `/upload/${id}`,
//     delete: (id) => `/upload/${id}`,
//     getProperties: () => '/upload/properties',
//     getCount: () => '/upload/count',
//   },

//   userranks: {
//     getAll: () => '/userrank/userranks',
//     create: () => '/userrank',
//     getById: (id) => `/userrank/${id}`,
//     update: (id) => `/userrank/${id}`,
//     delete: (id) => `/userrank/${id}`,
//     getProperties: () => '/userrank/properties',
//     getCount: () => '/userrank/count',
//   },

//   users: {
//     getAll: () => '/user/users',
//     create: () => '/user',
//     getById: (id) => `/user/${id}`,
//     update: (id) => `/user/${id}`,
//     delete: (id) => `/user/${id}`,
//     getProperties: () => '/user/properties',
//     getCount: () => '/user/count',
//   },

//   zones: {
//     getAll: () => '/zone/zones',
//     create: () => '/zone',
//     getById: (id) => `/zone/${id}`,
//     update: (id) => `/zone/${id}`,
//     delete: (id) => `/zone/${id}`,
//     getProperties: () => '/zone/properties',
//     getCount: () => '/zone/count',
//   },

//   utility: {
//     getCurrentUserInfo: () => '/getme',
//   }
// }
