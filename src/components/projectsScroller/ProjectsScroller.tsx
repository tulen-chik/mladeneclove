import { useState, useEffect, ComponentType, useRef } from 'react';
import { gsap } from 'gsap';
import { ProjectType } from '@/types/projects';
import ScrollerElement from '@/components/scrollerElement/ScrollerElement';

interface DownScrollerProps {
    projects: ProjectType[];
}

const ProjectsScroller: ComponentType<DownScrollerProps> = ({ projects }) => {
    const [currentComponentIndex, setCurrentComponentIndex] = useState<number>(0);
    const [components, setComponents] = useState<JSX.Element[]>([]);
    const componentRef = useRef<HTMLDivElement>(null); // Ensure the correct type for the ref
    const [lastScrollTime, setLastScrollTime] = useState(0);

    useEffect(() => {
        setComponents(projects.map((project, index) => {
            const backgroundUrl = project.files.length > 0 ? project.files[0].Link : 'https://www.catschool.co/wp-content/uploads/2023/06/orange-tabby-kitten-1024x731.png';
            return (
                <ScrollerElement
                    key={index}
                    title={project.Name}
                    background={backgroundUrl}
                    description={project.Description}
                    link={`/project/${project.Id}`}
                />
            );
        }));
    }, [projects]);

    useEffect(() => {
        const handleScroll = (event: WheelEvent): void => {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastScrollTime;

            if (timeDiff < 1000) return; // Prevent rapid scrolling

            setLastScrollTime(currentTime);

            const scrollDirection = event.deltaY > 0 ? 1 : -1;
            const newIndex = Math.max(0, Math.min(components.length - 1, currentComponentIndex + scrollDirection));

            if (newIndex !== currentComponentIndex) {
                gsap.to(componentRef.current, {
                    x: scrollDirection > 0 ? '-100%' : '100%', // Move out in the direction of the scroll
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        setCurrentComponentIndex(newIndex);
                        gsap.fromTo(
                            componentRef.current,
                            { x: scrollDirection > 0 ? '100%' : '-100%', opacity: 0 },
                            {
                                x: '0%',
                                opacity: 1,
                                duration: 0.5,
                            }
                        );
                    }
                });
            }
        };

        window.addEventListener("wheel", handleScroll);
        return () => window.removeEventListener("wheel", handleScroll);
    }, [currentComponentIndex, components.length, lastScrollTime]);

    const ComponentToRender = components[currentComponentIndex];

    return (
        <div ref={componentRef}>
            {ComponentToRender}
        </div>
    );
};

export default ProjectsScroller;
