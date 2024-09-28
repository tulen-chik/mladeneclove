"use client"
import { createContext, useContext, ReactNode } from "react";
import User from "./user";
import Project from "./projects";
import Order from "./orders";

// Define the types for User, Project, and Order
type UserType = InstanceType<typeof User>;
type ProjectType = InstanceType<typeof Project>;
type OrderType = InstanceType<typeof Order>;

// Define the context type
interface GlobalContextType {
    user: UserType;
    project: ProjectType;
    order: OrderType;
}

// Create the context with the defined type
const GlobalContext = createContext<GlobalContextType | null>(null);

// Define the props for the GlobalProvider
interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    return (
        <GlobalContext.Provider value={{ user: new User(), project: new Project(), order: new Order() }}>
            {children}
        </GlobalContext.Provider>
    );
};

// Define the useGlobal hook
export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobal must be used within a GlobalProvider");
    }
    return context;
};
