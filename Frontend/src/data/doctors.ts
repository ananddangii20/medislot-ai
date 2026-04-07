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
    name: "Dr. Ananya Iyer",
    specialization: "Cardiologist",
    experience: 12,
    rating: 4.9,
    reviews: 284,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    bio: "Senior cardiologist focused on preventive heart care and heart failure management, with extensive experience across major hospitals in Bengaluru.",
    available: true,
    fee: 1500,
    slots: ["9:00 AM", "10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"],
  },
  {
    id: "2",
    name: "Dr. Rohan Mehta",
    specialization: "Dermatologist",
    experience: 8,
    rating: 4.8,
    reviews: 196,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    bio: "Dermatologist specializing in acne, pigmentation, and hair fall treatments, serving patients in Ahmedabad and across Gujarat.",
    available: true,
    fee: 1100,
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
    bio: "Leading neurologist with expertise in movement disorders and migraine care, currently consulting across Delhi NCR.",
    available: true,
    fee: 1800,
    slots: ["9:30 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  },
  {
    id: "4",
    name: "Dr. Vikram Singh",
    specialization: "Orthopedic",
    experience: 10,
    rating: 4.7,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face",
    bio: "Orthopedic and sports injury specialist with strong expertise in knee and shoulder rehabilitation in Pune.",
    available: true,
    fee: 1400,
    slots: ["8:00 AM", "9:30 AM", "11:00 AM", "1:30 PM", "3:00 PM"],
  },
  {
    id: "5",
    name: "Dr. Neha Kapoor",
    specialization: "Pediatrician",
    experience: 9,
    rating: 4.8,
    reviews: 231,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&fit=crop&crop=face",
    bio: "Compassionate pediatrician supporting child health from newborn care to teenage wellness, based in Mumbai.",
    available: true,
    fee: 900,
    slots: ["9:00 AM", "10:30 AM", "12:00 PM", "2:30 PM", "4:00 PM"],
  },
  {
    id: "6",
    name: "Dr. Arjun Nair",
    specialization: "General Physician",
    experience: 20,
    rating: 4.9,
    reviews: 512,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
    bio: "Experienced general physician offering complete primary care and lifestyle disease management in Kochi.",
    available: true,
    fee: 700,
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
