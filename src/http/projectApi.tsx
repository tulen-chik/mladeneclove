import { $host } from "./index";
import {ProjectType} from "@/types/projects";

export const getAllProjects = async (): Promise<Array<ProjectType> | false> => {
    try {
        //const { data } = await $host.get('api/projects');
        return [
            {
                Id: 0,
                Name: "cool",
                Description: "very cool project",
                UserId: 2,
                files: [
                    {
                        Link: "https://www.catschool.co/wp-content/uploads/2023/09/kipsan-testimonial.jpeg"
                    },
                    {
                        Link: "https://www.catschool.co/wp-content/uploads/2023/09/Heather-S-review.png"
                    },
                    {
                        Link: "https://www.catschool.co/wp-content/uploads/2023/09/Julie-walking-Jones.png"
                    }
                ]
            },
            {
                Id: 0,
                Name: "not cool",
                Description: "very cool cool project",
                UserId: 2,
                files: [
                    {
                        Link: "https://www.catschool.co/wp-content/uploads/2023/09/kipsan-testimonial.jpeg"
                    },
                    {
                        Link: "https://www.catschool.co/wp-content/uploads/2023/09/Heather-S-review.png"
                    },
                    {
                        Link: "https://www.catschool.co/wp-content/uploads/2023/09/Julie-walking-Jones.png"
                    }
                ]
            },
            {
                Id: 0,
                Name: "very cool cool",
                Description: "very very very cool project",
                UserId: 2,
                files: [
                    {
                        Link: "https://www.catschool.co/wp-content/uploads/2023/09/kipsan-testimonial.jpeg"
                    },
                    {
                        Link: "https://www.catschool.co/wp-content/uploads/2023/09/Heather-S-review.png"
                    },
                    {
                        Link: "https://www.catschool.co/wp-content/uploads/2023/09/Julie-walking-Jones.png"
                    }
                ]
            },
        ]
        //return data;
    } catch (e) {
        return false;
    }
}

export const getProject = async (id: number): Promise<ProjectType | false> => {
    try {
        //const { data } = await $host.get(`api/projects/${id}`);
        return {
            Id: 0,
            Name: "cool",
            Description: "very cool project",
            UserId: 2,
            files: [
                {
                    Link: "https://www.catschool.co/wp-content/uploads/2023/09/kipsan-testimonial.jpeg"
                },
                {
                    Link: "https://www.catschool.co/wp-content/uploads/2023/09/Heather-S-review.png"
                },
                {
                    Link: "https://www.catschool.co/wp-content/uploads/2023/09/Julie-walking-Jones.png"
                }
            ]
        }
        //return data;
    } catch (e) {
        return false;
    }
}