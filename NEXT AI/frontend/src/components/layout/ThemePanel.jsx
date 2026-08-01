import "./ThemePanel.css";

import { useContext } from "react";

import { ThemeContext } from "../../context/ThemeContext";

const themes=[
["dark","🌙"],
["light","☀️"],
["ocean","🌊"],
["forest","🌲"],
["purple","💜"],
["sakura","🌸"],
["coffee","☕"],
["amoled","🖤"],
["cyberpunk","⚡"],
["dracula","🦇"]
];

export default function ThemePanel(){

const {theme,setTheme}=useContext(ThemeContext);

return(

<div className="theme-panel">

<h3>🎨 Themes</h3>

<div className="theme-grid">

{themes.map(([name,icon])=>(

<div

key={name}

className={`theme-btn ${theme===name?"active":""}`}

onClick={()=>setTheme(name)}

>

<span>{icon}</span>

<span style={{textTransform:"capitalize"}}>{name}</span>

</div>

))}

</div>

</div>

);

}