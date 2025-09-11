import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../../layouts/PageTitle";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Your username must consist of at least 3 characters ")
    .max(50, "Your username must consist of at least 3 characters ")
    .required("Please enter a username"),
  password: Yup.string()
    .min(5, "Your password must be at least 5 characters long")
    .max(50, "Your password must be at least 5 characters long")
    .required("Please provide a password"),
});

const FormValidation = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <Fragment>
      <PageTitle
        activeMenu="Validation"
        motherMenu="Form"
        pageContent="Validation"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Form Validation</h4>
              </div>
              <div className="card-body">
                <div className="form-validation">
                  <form
                    className="form-valide"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="row">
                      <div className="col-xl-6">
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-username"
                          >
                            Username
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <Controller
                              name="username"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="text"
                                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                  id="val-username"
                                  placeholder="Enter a username.."
                                />
                              )}
                            />
                            {errors.username && (
                              <div className="invalid-feedback">{errors.username.message}</div>
                            )}
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-email"
                          >
                            Email <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-email"
                              name="val-email"
                              placeholder="Your valid email.."
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-password"
                          >
                            Password
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <Controller
                              name="password"
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="password"
                                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                  id="val-password"
                                  placeholder="Choose a safe one.."
                                />
                              )}
                            />
                            {errors.password && (
                              <div className="invalid-feedback">{errors.password.message}</div>
                            )}
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-confirm-password"
                          >
                            Confirm Password{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="password"
                              className="form-control"
                              id="val-confirm-password"
                              name="val-confirm-password"
                              placeholder="..and confirm it!"
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-suggestions"
                          >
                            Suggestions <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <textarea
                              className="form-control"
                              id="val-suggestions"
                              name="val-suggestions"
                              rows="5"
                              placeholder="What would you like to see?"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-skill"
                          >
                            Best Skill
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <select
                              className="form-control"
                              id="val-skill"
                              name="val-skill"
                            >
                              <option value="">Please select</option>
                              <option value="html">HTML</option>
                              <option value="css">CSS</option>
                              <option value="javascript">JavaScript</option>
                              <option value="angular">Angular</option>
                              <option value="angular">React</option>
                              <option value="vuejs">Vue.js</option>
                              <option value="ruby">Ruby</option>
                              <option value="php">PHP</option>
                              <option value="asp">ASP.NET</option>
                              <option value="python">Python</option>
                              <option value="mysql">MySQL</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-currency"
                          >
                            Currency
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-currency"
                              name="val-currency"
                              placeholder="$21.60"
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-website"
                          >
                            Website
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-website"
                              name="val-website"
                              placeholder="http://example.com"
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-phoneus"
                          >
                            Phone (US)
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-phoneus"
                              name="val-phoneus"
                              placeholder="212-999-0000"
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-digits"
                          >
                            Digits <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-digits"
                              name="val-digits"
                              placeholder="5"
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-number"
                          >
                            Number <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-number"
                              name="val-number"
                              placeholder="5.0"
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label
                            className="col-lg-4 col-form-label"
                            htmlFor="val-range"
                          >
                            Range [1, 5]
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-6">
                            <input
                              type="text"
                              className="form-control"
                              id="val-range"
                              name="val-range"
                              placeholder="4"
                            />
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <label className="col-lg-4 col-form-label">
                            <Link to="form-validation">
                              Terms &amp; Conditions
                            </Link>{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="col-lg-8">
                            <label
                              className="form-check css-control-primary css-checkbox"
                              htmlFor="val-terms"
                            >
                              <input
                                type="checkbox"
                                className="form-check-input me-2 mt-0"
                                id="val-terms"
                                name="val-terms"
                                value="1"
                              />
                              <span className="css-control-indicator"></span> Agree to terms and conditions
                            </label>
                          </div>
                        </div>
                        <div className="form-group mb-3 row">
                          <div className="col-lg-8 ms-auto">
                            <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Vertical Forms with icon</h4>
              </div>
              <div className="card-body">
                <div className="basic-form">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group mb-3">
                      <label className="text-label">Username</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fa fa-user" />
                        </span>
                        <Controller
                          name="username"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                              id="val-username1"
                              placeholder="Enter a username.."
                            />
                          )}
                        />
                        {errors.username && (
                          <div className="invalid-feedback">
                            {errors.username.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label className="text-label">Password *</label>
                      <div className="input-group transparent-append mb-2">
                        <span className="input-group-text">
                          <i className="fa fa-lock" />
                        </span>
                        <Controller
                          name="password"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                              id="val-password1"
                              placeholder="Choose a safe one.."
                            />
                          )}
                        />
                        <div
                          className="input-group-text"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword === false ? (
                            <i className="fa fa-eye-slash" />
                          ) : (
                            <i className="fa fa-eye" />
                          )}
                        </div>
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <div className="form-check">
                        <input
                          id="checkbox1"
                          className="form-check-input"
                          type="checkbox"
                        />
                        <label htmlFor="checkbox1" className="form-check-label">
                          Check me out
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="btn me-2 btn-primary">
                      Submit
                    </button>
                    <button type="button" className="btn btn-danger light">
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default FormValidation;
