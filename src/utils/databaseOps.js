import { db, storage } from "../../firebase";
import { doc, getDocs, getDoc, setDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import generateRandomFileName from "../helpers/generateRandomFileName";
import {signOut} from "firebase/auth";


const logout = () => {
  signOut(auth);
};

async function addTask(task) {
  task.id = `#${(task.project_ID.substr(0, 2)+task.project_ID.at(-1)).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;
  task.time_STAMP = new Date();
  task.last_updated = task.time_STAMP;
  console.log(task);

  // uncomment below line to allow task addition in database

  // const collectionPath = `Projects/${task.project_ID}/TASKS`;
  // const docRef = doc(db, collectionPath, task.id);
  // await setDoc(docRef, task);
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
    return [doc.id, doc.data().sections]
  });
  return segments;
}

async function getTags(project_ID) {
  const tagsCollection = collection(db, `Projects/${project_ID}/TAGS`);
  const querySnapshot = await getDocs(tagsCollection);
  const tags = querySnapshot.docs.map((doc) => {
    return doc.data()
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

// Function to upload image to Firebase Storage
export const uploadImage = async (task, file) => {
  console.log("IMAGE UPLOAD PATH",`Projects/${task.project_ID}/${generateRandomFileName()}`)
  const imageRef = ref(storage, `Projects/${task.project_ID}/${generateRandomFileName()}`);
  await uploadBytes(imageRef, file);

  const downloadURL = await getDownloadURL(imageRef);
  return downloadURL;
};

export { addTask, getProjects, getSegments, getTags, getContributors };


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
