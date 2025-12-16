// The provided course information.

// {
//     "id": number,
//     "name": string,
// }
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};


// The provided assignment group.

// {
//     "id": number,
//     "name": string,
//     // the ID of the course the assignment group belongs to
//     "course_id": number,
//     // the percentage weight of the entire assignment group
//     "group_weight": number,
//     "assignments": [
//         {
//             "id": number,
//             "name": string,
//             // the due date for the assignment
//             "due_at": Date string,
//             // the maximum points possible for the assignment
//             "points_possible": number,
//         }
//     ],
// }

const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};


// The provided learner submission data.

// {
//     "learner_id": number,
//     "assignment_id": number,
//     "submission": {
//         "submitted_at": Date string,
//         "score": number
//     }
// }
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];





function getLearnerData(course, ag, submissions) {
    try {
        // here, we would process this data to achieve the desired result.
        if (course.id != ag.course_id)
            throw new Error("Error: Input was invalid. AssignmentGroup does not belong to its course (mismatching course_id).");

        let results = {}
        let output = []

        for (let i in submissions) { // looping through student submissions
            let s = submissions[i];

            let assignment = null;
            for (let a in ag.assignments) { // finding matching assignment
                if (ag.assignments[a].id === s.assignment_id) {
                    assignment = ag.assignments[a];
                    break;
                }
            }

            if (!assignment)
                continue;

            if (new Date(assignment.due_at) > new Date())
                continue;

            let possible = Number(assignment.points_possible);
            if (possible <= 0)
                continue;

            let score = Number(s.submission.score);
            if (new Date(s.submission.submitted_at) > new Date(assignment.due_at)) {
                score = score - possible * 0.1;
                if (score < 0)
                    score = 0;
            }

            let percent = score / possible;

            if (!results[s.learner_id]) {
                results[s.learner_id] = {
                    id: s.learner_id,
                    totalScore: 0,
                    totalPossible: 0
                };
            }

            results[s.learner_id][s.assignment_id] = percent;

            results[s.learner_id].totalScore += score;
            results[s.learner_id].totalPossible += possible;
        }

        for (let k in results) {
            results[k].avg = results[k].totalScore / results[k].totalPossible;
            delete results[k].totalScore;
            delete results[k].totalPossible;
            output.push(results[k]);
        }


        //   const result = [
        //     {
        //       id: 125,
        //       avg: 0.985, // (47 + 150) / (50 + 150)
        //       1: 0.94, // 47 / 50
        //       2: 1.0 // 150 / 150
        //     },
        //     {
        //       id: 132,
        //       avg: 0.82, // (39 + 125) / (50 + 150)
        //       1: 0.78, // 39 / 50
        //       2: 0.833 // late: (140 - 15) / 150
        //     }
        //   ];

        return output;
    } catch (err) {
        console.log(err)
    }

}


const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
