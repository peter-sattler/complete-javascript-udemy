/////////////////////////////
// Lecture: Closures

/* WITHOUT CLOSURES
function interviewQuestion(job) {
    if (job === 'designer') {
        return function(name) {
            console.log(name + ', can you please explain what UX design is?');
        }
    } else if (job === 'teacher') {
        return function(name) {
            console.log('What subject do you teach, ' + name + '?');
        }
    } else {
        return function(name) {
            console.log('Hello ' + name + ', what do you do?');
        }
    }
}

var teacherQuestion = interviewQuestion('teacher');
var designerQuestion = interviewQuestion('designer');

teacherQuestion('John');
designerQuestion('John');
designerQuestion('jane');
designerQuestion('Mark');
designerQuestion('Mike');

interviewQuestion('teacher')('Mark');

interviewQuestion('teacher')('John');
*/

//WITH CLOSURES:
function interviewQuestion(job) {
    return function(name) {
        if (job === 'designer') {
            console.log(name + ', can you please explain what UX design is?');
        }
        else if (job === 'teacher') {
            console.log('What subject do you teach, ' + name + '?');
        }
        else {
            console.log('Hello ' + name + ', what do you do?');
        }
    }
}

interviewQuestion('designer')('Jane');
interviewQuestion('teacher')('John');
interviewQuestion('janitor')('Mark');