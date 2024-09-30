"use client"

import { useEffect, useState } from 'react';
import { getProject } from '@/http/projectApi';
import { ProjectType } from '@/types/projects';
import ProjectScroller from "@/components/projectScroller/ProjectScroller";
import { useParams } from 'next/navigation';

const ProjectPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState<ProjectType | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (id) {
                const result: false | ProjectType = await getProject(Number(id));
                if (result) {
                    setProject(result);
                } else {
                    setError('Failed to fetch project.');
                }
            } else {
                setError('No project ID provided.');
            }
        };

        fetchProject();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {project ? <ProjectScroller project={project} /> : <div>Loading...</div>}
        </div>
    );
};

export default ProjectPage;
