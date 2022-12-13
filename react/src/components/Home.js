import { React, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate()

  const [loading, setloading] = useState(true)
  const [error, seterror] = useState(false)

  return (
    <>
      <>
        <Formik
          initialValues={{ username: "", email: "", phone: "" }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(async () => {
              try {
                console.log(values)
                const res = await axios.post(`http://localhost:8000/user`, values)
                console.log(res)
                if (res.data){alert("Registration Success ");} 
              }
              catch (err){
                console.log(err);
                if (err.response.data) {
                  alert(err.response.data.detail);
                }
              }
              setSubmitting(false);
            }, 5000);
          }}

          validationSchema={Yup.object().shape({
            username: Yup.string()
              .required("Username Required"),
            email: Yup.string()
              .email()
              .required("Email Required"),
            phone: Yup.string()
              .required("No phone provided.")
              .min(10, "Enter minimum 10 digits.")
              .matches(/([0-9])/, "phone must contain a number."),
          })}
        >

          {props => {
            const {
              values, touched, errors, isSubmitting, handleChange, handleBlur, handleSubmit
            } = props;

            if (isSubmitting) {
              var disableStyle = { cursor: "not-allowed", }
            }

            return (<>

              <div className="center-screen">

                <div className="gcard" style={{ margin: '5px', height: 'auto', width: "35rem", padding: '40px' }}>
                  <h1 style={{ marginBottom: '15px' }}>Get Programme Info</h1>
                  <form
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column' }}>

                    <label htmlFor="username" style={{ marginTop: '20px' }}>Username</label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.username && touched.username && "error"}
                    />
                    {errors.username && touched.username && (
                      <div className="input-feedback">{errors.username}</div>
                    )}

                    <label htmlFor="email" style={{ marginTop: '20px' }}>Email</label>
                    <input
                      id="email"
                      name="email"
                      type="text"
                      placeholder="Enter your email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.email && touched.email && "error"}
                    />
                    {errors.email && touched.email && (
                      <div className="input-feedback">{errors.email}</div>
                    )}


                    <label htmlFor="phone" style={{ marginTop: '20px' }}>Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="Enter your phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.phone && touched.phone && "error"}
                    />
                    {errors.phone && touched.phone && (
                      <div className="input-feedback">{errors.phone}</div>
                    )}

                    <div>
                      <p>By clicking the button below, you agree to receive communications via Email/Call/WhatsApp from Ready Accountant& Emeritus about this programme and other relevant programmes. Privacy Policy</p>
                    </div>

                    <div>
                      <button type="submit" className="gbtn1" style={disableStyle} disabled={isSubmitting}>
                        {isSubmitting ? 'wait' : 'DOWNLOAD BROUCHER'}</button>
                    </div>

                  </form>
                </div>
              </div>
            </>

            );
          }}
        </Formik>
      </>
    </>
  )
}

export default Home;