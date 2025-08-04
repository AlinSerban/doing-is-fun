import { useForm, type SubmitHandler } from "react-hook-form";
import { type LoginModalProps, type LoginPayload } from "../types/auth"
import { useNavigate } from "react-router";
import { useLoginMutation } from "../features/api/authApi";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/slices/authSlice";

export default function Login({ showModal, setShowModal }: LoginModalProps) {
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginPayload>();

    const onSubmit: SubmitHandler<LoginPayload> = async (data) => {

        try {
            const { user, accessToken } = await login(data).unwrap();
            dispatch(setCredentials({ user, accessToken }));
            //setUser(user);
            //setAccessToken(accessToken);
            setShowModal(false);
            navigate("/dashboard");
        }
        catch (err) {
            console.log('Login failed: ', err);
        }
    };

    if (!showModal) return null;

    return (
        <div
            className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowModal(false)}
        >
            <div
                className="bg-[#1a1a1a] text-white rounded-2xl p-10 w-full max-w-md shadow-xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold cursor-pointer"
                >
                    ×
                </button>
                <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: true })}
                        className="w-full h-12 px-4 rounded bg-[#ffffff1a] border border-gray-600 placeholder-white"
                    />
                    {errors.email && <p className="text-red-400 text-sm">Email is required</p>}

                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", { required: true })}
                        className="w-full h-12 px-4 rounded bg-[#ffffff1a] border border-gray-600 placeholder-white"
                    />
                    {errors.password && <p className="text-red-400 text-sm">Password is required</p>}

                    <button
                        type="submit"
                        className="w-full bg-[#9c2c34] transition rounded-2xl py-3 text-white font-semibold cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in…" : "Log In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
