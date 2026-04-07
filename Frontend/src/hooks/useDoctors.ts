import { useEffect, useState } from "react";
import { getDoctors } from "@/api";
import { buildDoctorsList, type UnifiedDoctor } from "@/utils/doctors";

export function useDoctors() {
    const [doctors, setDoctors] = useState<UnifiedDoctor[]>(buildDoctorsList());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadDoctors() {
            try {
                setLoading(true);
                const data = await getDoctors();
                if (!isMounted) return;

                setDoctors(buildDoctorsList(data.doctors || []));
            } catch {
                if (!isMounted) return;
                setDoctors(buildDoctorsList());
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadDoctors();

        return () => {
            isMounted = false;
        };
    }, []);

    return { doctors, loading };
}
