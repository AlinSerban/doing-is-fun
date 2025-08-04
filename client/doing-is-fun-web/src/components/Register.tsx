import { useForm, type SubmitHandler } from "react-hook-form"
import { type RegisterModalProps, type RegisterPayload } from "../types/auth";
import { useNavigate } from "react-router";
import { useRegisterMutation } from "../features/api/authApi";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/slices/authSlice";

export default function Register({ showModal, setShowModal }: RegisterModalProps) {
    const [registerUser, { isLoading }] = useRegisterMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        //watch,
        formState: { errors },
    } = useForm<RegisterPayload>()

    const onSubmit: SubmitHandler<RegisterPayload> = async (data) => {
        try {
            if (data.password != data.confirmPassword) {
                console.log('passwords do not match')
            }
            const { user, accessToken } = await registerUser(data).unwrap();
            dispatch(setCredentials({ user, accessToken }));
            setShowModal(false); // Close modal on successful submit
            navigate("/dashboard");

        }
        catch (err) {
            console.error('Register failed: ', err);
        }
    }

    if (!showModal) return null;

    return (
        <div>
            {showModal && (
                <div
                    className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => setShowModal(false)} // click outside to close
                >
                    {/* Prevent modal content from closing when clicked */}
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
                        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <input
                                placeholder="Full Name"
                                {...register("fullName", { required: true })}
                                className="w-full h-12 px-4 rounded bg-[#ffffff1a] border border-gray-600 placeholder-white"
                            />
                            {errors.fullName && <p className="text-red-400 text-sm">Full name is required</p>}

                            <input
                                placeholder="Email"
                                type="email"
                                {...register("email", { required: true })}
                                className="w-full h-12 px-4 rounded bg-[#ffffff1a] border border-gray-600 placeholder-white"
                            />
                            {errors.email && <p className="text-red-400 text-sm">Email is required</p>}

                            <input
                                placeholder="Username"
                                {...register("username", { required: true })}
                                className="w-full h-12 px-4 rounded bg-[#ffffff1a] border border-gray-600 placeholder-white"
                            />
                            {errors.username && <p className="text-red-400 text-sm">Username is required</p>}

                            <input
                                placeholder="Password"
                                type="password"
                                {...register("password", { required: true, minLength: 6 })}
                                className="w-full h-12 px-4 rounded bg-[#ffffff1a] border border-gray-600 placeholder-white"
                            />
                            {errors.password && <p className="text-red-400 text-sm">Password is required (min 6 characters)</p>}

                            <input
                                placeholder="Confirm Password"
                                type="password"
                                {...register("confirmPassword", { required: true })}
                                className="w-full h-12 px-4 rounded bg-[#ffffff1a] border border-gray-600 placeholder-white"
                            />
                            {errors.confirmPassword && <p className="text-red-400 text-sm">Please confirm your password</p>}

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" {...register("terms", { required: true })} />
                                <label className="text-sm">
                                    I agree to the{" "}
                                    <a href="#" className="underline text-blue-400">
                                        Terms & Conditions
                                    </a>
                                </label>
                            </div>
                            {errors.terms && <p className="text-red-400 text-sm">You must accept the terms</p>}

                            <button
                                type="submit"
                                className="w-full bg-[#9c2c34] transition rounded-2xl py-3 text-white font-semibold cursor-pointer"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating…" : "Create Account"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}