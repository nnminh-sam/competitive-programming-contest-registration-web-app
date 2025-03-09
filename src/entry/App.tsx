import "./App.css";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schoolYearList, contestList } from "./index";

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  schoolYear: z
    .string()
    .min(1, "Please select your school year")
    .refine(
      (val) => schoolYearList.includes(val as (typeof schoolYearList)[number]),
      {
        message: "Invalid school year selected",
      }
    ),
});

type FormFields = z.infer<typeof UserSchema>;

function App() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: "example@email.com",
    },
    resolver: zodResolver(UserSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      console.log("data:", data);
    } catch (error) {
      setError("email", {
        message: "Email is taken",
      });
    }
  };

  return (
    <div className="app-container">
      <section className="top-section">
        <div className="image-section">
          <img src="/public/background.jpg" alt="Contest background" />
        </div>
        <form
          className="registration-form-container"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="form-title">Registration</h1>
          <div className="form-component">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div className="form-component">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
          <div className="form-component">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <p className="error">{errors.firstName.message}</p>
            )}
          </div>
          <div className="form-component">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <p className="error">{errors.lastName.message}</p>
            )}
          </div>
          <div className="form-component">
            <label htmlFor="schoolYear">School Year</label>
            <select
              id="schoolYear"
              {...register("schoolYear", {
                required: "Please select your school year",
              })}
            >
              <option value="">Select a school year</option>
              {schoolYearList.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.schoolYear && (
              <p className="error">{errors.schoolYear.message}</p>
            )}
          </div>
          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Processing..." : "Sign In"}
          </button>
        </form>
      </section>

      <section className="contests-section">
        <h2 className="section-title">Upcoming Contests</h2>
        <div className="contests-grid">
          {contestList.map((contest) => (
            <div key={contest.title} className="contest-card">
              <h3 className="contest-title">{contest.title}</h3>
              <p className="contest-description">{contest.description}</p>
              <div className="contest-details">
                <span className="contest-date">
                  {contest.beginTimestamp.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="contest-duration">
                  Duration: {contest.durationInHour} hours
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
