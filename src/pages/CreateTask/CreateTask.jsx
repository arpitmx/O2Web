import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { addTask } from "../../databaseOps";

export default function CreateTask({
    project_ID,
    section,
    segment
}){
    const projects = ["Medona", "NCSOxygen", "Odin", "Versa"];
    const priorities = ["Low", "Medium", "High", "Critical"];
    const sections = ["Ongoing Now", "Ready for Test", "testing", "Completed"];
    const segments = ["Backend", "Frontend", "Design"];
    const tags = ["Critical", "Bug", "Feature", "New"];
    const difficulties = ["Beginner", "Easy", "Medium", "Hard"];
    const types = ["Bug", "Feature", "Feature request", "Task", "Exception", "Security", "Performance"];
    const states = ["Unassigned", "Ongoing", "Open", "Review", "Testing"]
    const durations = ["hour", "day", "week"];

    useEffect(() => {
        // get data
    }, [])

    const [task, setTask] = useState({
        project_ID : "Medona",
        section : "Ongoing Now",
        segment : "Frontend",
        title : "",
        assignee : "",
        assignee_DP_URL : "",
        assigner : "",
        completed : false,
        deadline : "1 day",
        description : "",
        difficulty : 3,
        duration : "1 day",
        id : "",
        priority : 3,
        status : 2,
        type : 1,
        tags : [],
        time_STAMP : ""
    })

    function handleTaskSubmit(e){
        e.preventDefault();
        console.info(task);
        // addTask(task);
    }

    // event handler for handling changes in String valued fields
    function handleChange(event){
        const { name, value } = event.target;
        setTask((prevTask) => ({...prevTask, [name] : value}));
    }

    // event handler for handling changes in Numeric fields
    function handleNumChange(event){
        const { name, value } = event.target;
        setTask((prevTask) => ({...prevTask, [name] : Number(value)}));
    }

    // event handler for handling changes in tag selection
    function handleTagsEdit(event, tagName){
        const checked = event.target.checked;
        if(checked)
            // add tagname in tags array of task object if checkbox is checked
            setTask((prevTask) => ({...prevTask, tags : [...prevTask.tags, tagName]}));
        else
            // remove tagname from tags array of task object if checkbox is unchecked
            setTask((prevTask) => ({...prevTask, tags : [...prevTask.tags.filter((tag) => tag !== tagName)]}));
    }

    function handleDurationEdit(event, durationName){
        const checked = event.target.checked;
        if(checked)
            // add duration name at end of duration text if radio button of that duration name is checked
            setTask((prevTask) => (
                {
                    ...prevTask, 
                    duration: `${Number(prevTask.duration.split(" ")[0])} ${durationName}`
                }));
    }

    function handleDurationQuantityEdit(event){
        const value = event.target.value;
        setTask((prevTask) => ({...prevTask, duration: `${Number(value)} ${prevTask.duration.split(" ")[1]}`}));
    }

    const projectOptions = projects.map((projectName) => 
        <option key={projectName} value={projectName}>{projectName}</option>
    )

    const priorityOptions = priorities.map((priority, index) => 
        <option key={priority} value={index+1}>{priority}</option>
    )

    const difficultyOptions = difficulties.map((difficulty, index) => 
        <option key={difficulty} value={index+1}>{difficulty}</option>
    )

    const stateOptions = states.map((state, index) =>
        <option key={state} value={index+1}>{state}</option>
    )

    const typeOptions = types.map((type, index) => 
        <option key={type} value={index+1}>{type}</option>
    )

    const segmentOptions = segments.map((segmentName) =>
        <option key={segmentName} value={segmentName}>{segmentName}</option>
    )

    const sectionOptions = sections.map((sectionName) =>
        <option key={sectionName} value={sectionName}>{sectionName}</option>
    )
    
    const tagOptions = tags.map((tagName) => 
        <label key={tagName} htmlFor={tagName}>
            {tagName} :
            <input 
                name={"tag"} 
                id={tagName} 
                type="checkbox" 
                // if taskName present in the tags array of task object then give true
                checked={task.tags.indexOf(tagName) !== -1 ? true : false}
                onChange={(e) => handleTagsEdit(e, tagName)}
            />
        </label>
    )

    const durationOptions = durations.map((duration) => 
        <label key={duration} htmlFor={duration}>
            {duration} :
            <input 
                name={"duration"} 
                id={duration} 
                type="radio" 
                // if duration name present in the dutaion text of task object then give true
                checked={task.duration.split(" ")[1] === duration ? true : false}
                onChange={(e) => handleDurationEdit(e, duration)}
            />
        </label>
    )


    return (
        <>
            <form onSubmit={handleTaskSubmit}>

                <label htmlFor="project_ID">
                    Project :
                    <select disabled id="project_ID" value={task.project_ID} name="project_ID" onChange={handleChange}>
                        {projectOptions}
                    </select>
                </label>
                <br></br>

                <label htmlFor="segment">
                    Segment : 
                    <select disabled id="segment" value={task.segment} name="segment" onChange={handleChange}>
                        {segmentOptions}
                    </select>
                </label>

                <label htmlFor="section">
                    Section : 
                    <select disabled id="section" value={task.section} name="section" onChange={handleChange}>
                        {sectionOptions}
                    </select>
                </label>
                <br></br>

                <label htmlFor="priority">
                    Priority : 
                    <select id="priority" value={task.priority} name="priority" onChange={handleNumChange}>
                        {priorityOptions}
                    </select>
                </label>

                <label htmlFor="difficulty">
                    Difficulty : 
                    <select id="difficulty" value={task.difficulty} name="difficulty" onChange={handleNumChange}>
                        {difficultyOptions}
                    </select>
                </label>

                <label htmlFor="type">
                    Type : 
                    <select id="type" value={task.type} name="type" onChange={handleNumChange}>
                        {typeOptions}
                    </select>
                </label>

                <label htmlFor="state">
                    State : 
                    <select id="state" value={task.state} name="state" onChange={handleNumChange}>
                        {stateOptions}
                    </select>
                </label>
                <br></br>

                <label htmlFor="title">
                    Title : 
                    <input id="title" type="text" value={task.title} name="title" onChange={handleChange} placeholder="Title"/>
                </label>
                <br></br>

                <label htmlFor="description">
                    Description : 
                    <textarea id="description" type="text" value={task.description} name="description" onChange={handleChange} placeholder="Write Task Summary here..."/>
                </label>
                <br></br>

                <fieldset>
                    <legend>Duration</legend>
                    <input 
                        type="number" 
                        min="1"
                        max="100"
                        value={Number(task.duration.split(" ")[0])} 
                        onChange={handleDurationQuantityEdit}
                    />
                    {durationOptions}
                </fieldset>

                <fieldset>
                    <legend>Tags</legend>
                    {tagOptions}
                </fieldset>

                <button type="submit">
                    Create Task
                </button>

            </form>
        </>
    )
}

CreateTask.propTypes = { 
    project_ID: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    segment: PropTypes.string.isRequired,
};