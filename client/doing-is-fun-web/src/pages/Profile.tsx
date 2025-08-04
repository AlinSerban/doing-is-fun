import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getProfile } from "../api/auth";
import { useAccessToken } from "../hooks/useAccessToken";

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<typeof user | null>(null);
    const [loading, setLoading] = useState(true);
    const [accessToken] = useAccessToken();
    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }
        const fetchProfile = async () => {
            if (!accessToken) return;
            try {
                const profile = await getProfile(accessToken);
                setProfile(profile);
            }
            catch (err) {
                console.error('Failed to fetch profile', err);
                navigate("/");
            }
            finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [user, navigate, accessToken]);

    if (loading) return <p className="text-white">Loading...</p>
    if (!profile) return <p className="text-red-500">Profile not found.</p>

    return (
        <div className="max-w-xl mx-auto text-white mt-20 p-6 bg-[#1a1a1a] rounded-xl shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Profile</h1>
            <p><strong>Full Name:</strong> {profile.full_name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Username:</strong> {profile.username}</p>
        </div>
    )

}