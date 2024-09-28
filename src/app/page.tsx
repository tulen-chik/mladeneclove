"use client"
import { useEffect, useState } from 'react';
import { getAllProjects } from '@/http/projectApi';
import { ProjectType } from '@/types/projects';
import ProjectsScroller from "@/components/projectsScroller/ProjectsScroller";
import styles from "./page.module.css"

const Home = () => {
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const result: false | Array<ProjectType> = await getAllProjects();
            if (result) {
                setProjects(result);
            } else {
                setError('Failed to fetch projects.');
            }
        };

        fetchProjects();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {projects.length > 0 ? <ProjectsScroller projects={projects} /> : <div className={styles.loading}>Loading...</div>}
        </div>
    );
};

export default Home;
