import { html } from 'lit-html';
import providers from '../providers.js';

export default function stars(noteArray){
    let note = calcNoteRound(noteArray);
    let array =  Array.apply(null, Array(note)).map((val, idx) => idx);
    return array.map(el => {
        return html`
            <svg version="1.0"
                class="star-note" viewBox="0 0 1280.000000 1216.000000"
                preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,1216.000000) scale(0.100000,-0.100000)" 
                stroke="none">
                <path d="${providers.icons.STAR}"/>
                </g>
            </svg>
        `
    })
}

export function calcNoteRound(noteArray){
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let note = noteArray.reduce(reducer) / noteArray.length;
    return Math.round(note);
}