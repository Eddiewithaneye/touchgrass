import { useState } from "react"

export default function Objectives( {showCamera} ) {
    const objective_list = ["Find a leaf", "Find grass", 
        "Find a monster", "Find a human"]
    
    const [objComplete, setObjComplete] = useState(false)
    
    return (
        <main>
            <ul>
                {objective_list.map((objective, i) => (
                    <li key={i}>{objective}</li>
                ))}
            </ul>
            
        </main>
    )
}