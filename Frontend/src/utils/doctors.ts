import type { Doctor } from "@/data/doctors";
import { doctors as demoDoctors } from "@/data/doctors";

export interface AccountDoctor {
    id: string;
    name: string;
    email?: string;
    specialization?: string;
    experience?: number;
    bio?: string;
    consultation_fee?: number;
    image?: string;
}

export type UnifiedDoctor = Doctor & {
    source: "demo" | "account";
    email?: string;
};

const fallbackDoctorImages = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
];

function mapAccountDoctor(doc: AccountDoctor, index: number): UnifiedDoctor {
    return {
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization || "General Physician",
        experience: doc.experience || 5,
        rating: 4.8,
        reviews: 0,
        image: doc.image || fallbackDoctorImages[index % fallbackDoctorImages.length],
        bio: doc.bio || "Experienced Indian healthcare professional available for online consultation.",
        available: true,
        fee: doc.consultation_fee || 1000,
        slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
        source: "account",
        email: doc.email,
    };
}

export function buildDoctorsList(accountDoctors: AccountDoctor[] = []): UnifiedDoctor[] {
    const accountMapped = accountDoctors.map(mapAccountDoctor);
    const demoMapped: UnifiedDoctor[] = demoDoctors.map((doc) => ({ ...doc, source: "demo" }));

    const seenByName = new Set(accountMapped.map((doc) => doc.name.toLowerCase()));
    const filteredDemo = demoMapped.filter((doc) => !seenByName.has(doc.name.toLowerCase()));

    return [...accountMapped, ...filteredDemo];
}

export function buildSpecializations(doctorsList: UnifiedDoctor[]): string[] {
    return ["All", ...Array.from(new Set(doctorsList.map((doc) => doc.specialization)))];
}
