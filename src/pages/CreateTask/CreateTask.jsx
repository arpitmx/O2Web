import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import {
  addTask,
  getTags,
  getSegments,
  getContributors,
  getProjects,
  uploadImage,
} from "../../utils/databaseOps";
import styles from "./CreateTask.module.css";

export default function CreateTask() {
  // hardcoded values

  const priorities = [
    { value: 1, label: "Low" },
    { value: 2, label: "Medium" },
    { value: 3, label: "High" },
    { value: 4, label: "Critical" },
  ];

  const difficulties = [
    { value: 1, label: "Beginner" },
    { value: 2, label: "Easy" },
    { value: 3, label: "Medium" },
    { value: 4, label: "Hard" },
  ];

  const types = [
    { value: 1, label: "Bug" },
    { value: 2, label: "Feature" },
    { value: 3, label: "Feature request" },
    { value: 4, label: "Exception" },
    { value: 5, label: "Security" },
    { value: 6, label: "Performance" },
  ];

  const durations = ["hour", "day", "week"];

  // values per project basis
  const [data, setData] = useState({
    projects: [],
    segments: [],
    sections: [],
    contributors: [],
    tags: [],
  });

  // task object to be submitted to database
  const [task, setTask] = useState({
    id: "",
    title: "",
    description: "",

    difficulty: undefined,
    priority: undefined,
    status: 0,

    assignee: undefined,
    assigner: "", // the user creating the task
    moderators: [],

    time_STAMP: "",
    duration: "1 day",
    tags: [], // array
    
    project_ID: undefined,
    segment: undefined,
    section: undefined,
    type: undefined,
    
    last_updated: "", // Timestamp
});

// For Image Uploads
const descriptionRef = useRef(null);
const [dragging, setDragging] = useState(false);
const [uploadMessage, setUploadMessage] = useState(null);


// get projects on page load
useEffect(() => {
    getProjects().then((projects) => {
      setData((prevData) => {
        return {
          ...prevData,
          projects: projects
            ? projects.map((project) => {
                return { value: project, label: project };
              })
            : [],
        };
      });
    });
  }, []);

  // get project specific data when new project is selected
  useEffect(() => {
    if (!task.project_ID) return;

    // get tags of the selected project
    getTags(task.project_ID).then((tagsData) => {
      console.log(tagsData);
      setData((prevData) => {
        return { ...prevData, tags: tagsData ? [...tagsData] : [] };
      });
    });

    // get segments of the selected project
    getSegments(task.project_ID).then((segmentData) => {
      setData((prevData) => {
        return {
          ...prevData,
          segments: segmentData
            ? segmentData.map((segment) => {
                return {
                  value: segment[0],
                  label: segment[0],
                  sections: segment[1],
                };
              })
            : [],
        };
      });
      // set default segment of the project
      // setTask((prevTask) => ({...prevTask, segment : segmentData[0]}));
    });

    // get constibutors of the selected project
    getContributors(task.project_ID).then((contributorsData) => {
      setData((prevData) => {
        return {
          ...prevData,
          contributors: contributorsData
            ? contributorsData.map((contributor) => {
                return {
                  ...contributor,
                  value: contributor.EMAIL,
                  label: contributor.USERNAME,
                };
              })
            : [],
        };
      });
      // set default assignee of the task
      // setTask((prevTask) => ({
      //     ...prevTask,
      //     assignee : contributorsData[0].USERNAME,
      // }));
    });

    return () => {
      // reset any selected moderators or tags from task array
      setTask((prevTask) => ({
        ...prevTask,
        moderators: [],
        tags: [],
        segment: undefined,
      }));
    };
  }, [task.project_ID]);

  // get sections of the selected segment
  useEffect(() => {
    if (!task.segment) return;

    setData((prevData) => {
      return {
        ...prevData,
        sections: prevData.segments[
          prevData.segments.findIndex((segment) => {
            return segment.value === task.segment;
          })
        ]["sections"].map((section) => ({ value: section, label: section })),
      };
    });
  }, [task.segment]);

  // handle submission of the task
  async function handleTaskSubmit(e) {
    e.preventDefault();
    if (Object.values(task).includes(undefined)) {
      alert("form not complete");
    }
    console.info(task);
    // else{
    //     console.info(task);
    addTask(task)
      .then(() => {
        alert("task added succesfully");
      })
      .catch((error) => {
        console.log(error);
        alert("error adding task");
      });
    // }
  }

  // event handler for handling changes in select
  const handleSelectChange = (select, spec) => {
    setTask((prevTask) => ({ ...prevTask, [spec]: select.value }));
    console.log(`Option selected:`, select.value);
  };

  // event handler for handling project title and desc input
  function handleChange(event) {
    const { name, value } = event.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  }

  // event handler for handling changes in tag selection
  function handleTagsEdit(event, tagID) {
    const checked = event.target.checked;
    if (checked)
      // add tagID in tags array of task object if checkbox is checked
      setTask((prevTask) => ({ ...prevTask, tags: [...prevTask.tags, tagID] }));
    // remove tagID from tags array of task object if checkbox is unchecked
    else
      setTask((prevTask) => ({
        ...prevTask,
        tags: [...prevTask.tags.filter((tag) => tag !== tagID)],
      }));
  }

  // event handler for handling project duration selection(hours, days, weeks)
  function handleDurationEdit(event, durationName) {
    const checked = event.target.checked;
    if (checked) {
      // add duration name at end of duration text if radio button of that duration name is checked
      setTask((prevTask) => ({
        ...prevTask,
        duration: `${Number(prevTask.duration.split(" ")[0])} ${durationName}`,
      }));
    }
  }

  // event handler for handling duration quantity edit
  function handleDurationQuantityEdit(event) {
    const value = event.target.value;
    setTask((prevTask) => ({
      ...prevTask,
      duration: `${Number(value)} ${prevTask.duration.split(" ")[1]}`,
    }));
  }

  // construct an array of tags to be rendered
  const tagOptions = data.tags.map((tagName) => (
    <label
      key={tagName.tagID}
      htmlFor={tagName.tagID}
      style={{
        backgroundColor: tagName.bgColor,
        color: tagName.textColor,
      }}
    >
      {tagName.tagText} :
      <input
        name={"tag"}
        id={tagName.tagID}
        type="checkbox"
        // if taskName present in the tags array of task object then give true
        checked={task.tags.indexOf(tagName.tagID) !== -1 ? true : false}
        onChange={(e) => handleTagsEdit(e, tagName.tagID)}
      />
    </label>
  ));

  // construct an array of mods to be rendered
  const modOptions = data.contributors.filter((contributor) => {
    return contributor.ROLE >= 3;
  });

  // construct an array of duration names to be rendered
  const durationOptions = durations.map((duration) => (
    <label key={duration} htmlFor={duration}>
      {duration}
      <input
        name={"duration"}
        id={duration}
        type="radio"
        // if duration name present in the duraion text of task object then give true
        checked={task.duration.split(" ")[1] === duration ? true : false}
        onChange={(e) => handleDurationEdit(e, duration)}
      />
    </label>
  ));

  // handle multi selection of moderators from dropdown
  function handleModsSelect(moderators) {
    setTask((prevTask) => ({
      ...prevTask,
      moderators: moderators.map((moderator) => {
        return moderator.EMAIL;
      }),
    }));
  }

  //   Handler for handling the image drop
  function handleImageDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if ((task, file)) {
      setUploadMessage(`Uploading ${file.name}...`);
      console.log("File", file);
      uploadImage(task,file).then((url) => {
        console.log("IMAGE URL from store", url);
        const cursorPosition = descriptionRef.current.selectionStart;
        const newDescription =
          task.description.slice(0, cursorPosition) +
          `![Image](${url})` +
          task.description.slice(cursorPosition);

        setTask((prevTask) => ({ ...prevTask, description: newDescription }));
        setUploadMessage(null);
      });
    }
  }

  // event handler for handling drag enter
  function handleDragEnter(e) {
    e.preventDefault();
    setDragging(true);
  }

  // event handler for handling drag leave
  function handleDragLeave(e) {
    e.preventDefault();
    setDragging(false);
  }

  // render task form
  return (
    <>
      <form
        className={styles.form}
        onSubmit={handleTaskSubmit}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleImageDrop}
      >
        <div className={styles.header}>
          <h1>New Task</h1>
          <button type="submit" className={styles.taskSubmit}>
            Create Task
          </button>
        </div>
        <div className={styles.taskSpecs}>
          {/* Project_ID select dropdown*/}
          <Select
            options={data.projects}
            onChange={(select) => handleSelectChange(select, "project_ID")}
            autoFocus={true}
            className={styles.selectElement}
            placeholder={"Project"}
          />

          {/* priority select dropdown*/}
          <Select
            options={priorities}
            onChange={(select) => handleSelectChange(select, "priority")}
            autoFocus={true}
            className={styles.selectElement}
            placeholder={"Priority"}
          />

          {/* Type select dropdown*/}
          <Select
            options={types}
            onChange={(select) => handleSelectChange(select, "type")}
            autoFocus={true}
            className={styles.selectElement}
            placeholder={"Type"}
          />

          {/* Difficulty select dropdown*/}
          <Select
            options={difficulties}
            onChange={(select) => handleSelectChange(select, "difficulty")}
            autoFocus={true}
            className={styles.selectElement}
            placeholder={"Difficulty"}
          />

          {/* Assignee select dropdown*/}
          <Select
            options={data.contributors}
            onChange={(select) => handleSelectChange(select, "assignee")}
            autoFocus={true}
            className={styles.selectElement}
            placeholder={"Assignee"}
          />
        </div>

        <div className={styles.taskPhase}>
          {/* segment select dropdown*/}
          <Select
            options={data.segments}
            onChange={(select) => handleSelectChange(select, "segment")}
            autoFocus={true}
            className={styles.selectElement}
            placeholder={"Segment"}
          />
          {">"}

          {/* section select dropdown*/}
          <Select
            options={data.sections}
            onChange={(select) => handleSelectChange(select, "section")}
            autoFocus={true}
            className={styles.selectElement}
            placeholder={"Section"}
          />
        </div>

        <div className={styles.taskInfo}>
          {/* title textbox */}
          <input
            id="title"
            type="text"
            value={task.title}
            name="title"
            onChange={handleChange}
            placeholder="Title"
          />

          {/* description textarea */}
          <textarea
            ref={descriptionRef}
            id="description"
            type="text"
            value={task.description}
            name="description"
            onChange={handleChange}
            placeholder="Write Task Summary here..."
            rows="7"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={dragging ? styles.textareaDragging : styles.textarea}
          />
          {uploadMessage && <div>{uploadMessage}</div>}
        </div>

        {/* duration edit section */}
        <fieldset className={styles.taskDuration}>
          <legend>Duration</legend>
          {/* Duration quantity */}
          <input
            type="number"
            min="1"
            max="100"
            value={Number(task.duration.split(" ")[0])}
            onChange={handleDurationQuantityEdit}
          />
          {/* duration type */}
          {durationOptions}
        </fieldset>

        {/* moderators multiselect */}
        <fieldset className={styles.taskMods}>
          <legend>Moderators</legend>
          <Select
            isMulti
            onChange={handleModsSelect}
            options={modOptions}
            placeholder={"Moderators"}
            closeMenuOnSelect={false}
            className={styles.selectElement}
          />
        </fieldset>

        {/* tags select */}
        <fieldset className={styles.taskTags}>
          <legend>Tags</legend>
          {tagOptions}
        </fieldset>
      </form>
    </>
  );
}
