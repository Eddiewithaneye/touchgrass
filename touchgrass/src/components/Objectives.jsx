import { useState } from "react"

export default function Objectives( {showCamera} ) {
    const objective_list = ["Objective: Find a leaf", "Objective: Find grass", 
        "Objective: Find a monster", "Objective: Find a human"]
    
    const [objComplete, setObjComplete] = useState(false)
       
    return (
        <p className = "objective">{objective_list[Math.floor(Math.random() * objective_list.length)]}
        
        </p>
    )
}