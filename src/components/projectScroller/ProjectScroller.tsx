import { useState, useEffect, ComponentType } from 'react';

import {FileType, ProjectType} from '@/types/projects';
import ScrollerElement from '@/components/scrollerElement/ScrollerElement';

interface ProjectScrollerProps {
    project: ProjectType;
}

const ProjectScroller: ComponentType<ProjectScrollerProps> = ({ project }) => {
    const [currentComponentIndex, setCurrentComponentIndex] = useState<number>(0);
    const [components, setComponents] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setComponents(project.files.map((file: FileType, index: number) => {
            return (
                <ScrollerElement
                    key={index}
                    title={index === 0 ? project.Name : ""}
                    background={file.Link}
                    description={index === 0 ? project.Description : ""}
                />
            );
        }));
    }, [project]);


    const ComponentToRender = components[currentComponentIndex];

    return (
        <div>
            {components}
        </div>
    );
};

export default ProjectScroller;
