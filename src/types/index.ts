export interface Props {
    title: string;
    background: string;
    description: string;
    className?: string;
    link?: string;
}

export interface ScrollerElementProps {
    title: string;
    background: string;
    description: string;
}

export interface Payload {
    email: string,
    id: number,
    isActivated: boolean,
}