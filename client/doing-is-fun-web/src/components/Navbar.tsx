import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCredentials } from "../store/slices/authSlice";
import { useLogoutMutation } from "../features/api/authApi";
type NavbarProps = {
    onRegisterClick: () => void;
    onLoginClick: () => void;
};

const Navbar = ({ onRegisterClick, onLoginClick }: NavbarProps) => {
    const [logoutApi] = useLogoutMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);
    //const { user, setUser } = useAuth();
    // const [, setAccessToken] = useAccessToken();

    const handleLogout = async () => {
        try {
            //await logoutUser();
            await logoutApi().unwrap();
            dispatch(clearCredentials());
            // setUser(null);
            // setAccessToken("");
            navigate("/")
        }
        catch (err) {
            console.error("Logout failed", err);
        }
    }

    return (
        <nav className="bg-transparent">
            <div className="mx-auto max-w-6xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between text-white text-xl ">
                    <div className="flex gap-4">
                        <button onClick={() => navigate("/dashboard")} className="cursor-pointer">Home</button>
                        <span>|</span>
                    </div>
                    <div>
                        {user ? (
                            <>
                                <span>Welcome, {user.full_name.split(" ")[0]}</span>
                                <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-2xl text-white cursor-pointer">Logout</button>
                                <button onClick={() => navigate("/profile")} className="cursor-pointer">Profile</button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onRegisterClick}
                                    className="rounded-2xl bg-[#9c2c34] py-2 px-6 border border-transparent text-center text-white cursor-pointer">Register</button>
                                <span>|</span>
                                <button
                                    onClick={onLoginClick}
                                    className="rounded-2xl bg-[#ffffff38] py-2 px-6 border border-transparent text-center text-white cursor-pointer">Login</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;