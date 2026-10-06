import React,{useEffect,useRef} from 'react';
import {initJourney} from './initJourney';
import './journey.css';
const markup="<div id=\"intro\" role=\"dialog\" aria-modal=\"true\" aria-label=\"Animated introduction\">\n<canvas id=\"sky\"></canvas>\n<div class=\"gw\"><div class=\"gi\" id=\"gi\"><canvas id=\"gx\" width=\"700\" height=\"700\"></canvas><div class=\"you\"><b>YOU ARE HERE</b></div></div></div>\n<div class=\"ea\" id=\"ea\"></div>\n<svg id=\"map\" viewBox=\"0 0 412 518\" preserveAspectRatio=\"xMidYMid meet\" aria-hidden=\"true\"><g id=\"mw\"><path id=\"eu\"/><path id=\"sc\"/><path id=\"gb\"/><path id=\"ie\" class=\"ie\"/>\n<g id=\"dub\"><path id=\"lf\" class=\"lf\"/><g id=\"pin\"><circle class=\"rip\" id=\"r1\" r=\".12\"/><circle id=\"pc\" r=\".06\" fill=\"#b5f36c\"/></g><text id=\"tdub\" text-anchor=\"middle\">Dublin</text><text id=\"tuc\" class=\"t2\">UCD Belfield \u00b7 CeADAR</text></g></g></svg>\n<div class=\"hud\"><div class=\"trail\" id=\"trail\"><span>Galaxy</span> \u203a <span>Earth</span> \u203a <span>Europe</span> \u203a <span>Ireland</span> \u203a <span>Dublin</span></div><div class=\"cap\" id=\"cap\" aria-live=\"polite\"></div></div>\n<div id=\"av\"><div class=\"bub\" id=\"bub\"></div><div id=\"avh\"></div></div>\n<button class=\"btn p\" id=\"go\">\ud83d\ude80 Take me there</button>\n<button id=\"skip\">Skip intro \u203a</button>\n</div>\n";
export default function Journey({onComplete}){
const root=useRef(null);
useEffect(()=>initJourney(root.current,onComplete),[onComplete]);
return <div ref={root} dangerouslySetInnerHTML={{__html:markup}}/>;
}
