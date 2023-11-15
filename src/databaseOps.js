import {db} from "../../../firebase"
import { doc, setDoc } from 'firebase/firestore';

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

export {
    addTask
}