'use strict'

class HalaqaRepository {
    constructor() {
        this.utils = require('./Utils');
    }

    getStudents() {
        return this.utils.readJsonFile('./data/student.json').then(parents => {
            let students = this.utils.flattenMultiArray(parents.map(p=> p.students));
            return students;
        });
    }

    getTeacherStudents(teacherId) {
        return this.utils.readJsonFile('./data/student.json').then(parents => {
            let students = this.utils.flattenMultiArray(parents.map(p=> p.students));
            return students.filter(s => s.teacherId === teacherId);
        });
    }

    getParentStudents(parentId) {
        return this.utils.readJsonFile('./data/student.json').then(parents => {
            parents = parents.filter(p => p.qatariId === parentId);
            return parents[0].students;
        });
    }

    getSurahs() {
        return this.utils.readJsonFile('./data/surah.json');
    }

    getStudentTasks(studentId, taskStatus) {
        return this.utils.readJsonFile('./data/task.json').then(tasks => {
            tasks = tasks.filter(t => t.studentId === studentId);

            if (taskStatus === "Completed") {
                tasks = tasks.filter(tasks => tasks.completedDate);
            }
            else if (taskStatus === "Pending") {
                tasks = tasks.filter(tasks => tasks.completedDate === undefined);
            }

            return tasks;
        });
    }

    getTask(taskId) {
        return this.utils.readJsonFile('./data/task.json').then(tasks => {
            tasks = tasks.filter(t => t.taskId === taskId);
            return tasks[0];
        });
    }

    deleteTask(taskId) {
        return this.utils.readJsonFile('./data/task.json').then(tasks => {
            let taskIndex = tasks.findIndex(t => t.taskId === taskId);
            tasks.splice(taskIndex, 1);
            return this.utils.writeToJsonFile("./data/task.json", tasks);
        });
    }

    addTask(newTask) {
        return this.utils.readJsonFile('./data/task.json').then(tasks => {
            let maxId = Math.max.apply(Math, tasks.map(r => r.taskId)) + 1;
            newTask.taskId = maxId;
            tasks.push(newTask);
            return this.utils.writeToJsonFile('./data/task.json', tasks);
        });
    }
    
    updateTask(updatedTask) {
        return this.utils.readJsonFile('./data/task.json').then(tasks => {
            let taskIndex = tasks.findIndex(t => t.taskId === updatedTask.taskId);
            tasks[taskIndex] = updatedTask;
            return this.utils.writeToJsonFile('./data/task.json', tasks);
        });
    }

    completeTask(completedTask) {
        return this.utils.readJsonFile('./data/task.json').then(tasks => {
            let taskIndex = tasks.findIndex(t => t.taskId === completedTask.taskId);
            tasks[taskIndex].completedDate = completedTask.completedDate;
            tasks[taskIndex].masteryLevel = completedTask.masteryLevel;
            tasks[taskIndex].comment = completedTask.comment;
            return this.utils.writeToJsonFile('./data/task.json', tasks);
        });
    }

    getMessages(studentId) {
        return this.utils.readJsonFile('./data/message.json').then(messages => {
            return messages.filter(m=> m.studentId === studentId);
        });
    }
    
    addMessage(message) {
        return this.utils.readJsonFile('./data/message.json').then(messages => {
            let maxId = Math.max.apply(Math, messages.map(m => m.id)) + 1;
            message.id = maxId;
            messages.push(message);

            return this.utils.writeToJsonFile('./data/message.json', messages);
        });
    }

    addParent(newParent) {
        //console.log("addParent.newParent", newParent);
        let newId;
        return this.generateStudentId().then(id => {
            newId = id;
            return this.utils.readJsonFile('./data/student.json');
        }).then(parents => {
            if (newParent.students) {
                newParent.students[0].studentId = newId;
            }
            parents.push(newParent);
            return this.utils.writeToJsonFile('./data/student.json', parents);
        });
    }

    /*Register new children with existing parent*/
    addStudent(student, qatariId) {
        return this.generateStudentId().then(id => {
            student.studentId = id;
            return this.utils.readJsonFile('./data/student.json');
        }).then(parents => {
            let index = parents.findIndex(p => p.qatariId === qatariId);
            parents[index].students.push(student);
            return this.utils.writeToJsonFile('./data/student.json', parents);
        });
    }

    generateStudentId()
    {
        return this.getStudents().then(students => {
            let maxId = Math.max.apply(Math, students.map(s => s.studentId)) + 1;
            return maxId;
        });
    }

    getParents() {
        return this.utils.readJsonFile('./data/student.json').then(parents => {
            for(let parent of parents) {
               delete parent.students;
            };

            return parents;
        });
    }

    getTeachers() {
        return this.utils.readJsonFile('./data/teacher.json').then(teachers=> {
            return teachers.filter(t=>t.isCoordinator != 1);
        });
    }
}

module.exports = new HalaqaRepository();