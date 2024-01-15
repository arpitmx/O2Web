import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  addTask,
  getTags,
  getSegments,
  getContributors,
} from "../../utils/databaseOps";
import { auth, logout} from "../../../firebase";
import styles from "./CreateTask.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import SummaryEdit from './components/SummaryEdit';

export default function CreateTask() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout(){
    if(!user){
        navigate('/');
    }
    logout();
  }

  //If the user logs out redirect to login page
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
      if(loading){
          return;
      }
      if (!user){
          navigate("/");
      }
  }, [user]);

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
    projects: location.state?.userData.PROJECTS.map((project) => {
      return {value : project, label : project}
    }),
    segments: [],
    sections: [],
    contributors: [],
    tags: [],
  });

    // task object to be submitted to database
    const [task, setTask] = useState({
        id : undefined,
        title : "",
        description : "",
        difficulty : undefined,
        priority : undefined,
        status : 1,
        assignee : undefined,
        assigner : location.state?.userData.EMAIL, // get the assigner from login page
        moderators : [],
        time_STAMP : undefined,
        duration : "1 day",
        tags : [], // array
        project_ID : undefined,
        segment : undefined,
        section : undefined,
        type : undefined,
        last_updated : undefined,
        version: 4,
    })

    // function logout(){
    //     navigate("/");
    // }

  // get project specific data when new project is selected
  useEffect(() => {
    if (!task.project_ID) return;

    // get tags of the selected project
    getTags(task.project_ID).then((tagsData) => {
      setData((prevData) => {
        return { ...prevData, tags: tagsData ? [...tagsData] : [] };
      });
    });

        // get segments of the selected project
        getSegments(task.project_ID).then((segmentData) => {
            setData((prevData) => {
                return {...prevData, segments : segmentData ? segmentData.map((segment) => {
                    return {value : segment[0], label : segment[0], sections : segment[1]}
                }) : []};
            })
        });

        // get constibutors of the selected project
        getContributors(task.project_ID).then((contributorsData) => {
            setData((prevData) => {
                return {...prevData, contributors : contributorsData ? contributorsData.map((contributor) => {
                    return {...contributor, value : contributor.EMAIL, label : contributor.USERNAME}
                }) : []};
            })
        });

    return () => {
      // reset any selected moderators or tags from task array
      setTask((prevTask) => ({
        ...prevTask,
        moderators: [],
        tags: [],
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
    async function handleTaskSubmit(e){
        e.preventDefault();
        // console.log(task);
        addTask(task).then(() => {
            alert("task added succesfully");
        }).catch((error) => {
            console.log(error)
            alert("error adding task");
        })
    }

  // event handler for handling changes in select
  const handleSelectChange = (select, spec) => {
    setTask((prevTask) => ({ ...prevTask, [spec]: select.value }));
    // console.log(`Option selected:`, select.value);
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
    function handleDurationQuantityEdit(event){
        const value = event.target.value;
        setTask((prevTask) => ({...prevTask, duration: `${Number(value)} ${prevTask.duration.split(" ")[1]}`}));
    }
    
    // construct an array of tags to be rendered
    const tagOptions = data.tags.map((tagName) => 
        <label 
            key={tagName.tagID} 
            htmlFor={tagName.tagID}
            style={{
                backgroundColor : tagName.bgColor,
                color: tagName.textColor,
            }}
        >
            {tagName.tagText}
            <input 
                name={"tag"} 
                id={tagName.tagID} 
                type="checkbox" 
                // if taskName present in the tags array of task object then give true
                checked={task.tags.indexOf(tagName.tagID) !== -1 ? true : false}
                onChange={(e) => handleTagsEdit(e, tagName.tagID)}
            />
        </label>
    )

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

    // render task form
    return (
        <>
            <form className={styles.form} onSubmit={handleTaskSubmit}>
                <div className={styles.header}>
                    <img className={styles.logoImg} src="./O2logo.png" alt="O2 logo"/>
                    {/* <h1>New Task</h1> */}
                    <div className={styles.btnCont}>
                      <button type="submit" className={styles.taskSubmit}>
                          Create Task
                      </button>
                      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                          Logout
                      </button>
                    </div>
                </div>
                <div className={styles.taskSpecs}>
                    
                    {/* Project_ID select dropdown*/}
                    <fieldset>
                      <legend>Project</legend>
                      <Select
                          options={data.projects}
                          onChange={(select) => handleSelectChange(select, "project_ID")}
                          autoFocus={true}
                          className={styles.selectElement}
                          placeholder={"Project"}
                          required
                      />
                    </fieldset>
                    

                    {/* priority select dropdown*/}
                    <fieldset>
                      <legend>Priority</legend>
                      <Select
                          options={priorities}
                          onChange={(select) => handleSelectChange(select, "priority")}
                          autoFocus={true}
                          className={styles.selectElement}
                          placeholder={"Priority"}
                          required
                      />
                    </fieldset>
                    

                    {/* Type select dropdown*/}
                    <fieldset>
                      <legend>Type</legend>
                      <Select
                          options={types}
                          onChange={(select) => handleSelectChange(select, "type")}
                          autoFocus={true}
                          className={styles.selectElement}
                          placeholder={"Type"}
                          required
                      />
                    </fieldset>
                    
                    {/* Difficulty select dropdown*/}
                    <fieldset>
                      <legend>Difficulty</legend>
                      <Select
                        options={difficulties}
                        onChange={(select) => handleSelectChange(select, "difficulty")}
                        autoFocus={true}
                        className={styles.selectElement}
                        placeholder={"Difficulty"}
                        required
                      />
                    </fieldset>
                    

                    {/* Assignee select dropdown*/}
                    <fieldset>
                      <legend>Assignee</legend>
                      <Select
                        options={data.contributors}
                        onChange={(select) => handleSelectChange(select, "assignee")}
                        autoFocus={true}
                        className={styles.selectElement}
                        placeholder={"Assignee"}
                        required
                      />
                    </fieldset>
                </div>

                <div className={styles.taskPhase}>

                    {/* segment select dropdown*/}
                    <fieldset>
                      <legend>Segment</legend>
                      <Select
                        options={data.segments}
                        onChange={(select) => handleSelectChange(select, "segment")}
                        autoFocus={true}
                        className={styles.selectElement}
                        placeholder={"Segment"}
                        required
                      />
                    </fieldset>

                    {/* {">"} */}

                    {/* section select dropdown*/}
                    <fieldset>
                      <legend>Section</legend>
                      <Select
                        options={data.sections}
                        onChange={(select) => handleSelectChange(select, "section")}
                        autoFocus={true}
                        className={styles.selectElement}
                        placeholder={"Section"}
                        required
                      />
                    </fieldset>
                </div>
                
                <div className={styles.taskInfo}>
                    {/* title textbox */}
                    <input 
                      id="title" 
                      type="text" 
                      value={task.title} 
                      name="title" 
                      className={styles.taskTitle}
                      onChange={handleChange} 
                      placeholder="Task Title"
                      required
                    />

                    {/* Summary edit box */}
                    <SummaryEdit description={task.description} handleChange={handleChange} task={task}/>

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
                        required
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
                        required
                    />
                </fieldset>

        {/* tags select */}
        <fieldset className={styles.taskTags}>
          <legend>Tags</legend>
          {tagOptions.length ? tagOptions : <p>No tags available</p>}
        </fieldset>
      </form>
    </>
  );
}
