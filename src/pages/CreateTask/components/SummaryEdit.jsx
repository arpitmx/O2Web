
// for further extension

import styles from './SummaryEdit.module.css'

export default function SummaryEdit({description, handleChange}){
    return(
        <>
            {/* description textarea */}
            <textarea 
                id="description" 
                type="text" 
                value={description} 
                className={styles.summaryBox}
                name="description" 
                onChange={handleChange} 
                placeholder="Task Summary"
                rows="7"
                required
            />
        </>
    )
}