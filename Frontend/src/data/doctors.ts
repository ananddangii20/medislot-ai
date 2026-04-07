export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: string;
  hospital_or_clinic: string;
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
    name: "Dr. Anand",
    specialization: "Cardiologist",
    location: "Andheri, Mumbai",
    hospital_or_clinic: "Andheri Heart Care Clinic",
    experience: 11,
    rating: 4.8,
    reviews: 210,
    image: "/anand.JPG",
    bio: "Experienced cardiologist serving patients across Andheri and nearby Mumbai suburbs, focused on heart health, preventive care, and lifestyle disease management.",
    available: true,
    fee: 1500,
    slots: ["9:00 AM", "10:30 AM", "12:00 PM", "2:30 PM", "4:00 PM"],
  },
  {
    id: "2",
    name: "Dr. Mahika",
    specialization: "Dermatologist",
    location: "Worli, Mumbai",
    hospital_or_clinic: "Worli Skin & Care Clinic",
    experience: 7,
    rating: 4.7,
    reviews: 165,
    image: "/maahi.jpeg",
    bio: "Dermatologist based in Worli, Mumbai, specializing in skin treatments, acne care, and cosmetic dermatology with a patient-friendly approach.",
    available: true,
    fee: 1200,
    slots: ["10:00 AM", "11:30 AM", "1:30 PM", "3:00 PM", "5:00 PM"],
  },
  {
    id: "3",
    name: "Dr. Ramkumar",
    specialization: "Neurologist",
    location: "Kandivali, Mumbai",
    hospital_or_clinic: "Kandivali Neuro Centre",
    experience: 14,
    rating: 4.9,
    reviews: 320,
    image: "/ramkumar.jpeg",
    bio: "Senior neurologist consulting in Kandivali, Mumbai, with expertise in migraine, epilepsy, and neurological disorders, trusted by patients across western suburbs.",
    available: true,
    fee: 1800,
    slots: ["9:30 AM", "11:00 AM", "2:00 PM", "4:30 PM"],
  },
  {
    id: "4",
    name: "Dr. Lakshita",
    specialization: "Orthopedic",
    location: "Hostel Area, Mumbai",
    hospital_or_clinic: "City Ortho & Sports Clinic",
    experience: 9,
    rating: 4.6,
    reviews: 140,
    image: "/lakshita.jpg",
    bio: "Orthopedic specialist working near student and residential hostel areas in Mumbai, focusing on injury recovery, bone health, and mobility care.",
    available: true,
    fee: 1300,
    slots: ["8:30 AM", "10:00 AM", "11:30 AM", "1:30 PM", "3:00 PM"],
  },
  {
    id: "5",
    name: "Dr. Gautam",
    specialization: "Pediatrician",
    location: "Ghatkopar, Mumbai",
    hospital_or_clinic: "Ghatkopar Children Clinic",
    experience: 10,
    rating: 4.8,
    reviews: 250,
    image: "/gautam.png",
    bio: "Trusted pediatrician in Ghatkopar, Mumbai, providing complete child healthcare from newborns to adolescents with a compassionate and modern approach.",
    available: true,
    fee: 1000,
    slots: ["9:00 AM", "10:30 AM", "12:00 PM", "3:00 PM", "4:30 PM"],
  },
  {
    id: "6",
    name: "Dr. Ramesh",
    specialization: "General Physician",
    location: "Panvel, Navi Mumbai",
    hospital_or_clinic: "Panvel Family Health Clinic",
    experience: 18,
    rating: 4.9,
    reviews: 400,
    image: "/ramesh.png",
    bio: "Highly experienced general physician serving Panvel and Navi Mumbai region, offering primary care, diagnosis, and long-term health management.",
    available: true,
    fee: 800,
    slots: ["8:00 AM", "9:30 AM", "11:00 AM", "1:00 PM", "2:30 PM", "5:00 PM"],
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
