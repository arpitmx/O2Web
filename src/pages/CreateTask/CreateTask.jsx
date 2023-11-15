import { useEffect, useState } from "react";
import PropTypes from 'prop-types'; 

export default function CreateTask({
    project_ID,
    section,
    segment
}){
    useEffect(() => {
        // get data
    }, [])

    const projects = ["medusa", "odin", "legacy"];
    const priorities = ["Low", "Medium", "High"];
    const sections = ["Ongoing Now", "Ready for Test", "testing", "Completed"];
    const segments = ["Backend", "Frontend", "Design"];
    const tags = ["Critical", "Bug", "Feature", "New"];
    const difficulties = ["Easy", "Medium", "Hard"];

    const [task, setTask] = useState({
        project_ID,
        section,
        segment,
        title : "",
        assignee : "",
        assignee_DP_URL : "",
        assigner : "",
        completed : false,
        deadline : "1 day",
        description : "",
        difficulty : 3,
        duration : "1",
        id : "",
        links : [],
        priority : 3,
        status : 2,
        tags : [],
        time_STAMP : ""
    })

    function handleTaskSubmit(e){
        e.preventDefault();
        console.info(task);
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

    const projectOptions = projects.map((projectName) => 
        <option key={projectName} value={projectName}>{projectName}</option>
    )

    const priorityOptions = priorities.map((priority, index) => 
        <option key={priority} value={index+1}>{priority}</option>
    )

    const difficultyOptions = difficulties.map((difficulty, index) => 
        <option key={difficulty} value={index+1}>{difficulty}</option>
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
                name={tagName} 
                id={tagName} 
                type="checkbox" 
                // if taskName present in the tags array of task object then give true
                checked={task.tags.indexOf(tagName) !== -1 ? true : false}
                onChange={(e) => handleTagsEdit(e, tagName)}
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
                    <legend>Tags : </legend>
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