interface Animal {
    id: number;
    url: string;
    gender: 'Male' | 'Female' | 'Unknown';
    size: 'Small' | 'Medium' | 'Large';
    name: string;
    description: string;
}

export default Animal;
