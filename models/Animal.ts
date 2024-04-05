interface Animal {
    id: number;
    url: string;
    gender: 'Male' | 'Female' | 'Unknown'; // Assuming gender can be Male, Female, or Unknown
    size: 'Small' | 'Medium' | 'Large'; // Assuming size can be Small, Medium, or Large
    name: string;
    description: string;
}

export default Animal;
