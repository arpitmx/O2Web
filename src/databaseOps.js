import {db} from "../firebase"
import { doc,getDocs, getDoc, setDoc, collection } from 'firebase/firestore';

async function addTask (task){
    const collectionPath = `Projects/${task.project_ID}/TASKS`;
    const docRef = doc(db, collectionPath, task.id);
    await setDoc(docRef, task);
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
    const segmentsCollection = collection(db, `Projects/${project_ID}/SEGMENTS`);
    const querySnapshot = await getDocs(segmentsCollection);
    let segments = []
    querySnapshot.forEach((doc) => {
      segments.push(doc.id);
    });
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

async function getContributors(project_ID){
    const collectionPath = "Projects";
    const projectRef = doc(db, collectionPath, project_ID);

    const projectSnap = await getDoc(projectRef);
    if (projectSnap.exists()) {
        const contributorsIDs = projectSnap.data().contributors;
        const usersCollection = collection(db, "Users");
        const querySnapshot = await getDocs(usersCollection);
        let contributors = []
        querySnapshot.forEach((doc) => {
            if(contributorsIDs.includes(doc.id))
                contributors.push([doc.id, doc.data()]);
        });
        return contributors;
    }
    else {
        console.log("No such document!");
    }
}

export {
    addTask,
    getProjects,
    getSegments,
    getTags,
    getContributors
}