import { makeObservable, observable } from 'mobx';
import {ProjectType} from "@/types/projects";

export default class Project {
    // Declare the _projects property directly in the class
    _projects: Array<ProjectType> = [];

    constructor() {
        // Initialize MobX observable on this instance
        makeObservable(this, {
            _projects: observable,
        });
    }

    setProjects(projects: Array<ProjectType>) {
        this._projects = projects;
    }

    // Corrected getter method to return _projects
    get projects() {
        return this._projects;
    }
}
