import React from 'react';
import {Link} from 'react-router-dom';
import { SVGICON } from '../../../constant/theme';
import DraggableBlog from './DraggableBlog';

const listData = [
    {id:"input1", title: 'Compete this projects Monday', styleChange: 'text-warning', icon: SVGICON.Stopboard},
    {id:"input2", title: 'Compete this projects Sunday', styleChange: 'text-success', icon: SVGICON.RightClick},
    {id:"input3", title: 'Compete this projects Tuesday', styleChange: 'text-warning', icon: SVGICON.Stopboard},
    {id:"input4", title: 'Compete this projects Wednesday',styleChange: 'text-success', icon: SVGICON.RightClick},
    {id:"input5", title: 'Compete this projects Friday', styleChange: 'text-warning', icon: SVGICON.Stopboard}
];

const ToDoList = () => {
    return (
        <>
            <div className="card">
                <div className="card-header border-0">
                    <h4 className="heading mb-0">Ajpop Weco</h4>
                    <div>
                        <Link to="#" className="text-primary me-2">View All</Link>
                        <Link to="#" className="text-black"> + Add To Do</Link>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="dt-do-bx">
                        <div className="draggable-zone dropzoneContainer to-dodroup dz-scroll">                            
                            <DraggableBlog />
                        </div>
                    </div>	
                </div>
            </div>  
        </>
    );
};

export default ToDoList;