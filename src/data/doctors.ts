export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  image: string;
  bio: string;
  available: boolean;
  fee: number;
  slots: string[];
}

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    specialization: "Cardiologist",
    experience: 12,
    rating: 4.9,
    reviews: 284,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    bio: "Board-certified cardiologist specializing in preventive cardiology and heart failure management. Published researcher with over 50 peer-reviewed articles.",
    available: true,
    fee: 150,
    slots: ["9:00 AM", "10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"],
  },
  {
    id: "2",
    name: "Dr. James Chen",
    specialization: "Dermatologist",
    experience: 8,
    rating: 4.8,
    reviews: 196,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    bio: "Expert in cosmetic and medical dermatology. Fellow of the American Academy of Dermatology with special interest in skin cancer prevention.",
    available: true,
    fee: 120,
    slots: ["10:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "4:30 PM"],
  },
  {
    id: "3",
    name: "Dr. Priya Sharma",
    specialization: "Neurologist",
    experience: 15,
    rating: 4.9,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=300&h=300&fit=crop&crop=face",
    bio: "Leading neurologist with expertise in movement disorders and neurodegenerative diseases. Director of the Movement Disorders Clinic.",
    available: true,
    fee: 200,
    slots: ["9:30 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  },
  {
    id: "4",
    name: "Dr. Michael Torres",
    specialization: "Orthopedic",
    experience: 10,
    rating: 4.7,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face",
    bio: "Sports medicine and orthopedic surgery specialist. Team physician for professional athletes with expertise in minimally invasive procedures.",
    available: true,
    fee: 175,
    slots: ["8:00 AM", "9:30 AM", "11:00 AM", "1:30 PM", "3:00 PM"],
  },
  {
    id: "5",
    name: "Dr. Emily Watson",
    specialization: "Pediatrician",
    experience: 9,
    rating: 4.8,
    reviews: 231,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&fit=crop&crop=face",
    bio: "Compassionate pediatrician dedicated to children's health from newborn to adolescence. Specialized in developmental pediatrics.",
    available: true,
    fee: 100,
    slots: ["9:00 AM", "10:30 AM", "12:00 PM", "2:30 PM", "4:00 PM"],
  },
  {
    id: "6",
    name: "Dr. Robert Kim",
    specialization: "General Physician",
    experience: 20,
    rating: 4.9,
    reviews: 512,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
    bio: "Experienced general practitioner providing comprehensive primary care. Expert in chronic disease management and preventive medicine.",
    available: true,
    fee: 80,
    slots: ["8:30 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"],
  },
];

export const specializations = [
  "All",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "General Physician",
];
