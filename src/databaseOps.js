import {db} from "../firebase"
import { doc, getDoc, setDoc } from 'firebase/firestore';

function addTask (task){
    const collectionPath = `Projects/${task.project_ID}/TASKS`;
    const docRef = doc(db, collectionPath, task.task_ID);

    setDoc(docRef, task)
    .then(() => {
        console.info('Task added successfully');
    })
    .catch((error) => {
        console.error('Error adding task: ', error);
    });
}

async function getProjects(){
    const projectsRef = db.collection("Projects");
    const snapshot = await projectsRef.get();
    const projects = snapshot.docs.map((project) =>
        project.id
    )
    return projects
}

async function getSegments(project_ID){
    const collectionPath = `Projects/${project_ID}/SEGMENTS`;
    const segmentsRef = doc(db, collectionPath, project_ID);
    
    const snapshot = await segmentsRef.get();
    const segments = snapshot.docs.map((segment) =>
        segment.id
    )
    return segments
}

async function getTags(project_ID){
    const collectionPath = "Projects";
    const projectRef = doc(db, collectionPath, project_ID);

    const projectSnap = await getDoc(projectRef);
    if (projectSnap.exists()) {
        return projectSnap.data().TAGS;
    }
    else {
        console.log("No such document!");
    }
}

async function getContributers(project_ID){
    const collectionPath = "Projects";
    const projectRef = doc(db, collectionPath, project_ID);

    const projectSnap = await getDoc(projectRef);
    if (projectSnap.exists()) {
        const users = projectSnap.data().CONTRIBUTERS;
        const userPath = "Users";
    }
    else {
        console.log("No such document!");
    }
}

export {
    addTask,
    getProjects,
    getSegments,
    getTags
}