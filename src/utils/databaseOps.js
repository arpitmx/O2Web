import { db } from "../../firebase";
import { doc, getDocs, getDoc, setDoc, collection } from "firebase/firestore";

async function getUserData(email) {
  const userDoc = await getDoc(doc(db, "Users", email));
  return userDoc.data();
}

async function addTask(task, checklist) {
  task.id = `#${(
    task.project_ID.substr(0, 2) + task.project_ID.at(-1)
  ).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;
  task.time_STAMP = new Date();
  task.last_updated = task.time_STAMP;
  console.log(task);

  // uncomment below line to allow task addition in database

  // add task to project tasks
  const collectionPath = `Projects/${task.project_ID}/TASKS`;
  const docRef = doc(db, collectionPath, task.id);
  await setDoc(docRef, task);

  // add task to assignee workspace
  const workspacePath = `Users/${task.assignee}/WORKSPACE`;
  const taskRef = doc(db, workspacePath, task.id);
  await setDoc(taskRef, {
    id: task.id,
    project_id: task.project_ID,
    status: "Assigned",
  });
  await addChecklist(checklist, task.project_ID, task.id);
}
async function addChecklist(checklist, project_ID, task_ID) {
  try {
    const checklistCollectionRef = collection(
      db,
      `Projects/${project_ID}/TASKS/${task_ID}/CHECKLIST`
    );
    let count = 0;
    for (const checklistItem of checklist) {
      const checklistID = Math.floor(10000 + Math.random() * 90000).toString();

      const checklistDocRef = doc(checklistCollectionRef, checklistID);
      checklistItem.id = checklistID;
      checklistItem.index = count++;
      await setDoc(checklistDocRef, checklistItem);
    }

    console.log("Checklist added successfully!");
  } catch (e) {
    console.log(e);
  }
}

async function getProjects(assigner) {
  const assignerDocRef = doc(db, "Users", assigner);
  const assignerDocSnap = await getDoc(assignerDocRef);
  return assignerDocSnap.data().PROJECTS;
}

async function getSegments(project_ID) {
  const segmentsCollection = collection(db, `Projects/${project_ID}/SEGMENTS`);
  const querySnapshot = await getDocs(segmentsCollection);
  const segments = querySnapshot.docs.map((doc) => {
    return [doc.id, doc.data().sections];
  });
  return segments;
}

async function getTags(project_ID) {
  const tagsCollection = collection(db, `Projects/${project_ID}/TAGS`);
  const querySnapshot = await getDocs(tagsCollection);
  const tags = querySnapshot.docs.map((doc) => {
    return doc.data();
  });
  return tags;
}

async function getContributors(project_ID) {
  const collectionPath = "Projects";
  const projectRef = doc(db, collectionPath, project_ID);

  const projectSnap = await getDoc(projectRef);
  if (projectSnap.exists()) {
    const contributorsIDs = projectSnap.data().contributors;
    const usersCollection = collection(db, "Users");
    const querySnapshot = await getDocs(usersCollection);
    let contributors = [];
    querySnapshot.forEach((doc) => {
      if (contributorsIDs.includes(doc.id)) contributors.push(doc.data());
    });
    return contributors;
  } else {
    console.log("No such document!");
  }
}

export {
  addTask,
  getProjects,
  getSegments,
  getTags,
  getContributors,
  getUserData,
};

// async function getProjects(){
//     const projectsCollection = collection(db, "Projects");
//     const querySnapshot = await getDocs(projectsCollection);
//     let Projects = []
//     querySnapshot.forEach((doc) => {
//         Projects.push(doc.data().PROJECT_NAME);
//     });
//     return Projects;
// }

// async function getSegments(project_ID){
//     const segmentsCollection = collection(db, `Projects/${project_ID}/SEGMENTS`);
//     const querySnapshot = await getDocs(segmentsCollection);
//     let segments = []
//     querySnapshot.forEach((doc) => {
//       segments.push(doc.id);
//     });
//     return segments
// }

// async function getTags(project_ID) {
//   const collectionPath = "Projects";
//   const projectRef = doc(db, collectionPath, project_ID);

//   const projectSnap = await getDoc(projectRef);
//   if (projectSnap.exists()) {
//     console.log(projectSnap.data().TAGS);
//     return projectSnap.data().TAGS;
//   } else {
//     console.log("No such document!");
//   }
// }
